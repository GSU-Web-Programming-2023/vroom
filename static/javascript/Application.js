import * as THREE from 'three'
import * as dat from 'dat.gui'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import World from './World/index.js'
import Resources from './Resources.js'
import Stats from 'stats.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import BlurPass from './Passes/Blur.js'
import GlowsPass from './Passes/Glows.js'
import Camera from './Camera.js'

export default class Application
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        // Options
        this.$canvas = _options.$canvas

        // Set up
        this.time = new Time()
        this.sizes = new Sizes()
        this.debug = new dat.GUI({ width: 420 })
        this.resources = new Resources()

        this.resources.on('ready', () =>
        {
            this.setRenderer()
            this.setCamera()
            this.setPasses()
            this.setPerformanceStats();
            this.setWorld()
        })
    }

    /**
     * Set renderer
     */
    setRenderer()
    {
        // Scene
        this.scene = new THREE.Scene()

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            alpha: true
        })
        // this.renderer.setClearColor(0x414141, 1)
        this.renderer.setClearColor(0x000000, 1)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
        this.renderer.physicallyCorrectLights = true
        this.renderer.gammaFactor = 2.2
        this.renderer.gammaOutPut = true
        this.renderer.autoClear = false

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
        })
    }

    /**
     * Set camera
     */
    setCamera()
    {
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            renderer: this.renderer,
            debug: this.debug
        })

        this.scene.add(this.camera.instance)

        this.time.on('tick', () =>
        {
            this.camera.target.copy(this.world.car.chassis.object.position)
        })
    }

    setPasses()
    {
        this.passes = {}

        // Debug
        if(this.debug)
        {
            this.passes.debugFolder = this.debug.addFolder('postprocess')
            // this.passes.debugFolder.open()
        }

        this.passes.composer = new EffectComposer(this.renderer)

        // Create passes
        this.passes.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.passes.smaa = new SMAAPass(this.sizes.viewport.width * this.renderer.getPixelRatio(), this.sizes.viewport.height * this.renderer.getPixelRatio())
        this.passes.smaa.enabled = this.renderer.getPixelRatio() <= 1

        this.passes.horizontalBlurPass = new ShaderPass(BlurPass)
        this.passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height)
        this.passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(1.25, 0.0)

        this.passes.verticalBlurPass = new ShaderPass(BlurPass)
        this.passes.verticalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height)
        this.passes.verticalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(0.0, 1.25)

        // Debug
        if(this.debug)
        {
            const folder = this.passes.debugFolder.addFolder('blur')
            folder.open()

            folder.add(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 'x').step(0.001).min(0).max(10)
            folder.add(this.passes.verticalBlurPass.material.uniforms.uStrength.value, 'y').step(0.001).min(0).max(10)
        }

        this.passes.glowsPass = new ShaderPass(GlowsPass)
        this.passes.glowsPass.color = '#ffcfe0'
        this.passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(0.989, 0.117)
        this.passes.glowsPass.material.uniforms.uRadius.value = 0
        this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(this.passes.glowsPass.color)
        this.passes.glowsPass.material.uniforms.uAlpha.value = 0.55

        // Debug
        if(this.debug)
        {
            const folder = this.passes.debugFolder.addFolder('glows')
            folder.open()

            folder.add(this.passes.glowsPass.material.uniforms.uPosition.value, 'x').step(0.001).min(- 1).max(2).name('positionX')
            folder.add(this.passes.glowsPass.material.uniforms.uPosition.value, 'y').step(0.001).min(- 1).max(2).name('positionY')
            folder.add(this.passes.glowsPass.material.uniforms.uRadius, 'value').step(0.001).min(0).max(2).name('radius')
            folder.addColor(this.passes.glowsPass, 'color').name('color').onChange(() =>
            {
                this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(this.passes.glowsPass.color)
            })
            folder.add(this.passes.glowsPass.material.uniforms.uAlpha, 'value').step(0.001).min(0).max(1).name('alpha')
        }

        // Add passes
        this.passes.composer.addPass(this.passes.renderPass)
        this.passes.composer.addPass(this.passes.horizontalBlurPass)
        this.passes.composer.addPass(this.passes.verticalBlurPass)
        this.passes.composer.addPass(this.passes.glowsPass)
        this.passes.composer.addPass(this.passes.smaa)

        // Time tick
        this.time.on('tick', () =>
        {
            // Renderer
            this.passes.composer.render()
            // this.renderer.render(this.scene, this.camera.instance)
        })

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.horizontalBlurPass.material.uniforms.uResolution.value.x = this.sizes.viewport.width
            this.passes.horizontalBlurPass.material.uniforms.uResolution.value.y = this.sizes.viewport.height
            this.passes.verticalBlurPass.material.uniforms.uResolution.value.x = this.sizes.viewport.width
            this.passes.verticalBlurPass.material.uniforms.uResolution.value.y = this.sizes.viewport.height
        })
    }

    setPerformanceStats() {
        // Create Stats.js instances
        this.stats1 = new Stats();
        this.stats2 = new Stats();
        this.stats3 = new Stats();

        // Show the desired panels
        this.stats1.showPanel(0); // FPS
        this.stats2.showPanel(1); // MS
        this.stats3.showPanel(2); // MB

        // Add Stats.js to debug folder
        if (this.debug) {
            const perfFolder = this.debug.addFolder('performance');

            // Add a container div for the stats panels
            const statsContainer = document.createElement('div');
            statsContainer.setAttribute('id', 'stats-container');
            statsContainer.style.display = perfFolder.closed ? 'none' : 'flex';
            statsContainer.style.flexDirection = 'row';
            statsContainer.style.justifyContent = 'space-between';
            statsContainer.style.alignItems = 'center';
            statsContainer.style.width = '100%';
            perfFolder.__ul.appendChild(statsContainer);

            // Add stats panels to container
            statsContainer.appendChild(this.stats1.dom);
            statsContainer.appendChild(this.stats2.dom);
            statsContainer.appendChild(this.stats3.dom);

            // Make the stats panels relative to the container
            this.stats1.dom.style.position = 'relative';
            this.stats1.dom.style.top = '0';
            this.stats2.dom.style.position = 'relative';
            this.stats2.dom.style.top = '0';
            this.stats3.dom.style.position = 'relative';
            this.stats3.dom.style.top = '0';
            statsContainer.style.background = '#000000';
            statsContainer.style.display = 'none';

            perfFolder.domElement.addEventListener('click', () => {
                statsContainer.style.display = perfFolder.closed ? 'none' : 'flex';
            });
            document.querySelector("body > div.dg.ac > div > ul > li:nth-child(3) > div > ul > li").click();
        }

        // Update stats on each tick
        this.time.on('tick', () => {
          this.stats1.update();
          this.stats2.update();
          this.stats3.update();
        });
      }

    /**
     * Set world
     */
    setWorld()
    {
        this.world = new World({
            debug: this.debug,
            resources: this.resources,
            time: this.time,
            camera: this.camera,
            renderer: this.renderer
        })
        this.scene.add(this.world.container)
    }

    /**
     * Destructor
     */
    destructor()
    {
        this.time.off('tick')
        this.sizes.off('resize')

        this.camera.orbitControls.dispose()
        this.renderer.dispose()
        this.debug.destroy()
    }
}
