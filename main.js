import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
document.getElementById('three-container').appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 2;


camera.position.set(1, 1, 1);

  // Apuntar la cámara hacia el centro
  camera.lookAt(0, 0, 0);


const light = new THREE.AmbientLight(0xffffff, 2);
        scene.add(light);

const loader = new GLTFLoader();

loader.load( '/VAPOREON.gltf', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
	requestAnimationFrame(animate);

	renderer.render( scene, camera );

}

animate();

