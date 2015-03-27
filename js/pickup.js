// Create geometry for a box
var geometry = new THREE.BoxGeometry( 2,2, 2 );
// Set the material to a basic material with a colour
var material = new THREE.MeshPhongMaterial({ ambient: 0x050505,  color: 0x1d8ced, specular: 0x555555, shininess: 0 });
// create a Mesh object using the geometry and the material
var cube = new THREE.Mesh( geometry, material );
cube.position.x = 0;
cube.position.y = -10;
cube.position.z = -50;

// add the object to the scene
scene.add( cube );
