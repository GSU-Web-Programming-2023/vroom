import * as THREE from 'three'

export default class Objects
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.materials = _options.materials
        this.shadows = _options.shadows
        this.physics = _options.physics
        this.debug = _options.debug

        // Set up
        this.container = new THREE.Object3D()
        this.items = []

        this.setList()
        this.setParsers()

        // Add all objects from the list
        for(let _options of this.list)
        {
            this.add(_options)
        }
        this.setNPCMovement()
    }

    setList()
    {
        // Objects options list
        this.list = [
            {
                name: 'startingPoint', // starting point
                base: this.resources.items.startingPointBase.scene,
                collision: this.resources.items.startingPointCollision.scene,
                floorShadowTexture: this.resources.items.startingPointFloorShadowTexture,
                offset: new THREE.Vector3(0, 0, 0),
                mass: 50
            },
            {
                name: 'elon',
                base: this.resources.items.elon.scene,
                collision: this.resources.items.elonCollision.scene,
                offset: new THREE.Vector3(-7, -11, 0),
                mass: 45,
                is_npc: true
            },
            {
                name: 'xb1',
                base: this.resources.items.xb1.scene,
                collision: this.resources.items.xb1Collision.scene,
                offset: new THREE.Vector3(-55, -25, 0),
                mass: 15,
                is_npc: true
            },
            {
                name: 'r2d2',
                base: this.resources.items.r2d2.scene,
                collision: this.resources.items.r2d2Collision.scene,
                offset: new THREE.Vector3(-54, -24, 0),
                mass: 20,
                is_npc: true
            },
            {
                name: 'alien',
                base: this.resources.items.alien.scene,
                collision: this.resources.items.alienCollision.scene,
                offset: new THREE.Vector3(-35, 0, 1),
                mass: 10,
                is_npc: true
            },
            {
                name: 'spyBalloon',
                base: this.resources.items.spyBalloon.scene,
                collision: this.resources.items.spyBalloonCollision.scene,
                offset: new THREE.Vector3(10, -12, 4),
                mass: 0,
                is_npc: true
            },
            {
                name: 'lander',
                base: this.resources.items.lander.scene,
                collision: this.resources.items.landerCollision.scene,
                offset: new THREE.Vector3(-20, -11, 0),
                mass: 200
            },
            {
                name: 'rocket',
                base: this.resources.items.rocket.scene,
                collision: this.resources.items.rocketCollision.scene,
                offset: new THREE.Vector3(4, 10, 0),
                mass: 75
            },
            {
                name: 'tree',
                base: this.resources.items.tree.scene,
                collision: this.resources.items.treeCollision.scene,
                offset: new THREE.Vector3(-7, -7, 0),
                mass: 50
            },
            // {
            //     name: 'sphere',
            //     base: this.resources.items.dynamicSphereBase.scene,
            //     collision: this.resources.items.dynamicSphereCollision.scene,
            //     offset: new THREE.Vector3(0, 0, 0),
            //     mass: 2
            // },
            // {
            //     name: 'box',
            //     base: this.resources.items.dynamicBoxBase.scene,
            //     collision: this.resources.items.dynamicBoxCollision.scene,
            //     offset: new THREE.Vector3(0, 0, 2),
            //     mass: 2
            // },
            // {
            //     name: 'complex',
            //     base: this.resources.items.dynamicComplexBase.scene,
            //     collision: this.resources.items.dynamicComplexCollision.scene,
            //     offset: new THREE.Vector3(0, 0, 7),
            //     mass: 2
            // },
        ]

        // Spawn 75 trees and rocks in random locations
        for (let i = 0; i < 75; i++) {
            // Define a random distance between 30 and 70 meters
            let distance = Math.floor(Math.random() * 71) + 30;
        
            // Define a random angle between 0 and 2 * PI radians
            let angle = Math.random() * 2 * Math.PI;
        
            // Calculate the x and y offsets for the object using the distance and angle
            let xOffset = distance * Math.cos(angle);
            let yOffset = distance * Math.sin(angle);
        
            // Initial Position
            let object;
            let x = 0;
            let y = 0;
            let z = 0;

            let rand = Math.random();
            if (rand < 0.6) { // 60% chance for rocks
                object = {
                    name: `rock${i}`,
                    base: this.resources.items.rock.scene,
                    collision: this.resources.items.rockCollision.scene,
                    offset: new THREE.Vector3(x + xOffset, y + yOffset, z),
                    mass: 100
                };
            } else { // 40% chance for trees
                object = {
                    name: `tree${i}`,
                    base: this.resources.items.tree.scene,
                    collision: this.resources.items.treeCollision.scene,
                    offset: new THREE.Vector3(x + xOffset, y + yOffset, z),
                    mass: 100
                };
            }
        
            // Append the object to the list
            this.list.push(object);
        }

        // // Spawn 10 aliens in random locations
        for (let i = 0; i < 10; i++) {
            // Define a random distance between 30 and 70 meters
            let distance = Math.floor(Math.random() * 71) + 30;

            // Define a random angle between 0 and 2 * PI radians
            let angle = Math.random() * 2 * Math.PI;

            // Calculate the x and y offsets for the object using the distance and angle
            let xOffset = distance * Math.cos(angle);
            let yOffset = distance * Math.sin(angle);

            // Initial Position
            let object;
            let x = 0;
            let y = 0;
            let z = 1;

            object = {
                name: `alien${i}`,
                base: this.resources.items.alien.scene,
                collision: this.resources.items.alienCollision.scene,
                offset: new THREE.Vector3(x + xOffset, y + yOffset, z),
                mass: 10,
                is_npc: true
            };

            // Append the object to the list
            this.list.push(object);
        }
    }

    setParsers()
    {
        this.parsers = {}

        this.parsers.items = [
            // Shade
            {
                regex: /^shade([a-z]+)_?[0-9]{0,3}?/i,
                apply: (_mesh, _options) =>
                {
                    // Find material
                    let match = _mesh.name.match(/^shade([a-z]+)_?[0-9]{0,3}?/i)
                    let materialName = match[1].toLowerCase()
                    let material = this.materials.shades.items[materialName]

                    // Default
                    if(typeof material === 'undefined')
                    {
                        material = new THREE.MeshNormalMaterial()
                    }

                    // Create clone mesh with new material
                    let mesh = _options.cloneMesh ? _mesh.clone() : _mesh
                    mesh.material = material

                    return mesh
                }
            },

            // Shade
            {
                regex: /^pure([a-z]+)_?[0-9]{0,3}?/i,
                apply: (_mesh, _options) =>
                {
                    // Find material
                    let match = _mesh.name.match(/^pure([a-z]+)_?[0-9]{0,3}?/i)
                    let materialName = match[1].toLowerCase()
                    let material = this.materials.pures.items[materialName]

                    // Default
                    if(typeof material === 'undefined')
                    {
                        material = new THREE.MeshNormalMaterial()
                    }

                    // Create clone mesh with new material
                    let mesh = _options.cloneMesh ? _mesh.clone() : _mesh
                    mesh.material = material

                    return mesh
                }
            },

            // Floor
            {
                regex: /^floor_?[0-9]{0,3}?/i,
                apply: (_mesh, _options) =>
                {
                    // Create floor manually because of missing UV
                    let geometry = new THREE.PlaneBufferGeometry(_mesh.scale.x, _mesh.scale.z, 10, 10)
                    let material = this.materials.items.floorShadow.clone()

                    material.uniforms.tShadow.value = _options.floorShadowTexture
                    material.uniforms.uShadowColor.value = new THREE.Color(this.materials.items.floorShadow.shadowColor)

                    let mesh = new THREE.Mesh(geometry, material)

                    return mesh
                }
            }
        ]

        // Default
        this.parsers.default = {}
        this.parsers.default.apply = (_mesh) =>
        {
            // Create clone mesh with original material
            let mesh = _mesh.clone()
            mesh.material = _mesh.material
            return mesh
        }
    }

    getConvertedMesh(_children, _options = {}) {
        let container = new THREE.Object3D()
        let center = new THREE.Vector3()

        // Go through each base child
        let baseChildren = [..._children]

        for(let _child of baseChildren)
        {
            // Find center
            if(_child.name.match(/^center_?[0-9]{0,3}?/i))
            {
                center.set(_child.position.x, _child.position.y, _child.position.z)
            }

            if(_child instanceof THREE.Mesh)
            {
                // Find parser and use default if not found
                let parser = this.parsers.items.find((_item) => _child.name.match(_item.regex))
                if(typeof parser === 'undefined')
                {
                    parser = this.parsers.default
                }

                // Create mesh by applying parser
                let mesh = parser.apply(_child, _options)

                // Add to container
                container.add(mesh)
            }
        }

        // Recenter
        if(center.length() > 0)
        {
            for(let _child of container.children)
            {
                _child.position.sub(center)
            }

            container.position.add(center)
        }

        return container
    }

    getObjectByName(name) {
        for(let object of this.items) {
            if(object.container.name === name) {
                return object.container;
            }
        }
        return null; // return null if the object is not found
    }

    getChildObjectByName(object, name) {
        return object.children.find(child => child.name === name);
    }

    getObjects() {
        let objects = [];
        for (let object of this.items) {
            objects.push(object.container);
        }
        return objects;
    }

    getObjectsByName(name) {
        let objects = [];
        for(let object of this.items) {
            if(object.container.name.includes(name)) {
                objects.push(object.container);
            }
        }
        return objects;
    }

    getNPCs() {
        let npcs = [];
        for (let object of this.items) {
          if (object.container.is_npc) {
            npcs.push(object.container);
          }
        }
        return npcs;
    }   

    add(_options)
    {
        let object = {}

        // Container
        object.container = this.getConvertedMesh(_options.base.children, _options)
        object.container.position.copy(_options.offset)
        object.container.name = _options.name
        object.container.is_npc = _options.is_npc
        object.container.offset = _options.offset
        object.container.collided = false
        this.container.add(object.container)

        // Create physics object
        object.collision = this.physics.addObjectFromThree({
            meshes: [..._options.collision.children],
            offset: _options.offset,
            mass: _options.mass
        })

        for(let _child of object.container.children)
        {
            _child.position.sub(object.collision.center)
        }

        // Time tick event
        this.time.on('tick', () =>
        {
            object.container.position.copy(object.collision.body.position)
            object.container.quaternion.copy(object.collision.body.quaternion)
        })

        // Apply Shadows
        let bbox = new THREE.Box3().setFromObject(object.container)
        let size = bbox.getSize(new THREE.Vector3())
        
        if (object.container.name != 'startingPoint') {
            this.shadows.add(object.container, { 
                sizeX: size.x, 
                sizeY: size.z, 
                offsetZ: 0.3 
            })
        }              

        // Save
        this.items.push(object)

        let onCollide = (event, item) => {
            let collidedBody = event.bodyA === item.collision.body ? event.bodyB : event.bodyA;
            if (collidedBody && collidedBody.name !== 'ground') {
              item.container.body.velocity.set(0, 0, 0);
              item.container.collided = true;
            }
        };
          
        object.collision.body.removeEventListener('collide', onCollide);
        object.collision.body.addEventListener('collide', (event) => onCollide(event, object));

    }

    setNPCMovement() {
        this.npcMovementPatterns = {
          'elon': {
            type: 'still',
            animation: 'none',
          },
          'xb1': {
            type: 'still',
            animation: 'none',
          },
          'r2d2': {
            type: 'still',
            animation: 'none',
          },
          'spyBalloon': {
            type: 'pingPong',
            animation: 'none',
            axis: 'y',
            distance: 20,
            speed: 0.1,
          },
          'alien': {
            type: 'pingPong',
            animation: 'walking',
            axis: 'y',
            distance: 5,
            speed: 0.2,
          }
          // Add more movement patterns as needed
        };
        
        this.time.on('tick', () => {
            let npcs = this.getNPCs(); // Get all the NPCs from the items list
            for (let npc of npcs) {
              let closestObject = null;
              let closestDistance = Infinity;
          
              // Iterate over all objects and find the closest one to the NPC
              for (let o of this.items) {
                let distance = npc.position.distanceTo(o.container.position);
                if (distance < closestDistance && o.container !== npc) {
                  closestDistance = distance;
                  closestObject = o.container;
                }
              }

              let carDistance = npc.position.distanceTo(this.physics.car.chassis.body.position);
              if (carDistance < closestDistance) {
                closestDistance = carDistance;
                closestObject = this.physics.car.chassis.body.object;
              }
          
              let npcName = npc.name;
              let pattern = this.npcMovementPatterns[npcName.replace(/(\d+)/g, '')];
          
              // Check if the closest object is within a certain distance from the NPC, and if so, apply the movement pattern
              if (closestObject && closestDistance > 1 && !npc.collided) {
                this.applyMovementPattern(npc, pattern);
              }
            }
        });
    }
      
    applyMovementPattern(npcObject, movementPattern) {
        let object = this.items.find(item => item.container === npcObject);
        if (!object || !npcObject.position) return;
    
        if (movementPattern.type === 'still') {
            // Do nothing; the NPC will remain stationary.
        } else if (movementPattern.type === 'pingPong' &&
                    movementPattern.axis &&
                    movementPattern.distance &&
                    movementPattern.speed) {
    
            if (movementPattern.animation === 'walking') {
                this.animateWalking(npcObject);
            }
            // Bounce back and forth resembling a pacing effect
            movementPattern.initialPosition = npcObject.offset;
            let startPosition = movementPattern.initialPosition.clone();
            let targetPosition = movementPattern.initialPosition.clone();
            targetPosition[movementPattern.axis] += movementPattern.distance;
    
            let pingPong = (t) => {
                return t - Math.floor(t / 2) * 2;
            };
    
            let t = (Date.now() * 0.001 * movementPattern.speed) % 2;
            var lerpFactor = pingPong(t);
    
            // Check if direction has changed
            let currentDirection = lerpFactor <= 1 ? 1 : -1;
            if (currentDirection !== movementPattern.previousDirection &&
                    movementPattern.animation === 'walking') {
                npcObject.rotateZ(Math.PI); // Rotate 180 degrees
                movementPattern.previousDirection = currentDirection;
            }
    
            if (lerpFactor > 1) {
                lerpFactor = 2 - lerpFactor;
            }
    
            npcObject.position.lerpVectors(startPosition, targetPosition, lerpFactor);
    
            // Update the physics body position
            object.collision.body.position.copy(npcObject.position);
            object.collision.body.quaternion.copy(npcObject.quaternion);
        }
        // Add more movement types here as needed
    }    

    animateWalking(object) {
        let torso = this.getChildObjectByName(object, 'torso');
        let leftLegBone = this.getChildObjectByName(object, 'leftLeg');
        let leftArmBone = this.getChildObjectByName(object, 'leftArm');
        let rightLegBone = this.getChildObjectByName(object, 'rightLeg');
        let rightArmBone = this.getChildObjectByName(object, 'rightArm');
    
        let time = this.time.elapsed * 0.001; // Convert to seconds
    
        let legRotation = Math.sin(time * 4) * 0.2; // Oscillate leg rotation
        let armRotation = Math.sin(time * 4 + Math.PI * 0.5) * 0.2; // Oscillate arm rotation
    
        leftLegBone.rotation.x = legRotation;
        leftArmBone.rotation.x = armRotation;
        rightLegBone.rotation.x = -legRotation; // Opposite direction
        rightArmBone.rotation.x = -armRotation; // Opposite direction
    
        // Calculate angle between torso and legs
        let legAngle = torso.rotation.x;
    
        // Apply rotation to legs to match torso angle
        leftLegBone.rotation.x += legAngle;
        rightLegBone.rotation.x += legAngle;
    
        // Apply rotation to arms to match torso angle
        leftArmBone.rotation.x -= legAngle;
        rightArmBone.rotation.x -= legAngle;
    }
}
