
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

function drawBackgroundMap(canvasContext, canvas, showGrid) {
    console.log('Starting drawBackgroundMap...');
    let riverMap = null;

    const mapBackground = new Image();
    mapBackground.src = "src/assets/london-map.png";
    console.log('Loading map image from:', mapBackground.src);
    
    mapBackground.onload = () => {
        console.log('Map image loaded successfully');
        canvasContext.drawImage(mapBackground, 0, 0, canvas.width, canvas.height);
        console.log('Map drawn to canvas');

        const imageData = canvasContext.getImageData(0,0, canvas.width, canvas.height);
        console.log('Got image data, dimensions:', canvas.width, 'x', canvas.height);
        
        riverMap  = createRiverMap(imageData.data, canvas.width, canvas.height);
        console.log('River map created');

        if (!showGrid) {
            console.log('Grid display disabled, returning');
            return;
        }

        console.log('River map:', riverMap);

        riverMap.forEach((isRiver, index)=>{
            console.log('Checking if pixel is river...', isRiver);
            if (isRiver) {
                const x = index % canvas.width;
                const y = Math.floor(index / canvas.width);
                console.log('Drawing river at:', x, y);
                canvasContext.fillStyle = "red";
                canvasContext.fillRect(x, y, 1, 1);
            }
        })

        console.log('Drawing grid...');
        drawGrid(canvasContext, canvas);
        console.log('Grid drawing complete');
    };
}

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

//river detection funcitons
function createRiverMap(pixels, width, height) {
    console.log('Creating river map...');
    const riverMap = new Array(width * height);

    for (let y = 0; y < height; y++){
        for (let x = 0; x < width; x++){
            const index = (y * width + x) * 4; //rbg
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            const isRiver = !isBackgroundColor(r, g, b);
            riverMap[y * width + x] = isRiver;
        }
    }

    return riverMap;
}

function isBackgroundColor(r, g, b){
    //london background color is f0f0f0 or 240,240,240
    const tolerance = 10; //for png anti-aliasing
    return Math.abs(r - 240) <= tolerance && 
           Math.abs(g - 240) <= tolerance && 
           Math.abs(b - 240) <= tolerance;
}

/*
- fix the river detection -- grid doesnt matter for it
- add a zoom effect (add camera?) to the canvas where it starts small and gets progressively more
of the canvas in view
- add a grid show button
- add a map name up top
- add a time element
 */
