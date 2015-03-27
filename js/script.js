window.addEventListener("keypress", keys, false);
window.addEventListener("keyup", stopanim, false);

var score = 0;
var scoreboard = document.getElementById('scoreboard');

var collidableMeshList = [];
var arrowList = [];
var directionList = [];

// stop the animation if no keys are pressed
function stopanim(e){
	dir = "static";
}

var move = 0.5;
var rotate = 0.1;
var dir;
var ship;
var shipbox;

//Gets the key that was pressed and calls the function for each
function keys(e){
	var keypressed=e.keyCode? e.keyCode : e.charCode;

	//console.log(keypressed);
	switch(keypressed){
		case 97:
			//ship.position.x -= move;
			dir = "left";
			break;
		case 100:
			//ship.position.x += move;
			dir = "right";
			break;
		default:
			dir = "static";
	}
}



// To start using Three.js we need a Scene, a Camera, and a Renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

// Set the size of the renderer to the width and height of the window
renderer.setSize( window.innerWidth, window.innerHeight );
// Append the renderer to the body of the html document
document.body.appendChild( renderer.domElement );

// Set the camera position
camera.position.z = 0;
camera.position.y = 0;
camera.position.x = 0;

// Create geometry for a box
var geometry = new THREE.BoxGeometry( 2,2, 2 );
// Set the material to a basic material with a colour
var material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0x1d8ced, specular: 0x555555, shininess: 0 });
var redmaterial = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0xd80a25, specular: 0x555555, shininess: 0 });
// create a Mesh object using the geometry and the material
var materials = [material, redmaterial]
var cubes = [];

for(var i=0;i<10;i++){
	if(i > 6){
		var cube = new THREE.Mesh( geometry, redmaterial );
	} else {
		var cube = new THREE.Mesh( geometry, material );
	}
	cube.position.x = Math.floor(Math.random() * (36 - 0 + 1)) -18;
	cube.position.y = -10;
	cube.position.z = -50 - (Math.floor(Math.random() * 60) + (30 * i));
	cubes.push(cube);
	// add the object to the scene
	scene.add( cube );
}

var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 5, 3, 5 );
scene.add( directionalLight );

var directionalLight2 = new THREE.DirectionalLight( 0x3f3f3f );
directionalLight2.position.set( -50, 15, -25 );
scene.add( directionalLight2 );

var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

// create the skybox geometry sphere
var geometry  = new THREE.SphereGeometry(200, 100, 100);
// create the material, using a texture of startfield
var material  = new THREE.MeshBasicMaterial();
material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png');
material.side  = THREE.BackSide;
// create the mesh based on geometry and material
var mesh  = new THREE.Mesh(geometry, material);
scene.add( mesh );


var loader = new THREE.OBJLoader();
loader.load(
	// resource URL
	'models/ship.obj',
	// Function when resource is loaded
	function ( object ) {
		object.material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0xffffff, specular: 0x555555, shininess: 0 });
		//console.log(object.children[0].geometry);
		object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals( true );
						//console.log(child);
            child.material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0xff8855, specular: 0x555555, shininess: 0 });
        }
    });
		xScale = 0.03;
		object.scale.x = object.scale.y = object.scale.z = xScale;
		object.position.x = camera.position.x + 0;
		object.position.y = camera.position.y - 10;
		object.position.z = camera.position.z - 20;
		ship = object;
		scene.add( object );
	}
);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
var cubegeo = new THREE.BoxGeometry( 7, 5, 5 );
shipbox = new THREE.Mesh( cubegeo, wireMaterial );
shipbox.position.x = camera.position.x + 0;
shipbox.position.y = camera.position.y - 10;
shipbox.position.z = camera.position.z - 20;
// add the object to the scene
scene.add( shipbox );

var boundary = {zmin: -18, zmax:18};

// The Render loop will animate the scene recursively
function animate() {
  // recursively call this function
  requestAnimationFrame( animate );

	for(var m = 0;m<cubes.length;m++){
		var cube = cubes[m];
		// Rotate the cube
	  cube.rotation.z += 0.04;
	  cube.rotation.x += 0.04;
		cube.position.z += 0.5;

		if(cube.position.z > 0){
			cube.position.z = -130;
			cube.position.x = Math.floor(Math.random() * (36 - 0 + 1)) -18;
		}
	}

	switch(dir){
		case "left":
			if(ship.position.x > boundary.zmin){
				ship.position.x -= 0.25;
			}
			ship.rotation.z = (ship.position.x) * -0.02;
			break;
		case "right":
			if(ship.position.x < boundary.zmax){
				ship.position.x += 0.25;
			}
			ship.rotation.z = (ship.position.x) * -0.02;
			break;
	}

	var originPoint = shipbox.position.clone();

	for (var vertexIndex = 0; vertexIndex < shipbox.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = shipbox.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( shipbox.matrix );
		var directionVector = globalVertex.sub( shipbox.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( cubes );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
			console.log(collisionResults[0].object.position);
			if(collisionResults[0]){
				collisionResults[0].object.position.x = Math.floor(Math.random() * (36 - 0 + 1)) -18;
				collisionResults[0].object.position.z = -150;
				score += 10;
			}
		}

	shipbox.position.x = ship.position.x
	shipbox.position.y = ship.position.y;
	shipbox.position.z = ship.position.z;





	scoreboard.innerHTML = ("Score: " + score);
  // render the scene
	renderer.render(scene, camera);
  //composer.render( scene, camera );
}

// Initial call to render the scene
animate();
