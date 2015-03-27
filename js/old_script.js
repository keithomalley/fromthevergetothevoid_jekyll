window.addEventListener("keypress", keys, false);

var move = 0.5;
var rotate = 0.1;

//Gets the key that was pressed and calls the function for each
function keys(e){
	var keypressed=e.keyCode? e.keyCode : e.charCode;
	console.log(keypressed);
	switch(keypressed){
		case 119:
			camera.position.x += move;
			dir = "forward";
			break;
		case 97:
			camera.position.z -= move;
			dir = "left";
			break;
		case 100:
			camera.position.z += move;
			dir = "right";
			break;
		case 115:
			camera.position.x -= move;
			dir = "backward";
			break;
		case 101:
			camera.rotation.y -= rotate;
			break;
		case 113:
			camera.rotation.y += rotate;
			break;
		default:
			dir = "static";
	}
}



// To start using Three.js we need a Scene, a Camera, and a Renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
/*
controls = new THREE.FirstPersonControls( camera );
controls.movementSpeed = 70;
controls.lookSpeed = 0.05;
controls.noFly = true;
controls.lookVertical = false;
*/
// Set the size of the renderer to the width and height of the window
renderer.setSize( window.innerWidth, window.innerHeight );
// Append the renderer to the body of the html document
document.body.appendChild( renderer.domElement );

// Set the camera position
camera.position.z = -30;
camera.position.y = 10;
camera.position.x = 10;

camera.rotation.y = -1.5;

// Create geometry for a box
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// Set the material to a basic material with a colour
var material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0x1d8ced, specular: 0x555555, shininess: 0 });
// create a Mesh object using the geometry and the material
var cube = new THREE.Mesh( geometry, material );
cube.position.x = -4;
cube.position.y = 10;
cube.position.z = -22;

// add the object to the scene
scene.add( cube );

var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 1, 1 );
scene.add( directionalLight );

var directionalLight2 = new THREE.DirectionalLight( 0x3f3f3f );
directionalLight2.position.set( -50, 15, -25 );
scene.add( directionalLight2 );

var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

// create the geometry sphere
var geometry  = new THREE.SphereGeometry(200, 100, 100);
// create the material, using a texture of startfield
var material  = new THREE.MeshBasicMaterial();
material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png');
material.side  = THREE.BackSide;
// create the mesh based on geometry and material
var mesh  = new THREE.Mesh(geometry, material);
scene.add( mesh );

// instantiate a loader
var loader = new THREE.OBJLoader();

// load a resource
loader.load(
	// resource URL
	'models/Terrain.obj',
	// Function when resource is loaded
	function ( object ) {
		object.material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0xffffff, specular: 0x555555, shininess: 0 });
		//console.log(object.children[0].geometry);
		object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals( true );
						console.log(child);
            child.material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0x343434 , specular: 0x555555, shininess: 0 });
        }
    });
		scene.add( object );
	}
);


/*
composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
dotScreenEffect.uniforms[ 'scale' ].value = 4;
composer.addPass( dotScreenEffect );

var rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
rgbEffect.uniforms[ 'amount' ].value = 0.0015;
rgbEffect.renderToScreen = true;
composer.addPass( rgbEffect );
*/


// The Render loop will animate the scene recursively
function animate() {
  // recursively call this function
  requestAnimationFrame( animate );
  // Rotate the cube
  cube.rotation.z += 0.01;
  cube.rotation.x += 0.01;

	//controls.update();
  // render the scene
	renderer.render(scene, camera);
  //composer.render( scene, camera );
}

// Initial call to render the scene
animate();
