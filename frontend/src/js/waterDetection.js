/**
 * Checks if a pixel color is a shade of sample blue from map pngs, likely representing a body of water.
 * The main shades of blue in the water are #67C9F2 and #C6E7FA but this accounts for other shades of blue.
 * This function uses a heuristic to identify similar colors, accounting for anti-aliasing seen in the map pngs.
 */
function isWaterColor(r, g, b) {
    const isBlueDominant = b > r && b > g; //is dominate over red and green
    const isLightEnough = b > 150; // excludes dark colors
    
    return isBlueDominant && isLightEnough;
}

export function createWaterMap(pixels, width, height) {
    console.log('Creating water map...');
    const waterMap = new Array(width * height).fill(false);
    const visited = new Array(width * height).fill(false);

    // Find potential water pixels as starting points for the flood fill
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            if (visited[index]) {
                continue;
            }

            const pixelIndex = index * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];

            // If we find an unvisited water pixel, start a flood fill from there.
            if (isWaterColor(r, g, b)) {
                floodFill(pixels, x, y, width, height, waterMap, visited);
            }
        }
    }

    return waterMap;
}

function floodFill(pixels, startX, startY, width, height, waterMap, visited) {
    const stack = [{x: startX, y: startY}];

    while (stack.length > 0) {
        const {x, y} = stack.pop();
        const index = y * width + x;

        if (visited[index]) {
            continue;
        }
        visited[index] = true;

        const pixelIndex = index * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];

        // If the pixel is a water color, mark it and check its neighbors.
        // This allows filling contiguous areas of any shade of blue water color.
        if (isWaterColor(r, g, b)) {
            waterMap[index] = true;

            // Add adjacent pixels to stack
            const neighbors = [
                {x: x + 1, y: y}, {x: x - 1, y: y},
                {x: x, y: y + 1}, {x: x, y: y - 1}
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < width &&
                    neighbor.y >= 0 && neighbor.y < height &&
                    !visited[neighbor.y * width + neighbor.x]) {
                    stack.push(neighbor);
                }
            }
        }
    }
}
