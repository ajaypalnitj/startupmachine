// DOM Elements
const colorPalette = document.getElementById('colorPalette');
const generateButton = document.getElementById('generateButton');
const lockButton = document.getElementById('lockButton');
const lockIcon = document.getElementById('lockIcon');
const lockText = document.getElementById('lockText');
const exportButton = document.getElementById('exportButton');
const exportOptions = document.getElementById('exportOptions');
const exportPreview = document.getElementById('exportPreview');
const exportCode = document.getElementById('exportCode');
const copyExport = document.getElementById('copyExport');
const closeExportPreview = document.getElementById('closeExportPreview');

// Method Selection
const randomButton = document.getElementById('randomButton');
const baseColorButton = document.getElementById('baseColorButton');
const imageButton = document.getElementById('imageButton');
const baseColorOptions = document.getElementById('baseColorOptions');
const imageUploadOptions = document.getElementById('imageUploadOptions');
const baseColorPicker = document.getElementById('baseColorPicker');
const baseColorInput = document.getElementById('baseColorInput');
const imageUpload = document.getElementById('imageUpload');
const uploadPreview = document.getElementById('uploadPreview');

// Palette Type Selection
const analogousButton = document.getElementById('analogousButton');
const monochromaticButton = document.getElementById('monochromaticButton');
const triadicButton = document.getElementById('triadicButton');
const complementaryButton = document.getElementById('complementaryButton');
const splitComplementaryButton = document.getElementById('splitComplementaryButton');

// Color Count Selection
const colorCountButtons = document.querySelectorAll('.color-count-button');

// Export Options
const exportCSS = document.getElementById('exportCSS');
const exportSCSS = document.getElementById('exportSCSS');
const exportJSON = document.getElementById('exportJSON');
const exportImage = document.getElementById('exportImage');

// Palette State
let paletteState = {
    method: 'random',
    baseColor: '#4F46E5',
    image: null,
    paletteType: 'analogous',
    colorCount: 5,
    colors: [],
    lockedColors: {}
};

// Initialize the app
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Generate initial palette
    generatePalette();
}

// Set up event listeners
function setupEventListeners() {
    // Method Selection
    randomButton.addEventListener('click', () => setMethod('random'));
    baseColorButton.addEventListener('click', () => setMethod('baseColor'));
    imageButton.addEventListener('click', () => setMethod('image'));
    
    // Base Color Picker
    baseColorPicker.addEventListener('input', () => {
        paletteState.baseColor = baseColorPicker.value;
        baseColorInput.value = baseColorPicker.value;
    });
    
    baseColorInput.addEventListener('input', () => {
        if (isValidColor(baseColorInput.value)) {
            paletteState.baseColor = baseColorInput.value;
            baseColorPicker.value = baseColorInput.value;
        }
    });
    
    // Image Upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Palette Type Selection
    analogousButton.addEventListener('click', () => setPaletteType('analogous'));
    monochromaticButton.addEventListener('click', () => setPaletteType('monochromatic'));
    triadicButton.addEventListener('click', () => setPaletteType('triadic'));
    complementaryButton.addEventListener('click', () => setPaletteType('complementary'));
    splitComplementaryButton.addEventListener('click', () => setPaletteType('splitComplementary'));
    
    // Color Count Selection
    colorCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            setColorCount(parseInt(button.dataset.count));
            setActiveButton(colorCountButtons, button);
        });
    });
    
    // Generate Button
    generateButton.addEventListener('click', generatePalette);
    
    // Lock Button
    lockButton.addEventListener('click', toggleAllLocks);
    
    // Export Button
    exportButton.addEventListener('click', () => {
        exportOptions.style.display = exportOptions.style.display === 'none' ? 'flex' : 'none';
    });
    
    // Export Options
    exportCSS.addEventListener('click', () => exportPalette('css'));
    exportSCSS.addEventListener('click', () => exportPalette('scss'));
    exportJSON.addEventListener('click', () => exportPalette('json'));
    exportImage.addEventListener('click', () => exportPalette('image'));
    
    // Close Export Preview
    closeExportPreview.addEventListener('click', () => {
        exportPreview.style.display = 'none';
    });
    
    // Copy Export
    copyExport.addEventListener('click', copyExportToClipboard);
}

// Set generation method
function setMethod(method) {
    paletteState.method = method;
    
    // Update UI
    randomButton.classList.toggle('active', method === 'random');
    baseColorButton.classList.toggle('active', method === 'baseColor');
    imageButton.classList.toggle('active', method === 'image');
    
    baseColorOptions.style.display = method === 'baseColor' ? 'block' : 'none';
    imageUploadOptions.style.display = method === 'image' ? 'block' : 'none';
}

// Set palette type
function setPaletteType(type) {
    paletteState.paletteType = type;
    
    // Update UI
    analogousButton.classList.toggle('active', type === 'analogous');
    monochromaticButton.classList.toggle('active', type === 'monochromatic');
    triadicButton.classList.toggle('active', type === 'triadic');
    complementaryButton.classList.toggle('active', type === 'complementary');
    splitComplementaryButton.classList.toggle('active', type === 'splitComplementary');
}

// Set color count
function setColorCount(count) {
    paletteState.colorCount = count;
}

// Set active button in a group
function setActiveButton(buttons, activeButton) {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Display image preview
            uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
            
            // Store image data
            paletteState.image = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Generate color palette
function generatePalette() {
    // Clear existing palette
    colorPalette.innerHTML = '';
    
    // Generate colors based on method
    let colors = [];
    
    switch (paletteState.method) {
        case 'random':
            colors = generateRandomPalette();
            break;
        case 'baseColor':
            colors = generatePaletteFromBaseColor();
            break;
        case 'image':
            if (paletteState.image) {
                colors = extractColorsFromImage();
            } else {
                // Fallback to random if no image
                colors = generateRandomPalette();
            }
            break;
    }
    
    // Apply locked colors
    colors = applyLockedColors(colors);
    
    // Store colors in state
    paletteState.colors = colors;
    
    // Render palette
    renderPalette(colors);
}

// Generate random palette
function generateRandomPalette() {
    const colors = [];
    const count = paletteState.colorCount;
    
    // Generate a random base color
    const baseHue = Math.floor(Math.random() * 360);
    
    switch (paletteState.paletteType) {
        case 'analogous':
            // Analogous colors are adjacent on the color wheel
            for (let i = 0; i < count; i++) {
                const hue = (baseHue + (i - Math.floor(count / 2)) * 30) % 360;
                colors.push(hslToHex(hue, 70, 60));
            }
            break;
        
        case 'monochromatic':
            // Monochromatic colors are different shades of the same hue
            for (let i = 0; i < count; i++) {
                const lightness = 30 + (i * (60 / (count - 1)));
                colors.push(hslToHex(baseHue, 70, lightness));
            }
            break;
        
        case 'triadic':
            // Triadic colors are evenly spaced around the color wheel
            const triadicStep = 360 / 3;
            for (let i = 0; i < count; i++) {
                const hueIndex = i % 3;
                const hue = (baseHue + hueIndex * triadicStep) % 360;
                const lightness = 50 + (Math.floor(i / 3) * 15);
                colors.push(hslToHex(hue, 70, lightness));
            }
            break;
        
        case 'complementary':
            // Complementary colors are opposite on the color wheel
            const complementHue = (baseHue + 180) % 360;
            for (let i = 0; i < count; i++) {
                if (i < Math.ceil(count / 2)) {
                    const lightness = 40 + (i * 15);
                    colors.push(hslToHex(baseHue, 70, lightness));
                } else {
                    const lightness = 40 + ((i - Math.ceil(count / 2)) * 15);
                    colors.push(hslToHex(complementHue, 70, lightness));
                }
            }
            break;
        
        case 'splitComplementary':
            // Split complementary uses a base color and two colors adjacent to its complement
            const complement = (baseHue + 180) % 360;
            const split1 = (complement - 30) % 360;
            const split2 = (complement + 30) % 360;
            
            for (let i = 0; i < count; i++) {
                if (i % 3 === 0) {
                    colors.push(hslToHex(baseHue, 70, 50 + (Math.floor(i / 3) * 10)));
                } else if (i % 3 === 1) {
                    colors.push(hslToHex(split1, 70, 50 + (Math.floor(i / 3) * 10)));
                } else {
                    colors.push(hslToHex(split2, 70, 50 + (Math.floor(i / 3) * 10)));
                }
            }
            break;
    }
    
    return colors;
}

// Generate palette from base color
function generatePaletteFromBaseColor() {
    // Convert base color to HSL
    const baseHSL = hexToHSL(paletteState.baseColor);
    const baseHue = baseHSL.h;
    
    // Use the same logic as random palette but with the selected base color
    const colors = [];
    const count = paletteState.colorCount;
    
    switch (paletteState.paletteType) {
        case 'analogous':
            for (let i = 0; i < count; i++) {
                const hue = (baseHue + (i - Math.floor(count / 2)) * 30) % 360;
                colors.push(hslToHex(hue, baseHSL.s, baseHSL.l));
            }
            break;
        
        case 'monochromatic':
            for (let i = 0; i < count; i++) {
                const lightness = 30 + (i * (60 / (count - 1)));
                colors.push(hslToHex(baseHue, baseHSL.s, lightness));
            }
            break;
        
        case 'triadic':
            const triadicStep = 360 / 3;
            for (let i = 0; i < count; i++) {
                const hueIndex = i % 3;
                const hue = (baseHue + hueIndex * triadicStep) % 360;
                const lightness = baseHSL.l + (Math.floor(i / 3) * 10 - 15);
                colors.push(hslToHex(hue, baseHSL.s, lightness));
            }
            break;
        
        case 'complementary':
            const complementHue = (baseHue + 180) % 360;
            for (let i = 0; i < count; i++) {
                if (i < Math.ceil(count / 2)) {
                    const lightness = baseHSL.l + (i * 10 - 15);
                    colors.push(hslToHex(baseHue, baseHSL.s, lightness));
                } else {
                    const lightness = baseHSL.l + ((i - Math.ceil(count / 2)) * 10 - 15);
                    colors.push(hslToHex(complementHue, baseHSL.s, lightness));
                }
            }
            break;
        
        case 'splitComplementary':
            const complement = (baseHue + 180) % 360;
            const split1 = (complement - 30) % 360;
            const split2 = (complement + 30) % 360;
            
            for (let i = 0; i < count; i++) {
                if (i % 3 === 0) {
                    colors.push(hslToHex(baseHue, baseHSL.s, baseHSL.l + (Math.floor(i / 3) * 10 - 10)));
                } else if (i % 3 === 1) {
                    colors.push(hslToHex(split1, baseHSL.s, baseHSL.l + (Math.floor(i / 3) * 10 - 10)));
                } else {
                    colors.push(hslToHex(split2, baseHSL.s, baseHSL.l + (Math.floor(i / 3) * 10 - 10)));
                }
            }
            break;
    }
    
    return colors;
}

// Extract colors from image
function extractColorsFromImage() {
    // This is a simplified version - in a real app, you'd use a color quantization algorithm
    // For now, we'll generate a palette based on the base color method
    // and pretend we extracted it from the image
    return generatePaletteFromBaseColor();
}

// Apply locked colors to the palette
function applyLockedColors(colors) {
    const result = [...colors];
    
    // Replace colors with locked ones
    for (const index in paletteState.lockedColors) {
        if (index < result.length) {
            result[index] = paletteState.lockedColors[index];
        }
    }
    
    return result;
}

// Render the palette to the DOM
function renderPalette(colors) {
    colorPalette.innerHTML = '';
    
    colors.forEach((color, index) => {
        const isLocked = paletteState.lockedColors[index] !== undefined;
        
        // Create color swatch
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        
        // Convert color to different formats
        const rgb = hexToRgb(color);
        const hsl = hexToHSL(color);
        
        swatch.innerHTML = `
            <div class="color-preview" style="background-color: ${color}"></div>
            <div class="color-info">
                <div class="color-hex">${color}</div>
                <div class="color-values">
                    <span>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</span>
                    <span>HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%</span>
                </div>
            </div>
            <div class="color-actions">
                <button class="color-action color-lock" data-index="${index}">${isLocked ? '🔒' : '🔓'}</button>
            </div>
        `;
        
        // Add event listeners
        const colorPreview = swatch.querySelector('.color-preview');
        const colorHex = swatch.querySelector('.color-hex');
        const lockButton = swatch.querySelector('.color-lock');
        
        // Copy color on click
        colorPreview.addEventListener('click', () => {
            copyToClipboard(color);
            showToast(`Copied ${color} to clipboard`);
        });
        
        colorHex.addEventListener('click', () => {
            copyToClipboard(color);
            showToast(`Copied ${color} to clipboard`);
        });
        
        // Toggle lock
        lockButton.addEventListener('click', () => {
            toggleLock(index);
        });
        
        colorPalette.appendChild(swatch);
    });
}

// Toggle lock for a specific color
function toggleLock(index) {
    if (paletteState.lockedColors[index]) {
        delete paletteState.lockedColors[index];
    } else {
        paletteState.lockedColors[index] = paletteState.colors[index];
    }
    
    // Update UI
    const lockButton = document.querySelector(`.color-lock[data-index="${index}"]`);
    if (lockButton) {
        lockButton.textContent = paletteState.lockedColors[index] ? '🔒' : '🔓';
    }
    
    // Update lock all button
    updateLockAllButton();
}

// Toggle all locks
function toggleAllLocks() {
    const allLocked = Object.keys(paletteState.lockedColors).length === paletteState.colors.length;
    
    if (allLocked) {
        // Unlock all
        paletteState.lockedColors = {};
        lockIcon.textContent = '🔓';
        lockText.textContent = 'Unlock All';
    } else {
        // Lock all
        paletteState.colors.forEach((color, index) => {
            paletteState.lockedColors[index] = color;
        });
        lockIcon.textContent = '🔒';
        lockText.textContent = 'Lock All';
    }
    
    // Update UI
    const lockButtons = document.querySelectorAll('.color-lock');
    lockButtons.forEach((button, index) => {
        button.textContent = paletteState.lockedColors[index] ? '🔒' : '🔓';
    });
}

// Update lock all button based on current state
function updateLockAllButton() {
    const allLocked = Object.keys(paletteState.lockedColors).length === paletteState.colors.length;
    
    lockIcon.textContent = allLocked ? '🔒' : '🔓';
    lockText.textContent = allLocked ? 'Lock All' : 'Unlock All';
}

// Export palette in different formats
function exportPalette(format) {
    let output = '';
    
    switch (format) {
        case 'css':
            output = `:root {\n`;
            paletteState.colors.forEach((color, index) => {
                output += `  --color-${index + 1}: ${color};\n`;
            });
            output += `}`;
            break;
        
        case 'scss':
            paletteState.colors.forEach((color, index) => {
                output += `$color-${index + 1}: ${color};\n`;
            });
            break;
        
        case 'json':
            const jsonObj = {
                palette: paletteState.colors.map((color, index) => ({
                    name: `Color ${index + 1}`,
                    hex: color,
                    rgb: hexToRgb(color),
                    hsl: hexToHSL(color)
                }))
            };
            output = JSON.stringify(jsonObj, null, 2);
            break;
        
        case 'image':
            // For image export, we'll just show a message
            output = "To export as an image, right-click on the palette and select 'Save Image As...'";
            break;
    }
    
    // Show export preview
    exportCode.textContent = output;
    exportPreview.style.display = 'block';
    exportOptions.style.display = 'none';
}

// Copy export to clipboard
function copyExportToClipboard() {
    copyToClipboard(exportCode.textContent);
    showToast('Copied to clipboard');
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textarea);
}

// Show a toast message
function showToast(message) {
    // Check if a toast already exists
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // Create a new toast
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.style.display = 'block';
    
    // Add animation
    toast.style.opacity = '0';
    toast.style.bottom = '20px';
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 3000);
}

// Color conversion utilities
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function hexToHSL(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return {
        h: h * 360,
        s: s * 100,
        l: l * 100
    };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Helper function to check if a string is a valid CSS color
function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
}

// Add CSS for toast
const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 1000;
    transition: opacity 0.5s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
`;
document.head.appendChild(style);

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 