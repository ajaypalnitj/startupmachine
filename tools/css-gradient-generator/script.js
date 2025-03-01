// DOM Elements
const gradientPreview = document.getElementById('gradientPreview');
const cssCode = document.getElementById('cssCode');
const copyCodeButton = document.getElementById('copyCode');
const randomizeButton = document.getElementById('randomizeButton');
const addColorStopButton = document.getElementById('addColorStop');
const colorStopsContainer = document.getElementById('colorStopsContainer');

// Gradient Type Controls
const linearGradientButton = document.getElementById('linearGradient');
const radialGradientButton = document.getElementById('radialGradient');
const conicGradientButton = document.getElementById('conicGradient');
const linearControls = document.getElementById('linearControls');
const radialControls = document.getElementById('radialControls');
const conicControls = document.getElementById('conicControls');

// Linear Gradient Controls
const directionButtons = document.querySelectorAll('.direction-button');
const angleInput = document.getElementById('angleInput');

// Radial Gradient Controls
const shapeButtons = document.querySelectorAll('.shape-button');
const positionButtons = document.querySelectorAll('.position-button');

// Conic Gradient Controls
const conicPositionButtons = document.querySelectorAll('.conic-position-button');
const conicAngleInput = document.getElementById('conicAngleInput');

// Preview Size Controls
const previewSizeButtons = document.querySelectorAll('.preview-size-button');

// Gradient State
let gradientState = {
    type: 'linear',
    direction: 'to bottom',
    angle: 180,
    shape: 'circle',
    position: 'center',
    conicPosition: 'center',
    conicAngle: 0,
    colorStops: [
        { color: '#4F46E5', position: '0%' },
        { color: '#EC4899', position: '100%' }
    ],
    previewSize: 'medium'
};

// Initialize the app
function init() {
    // Add initial color stops
    gradientState.colorStops.forEach(stop => {
        addColorStopToDOM(stop.color, stop.position);
    });
    
    // Set up event listeners
    setupEventListeners();
    
    // Generate initial gradient
    updateGradient();
}

// Set up event listeners
function setupEventListeners() {
    // Gradient Type Controls
    linearGradientButton.addEventListener('click', () => setGradientType('linear'));
    radialGradientButton.addEventListener('click', () => setGradientType('radial'));
    conicGradientButton.addEventListener('click', () => setGradientType('conic'));
    
    // Linear Gradient Controls
    directionButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveButton(directionButtons, button);
            gradientState.direction = button.dataset.direction;
            updateAngleFromDirection(button.dataset.direction);
            updateGradient();
        });
    });
    
    angleInput.addEventListener('input', () => {
        gradientState.angle = parseInt(angleInput.value) || 0;
        updateDirectionFromAngle(gradientState.angle);
        updateGradient();
    });
    
    // Radial Gradient Controls
    shapeButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveButton(shapeButtons, button);
            gradientState.shape = button.dataset.shape;
            updateGradient();
        });
    });
    
    positionButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveButton(positionButtons, button);
            gradientState.position = button.dataset.position;
            updateGradient();
        });
    });
    
    // Conic Gradient Controls
    conicPositionButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveButton(conicPositionButtons, button);
            gradientState.conicPosition = button.dataset.position;
            updateGradient();
        });
    });
    
    conicAngleInput.addEventListener('input', () => {
        gradientState.conicAngle = parseInt(conicAngleInput.value) || 0;
        updateGradient();
    });
    
    // Preview Size Controls
    previewSizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveButton(previewSizeButtons, button);
            gradientState.previewSize = button.dataset.size;
            updatePreviewSize();
        });
    });
    
    // Add Color Stop Button
    addColorStopButton.addEventListener('click', () => {
        const newColor = getRandomColor();
        const newPosition = '50%';
        gradientState.colorStops.push({ color: newColor, position: newPosition });
        addColorStopToDOM(newColor, newPosition);
        updateGradient();
    });
    
    // Randomize Button
    randomizeButton.addEventListener('click', randomizeGradient);
    
    // Copy Code Button
    copyCodeButton.addEventListener('click', copyCodeToClipboard);
}

// Set gradient type (linear, radial, conic)
function setGradientType(type) {
    gradientState.type = type;
    
    // Update UI
    linearGradientButton.classList.toggle('active', type === 'linear');
    radialGradientButton.classList.toggle('active', type === 'radial');
    conicGradientButton.classList.toggle('active', type === 'conic');
    
    linearControls.style.display = type === 'linear' ? 'block' : 'none';
    radialControls.style.display = type === 'radial' ? 'block' : 'none';
    conicControls.style.display = type === 'conic' ? 'block' : 'none';
    
    updateGradient();
}

// Set active button in a group
function setActiveButton(buttons, activeButton) {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Update angle input based on direction
function updateAngleFromDirection(direction) {
    let angle = 180; // Default (to bottom)
    
    switch (direction) {
        case 'to top': angle = 0; break;
        case 'to top right': angle = 45; break;
        case 'to right': angle = 90; break;
        case 'to bottom right': angle = 135; break;
        case 'to bottom': angle = 180; break;
        case 'to bottom left': angle = 225; break;
        case 'to left': angle = 270; break;
        case 'to top left': angle = 315; break;
    }
    
    angleInput.value = angle;
    gradientState.angle = angle;
}

// Update direction buttons based on angle
function updateDirectionFromAngle(angle) {
    // Normalize angle to 0-360
    angle = ((angle % 360) + 360) % 360;
    
    // Find the closest direction
    let direction;
    if (angle >= 337.5 || angle < 22.5) {
        direction = 'to top';
    } else if (angle >= 22.5 && angle < 67.5) {
        direction = 'to top right';
    } else if (angle >= 67.5 && angle < 112.5) {
        direction = 'to right';
    } else if (angle >= 112.5 && angle < 157.5) {
        direction = 'to bottom right';
    } else if (angle >= 157.5 && angle < 202.5) {
        direction = 'to bottom';
    } else if (angle >= 202.5 && angle < 247.5) {
        direction = 'to bottom left';
    } else if (angle >= 247.5 && angle < 292.5) {
        direction = 'to left';
    } else {
        direction = 'to top left';
    }
    
    // Update active button
    directionButtons.forEach(button => {
        if (button.dataset.direction === direction) {
            setActiveButton(directionButtons, button);
        }
    });
    
    gradientState.direction = direction;
}

// Add a color stop to the DOM
function addColorStopToDOM(color, position) {
    const colorStopIndex = colorStopsContainer.children.length;
    
    const colorStop = document.createElement('div');
    colorStop.className = 'color-stop';
    colorStop.dataset.index = colorStopIndex;
    
    colorStop.innerHTML = `
        <div class="color-stop-input">
            <input type="color" value="${color}" data-index="${colorStopIndex}">
            <input type="text" value="${color}" data-index="${colorStopIndex}">
        </div>
        <div class="color-stop-position">
            <input type="text" value="${position}" data-index="${colorStopIndex}">
        </div>
        <button class="remove-color-stop" data-index="${colorStopIndex}">×</button>
    `;
    
    // Add event listeners for this color stop
    const colorInput = colorStop.querySelector('input[type="color"]');
    const colorTextInput = colorStop.querySelector('.color-stop-input input[type="text"]');
    const positionInput = colorStop.querySelector('.color-stop-position input');
    const removeButton = colorStop.querySelector('.remove-color-stop');
    
    colorInput.addEventListener('input', () => {
        const index = parseInt(colorInput.dataset.index);
        gradientState.colorStops[index].color = colorInput.value;
        colorTextInput.value = colorInput.value;
        updateGradient();
    });
    
    colorTextInput.addEventListener('input', () => {
        const index = parseInt(colorTextInput.dataset.index);
        // Only update if it's a valid color
        if (isValidColor(colorTextInput.value)) {
            gradientState.colorStops[index].color = colorTextInput.value;
            colorInput.value = colorTextInput.value;
            updateGradient();
        }
    });
    
    positionInput.addEventListener('input', () => {
        const index = parseInt(positionInput.dataset.index);
        gradientState.colorStops[index].position = positionInput.value;
        updateGradient();
    });
    
    removeButton.addEventListener('click', () => {
        const index = parseInt(removeButton.dataset.index);
        // Don't allow removing if there are only 2 color stops
        if (gradientState.colorStops.length > 2) {
            gradientState.colorStops.splice(index, 1);
            colorStopsContainer.removeChild(colorStop);
            // Update indices for remaining color stops
            updateColorStopIndices();
            updateGradient();
        }
    });
    
    colorStopsContainer.appendChild(colorStop);
}

// Update indices for color stops after removal
function updateColorStopIndices() {
    const colorStops = colorStopsContainer.querySelectorAll('.color-stop');
    colorStops.forEach((stop, index) => {
        stop.dataset.index = index;
        
        const inputs = stop.querySelectorAll('input');
        inputs.forEach(input => {
            input.dataset.index = index;
        });
        
        const removeButton = stop.querySelector('.remove-color-stop');
        removeButton.dataset.index = index;
    });
}

// Update the gradient preview and CSS code
function updateGradient() {
    let gradientCSS = '';
    
    // Build the gradient CSS based on type
    switch (gradientState.type) {
        case 'linear':
            gradientCSS = buildLinearGradient();
            break;
        case 'radial':
            gradientCSS = buildRadialGradient();
            break;
        case 'conic':
            gradientCSS = buildConicGradient();
            break;
    }
    
    // Apply to preview
    gradientPreview.style.background = gradientCSS;
    
    // Update CSS code
    cssCode.textContent = `background: ${gradientCSS};`;
}

// Build linear gradient CSS
function buildLinearGradient() {
    const colorStopsCSS = gradientState.colorStops
        .map(stop => `${stop.color} ${stop.position}`)
        .join(', ');
    
    return `linear-gradient(${gradientState.angle}deg, ${colorStopsCSS})`;
}

// Build radial gradient CSS
function buildRadialGradient() {
    const colorStopsCSS = gradientState.colorStops
        .map(stop => `${stop.color} ${stop.position}`)
        .join(', ');
    
    return `radial-gradient(${gradientState.shape} at ${gradientState.position}, ${colorStopsCSS})`;
}

// Build conic gradient CSS
function buildConicGradient() {
    const colorStopsCSS = gradientState.colorStops
        .map(stop => `${stop.color} ${stop.position}`)
        .join(', ');
    
    return `conic-gradient(from ${gradientState.conicAngle}deg at ${gradientState.conicPosition}, ${colorStopsCSS})`;
}

// Update preview size
function updatePreviewSize() {
    gradientPreview.classList.remove('small', 'medium', 'large');
    gradientPreview.classList.add(gradientState.previewSize);
}

// Randomize gradient
function randomizeGradient() {
    // Randomize gradient type
    const types = ['linear', 'radial', 'conic'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Set random values based on type
    if (randomType === 'linear') {
        gradientState.angle = Math.floor(Math.random() * 360);
        updateDirectionFromAngle(gradientState.angle);
        angleInput.value = gradientState.angle;
    } else if (randomType === 'radial') {
        const shapes = ['circle', 'ellipse'];
        gradientState.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        const positions = ['top left', 'top', 'top right', 'left', 'center', 'right', 'bottom left', 'bottom', 'bottom right'];
        gradientState.position = positions[Math.floor(Math.random() * positions.length)];
        
        // Update UI
        shapeButtons.forEach(button => {
            if (button.dataset.shape === gradientState.shape) {
                setActiveButton(shapeButtons, button);
            }
        });
        
        positionButtons.forEach(button => {
            if (button.dataset.position === gradientState.position) {
                setActiveButton(positionButtons, button);
            }
        });
    } else if (randomType === 'conic') {
        gradientState.conicAngle = Math.floor(Math.random() * 360);
        
        const positions = ['top left', 'top', 'top right', 'left', 'center', 'right', 'bottom left', 'bottom', 'bottom right'];
        gradientState.conicPosition = positions[Math.floor(Math.random() * positions.length)];
        
        // Update UI
        conicAngleInput.value = gradientState.conicAngle;
        
        conicPositionButtons.forEach(button => {
            if (button.dataset.position === gradientState.conicPosition) {
                setActiveButton(conicPositionButtons, button);
            }
        });
    }
    
    // Set gradient type in UI
    setGradientType(randomType);
    
    // Randomize color stops
    // Clear existing color stops
    while (colorStopsContainer.firstChild) {
        colorStopsContainer.removeChild(colorStopsContainer.firstChild);
    }
    
    // Generate random number of color stops (2-5)
    const numStops = Math.floor(Math.random() * 4) + 2;
    gradientState.colorStops = [];
    
    for (let i = 0; i < numStops; i++) {
        const position = i === 0 ? '0%' : i === numStops - 1 ? '100%' : `${Math.floor(Math.random() * 100)}%`;
        const color = getRandomColor();
        gradientState.colorStops.push({ color, position });
        addColorStopToDOM(color, position);
    }
    
    // Update gradient
    updateGradient();
}

// Copy CSS code to clipboard
function copyCodeToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.value = cssCode.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        // Show feedback (could be improved with a toast notification)
        const originalText = copyCodeButton.textContent;
        copyCodeButton.textContent = 'Copied!';
        setTimeout(() => {
            copyCodeButton.textContent = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Helper function to check if a string is a valid CSS color
function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
}

// Helper function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 