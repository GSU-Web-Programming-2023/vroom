import * as THREE from 'three';
import FloorMaterial from '../Materials/Floor.js';

export default class Floor {
  constructor(_options) {
    // Options
    this.debug = _options.debug;

    // Container
    this.container = new THREE.Object3D();

    // Material
    this.material = new FloorMaterial();

    // Texture
    let texture = new THREE.TextureLoader();
    this.updateMaterial = function() {
        texture.load('../../static/images/floor_texture.jpg', function(loadedTexture) {
            let repeats = 1000 // increase the texture repeat
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.RepeatWrapping;
            loadedTexture.repeat.set(repeats, repeats);
            loadedTexture.needsUpdate = true;

            this.material.uniforms.tBackground.value = loadedTexture;
            this.material.needsUpdate = true;

            // Create the geometry in the onLoad callback function
            this.geometry = new THREE.PlaneBufferGeometry(10000, 10000, 50, 50);
            let uv = this.geometry.attributes.uv.array;
            for (let i = 0; i < uv.length; i++) {
              uv[i] *= repeats;
            }
            this.geometry.attributes.uv.needsUpdate = true;
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.container.add(this.mesh);
        }.bind(this));
    }.bind(this);

    this.updateMaterial();

    // Debug
    if (this.debug) {
      const folder = this.debug.addFolder('floor');
      // folder.open()

    //   folder.addColor(this.colors, 'topLeft').onChange(this.updateMaterial);
    //   folder.addColor(this.colors, 'topRight').onChange(this.updateMaterial);
    //   folder.addColor(this.colors, 'bottomRight').onChange(this.updateMaterial);
    //   folder.addColor(this.colors, 'bottomLeft').onChange(this.updateMaterial);
    }
  }
}
