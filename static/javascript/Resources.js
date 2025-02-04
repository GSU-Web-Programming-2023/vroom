import * as THREE from 'three'

import Loader from './Utils/Loader.js'
import EventEmitter from './Utils/EventEmitter.js'

import matcapBeigeSource from '../models/matcaps/beige.png'
import matcapBlackSource from '../models/matcaps/black.png'
import matcapOrangeSource from '../models/matcaps/orange.png'
import matcapRedSource from '../models/matcaps/red.png'
import matcapWhiteSource from '../models/matcaps/white.png'

import startingPointFloorShadowSource from '../models/startingPoint/floor-shadow.png'
import startingPointBaseSource from '../models/startingPoint/base.glb'
import startingPointCollisionSource from '../models/startingPoint/collision.glb'

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

import martianManHunterSource from '../models/npcs/martianManHunter/base.glb'
import martianManHunterCollisionSource from '../models/npcs/martianManHunter/collision.glb'

import rockSource from '../models/rock/base.glb'
import rockCollisionSource from '../models/rock/collision.glb'

import landerSource from '../models/lander/base.glb'
import landerCollisionSource from '../models/lander/collision.glb'

import spyBalloonSource from '../models/npcs/spyBalloon/base.glb'
import spyBalloonCollisionSource from '../models/npcs/spyBalloon/collision.glb'

import rocketSource from '../models/rocket/base.glb'
import rocketCollisionSource from '../models/rocket/collision.glb'

import aeroshellSource from '../models/aeroshell/base.glb'
import aeroshellCollisionSource from '../models/aeroshell/collision.glb'

import alienSource from '../models/npcs/alien/base.glb'
import alienCollisionSource from '../models/npcs/alien/collision.glb'

import cyborgSource from '../models/npcs/cyborg/base.glb'
import cyborgCollisionSource from '../models/npcs/cyborg/collision.glb'

import skyscraperSource from '../models/skyscraper/base.glb'
import skyscraperCollisionSource from '../models/skyscraper/collision.glb'

import buildingSource from '../models/building/base.glb'
import buildingCollisionSource from '../models/building/collision.glb'

import researchBuildingSource from '../models/research_building/base.glb'
import researchBuildingCollisionSource from '../models/research_building/collision.glb'

import hydroBuildingSource from '../models/hydro_building/base.glb'
import hydroBuildingCollisionSource from '../models/hydro_building/collision.glb'

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

            { name: 'startingPointBase', source: startingPointBaseSource },
            { name: 'startingPointCollision', source: startingPointCollisionSource },
            { name: 'startingPointFloorShadow', source: startingPointFloorShadowSource },

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

            { name: 'martianManHunter', source: martianManHunterSource },
            { name: 'martianManHunterCollision', source: martianManHunterCollisionSource },

            { name: 'rock', source: rockSource },
            { name: 'rockCollision', source: rockCollisionSource },

            { name: 'lander', source: landerSource },
            { name: 'landerCollision', source: landerCollisionSource },

            { name: 'spyBalloon', source: spyBalloonSource },
            { name: 'spyBalloonCollision', source: spyBalloonCollisionSource },

            { name: 'rocket', source: rocketSource },
            { name: 'rocketCollision', source: rocketCollisionSource },

            { name: 'aeroshell', source: aeroshellSource },
            { name: 'aeroshellCollision', source: aeroshellCollisionSource },

            { name: 'alien', source: alienSource },
            { name: 'alienCollision', source: alienCollisionSource },

            { name: 'cyborg', source: cyborgSource },
            { name: 'cyborgCollision', source: cyborgCollisionSource },

            { name: 'skyscraper', source: skyscraperSource },
            { name: 'skyscraperCollision', source: skyscraperCollisionSource },

            { name: 'building', source: buildingSource },
            { name: 'buildingCollision', source: buildingCollisionSource },

            { name: 'researchBuilding', source: researchBuildingSource },
            { name: 'researchBuildingCollision', source: researchBuildingCollisionSource },

            { name: 'hydroBuilding', source: hydroBuildingSource },
            { name: 'hydroBuildingCollision', source: hydroBuildingCollisionSource }
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

            this.items.startingPointFloorShadowTexture = new THREE.Texture(this.items.startingPointFloorShadow)
            this.items.startingPointFloorShadowTexture.needsUpdate = true

            // Trigger ready
            this.trigger('ready')
        })
    }
}
