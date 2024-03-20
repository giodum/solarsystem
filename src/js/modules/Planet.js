import * as THREE from 'three'

export default class Planet {
  constructor(
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
    textureLoader
  ) {
    // planet properties
    this.name = name
    this.geometry = geometry
    this.texture = texture
    this.size = size
    this.position = position
    this.ringGeometry = null
    this.ringTexture = ringTexture
    this.ringInternalSize = ringInternalSize
    this.ringExternalSize = ringExternalSize
    this.rotationSpeed = rotationSpeed
    this.revolutionSpeed = revolutionSpeed

    // planet and planet object
    this.planet = null
    this.ring = null
    this.planetObject = new THREE.Object3D()

    // extra elements
    this.textureLoader = textureLoader

    // create full planet
    this.createPlanet()
  }

  createPlanet() {
    // create planet
    let material = null

    if (this.name == 'sun') {
      material = new THREE.MeshStandardMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 1,
        emissiveMap: this.textureLoader.load(this.texture),
        map: this.textureLoader.load(this.texture),
        normalMap: this.textureLoader.load(
          '/textures/' + this.name + '_normal.jpg'
        ),
      })
    } else {
      material = new THREE.MeshStandardMaterial({
        map: this.textureLoader.load(this.texture),
        normalMap: this.textureLoader.load(
          '/textures/' + this.name + '_normal.jpg'
        ),
      })
    }

    this.planet = new THREE.Mesh(this.geometry, material)
    this.planet.scale.setScalar(this.size)
    this.planet.position.x = this.position
    this.planetObject.add(this.planet)

    // create ring
    if (this.ringTexture) {
      this.ringGeometry = new THREE.RingGeometry(
        this.ringInternalSize,
        this.ringExternalSize,
        30
      )

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 'white',
        map: this.textureLoader.load(this.ringTexture),
        side: THREE.DoubleSide,
      })

      this.ring = new THREE.Mesh(this.ringGeometry, ringMaterial)
      this.ring.position.x = this.position
      this.ring.rotation.x = -0.5 * Math.PI
      this.planetObject.add(this.ring)
    }
  }
}
