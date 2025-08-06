/**
 * checks if a pixel color is a shade of sample blue from map pngs, likely representing a body of water.
 * the main shades of blue in the water are #67C9F2 and #C6E7FA but this accounts for other shades of blue.
 * this function uses a heuristic to identify similar colors, accounting for anti-aliasing seen in the map pngs.
 * 
 * i could just better recreate an svg mask of the water but i am lazy and this works for now
 */

function isWaterColor(r, g, b) {
    // preknown water colors as hex (for icon shown) and rgb (for code)
    // #67C9F2 (103, 201, 242) and #C6E7FA (198, 231, 250)
    
    const tolerance = 20; //rbg color matching tolerance 
    const toleranceSquared = tolerance * tolerance;
    
    // distance check to first known water color -- #67C9F2
    const dr1 = r - 103;
    const dg1 = g - 201;
    const db1 = b - 242;
    const distanceSquared1 = dr1 * dr1 + dg1 * dg1 + db1 * db1;
    
    if (distanceSquared1 <= toleranceSquared ) {
        return true;
    }
    
    // distance check to second known water color -- #C6E7FA
    const dr2 = r - 198;
    const dg2 = g - 231;
    const db2 = b - 250;
    const distanceSquared2 = dr2 * dr2 + dg2 * dg2 + db2 * db2;
    
    if (distanceSquared2 <= toleranceSquared) {
        return true;
    }
    
    // optimized general blue heuristic for edgecases that are still likely water
    if (b <= r || b <= g) return false; // blue must dominate
    if (b <= 120) return false; // must be light enough
    if (r + g + b >= 720) return false; // not too white or close to background color of #f0f0f0
    if (r + g + b <= 100) return false; // not too black
    
    return true; // color is predomintantly blue, light enough, and not too close to the backgrond
}

export function createWaterMap(pixels, width, height) {
    console.log('Creating water map...');
    const startTime = performance.now();
    const waterMap = new Array(width * height).fill(false);
    const visited = new Array(width * height).fill(false);

    // find potential water pixels as starting points
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

            // if we find an unvisited water pixel, start a flood fill from there.
            if (isWaterColor(r, g, b)) {
                floodFill(pixels, x, y, width, height, waterMap, visited);
            }
        }
    }

    const cleanedWaterMap = cleanupWaterMap(waterMap, width, height);

    const endTime = performance.now();
    console.log(`Creating water map took ${endTime - startTime} milliseconds`);
    console.log('Water map contains ', waterMap.filter(Boolean).length, 'water pixels');

    return cleanedWaterMap;
}

function floodFill(pixels, startX, startY, width, height, waterMap, visited) {
    const startTime = performance.now();
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

        // if the pixel is a water color, mark it and check its neighbors.
        // allows filling contiguous areas of any shade of blue water color.
        if (isWaterColor(r, g, b)) {
            waterMap[index] = true;

            // add adjacent pixels to stack
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
    
    const endTime = performance.now();
    const timeTaken = Math.floor((endTime - startTime) * 1000) / 1000;
    if (timeTaken > 0) console.log(`Flood fill took ${timeTaken} milliseconds`);
}

function cleanupWaterMap(waterMap, width, height) {
    // cleans up water map by removing small detected components 
    // that are not part of the main body of water
    // uses optimized union-find with rank and path compression
    
    const minAreaSize = 75; // px determined for connection to main body of water
    const arrayLength = width * height;
    const labels = new Uint32Array(arrayLength);
    let currentLabel = 1;
    
    // uf data structures
    const parent = new Uint32Array(currentLabel + arrayLength); // pre-allocate max possible size
    const rank = new Uint8Array(currentLabel + arrayLength);
    const componentSizes = new Uint32Array(currentLabel + arrayLength);
    
    // initialize uf structure
    function makeSet(label) {
        parent[label] = label;
        rank[label] = 0;
        componentSizes[label] = 0;
    }
    
    // find root with path compression (iterative to avoid stack overflow)
    function findRoot(label) {
        let root = label;
        // find root without path compression first
        while (parent[root] !== root) {
            root = parent[root];
        }
        
        // path compression - compress the entire path
        let current = label;
        while (current !== root) {
            const next = parent[current];
            parent[current] = root;
            current = next;
        }
        
        return root;
    }
    
    // union by rank
    function union(label1, label2) {
        const root1 = findRoot(label1);
        const root2 = findRoot(label2);
        
        if (root1 === root2) return root1;
        
        // rank to keep tree shallow
        if (rank[root1] < rank[root2]) {
            parent[root1] = root2;
            componentSizes[root2] += componentSizes[root1];
            return root2;
        } else if (rank[root1] > rank[root2]) {
            parent[root2] = root1;
            componentSizes[root1] += componentSizes[root2];
            return root1;
        } else {
            parent[root2] = root1;
            rank[root1]++;
            componentSizes[root1] += componentSizes[root2];
            return root1;
        }
    }
    
    // assign labels and build uf structure
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            
            if (!waterMap[index]) continue;
            
            // bit operations for bounds checking -- faster than conditions
            const hasLeft = x > 0;
            const hasTop = y > 0;
            
            const leftIndex = hasLeft ? index - 1 : -1;
            const topIndex = hasTop ? index - width : -1;
            
            const leftLabel = hasLeft && waterMap[leftIndex] ? labels[leftIndex] : 0;
            const topLabel = hasTop && waterMap[topIndex] ? labels[topIndex] : 0;
            
            if (leftLabel === 0 && topLabel === 0) {
                // new component
                labels[index] = currentLabel;
                makeSet(currentLabel);
                componentSizes[currentLabel] = 1;
                currentLabel++;
            } else if (leftLabel === 0) {
                // extend top component -- no new components created
                labels[index] = topLabel;
                componentSizes[findRoot(topLabel)]++;
            } else if (topLabel === 0) {
                // extend left component -- no new components created
                labels[index] = leftLabel;
                componentSizes[findRoot(leftLabel)]++;
            } else {
                // both neighbors have labels - union them
                const unionRoot = union(leftLabel, topLabel);
                labels[index] = unionRoot;
                componentSizes[unionRoot]++;
            }
        }
    }
    
    // cache root labels to avoid repeated findRoot calls
    const rootCache = new Uint32Array(currentLabel);
    for (let i = 1; i < currentLabel; i++) {
        rootCache[i] = findRoot(i);
    }
    
    // remove small components using cached roots
    for (let i = 0; i < arrayLength; i++) {
        if (labels[i] > 0) {
            const rootLabel = rootCache[labels[i]];
            const componentSize = componentSizes[rootLabel];
            if (componentSize < minAreaSize) {
                waterMap[i] = false;
            }
        }
    }
    
    return waterMap;
}