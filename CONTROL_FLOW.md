# Control Flow

## Overview

This document outlines the control flow for the THREE.js portion of the app (starting from index.js). The app consists of the following components:
- [Application.js](#applicationjs)
- [Resources.js](#resourcesjs)
- [Camera.js](#camerajs)
- [Physics.js](#physicsjs)
- [World.js](#worldjs)

## Application.js

### Description

Application initializes the game. In index.js, an instance of the Application class is created and assigned to the window.application variable. The instance is created with an options object that specifies the HTML canvas element to use and whether to use the post-processing effect composer.

If the module.hot object is present (which indicates that the code is being run in a development server environment), a function is registered with module.hot.dispose() that calls the destructor() method on the Application instance and sets the window.application variable to null. This is done to clean up any resources that may have been allocated by the Application instance and prevent any memory leaks.

### Control Flow &#x2193;

1. Create a new instance of `Application` by calling `new Application(_options)`, passing in the `$canvas` HTML element.
2. The constructor initializes the following:
    - a new `Time` instance
    - a new `Sizes` instance
    - a new `dat.GUI` instance for debugging
    - a new `Resources` instance for loading assets
3. When the `Resources` instance is ready, the following are set up in order:
    - A renderer is created by calling `setRenderer()`.
    - A camera is created by calling `setCamera()`.
    - Post-processing passes are set up by calling `setPasses()`.
    - A `Stats.js` instance is created by calling `setPerformanceStats()`.
    - A world is created by calling `setWorld()`.
4. The `Application` instance is now set up and running. The following are executed on each tick of the `Time` instance:
    - The camera's target is set to the position of the car chassis.
    - The post-processing passes are rendered by calling `render()` on the `EffectComposer` instance.
    - The `Stats.js` instance is updated.

5. When the application is no longer needed, call the `destructor()` method to clean up resources.

## Resources.js

### Description

The Resources class is responsible for loading and managing various resources such as textures and models used in the application. It utilizes the Loader class to load resources from different sources specified by their source path and assigns them a name. It listens to events emitted by the loader such as fileEnd and end to store loaded resources into the items object and create textures. Once all resources have been loaded and processed, the ready event is triggered to notify that the resources are ready to be used.

### Control Flow &#x2193;

### Constructor
- Set up a Loader instance.
- Create an empty object for the resources.
- Load the resources:
  - Load matcap textures.
  - Load static demo resources.
  - Load dynamic sphere resources.
  - Load dynamic box resources.
  - Load dynamic complex resources.
  - Load car resources.
  - Load Elon resources.
  - Load Xbox resources.
  - Load tree resources.
  - Load rock resources.
  - Load crash site resources.
  - Load spy balloon resources.
- Set up event listeners for when each file loads and when all files have finished loading.
- When a file has finished loading:
  - Add the data to the resources object with the file name as the key.
- When all files have finished loading:
  - Create textures for the matcap textures and static demo floor shadow.
  - Trigger the 'ready' event.

### Properties
- loader: a Loader instance.
- items: an object that contains all the loaded resources.

### Events
- ready: triggered when all resources have finished loading.

## Camera.js

### Description

The Camera class in this code is responsible for managing the three.js camera used in the application, setting its position and orientation, handling resizing and adding an orbit control option for user interaction. It also updates the camera's position and look direction every frame, allowing for smooth camera movement.

## Control Flow &#x2193;

### Constructor

1. Set options passed to the constructor to class properties.
2. Create new `Vector3` objects for base position, position, and target, with default values for the latter two.
3. Set `easing` class property to `0.25`.
4. If `debug` is set to `true`, create a new `dat.GUI` instance and add a folder for the camera controls.
5. Call `setInstance()` and `setOrbitControls()` methods.

### setInstance()

1. Create a new `PerspectiveCamera` object with a field of view of 40 degrees, near clipping plane of 2 units, and far clipping plane of 50 units.
2. Set the camera's up vector to `[0, 0, 1]`.
3. Set the camera's position to the `basePosition` vector.
4. Set the camera's look at vector to `[0, 0, 0]`.
5. Set the camera's field of view to `60`.
6. Add a resize event listener to the `sizes` instance property.
7. Add a time tick event listener to update the camera's position and look at vectors with easing, unless `orbitControls` is enabled.
8. Update the camera's projection matrix on resize.

### setOrbitControls()

1. Create a new `OrbitControls` instance with the camera instance and renderer's DOM element.
2. Set the `enabled` property to `false`.
3. Set the `enableKeys` property to `false`.
4. Set the `zoomSpeed` property to `0.5`.
5. If `debug` is set to `true`, add a `enabled` property to the camera controls folder.

## Physics.js

### Description

This is a class definition for a Physics object in JavaScript, which utilizes the CANNON.js and THREE.js libraries to simulate physics in a 3D environment. The constructor takes an object with various options, including a debug mode and a time object, and sets up the world, models, materials, floor, and car. The time object is used to update the physics engine at a fixed rate of 60 frames per second.

### Control Flow &#x2193;

- Set debug flag, time object
- Create world, models, materials, floor, car objects
- Set up time tick update to step the world

### setWorld()

- Set up world object with gravity and other settings

### setModels()

- Create models object and container object
- Add models container to scene

### setMaterials()

- Create materials object with static and dynamic materials

### setFloor()

- Create floor object
- Add floor mesh to scene
- Create floor physics object
- Add floor physics object to world

### setCar()

- Create car physics object
- Add car physics object to world

### addObjectFromThree(_options)

- Set up collision object with model container and children array
- Create body physics object with position, mass, and material
- Add body physics object to world
- Set collision center position and create shapes array
- Loop through meshes and create physics shapes and model objects for each shape
- Update meshes, shapes, and body to match center position
- Set up time tick update to update model container position and quaternion
- Return collision object

## World.js

### Description

World.js is a module that sets up the main world of the 3D application, including creating and adding the floor, shadows, lights, physics, objects, and car to the scene. It also sets up materials and debug options.

### Control Flow &#x2193;

### Constructor
- Set options
- Create container object
- Call setMaterials()
- Call setFloor()
- Call setShadows()
- Call setLights()
- Call setPhysics()
- Call setObjects()
- Call setCar()

### setMaterials()
- Create Materials instance
- Add debug folder if in debug mode

### setFloor()
- Create Floor instance
- Add debug folder if in debug mode
- Add container to main container

### setShadows()
- Create Shadows instance
- Add time, debug, renderer, and camera as parameters
- Add container to main container

### setLights()
- Create ambient light instance
- Create directional light instance
- Add both lights to main container

### setPhysics()
- Create Physics instance
- Add debug and time as parameters
- Add physics model container to main container

### setObjects()
- Create Objects instance
- Add time, resources, materials, physics, shadows, and debug as parameters
- Add objects container to main container

### setCar()
- Create Car instance
- Handles NPC Dialogue Scenarios
- Add time, resources, objects, physics, shadows, materials, renderer, camera, and debug as parameters
- Add car container to main container
