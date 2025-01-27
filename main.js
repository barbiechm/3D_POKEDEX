import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Configuración de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(500, 500);
renderer.setClearColor(0x000000);
document.getElementById("three-container").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 2);
camera.fov = 50;
camera.updateProjectionMatrix();

const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);

const listaPokemon = document.querySelector("#listaPokemon");


const URL = "https://pokeapi.co/api/v2/pokemon/";
const models = {
  Pikachu: 25,
  Bulbasaur: 1,
  Vaporeon: 134,
};

function mostrarPokemon(poke) {
  listaPokemon.innerHTML = ""; 

  const tipos = poke.types.map((t) => t.type.name.toUpperCase()).join(", ");
  const div = document.createElement("div");
  div.classList.add("pokemon");

  div.innerHTML = `
    <div class="right-column">
      <div class="pokemon-stats">
        <h2>STATS</h2>
        <p class="stat">Altura: ${poke.height / 10} m</p>
        <p class="stat">Peso: ${poke.weight / 10} kg</p>
      </div>
      <div class="pokemon-info">
        <p class="pokemon-id">#${poke.id.toString().padStart(3, "0")}</p>
        <h2 class="pokemon-nombre">${poke.name.toUpperCase()}</h2>
      </div>
      <div class="pokemon-tipos">
        <h2>TYPE</h2>
        <p class="tipo">${tipos}</p>
      </div>
    </div>
  `;

  listaPokemon.append(div);
}

const loader = new GLTFLoader();

function loadModel(modelName) {
  const modelPath = `/models/${modelName.toUpperCase()}.gltf`;
  console.log(`Cargando modelo: ${modelName}`);

 
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

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      camera.position.set(center.x - 0.5, center.y, center.z + 1.4);
    },
    undefined,
    (error) => console.error(`Error al cargar el modelo ${modelName}:`, error)
  );
}


const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const modelName = button.id; 
    const pokemonId = models[modelName]; 

    if (!pokemonId) {
      console.error(`No se encontró información para: ${modelName}`);
      return;
    }

    
    loadModel(modelName);


    fetch(URL + pokemonId)
      .then((response) => response.json())
      .then((data) => mostrarPokemon(data))
      .catch((error) =>
        console.error(`Error al obtener datos del Pokémon:`, error)
      );
  });
});


loadModel("Pikachu");
fetch(URL + models.Pikachu)
  .then((response) => response.json())
  .then((data) => mostrarPokemon(data));

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
