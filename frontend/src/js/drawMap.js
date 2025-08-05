import {createWaterMap} from './waterDetection.js';
/**
 * Draws the background map to the canvas.
 * should be called in the app.js file
 * loads the map image from assets
 * todo: add map selection from assets
 */

export function drawBackgroundMap(canvasContext, canvas, showGrid) {
    console.log('Starting drawBackgroundMap...');

    //load the map image from assets
    const mapBackground = new Image();
    mapBackground.src = "src/assets/london-map.png";
    console.log('Loading map image from:', mapBackground.src);
    
    mapBackground.onload = () => {
        console.log('Map image loaded successfully');
        canvasContext.drawImage(mapBackground, 0, 0, canvas.width, canvas.height);
        console.log('Map drawn to canvas');

        //get the image data from the canvas
        const imageData = canvasContext.getImageData(0,0, canvas.width, canvas.height);
        console.log('Got image data, dimensions:', canvas.width, 'x', canvas.height);
        
        //figure out which pixels are water
        let waterMap  = createWaterMap(imageData.data, canvas.width, canvas.height);
        console.log('Water map created');

        //debug -- draw the water map on the canvas
        waterMap.forEach((isWater, index)=>{
            if (isWater) {
                const x = index % canvas.width;
                const y = Math.floor(index / canvas.width);
                canvasContext.fillStyle = "red";
                canvasContext.fillRect(x, y, 1, 1);
            }
        })

        //debug -- move to a toggle later 
        if (!showGrid) {return;}
        console.log('Drawing grid...');
        drawGrid(canvasContext, canvas);
        console.log('Grid drawing complete');
    };
}


//move to a toggle later or be called there
function drawGrid(canvasContext, canvas) {
    canvasContext.strokeStyle = "#A0A0A0FF";
    canvasContext.lineWidth = 0.015;
    console.log(canvasContext.lineWidth);
    // Draw grid lines every 25px
    for (let x = 0; x < canvas.width; x += 25) {
        for (let y = 0; y < canvas.height; y += 25) {
            // Draw vertical line
            canvasContext.beginPath();
            canvasContext.moveTo(x, 0);
            canvasContext.lineTo(x, canvas.height);
            canvasContext.stroke();

            // Draw horizontal line 
            canvasContext.beginPath();
            canvasContext.moveTo(0, y);
            canvasContext.lineTo(canvas.width, y);
            canvasContext.stroke();
        }
    }
}


