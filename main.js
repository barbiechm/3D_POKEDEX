import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500);
renderer.setClearColor(0x000000);
document.getElementById("three-container").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();

camera.fov = 50;
camera.updateProjectionMatrix();

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

//GLTF
const loader = new GLTFLoader();


const models = {
  Vaporeon: "/models/VAPOREON.gltf",
  Bulbasaur: "/models/BULBASAUR.gltf",
  Pikachu: "/models/PIKACHU.gltf",
};

function loadModel(modelName) {
  const modelPath = models[modelName];
  if (!modelPath) {
    console.error(`No se encontró un modelo para: ${modelName}`);
    return;
  }

  console.log(`Cargando modelo: ${modelName}`);

  // Limpiar la escena (opcional)
  while (scene.children.length > 1) {
    const object = scene.children.pop();
    if (object.isMesh || object.isGroup) {
      object.geometry?.dispose();
      object.material?.dispose();
    }
  }
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.y = -0.5;
      scene.add(model);

      model.position.y = -0.4;
      const box = new THREE.Box3().setFromObject(model);

      const center = box.getCenter(new THREE.Vector3());

      camera.position.set(center.x - 0.5, center.y, center.z + 1.4); // Ajusta la altura y distancia según sea necesario
      camera.lookAt(center);
    },
    undefined,
    (error) => {
      console.error(`Error al cargar el modelo ${modelName}:`, error);
    }
  );
}

const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const modelName = button.id; // Usar el id del botón como clave
    loadModel(modelName);
  });
});

loadModel("Pikachu");

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
