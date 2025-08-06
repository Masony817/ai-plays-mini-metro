// debug.js – centralised debug utilities (camera controls + water-overlay toggle)
// Importing this module and calling setupDebug(camera) wires up all debug behaviour.

const MOVE_STEP = 10;    // px per key press
const ZOOM_STEP = 0.05;  // zoom delta per press
const STEPS_FILE_PATH = 'src/assets/cameraSteps.json';
// Global flag consumed by drawMap.js to decide if it should overlay water pixels
window.DEBUG_SHOW_WATER = true;
window.DEBUG_SHOW_GRID = true;
window.DEBUG_SHOW_VIEWPORT_INFO = true;

export function setupDebug(camera) {
  const savedSteps = [null, null, null, null];
  let sPressed = false;

  // Load previously saved steps (if the JSON asset exists)
  (async () => {
    try {
      const resp = await fetch(STEPS_FILE_PATH);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          data.slice(0, 4).forEach((step, idx) => {
            if (step && typeof step === 'object') savedSteps[idx] = step;
          });
          console.log('[debug] loaded camera steps', savedSteps);
        }
      }
    } catch (_) {
      console.info('[debug] no cameraSteps.json found – starting fresh');
    }
  })();

  function animateCameraTo(target) {
    const start = { x: camera.x, y: camera.y, zoom: camera.zoom };
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      // cubic easeInOut
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      camera.x = start.x + (target.x - start.x) * ease;
      camera.y = start.y + (target.y - start.y) * ease;
      camera.zoom = start.zoom + (target.zoom - start.zoom) * ease;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function downloadSteps() {
    const blob = new Blob([JSON.stringify(savedSteps, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cameraSteps.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener('keydown', (e) => {
    // modifier for saving
    if (e.key === 's') {
      sPressed = true;
      return;
    }

    // prevent arrow scroll
    if ([ 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ' ].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowLeft':
        camera.x -= MOVE_STEP;
        break;
      case 'ArrowRight':
        camera.x += MOVE_STEP;
        break;
      case 'ArrowUp':
        camera.y -= MOVE_STEP;
        break;
      case 'ArrowDown':
        camera.y += MOVE_STEP;
        break;
      case 'i':
        camera.zoom += ZOOM_STEP;
        break;
      case 'k':
        camera.zoom = Math.max(0.1, camera.zoom - ZOOM_STEP);
        break;
      case '1':
      case '2':
      case '3':
      case '4': {
        const idx = parseInt(e.key, 10) - 1;
        if (sPressed) {
          // save
          savedSteps[idx] = { x: camera.x, y: camera.y, zoom: camera.zoom };
          console.log(`[debug] saved camera step ${idx + 1}`, savedSteps[idx]);
        } else if (savedSteps[idx]) {
          animateCameraTo(savedSteps[idx]);
        }
        break;
      }
      case 'd':
        if (sPressed) downloadSteps();
        break;
      case 'w': // toggle water overlay visibility
        if (sPressed) {
          window.DEBUG_SHOW_WATER = !window.DEBUG_SHOW_WATER;
          console.log(`[debug] water overlay ${window.DEBUG_SHOW_WATER ? 'enabled' : 'disabled'}`);
        }
        break;
      case 'v': // toggle viewport info visibility
        if (sPressed) {
          window.DEBUG_SHOW_VIEWPORT_INFO = !window.DEBUG_SHOW_VIEWPORT_INFO;
          console.log(`[debug] viewport info ${window.DEBUG_SHOW_VIEWPORT_INFO ? 'enabled' : 'disabled'}`);
        }
        break;
      default:
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 's') sPressed = false;
  });
}

export function drawViewportInfo(context, camera) {
    if (!window.DEBUG_SHOW_VIEWPORT_INFO) return;
    
    context.save();
    // Reset transformations to draw UI elements in screen space
    context.setTransform(1, 0, 0, 1, 0, 0);
    
    context.fillStyle = 'black';
    context.font = '14px Arial';
    context.fillText(`Viewport: x=${Math.round(camera.x)}, y=${Math.round(camera.y)}, zoom=${camera.zoom.toFixed(2)}`, 10, 20);
    
    context.restore();
}

/*
* DEBUG CAMERA CONTROLS
* --------------------------------------------------------------------------
* Arrow Keys  : pan camera (world units)
* i / k       : zoom in / out
* Hold "s" + 1-4 : save current camera state to a step
* Keys 1-4    : move (with easing) to saved camera step
* Hold "s" + w : toggle water overlay visibility
* Hold "s" + v : toggle viewport info visibility
* --------------------------------------------------------------------------
*/
