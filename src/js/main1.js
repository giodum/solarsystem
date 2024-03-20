// Inspired by tutorial by Coders Unite - www.youtube.com/@codersunite

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import starsTexture from '/src/textures/stars.jpg'
import sunTexture from '/src/textures/sun.jpg'
import mercuryTexture from '/src/textures/mercury.jpg'
import saturnTexture from '/src/textures/saturn.jpg'
import saturnRingTexture from '/src/textures/saturn_ring.png'

// renderer
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

// creating camera instance
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// setting up background of the solar system
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
])

// setting up orbit control
const orbit = new OrbitControls(camera, renderer.domElement)
camera.position.set(-90, 140, 140)
orbit.update()

// setting up light
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

// loading planets textures
const textureLoader = new THREE.TextureLoader()

const planetGeometry = new THREE.SphereGeometry(1, 25, 20)
const ringGeometry = new THREE.RingGeometry(1.3, 1.5, 30)

const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
})
const sun = new THREE.Mesh(planetGeometry, sunMaterial)
sun.scale.setScalar(12)
scene.add(sun)

// add point light for the sun
const pointLight = new THREE.PointLight(0xffffff, 700, 500)
pointLight.position.set(0, 0, 0)
scene.add(pointLight)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
// scene.add(pointLightHelper)

const mercury = createPlanet(planetGeometry, mercuryTexture, 5, 20)

const saturn = createPlanet(
  planetGeometry,
  saturnTexture,
  5,
  150,
  ringGeometry,
  saturnRingTexture
)

/* ********* */
/* FUNCTIONS */
/* ********* */

// create planet function
function createPlanet(
  planetGeometry,
  planetTexture,
  size,
  position,
  ringGeometry,
  ringTexture
) {
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(planetTexture),
  })
  const planet = new THREE.Mesh(planetGeometry, material)
  planet.scale.setScalar(size)
  planet.position.x = position
  const planetObject = new THREE.Object3D()
  planetObject.add(planet)
  scene.add(planetObject)

  if (ringGeometry) {
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ringTexture),
      side: THREE.DoubleSide,
    })

    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.scale.setScalar(size)
    ring.position.x = position
    ring.rotation.x = -0.5 * Math.PI

    console.log(ring)
    planetObject.add(ring)
  }

  return {planet, planetObject}
}

// animation loop function
function animate() {
  mercury.planet.rotateY(0.001)
  mercury.planetObject.rotateY(0.01)
  sun.rotateY(0.002)

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
