import {createWaterMap} from './waterDetection.js';

/**
 * Draws the background map to the canvas.
 * should be called in the app.js file
 * loads the map image from assets
 * todo: add map selection from assets
 */

let mapCache = {
    image: null, // original image object
    scaledImage: null, // canvas-sized scaled image
    waterMap: null, // array of pixels
    isLoaded: false, // is the map loaded?
    originalWidth: 0, // original image width
    originalHeight: 0, // original image height
    waterMapScaleX: 1, // scale factor for water map coordinates (x-axis)
    waterMapScaleY: 1 // scale factor for water map coordinates (y-axis)
};

export function initializeMap(canvasContext, canvas){
    console.log('Initializing map...'); 

    return new Promise((resolve, reject) => {
        const mapBackground = new Image();
        mapBackground.src = "src/assets/london-map.png"; // todo: add map selection from assets
        mapCache.image = mapBackground; //add to cache
        console.log('Loading map image from:', mapBackground.src);

        mapBackground.onload = () => {
            // Store original image dimensions
            mapCache.originalWidth = mapBackground.naturalWidth;
            mapCache.originalHeight = mapBackground.naturalHeight;
            
            // Pre-calculate water map scaling factors
            mapCache.waterMapScaleX = mapCache.originalWidth / canvas.width;
            mapCache.waterMapScaleY = mapCache.originalHeight / canvas.height;

            // Create an offscreen canvas at original image resolution for water map
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = mapCache.originalWidth;
            offscreenCanvas.height = mapCache.originalHeight;
            const offscreenContext = offscreenCanvas.getContext('2d');

            // Draw image at original resolution
            offscreenContext.drawImage(mapBackground, 0, 0);

            // Get image data at original resolution for water map
            const imageData = offscreenContext.getImageData(0, 0, mapCache.originalWidth, mapCache.originalHeight);

            // Create water map at original resolution
            mapCache.waterMap = createWaterMap(imageData.data, mapCache.originalWidth, mapCache.originalHeight);

            // Create scaled image for performance
            const scaledCanvas = document.createElement('canvas');
            scaledCanvas.width = canvas.width;
            scaledCanvas.height = canvas.height;
            const scaledContext = scaledCanvas.getContext('2d');
            
            // Draw scaled image to cache
            scaledContext.drawImage(mapBackground, 0, 0, canvas.width, canvas.height);
            mapCache.scaledImage = scaledCanvas;

            // add to cache
            mapCache.isLoaded = true;
            resolve(mapCache);
        }

        mapBackground.onerror = () => {
            reject(new Error('Failed to load map'));
        }
    })
}

export function recreateScaledImage(canvas) {
    if (!mapCache.isLoaded) {
        console.warn('Map not initialized. Call initializeMap() first.');
        return;
    }
    
    // Update water map scale factors
    mapCache.waterMapScaleX = mapCache.originalWidth / canvas.width;
    mapCache.waterMapScaleY = mapCache.originalHeight / canvas.height;
    
    // Recreate scaled image
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width;
    scaledCanvas.height = canvas.height;
    const scaledContext = scaledCanvas.getContext('2d');
    
    scaledContext.drawImage(mapCache.image, 0, 0, canvas.width, canvas.height);
    mapCache.scaledImage = scaledCanvas;
}

export function drawBackgroundMap(canvasContext, canvas, camera) {
    if (!mapCache.isLoaded) {
        console.warn('Map not initialized. Call initializeMap() first.');
        return;
    }

    // Apply current camera settings – zoom then pan
    canvasContext.save();
    canvasContext.scale(camera.zoom, camera.zoom); // zoom first
    canvasContext.translate(-camera.x, -camera.y); // then translate to pan

    // Draw the cached scaled image
    canvasContext.drawImage(mapCache.scaledImage, 0, 0);

    // Debug overlay – draw water map pixels if enabled by debug.js
    if (window.DEBUG_SHOW_WATER) {
        mapCache.waterMap.forEach((isWater, index) => {
            if (isWater) {
                const originalX = index % mapCache.originalWidth;
                const originalY = Math.floor(index / mapCache.originalWidth);
                const scaledX = originalX / mapCache.waterMapScaleX;
                const scaledY = originalY / mapCache.waterMapScaleY;
                canvasContext.fillStyle = 'red';
                canvasContext.fillRect(scaledX, scaledY, 1, 1);
            }
        });
    }

    //debug -- move to a toggle later -- add showGrid to the function call if going to use
    // if (!showGrid) {return;}
    // console.log('Drawing grid...');
    // drawGrid(canvasContext, canvas, 25); // 25px grid boxes
    // console.log('Grid drawing complete');

    canvasContext.restore();
}




// //move to a toggle later or be called there
// function drawGrid(canvasContext, canvas, size) {

//     canvasContext.strokeStyle = "#A0A0A0FF";
//     canvasContext.lineWidth = 0.5;
//     console.log(canvasContext.lineWidth);
//     // all vertical lines
//     canvasContext.beginPath();
//     for (let x = 0; x < canvas.width; x += size) {
//         canvasContext.moveTo(x, 0);
//         canvasContext.lineTo(x, canvas.height);
//     }
//     canvasContext.stroke();

//     // all horizontal lines  
//     canvasContext.beginPath();
//     for (let y = 0; y < canvas.height; y += size) {
//         canvasContext.moveTo(0, y);
//         canvasContext.lineTo(canvas.width, y);
//     }
//     canvasContext.stroke();
// }
