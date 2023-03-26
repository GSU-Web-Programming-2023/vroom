import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default class Car
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.physics = _options.physics
        this.shadows = _options.shadows
        this.materials = _options.materials
        this.renderer = _options.renderer
        this.camera = _options.camera
        this.debug = _options.debug
        this.speedometer = document.getElementById('speedometer');

        // Set up
        this.container = new THREE.Object3D()

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('car')
            this.debugFolder.open()
        }

        this.setMovement()
        this.setChassis()
        this.setAntena()
        this.setBackLights()
        this.setWheels()
        this.setTransformControls()

        // Set Triggers for coming into close proximity with NPCs
        let elontalkedTo = false;
        this.time.on('tick', () => {
            // ELon
            const elon = this.objects.getObjectByName('elon');
            if (elon) {
                const elonPosition = elon.position.clone();
                const distance = this.chassis.object.position.distanceTo(elonPosition);
                if (distance < 5 && !elontalkedTo) {
                    const dialogue = [
                        "[Elon] Hey! You there! Come here...",
                        "[Elon] It appears my 'genius' engineers have stranded me here on this god-foresaken planet...",
                        "[Elon] We're gonna have to rewrite the whole stack if we're going to get off this rock...",
                        "[Elon] Somewhere in this wasteland you should be able to locate my AI assistant, X1-42069...",
                        "[Elon] Find him. He'll know what to do..."
                    ];
                    triggerDialogue(dialogue);
                    elontalkedTo = true;
                }
            }
        });        
    }

    setMovement()
    {
        this.movement = {}
        this.movement.speed = new THREE.Vector3()
        this.movement.localSpeed = new THREE.Vector3()
        this.movement.acceleration = new THREE.Vector3()
        this.movement.localAcceleration = new THREE.Vector3()

        // Time tick
        this.time.on('tick', () => {
            // Movement
            const movementSpeed = new THREE.Vector3()
            movementSpeed.copy(this.chassis.object.position).sub(this.chassis.oldPosition)
            this.movement.acceleration = movementSpeed.clone().sub(this.movement.speed)
            this.movement.speed.copy(movementSpeed)

            this.movement.localSpeed = this.movement.speed.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), - this.chassis.object.rotation.z)
            this.movement.localAcceleration = this.movement.acceleration.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), - this.chassis.object.rotation.z)

            // Update speedometer
            const speed = this.movement.localSpeed.length() * 300 // convert m/s to mph
            const speedometerValue = Math.min(Math.max(speed, 0), 140) // clamp between 0 and 140
            this.speedometer.textContent = speedometerValue.toFixed(0) + "mph"
        })
    }

    setChassis()
    {
        this.chassis = {}
        this.chassis.offset = new THREE.Vector3(0, 0, - 0.28)
        this.chassis.object = this.objects.getConvertedMesh(this.resources.items.carChassis.scene.children)
        this.chassis.object.position.copy(this.physics.car.chassis.body.position)
        this.chassis.oldPosition = this.chassis.object.position.clone()
        this.container.add(this.chassis.object)

        this.shadows.add(this.chassis.object, { sizeX: 3, sizeY: 2, offsetZ: 0.2 })

        // Time tick
        this.time.on('tick', () =>
        {
            // Save old position for movement calculation
            this.chassis.oldPosition = this.chassis.object.position.clone()

            // Update if mode physics
            if(!this.transformControls.enabled)
            {
                this.chassis.object.position.copy(this.physics.car.chassis.body.position).add(this.chassis.offset)
                this.chassis.object.quaternion.copy(this.physics.car.chassis.body.quaternion)
            }
        })
    }

    setAntena()
    {
        this.antena = {}

        this.antena.speedStrength = 10
        this.antena.damping = 0.035
        this.antena.pullBackStrength = 0.02

        this.antena.object = this.objects.getConvertedMesh(this.resources.items.carAntena.scene.children)
        this.chassis.object.add(this.antena.object)

        this.antena.speed = new THREE.Vector2()
        this.antena.absolutePosition = new THREE.Vector2()
        this.antena.localPosition = new THREE.Vector2()

        // Time tick
        this.time.on('tick', () =>
        {
            this.antena.speed.x -= this.movement.acceleration.x * this.antena.speedStrength
            this.antena.speed.y -= this.movement.acceleration.y * this.antena.speedStrength

            const position = this.antena.absolutePosition.clone()
            const pullBack = position.negate().multiplyScalar(position.length() * this.antena.pullBackStrength)
            this.antena.speed.add(pullBack)

            this.antena.speed.x *= 1 - this.antena.damping
            this.antena.speed.y *= 1 - this.antena.damping

            this.antena.absolutePosition.add(this.antena.speed)

            this.antena.localPosition.copy(this.antena.absolutePosition)
            this.antena.localPosition.rotateAround(new THREE.Vector2(), - this.chassis.object.rotation.z)

            this.antena.object.rotation.y = this.antena.localPosition.x * 0.1
            this.antena.object.rotation.x = this.antena.localPosition.y * 0.1
        })

        // Debug
        if(this.debug)
        {
            const folder = this.debugFolder.addFolder('antena')
            folder.open()

            folder.add(this.antena, 'speedStrength').step(0.001).min(0).max(50)
            folder.add(this.antena, 'damping').step(0.0001).min(0).max(0.1)
            folder.add(this.antena, 'pullBackStrength').step(0.0001).min(0).max(0.1)
        }
    }

    setBackLights()
    {
        this.backLightsBrake = {}

        this.backLightsBrake.material = this.materials.pures.items.red.clone()
        this.backLightsBrake.material.transparent = true
        this.backLightsBrake.material.opacity = 0.5

        this.backLightsBrake.object = this.objects.getConvertedMesh(this.resources.items.carBackLightsBrake.scene.children)
        for(const _child of this.backLightsBrake.object.children)
        {
            _child.material = this.backLightsBrake.material
        }

        this.chassis.object.add(this.backLightsBrake.object)

        // Back lights brake
        this.backLightsReverse = {}

        this.backLightsReverse.material = this.materials.pures.items.yellow.clone()
        this.backLightsReverse.material.transparent = true
        this.backLightsReverse.material.opacity = 0.5

        this.backLightsReverse.object = this.objects.getConvertedMesh(this.resources.items.carBackLightsReverse.scene.children)
        for(const _child of this.backLightsReverse.object.children)
        {
            _child.material = this.backLightsReverse.material
        }

        this.chassis.object.add(this.backLightsReverse.object)

        // Time tick
        this.time.on('tick', () =>
        {
            // Space is down
            if(this.physics.car.controls.actions.space)
            {
                this.backLightsBrake.material.opacity = 1
                this.backLightsReverse.material.opacity = 0.5
            }

            // Space is not down
            else
            {
                // Forward
                if(this.movement.localSpeed.x > 0)
                {
                    this.backLightsBrake.material.opacity = this.movement.localAcceleration.x < - 0.001 ? 1 : 0.5
                    this.backLightsReverse.material.opacity = 0.5
                }
                // Backward
                else
                {
                    this.backLightsBrake.material.opacity = this.movement.localAcceleration.x > 0.001 ? 1 : 0.5
                    this.backLightsReverse.material.opacity = this.movement.localAcceleration.x < - 0.001 ? 1 : 0.5
                }
            }
        })
    }

    setWheels()
    {
        this.wheels = {}
        this.wheels.object = this.objects.getConvertedMesh(this.resources.items.carWheel.scene.children)
        this.wheels.items = []

        for(let i = 0; i < 4; i++)
        {
            const object = this.wheels.object.clone()

            this.wheels.items.push(object)
            this.container.add(object)
        }

        // Time tick
        this.time.on('tick', () =>
        {
            if(!this.transformControls.enabled)
            {
                for(const _wheelKey in this.physics.car.wheels.bodies)
                {
                    const wheelBody = this.physics.car.wheels.bodies[_wheelKey]
                    const wheelObject = this.wheels.items[_wheelKey]

                    wheelObject.position.copy(wheelBody.position)
                    wheelObject.quaternion.copy(wheelBody.quaternion)
                }
            }
        })
    }

    setTransformControls()
    {
        this.transformControls = new TransformControls(this.camera.instance, this.renderer.domElement)
        this.transformControls.size = 0.5
        this.transformControls.attach(this.chassis.object)
        this.transformControls.enabled = false
        this.transformControls.visible = this.transformControls.enabled

        document.addEventListener('keydown', (_event) =>
        {
            if(this.mode === 'transformControls')
            {
                if(_event.key === 'r')
                {
                    this.transformControls.setMode('rotate')
                }
                else if(_event.key === 'g')
                {
                    this.transformControls.setMode('translate')
                }
            }
        })

        this.transformControls.addEventListener('dragging-changed', (_event) =>
        {
            this.camera.orbitControls.enabled = !_event.value
        })

        this.container.add(this.transformControls)

        if(this.debug)
        {
            const folder = this.debugFolder.addFolder('controls')
            folder.open()

            folder.add(this.transformControls, 'enabled').onChange(() =>
            {
                this.transformControls.visible = this.transformControls.enabled
            })
        }
    }
}
