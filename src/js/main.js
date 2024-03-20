// Inspired by tutorial by Coders Unite - www.youtube.com/@codersunite

import SolarSystem from './modules/SolarSystem'

export default class Main {
  constructor() {
    this.init()
  }

  init() {
    SolarSystem.init()
  }
}

const main = new Main()
