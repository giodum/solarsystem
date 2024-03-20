import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import planetsJson from '/src/data/planets.json'

import Planet from './Planet'

export default class SolarSystem {
  // singleton pattern
  static item = null

  constructor() {
    // check previous existance of the instance
    if (SolarSystem.item) {
      throw new Error('SolarSystem has already been initialized')
    }

    // initialize renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    // initialize scene
    this.scene = new THREE.Scene()

    // initialize camera
    this.camera = new THREE.PerspectiveCamera(
      45, // angle
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // min distance
      10000 // max distance
    )

    // setting up background of the solar system
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    this.scene.background = cubeTextureLoader
      .setPath('/textures/')
      .load([
        'stars.jpg',
        'stars.jpg',
        'stars.jpg',
        'stars.jpg',
        'stars.jpg',
        'stars.jpg',
      ])

    // setting up orbit control
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    this.camera.position.set(-120, 400, 400)
    this.orbit.update()

    // setting up texture loader
    this.textureLoader = new THREE.TextureLoader()

    // setting up ambient light
    this.ambientLight = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(this.ambientLight)

    // add point light for the sun (emitting lights)
    this.pointLight = new THREE.PointLight(0xffffff, 3.5, 1000, 0.1)
    this.pointLight.position.set(0, 0, 0)
    this.scene.add(this.pointLight)

    // create shared planet geometry
    this.planetGeometry = new THREE.SphereGeometry(1, 50, 50)

    // create planets
    this.planets = []
    planetsJson.planets.forEach((planet) => {
      this.planets[planet.name] = this.createPlanet(
        planet.name,
        this.planetGeometry,
        '/textures/' + planet.planet_texture_name,
        planet.size,
        planet.distance,
        planet.rings ? '/textures/' + planet.ring_texture_name : null,
        planet.ringInternalSize,
        planet.ringExternalSize,
        planet.rotationSpeed,
        planet.revolutionSpeed
      )
    })

    // animate planets
    this.animate()
  }

  createPlanet(
    name,
    geometry,
    texture,
    size,
    position,
    ringTexture,
    ringInternalSize,
    ringExternalSize,
    rotationSpeed,
    revolutionSpeed
  ) {
    const planet = new Planet(
      name,
      geometry,
      texture,
      size,
      position,
      ringTexture,
      ringInternalSize,
      ringExternalSize,
      rotationSpeed,
      revolutionSpeed,
      this.textureLoader
    )
    this.scene.add(planet.planetObject)
    return planet
  }

  animate() {
    Object.values(this.planets).forEach((planet) => {
      planet.planet.rotateY((planet.rotationSpeed / 100) * 1.5)
      planet.planetObject.rotateY((1 / planet.revolutionSpeed) * 3)
    })

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(() => this.animate())
  }

  static init() {
    if (!SolarSystem.item) {
      SolarSystem.item = new SolarSystem()
    }
  }
}
