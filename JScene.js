/* JS Library */
"use strict"; // always need a semicolon before an IIFE

/* 
Wrap the code that creates your library in an Immediately-Invoked function expression (IIFE).
This allows you to do any setup necessary in this function scope and then only put on the
the global scope the variables needed for developers to access.  Prevents pollution of the 
global scope, conflicts with variables from other libraries, and some control over functionality access.
*/

(function(global) { // the window object serves as the global object in the browser.

let this_path = 'worker';
try{//main process
	const scripts= document.getElementsByTagName('script');
	this_path= scripts[scripts.length-1].src;
}catch(err){//worker process
	//throw new Error("workers can't access document");
}

class Vector{
	constructor(arr){
		this.arr = arr;
	}
	get(index){
		return this.arr[index];
	}
	add(other_vec){
		const other_arr = other_vec.arr;
		let resut_arr = [];
		if(this.arr.length === other_arr.length){
			resut_arr = this.arr.map((result,index) => result+other_arr[index]);
			return new Vector(resut_arr);
		}
	}
	subtract(other_vec){
		const other_arr = other_vec.arr;
		let resut_arr = [];
		if(this.arr.length === other_arr.length){
			resut_arr = this.arr.map((result,index) => result-other_arr[index]);
			return new Vector(resut_arr);
		}
	}
	multiply(other_vec){
		const other_arr = other_vec.arr;
		let resut_arr = [];
		if(this.arr.length === other_arr.length){
			resut_arr = this.arr.map((result,index) => result*other_arr[index]);
			return new Vector(resut_arr);
		}
	}
	divide(other_vec){
		const other_arr = other_vec.arr;
		let resut_arr = [];
		if(this.arr.length === other_arr.length){
			resut_arr = this.arr.map((result,index) => {	// in case 1/0=Infinity, but 0/0=Nan
				if(result == 0){
					return 0;
				}else{
					return result/other_arr[index];
				}
			})
			return new Vector(resut_arr);
		}
	}
	multiply_const(num){
		let resut_arr = [];
		resut_arr = this.arr.map((result) => result*num);
		return new Vector(resut_arr);
	}
	dot(other_vec){
		const mult_arr = this.multiply(other_vec).arr;
		return mult_arr.reduce((result,index) => result+index, 0)
	}
	cross3d(other_vec){ // since we only use cross product for 3d vectors
		const other_arr = other_vec.arr;
		if(this.arr.length === other_arr.length && other_arr.length ===3){
			const a_x = this.arr[0];
			const a_y = this.arr[1];
			const a_z = this.arr[2];
			const b_x = other_arr[0];
			const b_y = other_arr[1];
			const b_z = other_arr[2];
			return new Vector([a_y*b_z-a_z*b_y, a_z*b_x-a_x*b_z, a_x*b_y-a_y*b_x]);
		}
	}
	get_magnitude(){
		const squr_sum = this.arr.reduce((total,current) => total + current*current, 0);
		return Math.sqrt(squr_sum);
	}
	get_normalized(){
		const magn = this.get_magnitude();
		return new Vector(this.arr.map((result) => result / magn));
	}
}

class Ray{
	// Not necessarily to be unit length.
	// when using origin+t*direction lands on a special point
	constructor(){
		this.origin = new Vector([0,0,0]);
		this.direction = new Vector([0,0,0]);
	}
}

class Scene{
	constructor(){
		this.camera = new Camera();
		this.objects = [];
		this.lights = []
	}
	add_camera(obj){
		this.camera = obj;
	}
	add_object(obj){
		this.objects.push(obj);
	}
	add_light(obj){
		this.lights.push(obj);
	}
}


class Camera{
	constructor(name='newCamera',location=[0,0,0],up=[0,1,0],front=[0,0,1]){
		this.name = name;
		this.location = new Vector(location);
		this.up = new Vector(up);
		this.front = new Vector(front);
		this.side = this.up.cross3d(this.front).multiply_const(-1); // left -> right side
	}
	focal_length = 2.8;
	width  = 1.778;
	height = 1;
}

class Light{
	constructor(name='newLight',location=[0,1,0],color=[178,178,178]){ //Gray light = Not very bright white light
		this.name = name;
		this.location = new Vector(location);
		this.color = new Vector(color);
	}
	set_color(new_color){
		this.color.arr = new_color;
	}
}
class LightPoint extends Light{
	type = 'pointLight';
	direction(q, d, max_t){
		let p_min_q = this.location.subtract(q)
		d.arr = (p_min_q).get_normalized().arr;
		max_t[0] = Math.sqrt((p_min_q).dot(p_min_q));
	}
}
class LightSun extends Light{ // directional light
	type = 'sunLight';
	direction(q, d, max_t){
		d.arr = this.location.get_normalized().multiply_const(-1).arr;
		max_t[0] = Infinity;
	}
}
class Material{
	constructor(name='newMaterial',ka=[51, 51, 51],kd=[204,204,204],ks=[25,25,25], km=[25,25,25], phong_exponent=20){
		this.name = name;
		this.ka_strength = 0.1;
		this.ka = new Vector(ka);	// ambient cofficient "ambient color"			- avoid complete dark in shadow
		this.kd = new Vector(kd);	// diffuse coefficient							- surface color
		this.ks = new Vector(ks);	// specular coefficient							- reflection
		this.km = new Vector(km);	// mirror color 								- 
		this.phong_exponent = phong_exponent;// larger -> smaller direct light refl to cam	- light reflection area
	}
}


class ObjectPlane{	//use up as normal and location as point
	constructor(name='newPlane', location=[0,0,0],up=[0,0,0],material=new Material()){
		this.name = name;
		this.location = new Vector(location);
		this.up = new Vector(up);
		this.material = material;
		this.type = "plane"
	}
	intersect(ray, min_t, t, n){
		n.arr = this.up.arr;
		// log(n.dot(ray.direction))
		if(n.dot(ray.direction) != 0){ // if ray // to plane -> infinity intersection
			// log('here inside')
			//log(ray.origin)
			t[0] = ((n.multiply_const(-1)).dot(ray.origin.subtract(this.location))) / (n.dot(ray.direction));
			// log(t[0])
			// log(min_t)
			if(t[0]>=min_t){
				return true;
			}
		}
		return false;
	}
}

class ObjectSphere{	//use location as center and size as radius
	constructor(name='newShpere',location=[0,0,0],size=1,material=new Material()){
		this.name = name;
		this.location = new Vector(location);
		this.size = size;
		this.material = material;
		this.type = "sphere"
	}
	
	intersect(ray, min_t, t, n){
		let ray_to_center = ray.origin.subtract(this.location);
		let a = (ray.direction.dot(ray.direction));
		let b = (ray.direction.multiply_const(2)).dot(ray_to_center);
		let c = (ray_to_center).dot(ray_to_center) - this.size*this.size;
		let discriminant = ((b*b)-4*a*c);

		if(discriminant < 0){ // no intersection or too close
			return false;
		}else{ // have intersection
			let t_min = (-b + Math.sqrt(discriminant))/(2*a);
			let t_plu = (-b - Math.sqrt(discriminant))/(2*a);
			if(t_min < min_t && min_t < t_plu){
				t[0] = t_plu;
			}else if(t_plu < min_t && min_t < t_min){
				t[0] = t_min;
			}else if(min_t < t_min && min_t < t_plu){
				t[0] = Math.min(t_min,t_plu);
			}else{
				return false;
			}
			//n = ((ray.origin+t*(ray.direction)) - center)/radius;
			n.arr = ray.direction.multiply_const(t[0]).add(ray.origin).subtract(this.location).multiply_const(1/this.size).arr;
			return true;
		}
		return false;
	}
}
function is_arr_eq(a1,a2) {//arrays must not contain objects
    return JSON.stringify(a1)==JSON.stringify(a2);
}

// const ERROR_SURFACE_MAT = new Material('error_surface',[255,0,255]);
class ObjectTriangle{	// triangle defined by three corner's location
	constructor(corners=[[1,0,0],[0,1,0],[0,0,1]],normal){
		if(is_arr_eq(corners[0],corners[1]) || is_arr_eq(corners[0],corners[2]) || is_arr_eq(corners[1],corners[2])){
			this.corners = [new Vector([1,0,0]),new Vector([0,1,0]),new Vector([0,0,1])];//if tow corners overlap, its not match definition of triangle
			// this.material = ERROR_SURFACE_MAT;
			console.error('triangle corners overlap: ' + JSON.stringify(corners));
		}else{
			// this.material = material;
			this.corners = [new Vector(corners[0]),new Vector(corners[1]),new Vector(corners[2])];
		}
		
		this.type = "triangle"
		const a_cor = this.corners[0]; // three consers already converted to vector
		const b_cor = this.corners[1];
		const c_cor = this.corners[2];

		if(!normal){
			const norm = (b_cor.subtract(a_cor)).cross3d(c_cor.subtract(a_cor));
			this.up = norm.divide(norm).get_normalized().arr;
		}else{
			this.up = normal;
		}
	}
	intersect(ray, min_t, t, n){ // pretty much mathematics thing which let ray = trangle -> sloves t
		const x_a = this.corners[0].arr[0];
		const y_a = this.corners[0].arr[1];
		const z_a = this.corners[0].arr[2];
		const x_b = this.corners[1].arr[0];
		const y_b = this.corners[1].arr[1];
		const z_b = this.corners[1].arr[2];
		const x_c = this.corners[2].arr[0];
		const y_c = this.corners[2].arr[1];
		const z_c = this.corners[2].arr[2];
		const a = x_a-x_b;
		const b = y_a-y_b;
		const c = z_a-z_b;
		const d = x_a-x_c;
		const e = y_a-y_c;
		const f = z_a-z_c;
		const g = ray.direction.arr[0];
		const h = ray.direction.arr[1];
		const i = ray.direction.arr[2];
		const j = x_a - ray.origin.arr[0];
		const k = y_a - ray.origin.arr[1];
		const l = z_a - ray.origin.arr[2];

		const m = a*(e*i-h*f)+b*(g*f-d*i)+c*(d*h-e*g);
		const p = (j*(e*i-h*f)+k*(g*f-d*i)+l*(d*h-e*g))/m;
		const r = (i*(a*k-j*b)+h*(j*c-a*l)+g*(b*l-k*c))/m;

		t[0] =-(f*(a*k-j*b)+e*(j*c-a*l)+d*(b*l-k*c))/m;
		if(t[0]<min_t){
			return false;
		}
		if((r<0) || (r>1)){
			return false;
		}
		if((p<0) || p>(1-r)){
			return false;
		}
		n.arr = this.up;
		return true;
	}
}

class ObjectTriangleSoup{ // triangle defined by three corner's location
	constructor(triangles,material=new Material(),name='newSoup'){
		this.triangles = triangles;
		this.material = material;
		this.name = name;
		this.type = 'trigsoup';
	}
	intersect(ray, min_t, t, n){ // pretty much mathematics thing which let ray = trangle -> sloves t
		let dummy=[0];
		if(first_hit(ray,min_t,this.triangles,dummy,t,n)==true){
			return true;
		}
	  	return false;
	}
}


function viewing_ray(camera, i, j, width, height, ray){
	let u = (camera.width / width) * (j+0.5) - (camera.width/2);
	let v = (camera.height/ height)* (i+0.5) - (camera.height/2);
	ray.origin = camera.location;
	ray.direction = ((camera.front.multiply_const(camera.focal_length)).add(camera.side.multiply_const(u)).add(camera.up.multiply_const(-v))).get_normalized();
}

function first_hit(ray,min_t,objects,hit_id,t,n){
	let result = false;
	let curr_t = [0];
	let curr_n = new Vector([0,0,0]);
	for(let i=0; i<objects.length; i++){
		if(objects[i].intersect(ray, min_t, curr_t, curr_n)){
			if(t[0] >= curr_t[0] || result == false){
				t[0] = curr_t[0];
				n.arr = curr_n.arr;
				hit_id[0] = i;
			}
			result = true;
		}
	}
	return result;
}
function reflect(in_vector, n){
	//log(in_vector)
	return in_vector.subtract(n.multiply_const(2*in_vector.dot(n)));
	//return in_vector.subtract(in_vector.dot(n).multiply(n).multiply_const(2));
}
function raycolor(ray,min_t,objects,lights,num_recursive_calls,rgb){
	//rgb = [0,0,0];
	let t=[0];
	let hit_id=[0];

	let n = new Vector([0,0,0]);
	let km= new Vector([0,0,0]);;
	let reflected_rgb= new Vector([0,0,0]);
	let reflectedRay = new Ray();
	//console.log("running ----");
	//console.log(objects);
	if(first_hit(ray,min_t,objects,hit_id,t,n)){ // if hit object
		km = objects[hit_id[0]].material.km.multiply_const(1/255); // since ka already range 0-255 -> ka*kd*ks*km needs keep in the range of 0-255  
		//console.log(n);
		rgb.arr = blinn_phong_shading(ray,hit_id[0],t[0],n,objects,lights).arr;
		if(num_recursive_calls<0){
			reflectedRay.origin = ray.direction.multiply_const(t[0]).add(ray.origin);
			reflectedRay.direction = reflect(ray.direction,n);
			//console.log("running ----");
			// log('here')
			// log(reflectedRay)
			if(raycolor(reflectedRay,0.000001,objects,lights,num_recursive_calls+1,reflected_rgb)){
				//console.log("running -sss---");
				rgb.arr = rgb.add(km.multiply(reflected_rgb)).arr;
			}
		}
		return true;
	}
	return false;
}

function blinn_phong_shading(ray,hit_id,t,n,objects,lights){
	let l = new Vector([0,0,0]);
	let h = new Vector([0,0,0]);
	let p = ray.direction.multiply_const(t).add(ray.origin);
	let v = ray.direction.multiply_const(-1);
	let ka_strength = objects[hit_id].material.ka_strength;
	let ka = objects[hit_id].material.ka;
	let kd = objects[hit_id].material.kd;
	let ks = objects[hit_id].material.ks;
	let phong_exponent = objects[hit_id].material.phong_exponent;

	let max_t = [0];
	//shadows temp variable
	let hit_id_temp = [0];
	let t_temp = [0];
	let n_temp = new Vector([0,0,0]);;
	let l_ray = new Ray();

	//add Ambient ka x ia
	let rgb = ka.multiply_const(ka_strength); //ka_strength ambient strength
	// log("curr rgb-----------------------------------------")
	// log(rgb.arr[0]/255)
	// log(rgb.arr[1]/255)
	// log(rgb.arr[2]/255)
	for(let i=0; i<lights.length; i++){
		//log(p);
		lights[i].direction(p,l,max_t);  //cumpute l
		l_ray.origin = p;
		l_ray.direction = l;
		// if not hit object before hit light
		if(!(first_hit(l_ray,0.000001,objects,hit_id_temp,t_temp,n_temp) && t_temp[0] < max_t[0])){
			// add Diffuse: Lambertian
			let diffuse = kd.multiply(lights[i].color).multiply_const(Math.max(0,n.dot(l))/255);
			rgb.arr = rgb.add(diffuse).arr;

			//add Specular: Blinn_Phong
			h = (v.get_normalized().add(l)).get_normalized();
			let specular = ks.multiply(lights[i].color).multiply_const( Math.pow(Math.max(0,n.dot(h)),phong_exponent)/255);
			rgb.arr = rgb.add(specular).arr;
		}
	}
	return rgb;

}



function get_worker(){
	// why web-worker and not using Promise:
	// Deferred/promise are constructs to assign a reference to a result not yet available, and to organize code that runs once the result becomes available or a failure is returned.
	// Web Workers perform actual work asynchronously (using operating system threads not processes - so they are relatively light weight).
	// Build a worker and return it's Blob url
	return URL.createObjectURL( new Blob([ '(',
	function(){
		if('function' === typeof importScripts) { // avoid worker executed twice
			self.addEventListener('message', (e)=>{
				if(e !== undefined){
					
					const data = e.data
					// console.log('-----');
					// console.log(data.main_src);
					importScripts(data.main_src);

					const w_min = data.w_range[0];
					const h_min = data.h_range[0];
					const w_max = data.w_range[1];
					const h_max = data.h_range[1];
					const canvas_w = data.canvas_range[0];
					const canvas_h = data.canvas_range[1];
					//log(data.objects)//constructor(name='newCamera',location=[0,0,0],up=[0,1,0],front=[0,0,1],size=1){
					const num_reflect = data.num_reflect;
					const cam_property = data.camera;
					const camera = new Camera(	cam_property.name,
												cam_property.location.arr,
												cam_property.up.arr,
												cam_property.front.arr,
												cam_property.size);
					camera.focal_length = cam_property.focal_length;
					camera.width  = cam_property.width;
					camera.height = cam_property.height;
					const objects = data.objects.map(obj => {
						//console.log(obj);
						const mat = obj.material; // this mat is json, not actual object, therefor needs to be convert
						let material;
						if(mat){
							material = new Material(mat.name,mat.ka.arr,mat.kd.arr,mat.ks.arr,mat.km.arr,mat.phong_exponent);
						}// else triangle dont have material
						if(obj.type === 'plane'){
							return new ObjectPlane(obj.name,obj.location.arr,obj.up.arr,material);
						}else if(obj.type === 'sphere'){
							return new ObjectSphere(obj.name,obj.location.arr,obj.size,material);
						}else if(obj.type === 'triangle'){
							return new ObjectTriangle([obj.corners[0].arr,obj.corners[1].arr,obj.corners[2].arr]);
						}else if(obj.type === 'trigsoup'){
							const trigs = obj.triangles.map(trig => {
								return new ObjectTriangle([trig.corners[0].arr,trig.corners[1].arr,trig.corners[2].arr]);
							});
							return new ObjectTriangleSoup(trigs, material)
							//console.log(obj);
						}
					})//constructor(name='newMaterial',ka=[25,125,235],kd=[25,125,235], ks=[25,125,235], km=[25,125,235], phong_exponent=1){
					const lights = data.lights.map(function(lig){
						if(lig.type === 'pointLight'){
							return new LightPoint(lig.name,lig.location.arr,lig.color.arr);
						}else if(lig.type === 'sunLight'){
							return new LightSun(lig.name,lig.location.arr,lig.color.arr);
						}
					})
					// log('good')
					// console.log(ObjectSphere);
					let result = [];
					for(let i=h_min; i<h_max; ++i){
						for(let j=w_min; j<w_max; ++j){
							let rgb = new Vector([0,0,0,255]);
							//compute viewing ray
							let ray = new Ray();
							viewing_ray(camera,i,j,canvas_w,canvas_h,ray);

							//shoot ray and collect color
							//log(objects);
							raycolor(ray,1.0,objects,lights,-num_reflect,rgb);

							//write precision color into image
							const r_index = 4*(j+canvas_w*i);
							const clamp = (s) => (Math.max(Math.min(s,255.0),0.0));

							result.push(clamp(rgb.arr[0]));
							result.push(clamp(rgb.arr[1]));
							result.push(clamp(rgb.arr[2]));
							result.push(255);
						}
					}
					// console.log('non-------------------')
					// console.log(camera)
					// console.log([canvas_w,canvas_h])
					self.postMessage({min_wh:[w_min,h_min],max_wh:[w_max,h_max], result: result});
				}
			})
		}
		//myWorker.terminate();	//no needs to wait worker exit gracefully hehe
	}.toString(),
	')()' ], { type: 'application/javascript' } ) );
}

function render_canvas_async(canvas,scene,tiles_w,tiles_h,num_reflect){
	
	let ctx = canvas.getContext('2d');
	//console.log([canvas.width,canvas.height]);
	let img_data = ctx.getImageData(0,0,canvas.width,canvas.height);
	let worker;
	const tiles_num_w = Math.ceil(canvas.width/tiles_w);
	const tiles_num_h = Math.ceil(canvas.height/tiles_h);
	let w_min,w_max,h_min,h_max;
	for(let w_index=0; w_index<tiles_num_w; w_index++){
		for(let h_index=0; h_index<tiles_num_h; h_index++){
			w_min = w_index*tiles_w;
			h_min = h_index*tiles_h;
			w_max = w_min+tiles_w;
			h_max = h_min+tiles_h;
			if(w_max>canvas.width){w_max=canvas.width}
			if(h_max>canvas.height){h_max=canvas.height}
			//create worker
			worker = new Worker(get_worker());
			worker.onmessage = workerMessaged;
			//call worker
			worker.postMessage(
					{main_src:this_path, 
					camera:scene.camera,
					objects:scene.objects,
					lights:scene.lights,
					canvas_range:[canvas.width,canvas.height], 
					w_range:[w_min,w_max],
					h_range:[h_min,h_max],
					num_reflect:num_reflect}); // document.location.protocol + '//' + document.location.host
		}
	}

	function workerMessaged(e){
		const result = e.data.result;
		const min_wh = e.data.min_wh;
		const max_wh = e.data.max_wh;
		const start_index = 4*(min_wh[0]+canvas.width*min_wh[1]);
		const tile_w = (max_wh[0]-min_wh[0])*4;
		let offset = 0;
		result.forEach(function(item,i){
			offset = parseInt(i/tile_w)*canvas.width*4 + i%tile_w;
			img_data.data[start_index + offset] = item;
		});
		ctx.putImageData(img_data,0,0);
	}
}



function render_canvas_native(canvas,scene,num_reflect){
	let ctx = canvas.getContext('2d');
	let img_data = ctx.getImageData(0,0,canvas.width,canvas.height);
	for(let i=0; i<canvas.height; ++i){
		for(let j=0; j<canvas.width; ++j){
			let rgb = new Vector([0,0,0,255]);
			//compute viewing ray
			let ray = new Ray();
			viewing_ray(scene.camera,i,j,canvas.width,canvas.height,ray);
			//shoot ray and collect color
			raycolor(ray,1.0,scene.objects,scene.lights,-num_reflect,rgb);
			//write precision color into image
			const r_index = 4*(j+canvas.width*i);
			const clamp = (s) => (Math.max(Math.min(s,255.0),0.0));
			img_data.data[r_index] = clamp(rgb.arr[0]);
			img_data.data[r_index+1] = clamp(rgb.arr[1]);
			img_data.data[r_index+2] = clamp(rgb.arr[2]);
			img_data.data[r_index+3] = 255.0; // not transparent
		}
	}
	ctx.putImageData(img_data,0,0);
}


//stl_to_triangleSoup converter
function get_triangleSoup(vers_norm, material){
	const trig_list = vers_norm.map(vn => new ObjectTriangle(vn[0],vn[1])); //...vn
	return new ObjectTriangleSoup(trig_list, material);
}



//ascii_STL_loader
async function parse_stl(file){
	return await new Promise((resolve,reject)=>{
		const reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = () => {
			let data = reader.result.split("normal");
			data.shift();	// remove "solid <obj name>"
			//data.pop();		// remove "endsolid <obj name>"
			data = data.map(trig_data => {
				const norm_veterx = trig_data.split('\n');
				//console.log(norm_veterx)
				const norm = norm_veterx[0].trim().split(' ').map(str => Number(str));
				const vec1 = norm_veterx[2].split(/[\svertex]+/).filter(x => x !== '').map(str => Number(str));
				const vec2 = norm_veterx[3].split(/[\svertex]+/).filter(x => x !== '').map(str => Number(str));
				const vec3 = norm_veterx[4].split(/[\svertex]+/).filter(x => x !== '').map(str => Number(str));
				// console.log(norm)
				// console.log([vec1,vec2,vec3])
				return [[vec1,vec2,vec3],norm]
			});
			resolve(data);
		}
	})
	//reader.readAsText(file) //by default, encoding is UTF-8
}

function clear_canvas(canvas){
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// After setup:
// Add the Scene to the window object if it doesn't already exist.
global.Scene = global.Scene || Scene;
global.Camera = global.Camera || Camera;
global.Material = global.Material || Material;
global.LightPoint = global.LightPoint || LightPoint;
global.LightSun = global.LightSun || LightSun;
global.ObjectPlane = global.ObjectPlane || ObjectPlane;
global.ObjectSphere = global.ObjectSphere || ObjectSphere;
global.ObjectTriangle = global.ObjectTriangle || ObjectTriangle;
global.ObjectTriangleSoup = global.ObjectTriangleSoup || ObjectTriangleSoup;
global.render_canvas_async = global.render_canvas_async || render_canvas_async;
global.render_canvas_native = global.render_canvas_native || render_canvas_native;
global.clear_canvas = global.clear_canvas || clear_canvas;
global.parse_stl = global.parse_stl || parse_stl;
global.get_triangleSoup = global.get_triangleSoup || get_triangleSoup;
if(this_path == "worker"){ // worker process
	global.Ray = global.Ray || Ray;
	global.Vector = global.Vector || Vector;
	global.raycolor = global.raycolor || raycolor;
	global.viewing_ray = global.viewing_ray || viewing_ray;
}

})(this); // pass the window object to the anonymous functions. Can also pass other global functions like jQuery.