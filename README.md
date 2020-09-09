# js-library-songzhif
<h2>Landing Page</h2>
<a href="https://jscene.herokuapp.com/">Link</a>

<h2>Getting Started</h2>
<p>To use JScene API, you need to <a href="https://github.com/csc309-summer-2020/js-library-songzhif/blob/master/pub/js/JScene.js">download</a> and reference <strong>JScene.js</strong> in the HTML file.</p>
<pre><code>&lt;script src=&quot;/path/to/JScene.js&quot;&gt;&lt;/script&gt;</code></pre>
<p>Add the HTML <strong>&lt;canvas&gt;</strong> tag, which will be our 3D viewport.</p>
<pre><code>&lt;canvas id="canvas"&gt;&lt;/canvas&gt;</code></pre>
<p>Create a <strong>Scene</strong> object, then draw it to the canvas.</p>
<pre><code>&lt;script&gt;
	var canvas= document.getElementById('canvas');
	var scene = new Scene();
	var recur_depth = 5;//how many time lights can reflect between objects
	render_canvas_native(canvas,scene,recur_depth);
&lt;/script&gt;</code></pre>

<h2>Documentation</h2>
<a href="https://jscene.herokuapp.com/api.html">Link</a>
