// app.js
window.addEventListener('DOMContentLoaded', function () {
    // Create the Babylon.js engine
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    // Create the scene
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);

        // Create camera
        var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Create light
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        // Create maze
        var maze = BABYLON.MeshBuilder.CreateBox("maze", { width: 2, height: 0.1, depth: 2 }, scene);
        maze.position.y = -0.05;

        // Create mouse
        var mouse = BABYLON.MeshBuilder.CreateSphere("mouse", { diameter: 0.2 }, scene);
        mouse.position.y = 0.1;

        // Set up keyboard input
        var inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        }));

        // Game loop
        scene.onBeforeRenderObservable.add(function () {
            // Move the mouse based on keyboard input
            var speed = 0.03;
            if (inputMap["w"] || inputMap["ArrowUp"]) {
                mouse.position.z += speed;
            }
            if (inputMap["s"] || inputMap["ArrowDown"]) {
                mouse.position.z -= speed;
            }
            if (inputMap["a"] || inputMap["ArrowLeft"]) {
                mouse.position.x -= speed;
            }
            if (inputMap["d"] || inputMap["ArrowRight"]) {
                mouse.position.x += speed;
            }

            // Check if the mouse reaches the end of the maze
            if (mouse.intersectsMesh(maze, false)) {
                alert("Congratulations! You reached the end of the maze!");
            }
        });

        return scene;
    }

    var scene = createScene();

    // Start the render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize the canvas on window resize
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
