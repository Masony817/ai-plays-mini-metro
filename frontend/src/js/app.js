import {createWaterMap} from './waterDetection.js'; //returns a water map array of px
import {drawBackgroundMap} from './drawMap.js';

// app init
document.addEventListener('DOMContentLoaded', function() {
    console.log("Frontend loaded");
    
    // canvas init
    const canvas = document.getElementById('game-container');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
        console.error('Unable to obtain 2D context');
        return;
    }

    // set canvas to viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const showGrid = true;

    console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);

    //put the map, grid, and river map on the canvas **london only for now**
    drawBackgroundMap(canvasContext, canvas, showGrid);

    console.log("Canvas initialized and map background drawn");
});


/*
- fix the river detection -- grid doesnt matter for it
- add a zoom effect (add camera?) to the canvas where it starts small and gets progressively more
of the canvas in view
- add a grid show button
- add a map name up top
- add a time element
 */
