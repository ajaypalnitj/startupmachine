document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const svgPreview = document.getElementById('svg-preview');
    const svgCode = document.getElementById('svg-code');
    const jsxCode = document.getElementById('jsx-code');
    const vueCode = document.getElementById('vue-code');
    const angularCode = document.getElementById('angular-code');
    const svgTextarea = document.getElementById('svg-textarea');
    const loadSvgBtn = document.getElementById('load-svg-btn');
    const inputMethodTabs = document.querySelectorAll('.input-method-tab');
    const inputMethodContents = document.querySelectorAll('.input-method-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const flipHorizontalBtn = document.getElementById('flip-horizontal');
    const flipVerticalBtn = document.getElementById('flip-vertical');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const aspectRatioLock = document.getElementById('aspect-ratio-lock');
    const backgroundColorInput = document.getElementById('bg-color-input');
    const backgroundColorText = document.getElementById('bg-color-text');
    const patternBtns = document.querySelectorAll('.pattern-btn');
    const optimizeBtn = document.getElementById('optimize-btn');
    const prettifyBtn = document.getElementById('prettify-btn');
    const svgExportBtn = document.getElementById('svg-export');
    const pngExportBtn = document.getElementById('png-export');
    const dataUriExportBtn = document.getElementById('data-uri-export');
    const toast = document.getElementById('toast');
    
    // State
    let originalSvgString = '';
    let currentSvgString = '';
    let svgElement = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 1;
    let rotation = 0;
    let scaleX = 1;
    let scaleY = 1;
    let isFileSelectInProgress = false;
    
    // Functions
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

    function handleFileSelect(e) {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    }

    function handleFile(file) {
        if (!file.type.includes('svg')) {
            showToast('Please select an SVG file', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const svgString = e.target.result;
            loadSvgFromString(svgString);
        };
        
        reader.onerror = () => {
            showToast('Error reading file', 'error');
        };
        
        reader.readAsText(file);
    }

    function loadSvgFromString(svgString) {
        try {
            // Clear previous SVG
            svgPreview.innerHTML = '';
            
            // Store original SVG string
            originalSvgString = svgString;
            currentSvgString = svgString;
            
            // Insert SVG into preview
            svgPreview.innerHTML = svgString;
            
            // Get the SVG element
            svgElement = svgPreview.querySelector('svg');
            
            if (!svgElement) {
                throw new Error('Invalid SVG');
            }
            
            // Show editor section
            document.getElementById('editor-section').style.display = 'block';
            
            // Get original dimensions
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                const [, , vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
                originalWidth = vbWidth || 100;
                originalHeight = vbHeight || 100;
            } else {
                originalWidth = parseFloat(svgElement.getAttribute('width')) || 100;
                originalHeight = parseFloat(svgElement.getAttribute('height')) || 100;
            }
            
            // Calculate aspect ratio
            aspectRatio = originalWidth / originalHeight;
            
            // Update dimension inputs
            widthInput.value = originalWidth;
            heightInput.value = originalHeight;
            
            // Reset transformations
            rotation = 0;
            scaleX = 1;
            scaleY = 1;
            
            // Update code views
            updateCodeViews();
            
            // Show success message
            showToast('SVG loaded successfully', 'success');
        } catch (error) {
            showToast('Invalid SVG code', 'error');
            console.error(error);
        }
    }

    function updateCodeViews() {
        // Update SVG code display
        svgCode.textContent = currentSvgString;
        
        // Update JSX code display
        jsxCode.textContent = convertToJsx(currentSvgString);
        
        // Update Vue code display
        vueCode.textContent = convertToVue(currentSvgString);
        
        // Update Angular code display
        angularCode.textContent = convertToAngular(currentSvgString);
    }

    function convertToJsx(svgString) {
        let jsxCode = svgString
            // Replace SVG attributes with JSX format
            .replace(/(\w+)=/g, (match, p1) => {
                // Skip xmlns attributes for JSX
                if (p1.startsWith('xmlns')) return match;
                // Convert kebab-case to camelCase
                const camelCase = p1.replace(/-([a-z])/g, (m, p) => p.toUpperCase());
                return camelCase + '=';
            })
            // Replace class with className
            .replace(/class=/g, 'className=')
            // Convert self-closing tags
            .replace(/<(\w+)([^>]*)\/>/g, (match, p1, p2) => `<${p1}${p2}></${p1}>`);
        
        return `import React from 'react';\n\nconst SvgComponent = () => (\n  ${jsxCode}\n);\n\nexport default SvgComponent;`;
    }

    function convertToVue(svgString) {
        return `<template>\n  ${svgString}\n</template>\n\n<script>\nexport default {\n  name: 'SvgIcon'\n};\n</script>`;
    }

    function convertToAngular(svgString) {
        return `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-svg-icon',\n  template: \`\n  ${svgString}\n  \`,\n  styles: []\n})\nexport class SvgIconComponent {}\n`;
    }

    function rotateSvg(degrees) {
        rotation = (rotation + degrees) % 360;
        applyTransform();
    }

    function flipSvg(direction) {
        if (direction === 'horizontal') {
            scaleX *= -1;
        } else if (direction === 'vertical') {
            scaleY *= -1;
        }
        applyTransform();
    }

    function applyTransform() {
        if (!svgElement) return;
        
        // Apply transforms to the SVG
        svgElement.style.transform = `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
        
        // Update current SVG string
        currentSvgString = svgPreview.innerHTML;
        
        // Update code views
        updateCodeViews();
    }

    function updateDimensions(e) {
        if (!svgElement) return;
        
        const target = e.target;
        const value = parseFloat(target.value);
        
        if (isNaN(value) || value <= 0) return;
        
        if (target === widthInput) {
            svgElement.setAttribute('width', value);
            
            if (aspectRatioLock.checked) {
                const newHeight = value / aspectRatio;
                svgElement.setAttribute('height', newHeight);
                heightInput.value = newHeight.toFixed(2);
            }
        } else if (target === heightInput) {
            svgElement.setAttribute('height', value);
            
            if (aspectRatioLock.checked) {
                const newWidth = value * aspectRatio;
                svgElement.setAttribute('width', newWidth);
                widthInput.value = newWidth.toFixed(2);
            }
        }
        
        // Update current SVG string
        currentSvgString = svgPreview.innerHTML;
        
        // Update code views
        updateCodeViews();
    }

    function updateBackgroundColor() {
        const color = backgroundColorInput.value;
        backgroundColorText.value = color;
        
        if (document.querySelector('.pattern-btn[data-pattern="color"]').classList.contains('active')) {
            svgPreview.style.backgroundColor = color;
        }
    }

    function updateBackgroundColorFromText() {
        const color = backgroundColorText.value;
        
        try {
            // Test if it's a valid color
            const testElement = document.createElement('div');
            testElement.style.color = color;
            
            if (testElement.style.color) {
                backgroundColorInput.value = color;
                
                if (document.querySelector('.pattern-btn[data-pattern="color"]').classList.contains('active')) {
                    svgPreview.style.backgroundColor = color;
                }
            }
        } catch (error) {
            console.error('Invalid color', error);
        }
    }

    function optimizeSvg() {
        if (!originalSvgString) return;
        
        // Basic optimization - remove comments, extra spaces, and newlines
        let optimized = originalSvgString
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
            .trim();
        
        // Update SVG
        currentSvgString = optimized;
        svgPreview.innerHTML = optimized;
        svgElement = svgPreview.querySelector('svg');
        
        // Update code views
        updateCodeViews();
        
        // Show success message
        showToast('SVG optimized', 'success');
    }

    function prettifySvg() {
        if (!originalSvgString) return;
        
        try {
            // Create parser and serializer
            const parser = new DOMParser();
            const serializer = new XMLSerializer();
            
            // Parse SVG string
            const svgDoc = parser.parseFromString(originalSvgString, 'image/svg+xml');
            
            // Serialize with indentation (manually adding indentation since XMLSerializer doesn't support it)
            let prettified = serializer.serializeToString(svgDoc)
                .replace(/></g, '>\n<') // Add newlines between tags
                .replace(/<(\w+)([^>]*)><\/\1>/g, '<$1$2/>') // Convert empty elements to self-closing
                .replace(/<(\w+)([^>]*)>/g, (match, p1, p2) => {
                    // Add indentation to opening tags
                    return match;
                });
            
            // Update SVG
            currentSvgString = prettified;
            svgPreview.innerHTML = prettified;
            svgElement = svgPreview.querySelector('svg');
            
            // Update code views
            updateCodeViews();
            
            // Show success message
            showToast('SVG prettified', 'success');
        } catch (error) {
            showToast('Error prettifying SVG', 'error');
            console.error(error);
        }
    }

    function exportSvg() {
        if (!currentSvgString) return;
        
        // Create blob and download link
        const blob = new Blob([currentSvgString], { type: 'image/svg+xml' });
        downloadBlob(blob, 'exported-svg.svg');
        
        // Show success message
        showToast('SVG exported', 'success');
    }

    function exportPng() {
        if (!svgElement) return;
        
        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            const width = parseFloat(widthInput.value) || originalWidth;
            const height = parseFloat(heightInput.value) || originalHeight;
            canvas.width = width;
            canvas.height = height;
            
            // Draw background if not transparent
            if (document.querySelector('.pattern-btn[data-pattern="color"]').classList.contains('active')) {
                ctx.fillStyle = backgroundColorInput.value;
                ctx.fillRect(0, 0, width, height);
            }
            
            // Convert SVG to data URL
            const svgBlob = new Blob([currentSvgString], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // Create image from SVG
            const img = new Image();
            img.onload = () => {
                // Draw SVG on canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert canvas to PNG
                canvas.toBlob(blob => {
                    downloadBlob(blob, 'exported-svg.png');
                });
            };
            
            img.src = svgUrl;
        } catch (e) {
            console.error('Error exporting PNG:', e);
            showToast('Error exporting PNG. Please try again.', 'error');
        }
    }

    function exportDataUri() {
        if (!currentSvgString) return;
        
        try {
            // Convert SVG to data URI
            const svgText = prettifySvgCode(currentSvgString)
                .replace(/"/g, "'")
                .replace(/#/g, '%23')
                .replace(/\n/g, '')
                .replace(/\s+/g, ' ');
            
            const dataUri = `data:image/svg+xml,${encodeURIComponent(svgText)}`;
            
            // Copy to clipboard
            copyToClipboard(dataUri, 'Data URI copied to clipboard!');
            
            // Create a preview link
            const previewBox = document.createElement('div');
            previewBox.style.position = 'fixed';
            previewBox.style.top = '50%';
            previewBox.style.left = '50%';
            previewBox.style.transform = 'translate(-50%, -50%)';
            previewBox.style.backgroundColor = 'white';
            previewBox.style.padding = '1rem';
            previewBox.style.borderRadius = '8px';
            previewBox.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            previewBox.style.zIndex = '1000';
            previewBox.style.maxWidth = '80%';
            previewBox.style.wordBreak = 'break-all';
            
            // Add content
            const title = document.createElement('h3');
            title.textContent = 'Data URI (copied to clipboard)';
            title.style.marginBottom = '1rem';
            
            const uriText = document.createElement('div');
            uriText.style.fontSize = '0.8rem';
            uriText.style.maxHeight = '150px';
            uriText.style.overflowY = 'auto';
            uriText.style.padding = '0.5rem';
            uriText.style.backgroundColor = '#f3f4f6';
            uriText.style.borderRadius = '4px';
            uriText.textContent = dataUri;
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.marginTop = '1rem';
            closeBtn.style.padding = '0.5rem 1rem';
            closeBtn.style.backgroundColor = '#3b82f6';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '4px';
            closeBtn.style.cursor = 'pointer';
            
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(previewBox);
            });
            
            previewBox.appendChild(title);
            previewBox.appendChild(uriText);
            previewBox.appendChild(closeBtn);
            
            document.body.appendChild(previewBox);
        } catch (e) {
            console.error('Error creating data URI:', e);
            showToast('Error creating data URI. Please try again.', 'error');
        }
    }

    function copyToClipboard(text, message = 'Copied to clipboard!') {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast(message, 'success');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                showToast('Error copying to clipboard. Please try again.', 'error');
            });
    }

    function showToast(message, type = '') {
        // Clear any existing timeout
        clearTimeout(toast.timeout);
        
        // Set message and type
        toast.textContent = message;
        toast.className = 'toast';
        
        if (type) {
            toast.classList.add(type);
        }
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide after 3 seconds
        toast.timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function downloadBlob(blob, defaultName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = defaultName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function prettifySvgCode(svgString) {
        try {
            // Create parser and serializer
            const parser = new DOMParser();
            const serializer = new XMLSerializer();
            
            // Parse SVG string
            const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
            
            // Serialize with basic formatting
            return serializer.serializeToString(svgDoc)
                .replace(/></g, '>\n<')
                .trim();
        } catch (e) {
            console.error('Error prettifying SVG code:', e);
            return svgString;
        }
    }
    
    // Initialize
    // Input method tabs
    inputMethodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            inputMethodTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all content
            inputMethodContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show corresponding content
            const target = tab.getAttribute('data-target');
            document.getElementById(target).style.display = 'block';
        });
    });
    
    // Code view tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show corresponding content
            const target = btn.getAttribute('data-target');
            document.getElementById(target).style.display = 'block';
        });
    });
    
    // File input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drop zone
    dropZone.addEventListener('click', triggerFileInput);
    
    document.querySelector('.browse-text').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerFileInput();
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Paste SVG code
    loadSvgBtn.addEventListener('click', () => {
        const svgCodeText = svgTextarea.value.trim();
        if (svgCodeText) {
            loadSvgFromString(svgCodeText);
        } else {
            showToast('Please enter SVG code', 'error');
        }
    });

    // Transform controls
    rotateLeftBtn.addEventListener('click', () => rotateSvg(-90));
    rotateRightBtn.addEventListener('click', () => rotateSvg(90));
    flipHorizontalBtn.addEventListener('click', () => flipSvg('horizontal'));
    flipVerticalBtn.addEventListener('click', () => flipSvg('vertical'));
    
    // Dimension controls
    widthInput.addEventListener('change', updateDimensions);
    heightInput.addEventListener('input', updateDimensions);
    
    // Background controls
    backgroundColorInput.addEventListener('input', updateBackgroundColor);
    backgroundColorText.addEventListener('change', updateBackgroundColorFromText);
    
    patternBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            patternBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const pattern = btn.getAttribute('data-pattern');
            if (pattern === 'transparent') {
                svgPreview.style.backgroundImage = 'none';
                svgPreview.style.backgroundColor = 'transparent';
                svgPreview.classList.add('grid-bg');
            } else if (pattern === 'color') {
                svgPreview.classList.remove('grid-bg');
                svgPreview.style.backgroundImage = 'none';
                svgPreview.style.backgroundColor = backgroundColorInput.value;
            } else if (pattern === 'grid') {
                svgPreview.classList.add('grid-bg');
                svgPreview.style.backgroundImage = 'none';
                svgPreview.style.backgroundColor = 'transparent';
            }
        });
    });
    
    // SVG actions
    optimizeBtn.addEventListener('click', optimizeSvg);
    prettifyBtn.addEventListener('click', prettifySvg);
    
    // Export buttons
    svgExportBtn.addEventListener('click', exportSvg);
    pngExportBtn.addEventListener('click', exportPng);
    dataUriExportBtn.addEventListener('click', exportDataUri);
    
    // Copy buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            const element = document.getElementById(targetId);
            if (element) {
                copyToClipboard(element.textContent);
            }
        });
    });

    // Initial setup
    const transparentPatternBtn = document.getElementById('bg-none');
    if (transparentPatternBtn) {
        transparentPatternBtn.classList.add('active');
        svgPreview.classList.add('grid-bg');
    }
    
    backgroundColorInput.value = '#ffffff';
    backgroundColorText.value = '#ffffff';
}); 