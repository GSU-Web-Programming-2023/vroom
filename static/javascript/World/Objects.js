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
        for(const _options of this.list)
        {
            this.add(_options)
        }
    }

    setList()
    {
        // Objects options list
        this.list = [
            {
                name: 'staticDemo',
                base: this.resources.items.staticDemoBase.scene,
                collision: this.resources.items.staticDemoCollision.scene,
                floorShadowTexture: this.resources.items.staticDemoFloorShadowTexture,
                offset: new THREE.Vector3(0, 0, 0),
                mass: 0
            },
            {
                name: 'elonNPC', // NPC in the name is used to trigger dialogue in Car.js
                base: this.resources.items.elon.scene,
                collision: this.resources.items.elonCollision.scene,
                offset: new THREE.Vector3(-7, -11, 0),
                mass: 45
            },
            {
                name: 'xb1NPC', // NPC in the name is used to trigger dialogue in Car.js
                base: this.resources.items.xb1.scene,
                collision: this.resources.items.xb1Collision.scene,
                offset: new THREE.Vector3(-55, -25, 0),
                mass: 45
            },
            {
                name: 'r2d2NPC', // NPC in the name is used to trigger dialogue in Car.js
                base: this.resources.items.r2d2.scene,
                collision: this.resources.items.r2d2Collision.scene,
                offset: new THREE.Vector3(-54, -24, 0),
                mass: 45
            },
            {
                name: 'spyBalloonNPC', // NPC in the name is used to trigger dialogue in Car.js
                base: this.resources.items.spyBalloon.scene,
                collision: this.resources.items.spyBalloonCollision.scene,
                offset: new THREE.Vector3(10, -12, -2),
                mass: 0
            },
            {
                name: 'crashSite',
                base: this.resources.items.crashSite.scene,
                collision: this.resources.items.crashSiteCollision.scene,
                offset: new THREE.Vector3(-20, -11, 0),
                mass: 200
            },
            {
                name: 'tree',
                base: this.resources.items.tree.scene,
                collision: this.resources.items.treeCollision.scene,
                offset: new THREE.Vector3(-7, -7, 0),
                mass: 100
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

        // Spawn 75 objects in random locations
        for (let i = 0; i < 75; i++) {
            // Define a random distance between 30 and 70 meters
            const distance = Math.floor(Math.random() * 71) + 30;
        
            // Define a random angle between 0 and 2 * PI radians
            const angle = Math.random() * 2 * Math.PI;
        
            // Calculate the x and y offsets for the object using the distance and angle
            const xOffset = distance * Math.cos(angle);
            const yOffset = distance * Math.sin(angle);
        
            // Initial Position
            let object;
            let x = 0;
            let y = 0;
            let z = 0;

            const rand = Math.random();
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
                    const match = _mesh.name.match(/^shade([a-z]+)_?[0-9]{0,3}?/i)
                    const materialName = match[1].toLowerCase()
                    let material = this.materials.shades.items[materialName]

                    // Default
                    if(typeof material === 'undefined')
                    {
                        material = new THREE.MeshNormalMaterial()
                    }

                    // Create clone mesh with new material
                    const mesh = _options.cloneMesh ? _mesh.clone() : _mesh
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
                    const match = _mesh.name.match(/^pure([a-z]+)_?[0-9]{0,3}?/i)
                    const materialName = match[1].toLowerCase()
                    let material = this.materials.pures.items[materialName]

                    // Default
                    if(typeof material === 'undefined')
                    {
                        material = new THREE.MeshNormalMaterial()
                    }

                    // Create clone mesh with new material
                    const mesh = _options.cloneMesh ? _mesh.clone() : _mesh
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
                    const geometry = new THREE.PlaneBufferGeometry(_mesh.scale.x, _mesh.scale.z, 10, 10)
                    const material = this.materials.items.floorShadow.clone()

                    material.uniforms.tShadow.value = _options.floorShadowTexture
                    material.uniforms.uShadowColor.value = new THREE.Color(this.materials.items.floorShadow.shadowColor)

                    const mesh = new THREE.Mesh(geometry, material)

                    return mesh
                }
            }
        ]

        // Default
        this.parsers.default = {}
        this.parsers.default.apply = (_mesh) =>
        {
            // Create clone mesh with original material
            const mesh = _mesh.clone()
            mesh.material = _mesh.material
            return mesh
        }
    }

    getConvertedMesh(_children, _options = {})
    {
        const container = new THREE.Object3D()
        const center = new THREE.Vector3()

        // Go through each base child
        const baseChildren = [..._children]

        for(const _child of baseChildren)
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
                const mesh = parser.apply(_child, _options)

                // Add to container
                container.add(mesh)
            }
        }

        // Recenter
        if(center.length() > 0)
        {
            for(const _child of container.children)
            {
                _child.position.sub(center)
            }

            container.position.add(center)
        }

        return container
    }

    getObjectByName(name) {
        for(const object of this.items) {
            if(object.container.name === name) {
                return object.container;
            }
        }
        return null; // return null if the object is not found
    }

    getNPCs() {
        let npcs = [];
        for (const object of this.items) {
          if (object.container.name.includes("NPC")) {
            npcs.push(object.container);
          }
        }
        return npcs;
    }
      

    add(_options)
    {
        const object = {}

        // Container
        object.container = this.getConvertedMesh(_options.base.children, _options)
        object.container.position.copy(_options.offset)
        object.container.name = _options.name
        this.container.add(object.container)

        // Create physics object
        object.collision = this.physics.addObjectFromThree({
            meshes: [..._options.collision.children],
            offset: _options.offset,
            mass: _options.mass
        })

        for(const _child of object.container.children)
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
        const bbox = new THREE.Box3().setFromObject(object.container)
        const size = bbox.getSize(new THREE.Vector3())
        
        if (object.container.name != 'staticDemo') {
            this.shadows.add(object.container, { 
                sizeX: size.x, 
                sizeY: size.z, 
                offsetZ: 0.3 
            })
        }              

        // Save
        this.items.push(object)
    }
}
