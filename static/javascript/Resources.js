import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'

import matcapBeigeSource from '../models/matcaps/beige.png'
import matcapBlackSource from '../models/matcaps/black.png'
import matcapOrangeSource from '../models/matcaps/orange.png'
import matcapRedSource from '../models/matcaps/red.png'
import matcapWhiteSource from '../models/matcaps/white.png'

import staticDemoFloorShadowSource from '../models/staticDemo/floor-shadow.png'
import staticDemoBaseSource from '../models/staticDemo/base.glb'
import staticDemoCollisionSource from '../models/staticDemo/collision.glb'

import dynamicSphereBaseSource from '../models/dynamicSphere/base.glb'
import dynamicSphereCollisionSource from '../models/dynamicSphere/collision.glb'

import dynamicBoxBaseSource from '../models/dynamicBox/base.glb'
import dynamicBoxCollisionSource from '../models/dynamicBox/collision.glb'

import dynamicComplexBaseSource from '../models/dynamicComplex/base.glb'
import dynamicComplexCollisionSource from '../models/dynamicComplex/collision.glb'

import carChassisSource from '../models/car/chassis.glb'
import carWheelSource from '../models/car/wheel.glb'
import carBackLightsBrakeSource from '../models/car/backLightsBrake.glb'
import carBackLightsReverseSource from '../models/car/backLightsReverse.glb'
import carAntenaSource from '../models/car/antena.glb'

import elonSource from '../models/npcs/elon/base.glb'
import elonCollisionSource from '../models/npcs/elon/collision.glb'

import xb1Source from '../models/npcs/xb1/base.glb'
import xb1CollisionSource from '../models/npcs/xb1/collision.glb'

import treeSource from '../models/tree/base.glb'
import treeCollisionSource from '../models/tree/collision.glb'

import rockSource from '../models/rock/base.glb'
import rockCollisionSource from '../models/rock/collision.glb'

import crashSiteSource from '../models/crashSite/base.glb'
import crashSiteCollisionSource from '../models/crashSite/collision.glb'

export default class Resources extends EventEmitter
{
    constructor()
    {
        super()

        this.loader = new Loader()
        this.items = {}

        this.loader.load([
            { name: 'matcapBeige', source: matcapBeigeSource },
            { name: 'matcapBlack', source: matcapBlackSource },
            { name: 'matcapOrange', source: matcapOrangeSource },
            { name: 'matcapRed', source: matcapRedSource },
            { name: 'matcapWhite', source: matcapWhiteSource },

            { name: 'staticDemoBase', source: staticDemoBaseSource },
            { name: 'staticDemoCollision', source: staticDemoCollisionSource },
            { name: 'staticDemoFloorShadow', source: staticDemoFloorShadowSource },

            { name: 'dynamicSphereBase', source: dynamicSphereBaseSource },
            { name: 'dynamicSphereCollision', source: dynamicSphereCollisionSource },

            { name: 'dynamicBoxBase', source: dynamicBoxBaseSource },
            { name: 'dynamicBoxCollision', source: dynamicBoxCollisionSource },

            { name: 'dynamicComplexBase', source: dynamicComplexBaseSource },
            { name: 'dynamicComplexCollision', source: dynamicComplexCollisionSource },

            { name: 'carChassis', source: carChassisSource },
            { name: 'carWheel', source: carWheelSource },
            { name: 'carBackLightsBrake', source: carBackLightsBrakeSource },
            { name: 'carBackLightsReverse', source: carBackLightsReverseSource },
            { name: 'carAntena', source: carAntenaSource },
            
            { name: 'elon', source: elonSource },
            { name: 'elonCollision', source: elonCollisionSource },
            
            { name: 'xb1', source: xb1Source },
            { name: 'xb1Collision', source: xb1CollisionSource },

            { name: 'tree', source: treeSource },
            { name: 'treeCollision', source: treeCollisionSource },

            { name: 'rock', source: rockSource },
            { name: 'rockCollision', source: rockCollisionSource },

            { name: 'crashSite', source: crashSiteSource },
            { name: 'crashSiteCollision', source: crashSiteCollisionSource }
        ])

        this.loader.on('fileEnd', (_resource, _data) =>
        {
            this.items[_resource.name] = _data
        })

        this.loader.on('end', () =>
        {
            // Create textures
            this.items.matcapBeigeTexture = new THREE.Texture(this.items.matcapBeige)
            this.items.matcapBeigeTexture.needsUpdate = true

            this.items.matcapBlackTexture = new THREE.Texture(this.items.matcapBlack)
            this.items.matcapBlackTexture.needsUpdate = true

            this.items.matcapOrangeTexture = new THREE.Texture(this.items.matcapOrange)
            this.items.matcapOrangeTexture.needsUpdate = true

            this.items.matcapRedTexture = new THREE.Texture(this.items.matcapRed)
            this.items.matcapRedTexture.needsUpdate = true

            this.items.matcapWhiteTexture = new THREE.Texture(this.items.matcapWhite)
            this.items.matcapWhiteTexture.needsUpdate = true

            this.items.staticDemoFloorShadowTexture = new THREE.Texture(this.items.staticDemoFloorShadow)
            this.items.staticDemoFloorShadowTexture.needsUpdate = true

            // Trigger ready
            this.trigger('ready')
        })
    }
}
