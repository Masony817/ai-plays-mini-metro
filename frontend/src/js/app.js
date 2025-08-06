import {drawBackgroundMap, initializeMap} from './drawMap.js';
import { setupDebug, drawViewportInfo as debugViewportInfo } from './debug.js';

// app init
document.addEventListener('DOMContentLoaded', function() {
    console.log("Frontend loaded");

    // map init retry count
    const maxMapInitRetries = 3;
    
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

    // camera init
    const camera = {
        x: 0,
        y: 0,
        zoom: 1.0,
        width: canvas.width,
        height: canvas.height,
    };

    // Initialise debug utilities (camera controls, overlays)
setupDebug(camera);

    // set canvas to viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const showGrid = true; // not used rn -- move to a toggle later

    console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
    // initialize map with retry logic
    async function initMapWithRetry() {
        for (let attempt = 0; attempt <= maxMapInitRetries; attempt++) {
            try {
                await initializeMap(canvasContext, canvas);
                console.log(attempt === 0 ? 'Map initialized' : 'Map initialized after retry');
                return;
            } catch (error) {
                if (attempt < maxMapInitRetries) {
                    console.warn(`Error initializing map (attempt ${attempt + 1}):`, error, 'retrying in 1 second...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    console.error('Failed to initialize map after all retry attempts:', error);
                    throw error;
                }
            }
        }
    }

    async function init() {
        await initMapWithRetry();
        render(canvasContext, canvas, camera); // now safe to call
    }
    init().catch(console.error);

    console.log("Canvas initialized and map background drawn");

});


function render(canvasContext, canvas, camera){
    // Clear the entire canvas before drawing the next frame so debug overlays & text don’t pile up
    canvasContext.setTransform(1, 0, 0, 1, 0, 0); // reset transform to default
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgroundMap(canvasContext, canvas, camera);
    debugViewportInfo(canvasContext, camera);

    requestAnimationFrame(() => render(canvasContext, canvas, camera));
}

/* legacy debug viewport info kept for reference but replaced by debug.js drawViewportInfo
function drawViewportInfo(context, camera) {
    context.save();
    // Reset transformations to draw UI elements in screen space
    context.setTransform(1, 0, 0, 1, 0, 0);
    
    context.fillStyle = 'black';
    context.font = '14px Arial';
    context.fillText(`Viewport: x=${Math.round(camera.x)}, y=${Math.round(camera.y)}, zoom=${camera.zoom.toFixed(2)}`, 10, 20);
    
    context.restore();
}
*/
/*
- ✅ fix the river detection -- grid doesnt matter for it
- add a zoom effect (add camera?) to the canvas where it starts small and gets progressively more
of the canvas in view
- add a grid show button
- add a map name up top
- add a time element
 */
