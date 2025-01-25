import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500);
renderer.setClearColor(0x000000);
document.getElementById('three-container').appendChild(renderer.domElement);


const controls = new OrbitControls( camera, renderer.domElement );


controls.update();

camera.fov = 50; 
camera.updateProjectionMatrix(); 


const light = new THREE.AmbientLight(0xffffff, 2.5);
        scene.add(light);

		//GLTF
const loader = new GLTFLoader();

loader.load( '/PIKACHU.gltf', function ( gltf ) {
    const model = gltf.scene;
	scene.add( model );

	model.position.y = -0.4;
    const box = new THREE.Box3().setFromObject(model);
    
    const center = box.getCenter(new THREE.Vector3());
	
	camera.position.set(center.x - 0.5, center.y, center.z + 1.4); // Ajusta la altura y distancia según sea necesario
    camera.lookAt(center);

}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
	requestAnimationFrame(animate);
    controls.update();
	renderer.render( scene, camera );

}

animate();

