
var canvas;
var engine;
var scene;

document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
},false);

var onload = function () {
	
    canvas = document.getElementById("renderCanvas");

	engine = new BABYLON.Engine(canvas, true);
	
	// DEBUG ONLY //
	/*scene = new BABYLON.Scene(engine);
	var origin = BABYLON.Mesh.CreateSphere("origin", 10, 1.0, scene);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
	camera.setPosition(new BABYLON.Vector3(0, 0, -3));
	camera.attachControl(canvas);	
	var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,0,-5), scene);
	light.parent=camera;*/
	// END DEBUG //
	
	BABYLON.SceneLoader.Load("./tmp/" + folder + "/", model, engine, 
		function (newScene) {
                scene = newScene;
                scene.executeWhenReady(function () {
					// If no default camera
                    if (! scene.activeCamera) {
						// Get the first mesh
						var radius = -1;

						scene.meshes.forEach(function (mesh) {
							if (radius < mesh._boundingInfo.boundingSphere.radius) {
								radius = mesh._boundingInfo.boundingSphere.radius
							}
						});   
						
						// Camera
						var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -3 * radius), scene);
						//camera.attachControl(canvas);

						camera.lowerRadiusLimit = 0;
						camera.upperRadiusLimit = 6 * radius;

						scene.activeCamera = camera;
					} 
					
					// give control to the user
					scene.activeCamera.attachControl(canvas);
					
					// If no lights
					if (scene.lights ||scene.lights.length === 0) {
						var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,0,-5), scene);
						light.parent=camera;
					}		
	
					// resize problem
					engine.resize();
                });

		}, function (evt) {
		
		});
		
	engine.runRenderLoop(function () {
		if (scene && scene.activeCamera) {
			scene.render();

			// Fps
			var fps = document.getElementById("fps");
			var stats = document.getElementById("stats");
			
			fps.innerHTML = BABYLON.Tools.GetFps().toFixed() + " fps";

			// stats
			stats.innerHTML = "Total vertices: " + scene.getTotalVertices() + "<br>"
				+ "Active vertices: " + scene.getActiveVertices() + "<br>"
				+ "Active particles: " + scene.getActiveParticles() + "<br><br><br>"
				+ "Frame duration: " + scene.getLastFrameDuration() + " ms<br><br>"
				+ "<i>Evaluate Active Meshes duration:</i> " + scene.getEvaluateActiveMeshesDuration() + " ms<br>"
				+ "<i>Render Targets duration:</i> " + scene.getRenderTargetsDuration() + " ms<br>"
				+ "<i>Particles duration:</i> " + scene.getParticlesDuration() + " ms<br>"
				+ "<i>Sprites duration:</i> " + scene.getSpritesDuration() + " ms<br>"
				+ "<i>Render duration:</i> " + scene.getRenderDuration() + " ms";
		}                
	});
}