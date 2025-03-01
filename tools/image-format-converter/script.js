// Image Format Converter Tool

// Global variables
let images = [];
let selectedFormat = 'jpeg';
let quality = 80;
let isHighQuality = true;
const MAX_IMAGES = 10;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Make results container visible by default
    document.getElementById('results-container').style.display = 'block';
});

// Set up event listeners
function setupEventListeners() {
    // File upload elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.querySelector('.file-btn');
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // File selection
    fileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });
    
    dropZone.addEventListener('click', function(e) {
        // Only trigger if not clicking on the button
        if (e.target !== fileBtn && !fileBtn.contains(e.target)) {
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files);
        }
    });
    
    // Format selection
    document.getElementById('format-select').addEventListener('change', function() {
        selectedFormat = this.value;
    });
    
    // Quality options
    document.getElementById('best-quality').addEventListener('change', function() {
        if (this.checked) {
            isHighQuality = true;
            quality = 90;
            document.getElementById('quality-slider').value = 90;
        }
    });
    
    document.getElementById('smallest-file').addEventListener('change', function() {
        if (this.checked) {
            isHighQuality = false;
            quality = 60;
            document.getElementById('quality-slider').value = 60;
        }
    });
    
    // Quality slider
    document.getElementById('quality-slider').addEventListener('input', function() {
        quality = parseInt(this.value);
        
        // Auto-select the appropriate radio button based on slider value
        if (quality >= 80) {
            document.getElementById('best-quality').checked = true;
            isHighQuality = true;
        } else {
            document.getElementById('smallest-file').checked = true;
            isHighQuality = false;
        }
    });
    
    // Convert action
    document.getElementById('start-btn').addEventListener('click', convertAllImages);
}

// Handle the uploaded files
function handleFiles(files) {
    // Check if adding these files would exceed the maximum
    if (images.length + files.length > MAX_IMAGES) {
        const availableSlots = Math.max(0, MAX_IMAGES - images.length);
        alert(`You can only upload a maximum of ${MAX_IMAGES} images. You already have ${images.length} images, so you can add ${availableSlots} more.`);
        
        // If we already have max images, don't process any more
        if (images.length >= MAX_IMAGES) {
            return;
        }
        
        // Otherwise, only process up to the available slots
        files = Array.from(files).slice(0, availableSlots);
    }
    
    // If no files are left to process after filtering, return
    if (files.length === 0) {
        return;
    }
    
    // If this is a new batch and we don't have any images yet, reset the array
    if (images.length === 0) {
        document.getElementById('image-results').innerHTML = '';
    }
    
    // Update file counter
    document.getElementById('file-counter').textContent = files.length > 0 ? `${files.length} file${files.length !== 1 ? 's' : ''}` : '';
    
    // Process each file
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            return; // Skip non-image files
        }
        
        // Create a preview and add to images array
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = {
                id: generateUniqueId(),
                file: file,
                originalSize: file.size,
                originalName: file.name,
                originalFormat: getFormatFromMimeType(file.type),
                originalDataUrl: e.target.result,
                convertedDataUrl: null,
                convertedSize: null,
                convertedFormat: selectedFormat
            };
            
            images.push(image);
            addImagePreview(image);
            
            // Update the counter to show total count
            updateFileCounter();
        };
        
        reader.readAsDataURL(file);
    });
}

// Update the file counter with the total count
function updateFileCounter() {
    document.getElementById('file-counter').textContent = images.length > 0 ? 
        `${images.length}${images.length === MAX_IMAGES ? ' (max)' : ''} file${images.length !== 1 ? 's' : ''}` : '';
}

// Add image preview to results
function addImagePreview(image) {
    const resultsContainer = document.getElementById('image-results');
    
    const imageElement = document.createElement('div');
    imageElement.className = 'image-result';
    imageElement.id = `image-${image.id}`;
    
    const preview = document.createElement('img');
    preview.className = 'image-preview';
    preview.src = image.originalDataUrl;
    preview.alt = image.originalName;
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'image-info';
    
    const nameElement = document.createElement('h5');
    nameElement.className = 'image-name';
    nameElement.textContent = image.originalName;
    
    const metaElement = document.createElement('div');
    metaElement.className = 'image-meta';
    metaElement.innerHTML = `
        <span>${image.originalFormat.toUpperCase()}</span>
        <span>${formatFileSize(image.originalSize)}</span>
    `;
    
    const actionsElement = document.createElement('div');
    actionsElement.className = 'image-actions';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'button';
    downloadButton.textContent = 'Download';
    downloadButton.disabled = true;
    downloadButton.onclick = function() {
        downloadImage(image.id);
    };
    
    actionsElement.appendChild(downloadButton);
    
    infoDiv.appendChild(nameElement);
    infoDiv.appendChild(metaElement);
    infoDiv.appendChild(actionsElement);
    
    imageElement.appendChild(preview);
    imageElement.appendChild(infoDiv);
    
    resultsContainer.appendChild(imageElement);
}

// Convert all images
function convertAllImages() {
    if (images.length === 0) {
        alert('Please select at least one image first');
        return;
    }
    
    // Show loading state
    const startBtn = document.getElementById('start-btn');
    startBtn.textContent = 'Converting...';
    startBtn.disabled = true;
    
    // Process each image
    const promises = images.map(image => {
        return new Promise((resolve) => {
            convertImage(image.id).then(() => {
                resolve();
            });
        });
    });
    
    // When all images are processed
    Promise.all(promises).then(() => {
        // Reset button
        startBtn.textContent = 'START →';
        startBtn.disabled = false;
        
        // Enable all download buttons
        document.querySelectorAll('.image-actions .button').forEach(button => {
            button.disabled = false;
        });
    });
}

// Convert single image
function convertImage(id) {
    return new Promise((resolve) => {
        const image = images.find(img => img.id === id);
        if (!image) {
            resolve();
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            // Convert to selected format
            let mimeType;
            let compressionQuality = quality / 100;
            
            switch(selectedFormat) {
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    break;
                case 'png':
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                case 'gif':
                    mimeType = 'image/gif';
                    break;
                case 'bmp':
                    mimeType = 'image/bmp';
                    break;
                default:
                    mimeType = 'image/jpeg';
            }
            
            // Get converted data URL
            const convertedDataUrl = canvas.toDataURL(mimeType, compressionQuality);
            
            // Calculate converted size
            const convertedBlob = dataURLToBlob(convertedDataUrl);
            const convertedSize = convertedBlob.size;
            
            // Update image object
            image.convertedDataUrl = convertedDataUrl;
            image.convertedSize = convertedSize;
            image.convertedFormat = getFormatFromMimeType(mimeType);
            
            // Update UI
            updateImageResult(image);
            
            resolve();
        };
        
        img.src = image.originalDataUrl;
    });
}

// Update image result in UI after conversion
function updateImageResult(image) {
    const imageElement = document.getElementById(`image-${image.id}`);
    if (!imageElement) return;
    
    // Update the preview with the converted image
    const preview = imageElement.querySelector('.image-preview');
    preview.src = image.convertedDataUrl;
    
    // Update the metadata
    const metaElement = imageElement.querySelector('.image-meta');
    const savingsPercentage = Math.round((1 - (image.convertedSize / image.originalSize)) * 100);
    
    metaElement.innerHTML = `
        <span>${image.convertedFormat.toUpperCase()}</span>
        <span>${formatFileSize(image.convertedSize)} (${savingsPercentage >= 0 ? '-' : '+'}${Math.abs(savingsPercentage)}%)</span>
    `;
    
    // Apply savings style
    if (savingsPercentage >= 20) {
        metaElement.querySelector('span:last-child').classList.add('savings');
    }
    
    // Enable download button
    const downloadButton = imageElement.querySelector('.button');
    downloadButton.disabled = false;
}

// Download a converted image
function downloadImage(id) {
    const image = images.find(img => img.id === id);
    if (!image || !image.convertedDataUrl) return;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = image.convertedDataUrl;
    
    // Generate filename
    const extension = `.${image.convertedFormat}`;
    const originalNameWithoutExt = image.originalName.replace(/\.[^/.]+$/, "");
    link.download = `${originalNameWithoutExt}-converted${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Convert data URL to Blob
function dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
}

// Get file format from MIME type
function getFormatFromMimeType(mimeType) {
    const formatMap = {
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpeg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/bmp': 'bmp',
        'image/x-icon': 'ico',
        'image/tiff': 'tiff',
        'image/avif': 'avif'
    };
    
    return formatMap[mimeType] || 'unknown';
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}

// Generate a unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
} 