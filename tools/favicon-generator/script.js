// Favicon Generator Tool
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const browseText = document.querySelector('.browse-text');
    const imagePreview = document.getElementById('image-preview');
    const preview16 = document.getElementById('preview-16');
    const preview32 = document.getElementById('preview-32');
    const preview48 = document.getElementById('preview-48');
    const preview64 = document.getElementById('preview-64');
    const editorSection = document.getElementById('editor-section');
    const outputOptions = document.getElementById('output-options');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const faviconPreviews = document.getElementById('favicon-previews');
    const htmlCode = document.getElementById('html-code');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const copyHtmlBtn = document.getElementById('copy-html-btn');
    
    // Option Elements
    const backgroundColor = document.getElementById('background-color');
    const backgroundColorText = document.getElementById('background-color-text');
    const paddingRange = document.getElementById('padding-range');
    const paddingValue = document.getElementById('padding-value');
    const borderRadiusRange = document.getElementById('border-radius-range');
    const borderRadiusValue = document.getElementById('border-radius-value');
    const transparentBackground = document.getElementById('transparent-background');
    
    // Output Option Elements
    const includeIco = document.getElementById('include-ico');
    const includePng = document.getElementById('include-png');
    const includeApple = document.getElementById('include-apple');
    const includeAndroid = document.getElementById('include-android');
    const includeMs = document.getElementById('include-ms');
    const includeHtml = document.getElementById('include-html');
    
    // Tab Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Variables
    let originalImage = null;
    let processedImage = null;
    let generatedFavicons = [];
    let isFileSelectInProgress = false;
    
    // File Input Event Listeners
    fileInput.addEventListener('change', handleFileSelect);
    
    // Prevent default behaviors for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Add visual feedback for drag and drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    // Handle file drop
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }, false);
    
    // Handle clicks on dropzone and browse text
    dropZone.addEventListener('click', triggerFileInput);
    browseText.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerFileInput();
    });
    
    function triggerFileInput() {
        if (!isFileSelectInProgress) {
            isFileSelectInProgress = true;
            fileInput.click();
            
            // Reset the flag after a short delay
            setTimeout(() => {
                isFileSelectInProgress = false;
            }, 300);
        }
    }
    
    // Option event listeners
    backgroundColor.addEventListener('input', updateBackgroundColor);
    backgroundColorText.addEventListener('input', updateBackgroundColorFromText);
    paddingRange.addEventListener('input', updatePadding);
    borderRadiusRange.addEventListener('input', updateBorderRadius);
    transparentBackground.addEventListener('change', updateTransparency);
    
    // Action event listeners
    generateBtn.addEventListener('click', generateFavicons);
    downloadAllBtn.addEventListener('click', downloadAllFavicons);
    copyHtmlBtn.addEventListener('click', copyHtmlCode);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
    
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        const fileType = file.type;
        
        // Check if file is an image
        if (!fileType.match('image.*')) {
            showToast('Please select an image file (PNG, JPG, or SVG).', 'error');
            return;
        }
        
        // Check if file is PNG, JPG, or SVG
        if (!fileType.match('image/png') && !fileType.match('image/jpeg') && !fileType.match('image/svg+xml')) {
            showToast('Please select a PNG, JPG, or SVG file.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Store original image
                originalImage = img;
                
                // Show editor section
                editorSection.style.display = 'block';
                outputOptions.style.display = 'block';
                generateBtn.disabled = false;
                
                // Update preview
                updatePreview();
                
                // Show success message
                showToast('Image uploaded successfully!', 'success');
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    function updateBackgroundColor() {
        backgroundColorText.value = backgroundColor.value;
        updatePreview();
    }
    
    function updateBackgroundColorFromText() {
        // Check if valid hex color
        const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(backgroundColorText.value);
        
        if (isValidHex) {
            backgroundColor.value = backgroundColorText.value;
            updatePreview();
        }
    }
    
    function updatePadding() {
        paddingValue.textContent = paddingRange.value + '%';
        updatePreview();
    }
    
    function updateBorderRadius() {
        borderRadiusValue.textContent = borderRadiusRange.value + '%';
        updatePreview();
    }
    
    function updateTransparency() {
        backgroundColor.disabled = transparentBackground.checked;
        backgroundColorText.disabled = transparentBackground.checked;
        updatePreview();
    }
    
    function updatePreview() {
        if (!originalImage) return;
        
        // Create canvas for main preview
        const canvas = document.createElement('canvas');
        const size = 260; // Preview size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Apply background color if not transparent
        if (!transparentBackground.checked) {
            ctx.fillStyle = backgroundColor.value;
            ctx.fillRect(0, 0, size, size);
        } else {
            ctx.clearRect(0, 0, size, size);
        }
        
        // Calculate padding
        const padding = (size * (parseInt(paddingRange.value) / 100));
        const imageSize = size - (padding * 2);
        
        // Apply border radius
        const radius = (size * (parseInt(borderRadiusRange.value) / 100));
        if (radius > 0) {
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.clip();
            
            if (!transparentBackground.checked) {
                ctx.fillStyle = backgroundColor.value;
                ctx.fillRect(0, 0, size, size);
            }
        }
        
        // Draw image with padding
        ctx.drawImage(originalImage, padding, padding, imageSize, imageSize);
        
        // Update main preview
        imagePreview.innerHTML = '';
        const previewImg = document.createElement('img');
        previewImg.src = canvas.toDataURL('image/png');
        imagePreview.appendChild(previewImg);
        
        // Store processed image
        processedImage = canvas;
        
        // Update size previews
        updateSizePreview(preview16, 16);
        updateSizePreview(preview32, 32);
        updateSizePreview(preview48, 48);
        updateSizePreview(preview64, 64);
    }
    
    function updateSizePreview(element, size) {
        if (!processedImage) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Draw the processed image scaled down
        ctx.drawImage(processedImage, 0, 0, size, size);
        
        // Update preview
        element.innerHTML = '';
        const previewImg = document.createElement('img');
        previewImg.src = canvas.toDataURL('image/png');
        element.appendChild(previewImg);
    }
    
    function generateFavicons() {
        if (!processedImage) {
            showToast('Please upload an image first.', 'error');
            return;
        }
        
        // Clear previous results
        faviconPreviews.innerHTML = '';
        generatedFavicons = [];
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'GENERATING...';
        
        // Use setTimeout to allow UI to update before heavy processing
        setTimeout(() => {
            // Generate favicons based on selected options
            if (includePng.checked) {
                generatePngFavicons();
            }
            
            if (includeApple.checked) {
                generateAppleTouchIcons();
            }
            
            if (includeAndroid.checked) {
                generateAndroidIcons();
            }
            
            if (includeMs.checked) {
                generateMsTiles();
            }
            
            if (includeIco.checked) {
                generateIcoFavicon();
            }
            
            // Generate HTML code
            if (includeHtml.checked) {
                generateHtmlCode();
            }
            
            // Show results
            resultsContainer.style.display = 'block';
            
            // Reset button state
            generateBtn.disabled = false;
            generateBtn.textContent = 'GENERATE FAVICON PACKAGE';
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Show success message
            showToast('Favicons generated successfully!', 'success');
        }, 100);
    }
    
    function generatePngFavicons() {
        const sizes = [16, 32, 48, 64, 128, 256];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Draw the processed image scaled down
            ctx.drawImage(processedImage, 0, 0, size, size);
            
            // Get data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Add to generated favicons
            generatedFavicons.push({
                name: `favicon-${size}x${size}.png`,
                dataUrl: dataUrl,
                size: `${size}x${size}`,
                type: 'PNG'
            });
            
            // Add preview
            addFaviconPreview(dataUrl, `${size}x${size}`, 'PNG', `favicon-${size}x${size}.png`);
        });
    }
    
    function generateAppleTouchIcons() {
        const sizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Draw the processed image scaled down
            ctx.drawImage(processedImage, 0, 0, size, size);
            
            // Get data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Add to generated favicons
            generatedFavicons.push({
                name: `apple-touch-icon-${size}x${size}.png`,
                dataUrl: dataUrl,
                size: `${size}x${size}`,
                type: 'Apple Touch'
            });
            
            // Add preview
            addFaviconPreview(dataUrl, `${size}x${size}`, 'Apple Touch', `apple-touch-icon-${size}x${size}.png`);
        });
    }
    
    function generateAndroidIcons() {
        const sizes = [36, 48, 72, 96, 144, 192, 512];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Draw the processed image scaled down
            ctx.drawImage(processedImage, 0, 0, size, size);
            
            // Get data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Add to generated favicons
            generatedFavicons.push({
                name: `android-chrome-${size}x${size}.png`,
                dataUrl: dataUrl,
                size: `${size}x${size}`,
                type: 'Android'
            });
            
            // Add preview
            addFaviconPreview(dataUrl, `${size}x${size}`, 'Android', `android-chrome-${size}x${size}.png`);
        });
    }
    
    function generateMsTiles() {
        const sizes = [
            { width: 70, height: 70, name: 'mstile-70x70.png' },
            { width: 144, height: 144, name: 'mstile-144x144.png' },
            { width: 150, height: 150, name: 'mstile-150x150.png' },
            { width: 310, height: 150, name: 'mstile-310x150.png' },
            { width: 310, height: 310, name: 'mstile-310x310.png' }
        ];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            const ctx = canvas.getContext('2d');
            
            // For wide tile, center the image
            if (size.width === 310 && size.height === 150) {
                const imageSize = 150;
                const x = (size.width - imageSize) / 2;
                ctx.drawImage(processedImage, x, 0, imageSize, imageSize);
            } else {
                // Draw the processed image scaled to fit
                ctx.drawImage(processedImage, 0, 0, size.width, size.height);
            }
            
            // Get data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            // Add to generated favicons
            generatedFavicons.push({
                name: size.name,
                dataUrl: dataUrl,
                size: `${size.width}x${size.height}`,
                type: 'MS Tile'
            });
            
            // Add preview
            addFaviconPreview(dataUrl, `${size.width}x${size.height}`, 'MS Tile', size.name);
        });
    }
    
    function generateIcoFavicon() {
        // For ICO generation, we'll use PNG data URLs and let the browser handle conversion
        // when downloading. In a real-world scenario, you might want to use a library like
        // png2ico for proper ICO generation.
        
        const sizes = [16, 32, 48];
        const dataUrls = [];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Draw the processed image scaled down
            ctx.drawImage(processedImage, 0, 0, size, size);
            
            // Get data URL
            dataUrls.push(canvas.toDataURL('image/png'));
        });
        
        // Use the first data URL for preview (16x16)
        generatedFavicons.push({
            name: 'favicon.ico',
            dataUrl: dataUrls[0], // Using 16x16 for preview
            size: 'Multi-size',
            type: 'ICO',
            multiSizeDataUrls: dataUrls
        });
        
        // Add preview
        addFaviconPreview(dataUrls[0], 'Multi-size', 'ICO', 'favicon.ico');
    }
    
    function addFaviconPreview(dataUrl, size, type, filename) {
        const previewItem = document.createElement('div');
        previewItem.className = 'favicon-preview-item';
        
        const previewImage = document.createElement('div');
        previewImage.className = 'favicon-preview-image';
        
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `${size} ${type} favicon`;
        
        previewImage.appendChild(img);
        
        const previewInfo = document.createElement('div');
        previewInfo.className = 'favicon-preview-info';
        
        const previewSize = document.createElement('div');
        previewSize.className = 'favicon-preview-size';
        previewSize.textContent = size;
        
        const previewType = document.createElement('div');
        previewType.textContent = type;
        
        const previewName = document.createElement('div');
        previewName.textContent = filename;
        previewName.style.fontSize = '0.75rem';
        previewName.style.marginTop = '0.25rem';
        previewName.style.wordBreak = 'break-all';
        
        previewInfo.appendChild(previewSize);
        previewInfo.appendChild(previewType);
        previewInfo.appendChild(previewName);
        
        previewItem.appendChild(previewImage);
        previewItem.appendChild(previewInfo);
        
        faviconPreviews.appendChild(previewItem);
    }
    
    function generateHtmlCode() {
        let code = '<!-- Favicon -->\n';
        code += '<link rel="icon" type="image/x-icon" href="favicon.ico">\n';
        
        // PNG favicons
        if (includePng.checked) {
            code += '<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">\n';
            code += '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">\n';
            code += '<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">\n';
        }
        
        // Apple Touch Icons
        if (includeApple.checked) {
            code += '\n<!-- Apple Touch Icons -->\n';
            code += '<link rel="apple-touch-icon" sizes="57x57" href="apple-touch-icon-57x57.png">\n';
            code += '<link rel="apple-touch-icon" sizes="60x60" href="apple-touch-icon-60x60.png">\n';
            code += '<link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-72x72.png">\n';
            code += '<link rel="apple-touch-icon" sizes="76x76" href="apple-touch-icon-76x76.png">\n';
            code += '<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png">\n';
            code += '<link rel="apple-touch-icon" sizes="120x120" href="apple-touch-icon-120x120.png">\n';
            code += '<link rel="apple-touch-icon" sizes="144x144" href="apple-touch-icon-144x144.png">\n';
            code += '<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png">\n';
            code += '<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon-180x180.png">\n';
        }
        
        // Android Icons
        if (includeAndroid.checked) {
            code += '\n<!-- Android Icons -->\n';
            code += '<link rel="manifest" href="site.webmanifest">\n';
            code += '<meta name="mobile-web-app-capable" content="yes">\n';
            code += '<meta name="theme-color" content="#ffffff">\n';
        }
        
        // Microsoft Tiles
        if (includeMs.checked) {
            code += '\n<!-- Microsoft Tiles -->\n';
            code += '<meta name="msapplication-TileColor" content="#ffffff">\n';
            code += '<meta name="msapplication-TileImage" content="mstile-144x144.png">\n';
            code += '<meta name="msapplication-config" content="browserconfig.xml">\n';
        }
        
        // Update HTML code display
        htmlCode.textContent = code;
    }
    
    function downloadAllFavicons() {
        if (generatedFavicons.length === 0) {
            showToast('No favicons to download.', 'error');
            return;
        }
        
        // Create a zip file
        const zip = new JSZip();
        
        // Add all favicons to the zip
        generatedFavicons.forEach(favicon => {
            // Convert data URL to blob
            const byteString = atob(favicon.dataUrl.split(',')[1]);
            const mimeString = favicon.dataUrl.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            
            const blob = new Blob([ab], { type: mimeString });
            
            // Special handling for ICO files with multiple sizes
            if (favicon.type === 'ICO' && favicon.multiSizeDataUrls) {
                // In a real-world scenario, you would convert the PNGs to a proper ICO file here
                // For this demo, we'll just use the 16x16 PNG as the ICO
                zip.file(favicon.name, blob);
            } else {
                zip.file(favicon.name, blob);
            }
        });
        
        // Generate sample manifest files if Android or MS options are selected
        if (includeAndroid.checked) {
            const webmanifest = {
                name: "Your Website",
                short_name: "Website",
                icons: [
                    {
                        src: "android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ],
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone"
            };
            
            zip.file("site.webmanifest", JSON.stringify(webmanifest, null, 2));
        }
        
        if (includeMs.checked) {
            const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="mstile-70x70.png"/>
            <square150x150logo src="mstile-150x150.png"/>
            <square310x310logo src="mstile-310x310.png"/>
            <wide310x150logo src="mstile-310x150.png"/>
            <TileColor>#ffffff</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
            
            zip.file("browserconfig.xml", browserconfig);
        }
        
        // Generate the zip file
        zip.generateAsync({ type: 'blob' })
            .then(function(content) {
                // Save the zip file
                saveAs(content, 'favicons.zip');
                
                // Show success message
                showToast('Favicons downloaded successfully!', 'success');
            })
            .catch(function(error) {
                console.error('Error generating zip file:', error);
                showToast('Error generating zip file.', 'error');
            });
    }
    
    function copyHtmlCode() {
        const textToCopy = htmlCode.textContent;
        
        if (!textToCopy) {
            showToast('No HTML code to copy.', 'error');
            return;
        }
        
        // Use the Clipboard API
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showToast('HTML code copied to clipboard!', 'success');
                
                // Change button text temporarily
                const originalText = copyHtmlBtn.innerHTML;
                copyHtmlBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    copyHtmlBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy to clipboard.', 'error');
            });
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Check if a toast container exists, create one if it doesn't
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        toast.appendChild(closeBtn);
        toastContainer.appendChild(toast);
        
        // Auto remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }
    
    // Handle mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuToggle && navLinks && overlay) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        overlay.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
}); 