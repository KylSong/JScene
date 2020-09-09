'use strict';


const c1_rec= document.getElementById('c1_r');
const c1_tw = document.getElementById('c1_tw');
const c1_th = document.getElementById('c1_th');
const c1 	= document.getElementById('c1');
const c1_select= document.getElementById('c1_select');

// frontend setting-----------------------------------------------------------------
//resolution

const c1_js = document.getElementById('c1_js');
const c1_css= document.getElementById('c1_css');
const c1_sel= document.getElementById('c1_select')
$("#c1_w").on("blur", function() { // blur: when user unselect (finished input)
	resize_canvas('c1',this.value,$('#c1_h').val());
});
$("#c1_h").on("blur", function() {
	resize_canvas('c1',$('#c1_w').val(),this.value);
});
function resize_canvas(canvas_id,w,h){
	const ratio = h/w*100+'%';
	$(`#${canvas_id}_s`).css("padding-top",ratio); // set height to 0 and enable padding-top
	$(`#${canvas_id}`).attr({"width":w,"height":h});
}
// canvas style
let c1_isCrisp = true;
const c1_css_style = `canvas {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;`
$("#c1_crisp").on("click", function() {
	$('#c1').toggleClass("crisp_canvas"); // add or remove crisp_canvas class;
	c1_isCrisp = !c1_isCrisp;
	if(!c1_isCrisp){
		c1_css.innerHTML = c1_css_style + `
}`;
	}else{
		c1_css.innerHTML = c1_css_style + `
	image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}`;
	}
	Prism.highlightElement(c1_css);
});
// change preview code
let c1_js_i = `let scene = new Scene();
scene.add_camera(new Camera());
scene.add_light(new LightPoint('pointLight',[-2,5,0]));//location
scene.add_object(new ObjectSphere('sphere', [0,0,9], 1));//location,radius`;

$('#c1_select').change(function(){
	const curr = c1_sel.value;
	if(curr == 'plane'){
		c1_js_i = c1_js.innerHTML = `let scene = new Scene();
scene.add_camera(new Camera());
scene.add_light(new LightPoint('pointLight',[-2,5,0]));//location
scene.add_object(new ObjectPlane('ground',[0,-1,0], [0,1,0]));//location,normal`;
	}else if(curr == 'sphere'){
		c1_js_i = c1_js.innerHTML = `let scene = new Scene();
scene.add_camera(new Camera());
scene.add_light(new LightPoint('pointLight',[-2,5,0]));//location
scene.add_object(new ObjectSphere('sphere', [0,0,9], 1));//location,radius`;
	}else if(curr == 'triangle'){
		c1_js_i = c1_js.innerHTML = `let scene = new Scene();
scene.add_camera(new Camera());
scene.add_light(new LightPoint('lightRight',[-9,5,30]));//location
scene.add_light(new LightPoint('lightLeft',[9,5,30]));
scene.add_light(new LightPoint('backLight',[1,5,90]));
scene.add_object(new ObjectTriangleSoup([
		new ObjectTriangle([[10,-0.5,85],[0,-1.5,19],[-6,-0.5,35]]),
		new ObjectTriangle([[20,-2,100],[2,-2,15],[-10,-2,40]]) //corners
]));`;
	}
	c1_js.innerHTML+= get_c_js_ii(c1_rec,c1_tw,c1_th);
	Prism.highlightElement(c1_js);
	//Prism.highlightAll();
});

$('#c1_r,#c1_tw,#c1_th').change(function(){
	c1_js.innerHTML = c1_js_i + get_c_js_ii(c1_rec,c1_tw,c1_th);
	Prism.highlightElement(c1_js);
})

function get_c_js_ii(rec,tw,th){
	return `
// Using Render Native
render_canvas_native(canvas,scene,${rec.value});
// Using Render Async
render_canvas_async(canvas,scene,${tw.value},${th.value},${rec.value});`;
}

// render --------------------------------------------------------------------------------c1-----
let c1_plane = new Scene();
c1_plane.add_camera(new Camera());
c1_plane.add_light(new LightPoint('point_lightname1',[-2,5,0]));
c1_plane.add_light(new LightPoint('point_lightname2',[-2,5,0]));// brighter!
c1_plane.add_object(new ObjectPlane('Ground',[0,-1,0], [0,1,0]));
let c1_sphere = new Scene();
c1_sphere.add_camera(new Camera());
c1_sphere.add_light(new LightPoint('point_lightname1',[-2,5,0]));
c1_sphere.add_light(new LightPoint('point_lightname2',[-2,5,0]));// brighter!
c1_sphere.add_object(new ObjectSphere('newsphere', [0,0,9], 1));
let c1_triangle = new Scene();
c1_triangle.add_camera(new Camera());
c1_triangle.add_light(new LightPoint('lightRight',[-9,5,30]));
c1_triangle.add_light(new LightPoint('lightLeft',[9,5,30]));
c1_triangle.add_light(new LightPoint('backLight',[1,5,90]));
c1_triangle.add_object(new ObjectTriangleSoup([
							new ObjectTriangle([[10,-0.5,85],[0,-1.5,19],[-6,-0.5,35]]),
							new ObjectTriangle([[20,-2,100],[2,-2,15],[-10,-2,40]])]));

const c1_rn = document.getElementById("c1_rn");
const c1_ra = document.getElementById("c1_ra");
c1_rn.addEventListener("mousedown",() =>{
	clear_canvas(c1);
});
c1_ra.addEventListener("mousedown",() =>{
	clear_canvas(c1);
});
c1_rn.addEventListener("mouseup",() =>{
	if(c1_select.value == 'plane'){
		render_canvas_native(c1,c1_plane,c1_rec.value)
	}else if(c1_select.value == 'sphere'){
		render_canvas_native(c1,c1_sphere,c1_rec.value)
	}else if(c1_select.value == 'triangle'){
		render_canvas_native(c1,c1_triangle,c1_rec.value)
	}
});
c1_ra.addEventListener("mouseup",() =>{
	clear_canvas(c1);
	if(c1_select.value == 'plane'){
		render_canvas_async(c1,c1_plane,c1_tw.value,c1_th.value,c1_rec.value); // num of light reflection
	}else if(c1_select.value == 'sphere'){
		render_canvas_async(c1,c1_sphere,c1_tw.value,c1_th.value,c1_rec.value); // num of light reflection
	}else if(c1_select.value == 'triangle'){
		render_canvas_async(c1,c1_triangle,c1_tw.value,c1_th.value,c1_rec.value); // num of light reflection
	}
});









// canvas_2 -------------------------------------------------------------------------
const c2_rec= document.getElementById('c2_r');
const c2_tw = document.getElementById('c2_tw');
const c2_th = document.getElementById('c2_th');
const c2 	= document.getElementById('c2');
const c2_select= document.getElementById('c2_select');
// frontend setting-----------------------------------------------------------------
//resolution
const c2_js = document.getElementById('c2_js');
const c2_css= document.getElementById('c2_css');
$("#c2_w").on("blur", function() { // blur: when user unselect (finished input)
	resize_canvas('c2',this.value,$('#c2_h').val());
});
$("#c2_h").on("blur", function() {
	resize_canvas('c2',$('#c2_w').val(),this.value);
});
function resize_canvas(canvas_id,w,h){
	const ratio = h/w*100+'%';
	$(`#${canvas_id}_s`).css("padding-top",ratio); // set height to 0 and enable padding-top
	$(`#${canvas_id}`).attr({"width":w,"height":h});
}
// canvas style
let c2_isCrisp = true;
const c2_css_style = `canvas {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;`
$("#c2_crisp").on("click", function() {
	$('#c2').toggleClass("crisp_canvas"); // add or remove crisp_canvas class;
	c2_isCrisp = !c2_isCrisp;
	if(!c2_isCrisp){
		c2_css.innerHTML = c2_css_style + `
}`;
	}else{
		c2_css.innerHTML = c2_css_style + `
	image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}`;
	}
	Prism.highlightElement(c2_css);
});
// change preview code
let c2_js_i = `let canvas = new Scene();
canvas.add_camera(new Camera('view',[0,-0.1,0]));//move camera lower
canvas.add_light(new LightPoint('frontLight',[-2,5,0]));
canvas.add_light(new LightPoint('backLight',[-1,5,12]));
canvas.add_object(new ObjectPlane('ground',[0,-1,0], [0,1,0]));

let mat = new Material("customMaterial", 
		[0,204,204],		//ka	ambient cofficient "ambient color"	- avoid complete dark in shadow
		[0,204,204],		//kd	diffuse coefficient					- surface color
		[0,204,204],		//ks	specular coefficient				- reflected light color
		[0,204,204],2000);	//km 	darker->less reflective				//ph area of light on surface
canvas.add_object(new ObjectSphere('sphereL', [0.5,0,9], 1, mat));//location,radius;
canvas.add_object(new ObjectSphere('sphereS', [-0.7,-0.5,7], 0.5, mat));
`
$('#c2_ka,#c2_kd,#c2_ks,#c2_km,#c2_phone').change(function(){
	const ka = hexToRgb($('#c2_ka').val());
	const kd = hexToRgb($('#c2_kd').val());
	const ks = hexToRgb($('#c2_ks').val());
	const km = hexToRgb($('#c2_km').val());
	const ph = $('#c2_phone').val();
	c2_js_i = c2_js.innerHTML = `let canvas = new Scene();
canvas.add_camera(new Camera('view',[0,-0.1,0]));//move camera lower
canvas.add_light(new LightPoint('frontLight',[-2,5,0]));
canvas.add_light(new LightPoint('backLight',[-1,5,12]));
canvas.add_object(new ObjectPlane('ground',[0,-1,0], [0,1,0]));

let mat = new Material("customMaterial", 
		[${ka}],		//ka	ambient cofficient "ambient color"	- avoid complete dark in shadow
		[${kd}],		//kd	diffuse coefficient					- surface color
		[${ks}],		//ks	specular coefficient				- reflected light color
		[${km}],${ph});	//km 	darker->less reflective				//ph area of light on surface
canvas.add_object(new ObjectSphere('sphereL', [0.5,0,9], 1, mat));//location,radius;
canvas.add_object(new ObjectSphere('sphereS', [-0.7,-0.5,7], 0.5, mat));
`
	c2_js.innerHTML += get_c_js_ii(c2_rec,c2_tw,c2_th);
	Prism.highlightElement(c2_js);
	//change material code
	c2_mat.ka.arr = ka;
	c2_mat.kd.arr = kd;
	c2_mat.ks.arr = ks;
	c2_mat.km.arr = km;
	c2_mat.phong_exponent = ph;
})
$('#c2_r,#c2_tw,#c2_th').change(function(){
	c2_js.innerHTML = c2_js_i + get_c_js_ii(c2_rec,c2_tw,c2_th);
	Prism.highlightElement(c2_js);
})

// render --------------------------------------------------------------------------------c2-----
let c2_sphere = new Scene();
c2_sphere.add_camera(new Camera('view',[0,-0.1,0]));//move camera lower
c2_sphere.add_light(new LightPoint('frontLight',[-2,5,0]));// light!
c2_sphere.add_light(new LightPoint('backLight',[-1,5,12]));
let c2_mat = new Material("customMaterial", 
		[0, 204, 204],					//ka
		[0, 204, 204],					//kd
		[0, 204, 204],					//ks
		[0, 204, 204],2000); 			//km
c2_sphere.add_object(new ObjectSphere('sphereL', [0.5,0,9], 1, c2_mat));
c2_sphere.add_object(new ObjectSphere('sphereS', [-0.7,-0.5,7], 0.5, c2_mat));
c2_sphere.add_object(new ObjectPlane('ground',[0,-1,0], [0,1,0]));

const c2_rn = document.getElementById("c2_rn");
const c2_ra = document.getElementById("c2_ra");
c2_rn.addEventListener("mousedown",() =>{
	clear_canvas(c2);
});
c2_ra.addEventListener("mousedown",() =>{
	clear_canvas(c2);
});
c2_rn.addEventListener("click",() =>{
	render_canvas_native(c2,c2_sphere,c2_rec.value)
});
c2_ra.addEventListener("click",() =>{
	render_canvas_async(c2,c2_sphere,c2_tw.value,c2_th.value,c2_rec.value); // num of light reflection
});







// canvas_3 -------------------------------------------------------------------------
const c3_rec= document.getElementById('c3_r');
const c3_tw = document.getElementById('c3_tw');
const c3_th = document.getElementById('c3_th');
const c3 	= document.getElementById('c3');
const c3_select= document.getElementById('c3_select');
// frontend setting-----------------------------------------------------------------
//resolution
const c3_js = document.getElementById('c3_js');
const c3_css= document.getElementById('c3_css');
$("#c3_w").on("blur", function() { // blur: when user unselect (finished input)
	resize_canvas('c3',this.value,$('#c3_h').val());
});
$("#c3_h").on("blur", function() {
	resize_canvas('c3',$('#c3_w').val(),this.value);
});
function resize_canvas(canvas_id,w,h){
	const ratio = h/w*100+'%';
	$(`#${canvas_id}_s`).css("padding-top",ratio); // set height to 0 and enable padding-top
	$(`#${canvas_id}`).attr({"width":w,"height":h});
}
// canvas style
let c3_isCrisp = true;
const c3_css_style = `canvas {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;`
$("#c3_crisp").on("click", function() {
	$('#c3').toggleClass("crisp_canvas"); // add or remove crisp_canvas class;
	c3_isCrisp = !c3_isCrisp;
	if(!c3_isCrisp){
		c3_css.innerHTML = c3_css_style + `
}`;
	}else{
		c3_css.innerHTML = c3_css_style + `
	image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}`;
	}
	Prism.highlightElement(c3_css);
});
// change preview code
let c3_js_i = `let scene = new Scene();
let camera = new Camera('cam3', [0,-0.2,2], [0,1,0], [0,0,-1]);//pos,up,direction
camera.focal_length = 1; // "field of view"
camera.width  = 1.7777777778;	// ratio of image, better match with resolution
camera.height = 1;				// or image will be stretched
scene.add_camera(camera);
scene.add_light(new LightPoint('backLight',[0,9,-2]));
scene.add_light(new LightPoint('frontLight',[0,9,2]));
scene.add_object(new ObjectPlane('ground',[0,-0.8,0], [0,1,0]));

const stl = document.getElementById("c3_file");
stl.addEventListener("change", handleFile, false);
function handleFile() { // after user choose a file
	parse_stl(this.files[0]).then(data => { //ascii_STL_loader
		scene.add_object(get_triangleSoup(data, blue));
	}); 
}
`

$('#c3_r,#c3_tw,#c3_th').change(function(){
	c3_js.innerHTML = c3_js_i + get_c_js_ii(c3_rec,c3_tw,c3_th);
	Prism.highlightElement(c3_js);
})

// render --------------------------------------------------------------------------------c3-----
let blue = new Material("blue metal", 
	[55, 126, 184],
	[55, 126, 184],
	[55, 126, 184],
	[55, 126, 184],2000);

let c3_file = new Scene();
let camera = new Camera('cam3', [0,-0.2,2], [0,1,0], [0,0,-1]);
camera.focal_length = 1; // "field of view"
camera.width  = 1.7777777778;	// ratio of image, better match with resolution
camera.height = 1;				// or image will be stretched
c3_file.add_camera(camera);
c3_file.add_light(new LightPoint('backLight',[0,9,-2]));
c3_file.add_light(new LightPoint('frontLight',[0,9,2]));
c3_file.add_object(new ObjectPlane('ground',[0,-0.8,0], [0,1,0]));

const stl = document.getElementById("c3_file");
stl.addEventListener("change", handleFile, false);
function handleFile() { // after user choose a file
  	//ascii_STL_loader
	parse_stl(this.files[0]).then(data => {
		c3_file.add_object(get_triangleSoup(data, blue));
	}); 
}

const c3_rn = document.getElementById("c3_rn");
const c3_ra = document.getElementById("c3_ra");
c3_rn.addEventListener("mousedown",() =>{
	clear_canvas(c3);
});
c3_ra.addEventListener("mousedown",() =>{
	clear_canvas(c3);
});
c3_rn.addEventListener("click",() =>{
	render_canvas_native(c3,c3_file,c3_rec.value)
});
c3_ra.addEventListener("click",() =>{
	render_canvas_async(c3,c3_file,c3_tw.value,c3_th.value,c3_rec.value); // num of light reflection
});











function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	] : null;
}