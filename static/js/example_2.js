'use strict';
//script for demo that not related to the library
let canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 580;
let ctx = canvas.getContext("2d");
ctx.font = "32px Arial";
ctx.fillText('This is an empty canvas',0, canvas.height*0.1);
ctx.fillText('render_canvas_native is very slow, wait patiently if you want to try it',0, canvas.height*0.3);
ctx.fillText('canvas.width and canvas.height is used as resolution of the camera',0, canvas.height*0.5);
ctx.fillText('ie. there will be canvas.width*canvas.height number of viewing rays',0, canvas.height*0.7);
ctx.fillText('if image stretched, check to make sure',0, canvas.height*0.8);
ctx.fillText('canvas.width/canvas.height == camera.width/camera.height',0, canvas.height*0.9);


let camera = new Camera('cam1', [9.6,0.3,10], [-0.7071067812,0,0.7071067812], [-0.7071067812,0,-0.7071067812]);
let pl1;
let pl2;
let m1ka, m2ka, m3ka, m4ka, m5ka;
let m1kd, m2kd, m3kd, m4kd, m5kd;
let m1ks, m2ks, m3ks, m4ks, m5ks;
let m1km, m2km, m3km, m4km, m5km;
let m1p, m2p, m3p, m4p, m5p;
let pll,pln,plm;
let s1l,s1r,s1m;
let s2l,s2r,s2m;
let s3l,s3r,s3m;
let s4l,s4r,s4m;
let lit1;
let lit2;
let red;
let blue;
let gree;
let purp;
let Lambertian;
let mat;
let pla, sph1,sph2,sph3,sph4;
let rec_time;
function get_variables(){
	rec_time = JSON.parse(document.getElementById('rec').value);
	pl1 = JSON.parse(document.getElementById('pl1').value);
	pl2 = JSON.parse(document.getElementById('pl2').value);
	m1ka = document.getElementById('m1ka').value;
	m1ka = hexToRgb(m1ka);
	m1ka = [m1ka.r,m1ka.g,m1ka.b];
	m1kd = document.getElementById('m1kd').value;
	m1kd = hexToRgb(m1kd);
	m1kd = [m1kd.r,m1kd.g,m1kd.b];
	m1ks = document.getElementById('m1ks').value;
	m1ks = hexToRgb(m1ks);
	m1ks = [m1ks.r,m1ks.g,m1ks.b];
	m1km = document.getElementById('m1km').value;
	m1km = hexToRgb(m1km);
	m1km = [m1km.r,m1km.g,m1km.b];
	m1p = JSON.parse(document.getElementById('m1p').value);
	m2ka = document.getElementById('m2ka').value;
	m2ka = hexToRgb(m2ka);
	m2ka = [m2ka.r,m2ka.g,m2ka.b];
	m2kd = document.getElementById('m2kd').value;
	m2kd = hexToRgb(m2kd);
	m2kd = [m2kd.r,m2kd.g,m2kd.b];
	m2ks = document.getElementById('m2ks').value;
	m2ks = hexToRgb(m2ks);
	m2ks = [m2ks.r,m2ks.g,m2ks.b];
	m2km = document.getElementById('m2km').value;
	m2km = hexToRgb(m2km);
	m2km = [m2km.r,m2km.g,m2km.b];
	m2p = JSON.parse(document.getElementById('m2p').value);
	m3ka = document.getElementById('m3ka').value;
	m3ka = hexToRgb(m3ka);
	m3ka = [m3ka.r,m3ka.g,m3ka.b];
	m3kd = document.getElementById('m3kd').value;
	m3kd = hexToRgb(m3kd);
	m3kd = [m3kd.r,m3kd.g,m3kd.b];
	m3ks = document.getElementById('m3ks').value;
	m3ks = hexToRgb(m3ks);
	m3ks = [m3ks.r,m3ks.g,m3ks.b];
	m3km = document.getElementById('m3km').value;
	m3km = hexToRgb(m3km);
	m3km = [m3km.r,m3km.g,m3km.b];
	m3p = JSON.parse(document.getElementById('m3p').value);
	m4ka = document.getElementById('m4ka').value;
	m4ka = hexToRgb(m4ka);
	m4ka = [m4ka.r,m4ka.g,m4ka.b];
	m4kd = document.getElementById('m4kd').value;
	m4kd = hexToRgb(m4kd);
	m4kd = [m4kd.r,m4kd.g,m4kd.b];
	m4ks = document.getElementById('m4ks').value;
	m4ks = hexToRgb(m4ks);
	m4ks = [m4ks.r,m4ks.g,m4ks.b];
	m4km = document.getElementById('m4km').value;
	m4km = hexToRgb(m4km);
	m4km = [m4km.r,m4km.g,m4km.b];
	m4p = JSON.parse(document.getElementById('m4p').value);
	m5ka = document.getElementById('m5ka').value;
	m5ka = hexToRgb(m5ka);
	m5ka = [m5ka.r,m5ka.g,m5ka.b];
	m5kd = document.getElementById('m5kd').value;
	m5kd = hexToRgb(m5kd);
	m5kd = [m5kd.r,m5kd.g,m5kd.b];
	m5ks = document.getElementById('m5ks').value;
	m5ks = hexToRgb(m5ks);
	m5ks = [m5ks.r,m5ks.g,m5ks.b];
	m5km = document.getElementById('m5km').value;
	m5km = hexToRgb(m5km);
	m5km = [m5km.r,m5km.g,m5km.b];
	m5p = JSON.parse(document.getElementById('m5p').value);
	
	
	red = new Material("red metal", m1ka,m1kd,m1ks,m1km,m1p);
	blue =new Material("blue metal", m2ka,m2kd,m2ks,m2km,m2p);
	gree =new Material("gree metal", m3ka,m3kd,m3ks,m3km,m3p);
	purp =new Material("purp metal", m4ka,m4kd,m4ks,m4km,m4p);
	Lambertian =new Material("grey", m5ka,m5kd,m5ks,m5km,m5p);

	mat = [red,blue,gree,purp,Lambertian]
	pll = JSON.parse(document.getElementById('pll').value);
	pln = JSON.parse(document.getElementById('pln').value);
	plm = mat[document.getElementById('plm').value-1];
	s1l = JSON.parse(document.getElementById('s1l').value);
	s1r = JSON.parse(document.getElementById('s1r').value);
	s2l = JSON.parse(document.getElementById('s2l').value);
	s2r = JSON.parse(document.getElementById('s2r').value);
	s3l = JSON.parse(document.getElementById('s3l').value);
	s3r = JSON.parse(document.getElementById('s3r').value);
	s4l = JSON.parse(document.getElementById('s4l').value);
	s4r = JSON.parse(document.getElementById('s4r').value);
	s1m = mat[document.getElementById('s1m').value-1];
	s2m = mat[document.getElementById('s2m').value-1];
	s3m = mat[document.getElementById('s3m').value-1];
	s4m = mat[document.getElementById('s4m').value-1];

	lit1 = new LightPoint('point_lightname1', pl1);
	lit2 = new LightPoint('point_lightname2', pl2); 
	pla  = new ObjectPlane('planename', pll, pln,plm);

	sph1 = new ObjectSphere('sphere_red', s1l, s1r, s1m);
	sph2 = new ObjectSphere('sphere_blue', s2l, s2r, s2m);
	sph3 = new ObjectSphere('sphere_gree', s3l, s3r, s3m);
	sph4 = new ObjectSphere('sphere_purp', s4l, s4r, s4m);

	scene.camera = [];
	scene.lights = [];
	scene.objects = [];
	scene.add_camera(camera);
	scene.add_object(pla);
	scene.add_object(sph3);
	scene.add_object(sph2);
	
	scene.add_object(sph4);
	scene.add_object(sph1);
	scene.add_light(lit1);
	scene.add_light(lit2);
}
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

let scene = new Scene();
scene.add_camera(camera);
scene.add_object(pla);
scene.add_object(sph3);
scene.add_object(sph2);

scene.add_object(sph4);
scene.add_object(sph1);
scene.add_light(lit1);
scene.add_light(lit2);
function render_ne(){
	get_variables();
	render_canvas_native(canvas,scene,rec_time);
}
function render_m(){
	get_variables();
	let tiles_w = JSON.parse(document.getElementById('tilesw').value);
	let tiles_h = JSON.parse(document.getElementById('tilesh').value);
	render_canvas_async(canvas,scene,tiles_w,tiles_h,rec_time); // num of light reflection
}