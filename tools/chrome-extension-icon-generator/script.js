// Chrome Extension Icon Generator Script

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const resetButton = document.getElementById('resetButton');
    const downloadButton = document.getElementById('downloadButton');
    const downloadSingleButtons = document.querySelectorAll('.download-single');
    
    // Preview images
    const preview16 = document.getElementById('preview16');
    const preview32 = document.getElementById('preview32');
    const preview48 = document.getElementById('preview48');
    const preview128 = document.getElementById('preview128');
    
    // Original image data
    let originalImage = null;
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    resetButton.addEventListener('click', resetTool);
    downloadButton.addEventListener('click', downloadIcons);
    
    // Add event listeners for single download buttons
    downloadSingleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = parseInt(this.getAttribute('data-size'));
            downloadSingleIcon(size);
        });
    });
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e);
        }
    });
    
    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0] || e.dataTransfer.files[0];
        
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                generatePreviews(img);
                showPreviewContainer();
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Generate preview images
    function generatePreviews(img) {
        generateIcon(img, 16, preview16);
        generateIcon(img, 32, preview32);
        generateIcon(img, 48, preview48);
        generateIcon(img, 128, preview128);
    }
    
    // Generate a single icon
    function generateIcon(img, size, previewElement) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);
        
        previewElement.src = canvas.toDataURL('image/png');
        previewElement.width = size;
        previewElement.height = size;
    }
    
    // Show preview container
    function showPreviewContainer() {
        uploadArea.style.display = 'none';
        previewContainer.style.display = 'block';
    }
    
    // Reset the tool
    function resetTool() {
        uploadArea.style.display = 'block';
        previewContainer.style.display = 'none';
        fileInput.value = '';
        originalImage = null;
    }
    
    // Download all icons as a ZIP file
    function downloadIcons() {
        if (!originalImage) return;
        
        const zip = new JSZip();
        const iconSizes = [16, 32, 48, 128];
        
        // Create a folder for the icons
        const iconsFolder = zip.folder("icons");
        
        // Add each icon to the ZIP
        iconSizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(originalImage, 0, 0, size, size);
            
            // Convert canvas to blob
            canvas.toBlob(function(blob) {
                iconsFolder.file(`icon-${size}.png`, blob);
                
                // Generate the ZIP file when all icons are added
                if (size === iconSizes[iconSizes.length - 1]) {
                    zip.generateAsync({type: 'blob'})
                        .then(function(content) {
                            saveAs(content, 'chrome-extension-icons.zip');
                        });
                }
            });
        });
    }
    
    // Download a single icon
    function downloadSingleIcon(size) {
        if (!originalImage) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(originalImage, 0, 0, size, size);
        
        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link element
            const a = document.createElement('a');
            a.href = url;
            a.download = `icon-${size}.png`;
            
            // Append to the document and click
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}); 