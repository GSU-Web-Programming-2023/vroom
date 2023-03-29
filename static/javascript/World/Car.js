import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export default class Car
{
    constructor(_options)
    {
        this.car = {}

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
        this.setProximityIndicator()
        this.setNPCDialogue()
        this.initAudio()
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
            this.speedometer.textContent = speed.toFixed(0) + "mph"
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

    setProximityIndicator() {
        const indicatorGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.5
        });
        const indicatorMesh = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicatorMesh.position.set(this.chassis.object.position.x, this.chassis.object.position.y, 2.75);
        this.chassis.object.add(indicatorMesh);
      
        let flashing = false;
      
        // Time tick
        this.time.on('tick', () => {
          const npcs = this.objects.getNPCs();
          let closestNPC = null;
          let closestDistance = Infinity;
      
          for (const npc of npcs) {
            const distance = this.chassis.object.position.distanceTo(npc.position);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestNPC = npc;
            }
          }
      
          if (closestNPC && closestDistance < 5) {
            indicatorMesh.visible = true;
      
            // Flashing effect
            if (!flashing) {
              flashing = true;
              const initialOpacity = indicatorMaterial.opacity;
              const flashDuration = 500;
              const flashInterval = 16;
              const numFlashes = flashDuration / flashInterval;
              let flashCount = 0;
      
              const flash = () => {
                const progress = flashCount / numFlashes;
                const easedOpacity = Math.sin(progress * Math.PI);
                indicatorMaterial.opacity = initialOpacity + (1 - initialOpacity) * easedOpacity;
      
                if (flashCount < numFlashes) {
                  flashCount++;
                  setTimeout(flash, flashInterval);
                } else {
                  indicatorMaterial.opacity = initialOpacity;
                  flashing = false;
                }
              };
      
              flash();
            }
          } else {
            indicatorMesh.visible = false;
            flashing = false;
            indicatorMaterial.opacity = 0.5;
          }
        });
    }
    
    setNPCDialogue() {
        // Set Triggers for coming into close proximity with NPCs
        const npcDialogues = {
            // Make the names the same as in the Object.js class but lowercase and without 'NPC'
            // Will not work otherwise
            "elon": [
                "[Elon] Hey! You there! Come make yourself useful...",
                "[Elon] It appears my 'genius' engineers have stranded me here on this rock...",
                "[Elon] Sigh...we're gonna have to rewrite the whole stack if we're gonna get outta here..",
                "[Elon] Locate my AI assistant, XB1-420-69...",
                "[Elon] Surely he'll know what to do..."
            ],
            "xb1": [
                "[XB1] ..bzzt.. ..I am XB1-420-69.. bzzt..",
                "[XB1] ..bzzt..",
            ],
            "r2d2": [
                "[R2] ..@@@>>?>?????>..//..",
            ],
            "spyballoon": [
                "[Balloon] Just a totally normal weather balloon, nothing to see here...",
            ],
            // more NPCs and their dialogues
        };
        
        const npcs = this.objects.getNPCs();
        npcs.forEach(npc => {
            // let talkedTo = false;
            let position = npc.position.clone();
            let distance = this.chassis.object.position.distanceTo(position);
            let currentDialogue = npcDialogues[npc.name.toLowerCase().replace('npc', '')];
        
            this.time.on('tick', () => {
                // Update the position and distance every tick
                position = npc.position.clone();
                distance = this.chassis.object.position.distanceTo(position);
            
                // Proximity trigger dialogue
                // if (distance < 5 && !talkedTo) {
                //     triggerDialogue(currentDialogue);
                //     talkedTo = true;
                // }
            
                // Handle F keypress to trigger dialogue
                document.removeEventListener('keypress', handleInteract); // Remove previous event listener
                document.addEventListener('keypress', handleInteract); // Add new event listener
            });
        
            function handleInteract(event) {
                if (event.key === 'f' && distance < 5) {
                    console.log(npc.name.toLowerCase().replace('npc', ''))
                    triggerDialogue(currentDialogue);
                }
            }
        });  
    }

    initAudio() {
        // Add the sound object to the car object
        this.car.sound = {
            brake: new Howl({
                src: ['static/sounds/car-brake.mp3'],
                loop: false,
                volume: 0.2,
                preload: true // preload the audio data
            }),
            boost: new Howl({
                src: ['static/sounds/car-boost.mp3'],
                loop: true,
                volume: 0.4,
                preload: true // preload the audio data
            }),
            idle: new Howl({
                src: ['static/sounds/car-idle.mp3'],
                loop: true,
                volume: 0.4,
                preload: true // preload the audio data
            }),
            engineStart: new Howl({
                src: ['static/sounds/car-engine-start.mp3'],
                volume: 0.4,
                preload: true, // preload the audio data
                onend: () => {
                    this.car.sound.idle.play();
                }
            })
        };
    
        this.car.engineStartPlayed = false;
        this.car.brakeSoundPlayed = false;
    
        const keyDownHandler = (event) => {
            let honkHelper = document.querySelector('#honkHelper');
            if (event.key === 'h' && honkHelper.value == 'false') {
                let honkSound = new Howl({src: ['static/sounds/car-honk.mp3'], volume: 0.5, loop: false, preload: true});
                honkSound.play();
                honkHelper.value = 'true';
            }
        };

        const keyUpHandler = (event) => {
            if (event.key === 'h') {
                let honkHelper = document.querySelector('#honkHelper');
                honkHelper.value = 'false';
            }
        };

        this.car.setSound = () => {
            // Honk sound
            // Remove the event listeners before adding new ones
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);

            // Add the event listeners back
            document.addEventListener('keydown', keyDownHandler);
            document.addEventListener('keyup', keyUpHandler);

            // Engine Start
            if (this.physics.car.controls.actions.up || this.physics.car.controls.actions.down) {
                if (!this.car.engineStartPlayed) {
                    this.car.sound.engineStart.play();
                    this.car.engineStartPlayed = true;
                    this.car.sound.idle.play();
                }
            }
            
            // Boost sound
            if ((this.physics.car.controls.actions.boost && this.physics.car.controls.actions.up) || 
                (this.physics.car.controls.actions.boost && this.physics.car.controls.actions.down)) {
                if (!this.car.sound.boost.playing()) {
                    this.car.sound.boost.play();
                    this.car.sound.idle.pause();
                }
            } else {
                if (this.car.sound.boost.playing()) {
                    this.car.sound.idle.play();
                    this.car.sound.boost.stop();
                }
            }
        
            // Brake sound
            if (this.physics.car.controls.actions.brake && !this.car.brakeSoundPlayed && this.movement.localSpeed.length() > 0.01) {
                this.car.sound.brake.play();
                this.car.brakeSoundPlayed = true;
            } else if (!this.physics.car.controls.actions.brake) {
                this.car.sound.brake.stop();
                this.car.brakeSoundPlayed = false;
            }
        
            // Adjust the volume of the idle sound based on speed
            const speedVolume = Math.min(0.7, this.movement.localSpeed.length());
            this.car.sound.idle.volume(speedVolume);
        
            if (this.movement.localSpeed.length() < 0.01) {
                this.car.sound.idle.pause();
            } else {
                if (!this.car.sound.idle.playing()) {
                    this.car.sound.idle.play();
                }
            }
        };        
    
        // Call the setSound function on each tick
        this.time.on('tick', () => {
            this.car.setSound();
        });
    }
}
