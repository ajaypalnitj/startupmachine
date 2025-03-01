// SVG Optimizer Tool
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const fileCounter = document.getElementById('file-counter');
    const startBtn = document.getElementById('start-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const svgResults = document.getElementById('svg-results');
    const resultsContainer = document.getElementById('results-container');
    
    // Optimization options
    const removeComments = document.getElementById('remove-comments');
    const removeMetadata = document.getElementById('remove-metadata');
    const removeUnusedIds = document.getElementById('remove-unused-ids');
    const removeEmptyAttrs = document.getElementById('remove-empty-attrs');
    const collapseGroups = document.getElementById('collapse-groups');
    const roundPrecision = document.getElementById('round-precision');
    const precisionSlider = document.getElementById('precision-slider');
    const precisionValue = document.getElementById('precision-value');
    const precisionContainer = document.getElementById('precision-container');
    
    // Variables
    const MAX_FILES = 10;
    let svgFiles = [];
    let optimizedSvgs = [];
    
    // Event Listeners
    fileInput.addEventListener('change', handleFiles);
    dropZone.addEventListener('click', () => fileInput.click());
    startBtn.addEventListener('click', optimizeSvgs);
    downloadAllBtn.addEventListener('click', downloadAllSvgs);
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Precision slider
    precisionSlider.addEventListener('input', updatePrecisionValue);
    roundPrecision.addEventListener('change', togglePrecisionSlider);
    
    // Initialize
    togglePrecisionSlider();
    updateFileCounter();
    
    // Functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropZone.classList.add('drag-over');
    }
    
    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
    
    function handleFiles(e) {
        const newFiles = Array.from(e.target.files).filter(file => {
            return file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
        });
        
        if (newFiles.length === 0) {
            showToast('Please select valid SVG files.', 'error');
            return;
        }
        
        const totalFiles = svgFiles.length + newFiles.length;
        
        if (totalFiles > MAX_FILES) {
            showToast(`You can only upload up to ${MAX_FILES} files. Only the first ${MAX_FILES - svgFiles.length} will be processed.`, 'error');
            
            // Only add files up to the maximum limit
            const filesRemaining = MAX_FILES - svgFiles.length;
            svgFiles = [...svgFiles, ...newFiles.slice(0, filesRemaining)];
        } else {
            svgFiles = [...svgFiles, ...newFiles];
        }
        
        updateFileCounter();
        
        // Reset file input
        if (e.target.files) {
            e.target.value = '';
        }
        
        startBtn.disabled = svgFiles.length === 0;
        
        // Show the results container when files are added
        if (svgFiles.length > 0) {
            resultsContainer.style.display = 'block';
        }
    }
    
    function updatePrecisionValue() {
        precisionValue.textContent = precisionSlider.value;
    }
    
    function togglePrecisionSlider() {
        if (roundPrecision.checked) {
            precisionContainer.style.display = 'flex';
        } else {
            precisionContainer.style.display = 'none';
        }
    }
    
    function updateFileCounter() {
        if (svgFiles.length === 0) {
            fileCounter.textContent = '';
            return;
        }
        
        let counterText = `${svgFiles.length} SVG file${svgFiles.length !== 1 ? 's' : ''} selected`;
        if (svgFiles.length === MAX_FILES) {
            counterText += ' (maximum)';
        }
        
        fileCounter.textContent = counterText;
    }
    
    function optimizeSvgs() {
        if (svgFiles.length === 0) {
            showToast('Please select SVG files to optimize.', 'error');
            return;
        }
        
        // Clear previous results
        svgResults.innerHTML = '';
        optimizedSvgs = [];
        
        // Disable the start button while processing
        startBtn.disabled = true;
        startBtn.textContent = 'OPTIMIZING...';
        
        // Get optimization options
        const options = {
            removeComments: removeComments.checked,
            removeMetadata: removeMetadata.checked,
            removeUnusedIds: removeUnusedIds.checked,
            removeEmptyAttrs: removeEmptyAttrs.checked,
            collapseGroups: collapseGroups.checked,
            roundPrecision: roundPrecision.checked ? parseInt(precisionSlider.value) : false
        };
        
        // Process each SVG file
        const promises = svgFiles.map(file => processSvgFile(file, options));
        
        Promise.all(promises)
            .then(() => {
                // Re-enable the start button
                startBtn.disabled = false;
                startBtn.textContent = 'OPTIMIZE SVG';
                
                // Enable download all button if there are results
                downloadAllBtn.disabled = optimizedSvgs.length === 0;
                
                // Show success message
                if (optimizedSvgs.length > 0) {
                    showToast(`Successfully optimized ${optimizedSvgs.length} SVG file${optimizedSvgs.length !== 1 ? 's' : ''}.`, 'success');
                }
                
                // Make sure the results container is visible
                resultsContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error optimizing SVGs:', error);
                showToast('An error occurred while optimizing SVGs.', 'error');
                
                // Re-enable the start button
                startBtn.disabled = false;
                startBtn.textContent = 'OPTIMIZE SVG';
            });
    }
    
    function processSvgFile(file, options) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const originalSvgContent = e.target.result;
                    let optimizedSvgContent;
                    
                    try {
                        optimizedSvgContent = optimizeSvg(originalSvgContent, options);
                    } catch (optimizeError) {
                        console.error('Error optimizing SVG:', optimizeError);
                        showToast(`Error optimizing file: ${file.name}. Using original content.`, 'error');
                        optimizedSvgContent = originalSvgContent;
                    }
                    
                    const originalSize = new Blob([originalSvgContent]).size;
                    const optimizedSize = new Blob([optimizedSvgContent]).size;
                    const savings = originalSize - optimizedSize;
                    const savingsPercentage = Math.round((savings / originalSize) * 100);
                    
                    // Create result item
                    const resultItem = createResultItem(
                        file.name,
                        originalSize,
                        optimizedSize,
                        savingsPercentage,
                        originalSvgContent,
                        optimizedSvgContent
                    );
                    
                    svgResults.appendChild(resultItem);
                    
                    // Add to optimized SVGs array
                    optimizedSvgs.push({
                        name: file.name,
                        content: optimizedSvgContent
                    });
                } catch (error) {
                    console.error('Error processing SVG:', error);
                    showToast(`Error processing file: ${file.name}`, 'error');
                }
                
                resolve();
            };
            
            reader.onerror = function() {
                showToast(`Error reading file: ${file.name}`, 'error');
                resolve();
            };
            
            reader.readAsText(file);
        });
    }
    
    function optimizeSvg(svgContent, options) {
        let optimized = svgContent;
        
        try {
            // Remove comments
            if (options.removeComments) {
                optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
            }
            
            // Remove metadata
            if (options.removeMetadata) {
                optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/g, '');
                optimized = optimized.replace(/<\?xml.*\?>/g, '');
            }
            
            // Remove unused IDs
            if (options.removeUnusedIds) {
                optimized = removeUnusedIdentifiers(optimized);
            }
            
            // Remove empty attributes
            if (options.removeEmptyAttrs) {
                optimized = optimized.replace(/\s+(\w+)=""/g, '');
            }
            
            // Collapse empty groups
            if (options.collapseGroups) {
                optimized = collapseEmptyGroups(optimized);
            }
            
            // Round numeric values
            if (options.roundPrecision !== false) {
                optimized = roundNumericValues(optimized, options.roundPrecision);
            }
            
            return optimized;
        } catch (error) {
            console.error('Error during SVG optimization:', error);
            return svgContent; // Return original content if optimization fails
        }
    }
    
    function removeUnusedIdentifiers(svgContent) {
        try {
            // Parse SVG content
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, 'image/svg+xml');
            
            // Find all elements with IDs
            const elementsWithIds = doc.querySelectorAll('[id]');
            
            // Collect all IDs
            const allIds = new Set();
            elementsWithIds.forEach(el => {
                allIds.add(el.getAttribute('id'));
            });
            
            // Find all references to IDs
            const svgString = new XMLSerializer().serializeToString(doc);
            const usedIds = new Set();
            
            // Check for url(#id) references
            const urlRefRegex = /url\(#([^)]+)\)/g;
            let match;
            while ((match = urlRefRegex.exec(svgString)) !== null) {
                usedIds.add(match[1]);
            }
            
            // Check for href="#id" references
            const hrefRegex = /href="#([^"]+)"/g;
            while ((match = hrefRegex.exec(svgString)) !== null) {
                usedIds.add(match[1]);
            }
            
            // Check for xlink:href="#id" references
            const xlinkHrefRegex = /xlink:href="#([^"]+)"/g;
            while ((match = xlinkHrefRegex.exec(svgString)) !== null) {
                usedIds.add(match[1]);
            }
            
            // Remove unused IDs
            elementsWithIds.forEach(el => {
                const id = el.getAttribute('id');
                if (!usedIds.has(id)) {
                    el.removeAttribute('id');
                }
            });
            
            // Serialize back to string
            return new XMLSerializer().serializeToString(doc);
        } catch (error) {
            console.error('Error removing unused IDs:', error);
            return svgContent; // Return original content if removal fails
        }
    }
    
    function collapseEmptyGroups(svgContent) {
        try {
            // Parse SVG content
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgContent, 'image/svg+xml');
            
            // Find all group elements
            const groups = doc.querySelectorAll('g');
            
            // Check each group
            groups.forEach(group => {
                // Check if the group has no attributes other than id
                const hasAttributes = Array.from(group.attributes).some(attr => 
                    attr.name !== 'id' && attr.name !== 'class'
                );
                
                // Check if the group has transform or style
                const hasTransform = group.hasAttribute('transform');
                const hasStyle = group.hasAttribute('style');
                
                // If the group has no attributes, transform, or style, and has children, replace it with its children
                if (!hasAttributes && !hasTransform && !hasStyle && group.children.length > 0) {
                    const parent = group.parentNode;
                    const fragment = doc.createDocumentFragment();
                    
                    // Move all children to the fragment
                    while (group.firstChild) {
                        fragment.appendChild(group.firstChild);
                    }
                    
                    // Replace the group with its children
                    parent.replaceChild(fragment, group);
                }
            });
            
            // Serialize back to string
            return new XMLSerializer().serializeToString(doc);
        } catch (error) {
            console.error('Error collapsing empty groups:', error);
            return svgContent; // Return original content if collapsing fails
        }
    }
    
    function roundNumericValues(svgContent, precision) {
        try {
            // Round numeric values in attributes
            const attrRegex = /(\s+[\w:-]+=")([^"]*?)(")/g;
            svgContent = svgContent.replace(attrRegex, (match, prefix, value, suffix) => {
                // Check if the value contains numbers with decimals
                if (/[0-9]+\.[0-9]+/.test(value)) {
                    // Replace each number with its rounded version
                    const roundedValue = value.replace(/([0-9]+\.[0-9]+)/g, num => {
                        return parseFloat(num).toFixed(precision);
                    });
                    return prefix + roundedValue + suffix;
                }
                return match;
            });
            
            // Round numeric values in path data
            const pathRegex = /(<path[^>]*d=")([^"]*?)(")/g;
            svgContent = svgContent.replace(pathRegex, (match, prefix, pathData, suffix) => {
                // Replace each number with its rounded version
                const roundedPathData = pathData.replace(/(-?[0-9]+\.[0-9]+)(?=[\s,]|$)/g, num => {
                    return parseFloat(num).toFixed(precision);
                });
                return prefix + roundedPathData + suffix;
            });
            
            return svgContent;
        } catch (error) {
            console.error('Error rounding numeric values:', error);
            return svgContent; // Return original content if rounding fails
        }
    }
    
    function createResultItem(fileName, originalSize, optimizedSize, savingsPercentage, originalSvgContent, optimizedSvgContent) {
        const resultItem = document.createElement('div');
        resultItem.className = 'svg-result-item';
        
        // Create tabs for original and optimized SVG
        const tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        
        const originalTab = document.createElement('button');
        originalTab.className = 'tab-button active';
        originalTab.textContent = 'Original';
        originalTab.dataset.tab = 'original';
        
        const optimizedTab = document.createElement('button');
        optimizedTab.className = 'tab-button';
        optimizedTab.textContent = 'Optimized';
        optimizedTab.dataset.tab = 'optimized';
        
        tabContainer.appendChild(originalTab);
        tabContainer.appendChild(optimizedTab);
        
        // Create SVG preview container
        const svgPreview = document.createElement('div');
        svgPreview.className = 'svg-preview';
        
        // Add tabs to preview
        svgPreview.appendChild(tabContainer);
        
        // Create content containers for original and optimized SVGs
        const originalContent = document.createElement('div');
        originalContent.className = 'svg-content active';
        originalContent.dataset.content = 'original';
        originalContent.innerHTML = originalSvgContent;
        
        const optimizedContent = document.createElement('div');
        optimizedContent.className = 'svg-content';
        optimizedContent.dataset.content = 'optimized';
        optimizedContent.innerHTML = optimizedSvgContent;
        
        svgPreview.appendChild(originalContent);
        svgPreview.appendChild(optimizedContent);
        
        // Add event listeners to tabs
        originalTab.addEventListener('click', () => switchTab(resultItem, 'original'));
        optimizedTab.addEventListener('click', () => switchTab(resultItem, 'optimized'));
        
        // Create SVG info
        const svgInfo = document.createElement('div');
        svgInfo.className = 'svg-info';
        
        const svgName = document.createElement('div');
        svgName.className = 'svg-name';
        svgName.textContent = fileName;
        
        const svgStats = document.createElement('div');
        svgStats.className = 'svg-stats';
        
        const originalSizeText = document.createElement('div');
        originalSizeText.textContent = `Original: ${formatBytes(originalSize)}`;
        
        const optimizedSizeText = document.createElement('div');
        optimizedSizeText.textContent = `Optimized: ${formatBytes(optimizedSize)}`;
        
        const savingsText = document.createElement('div');
        savingsText.className = 'savings';
        savingsText.textContent = `Saved: ${formatBytes(originalSize - optimizedSize)} (${savingsPercentage}%)`;
        
        svgStats.appendChild(originalSizeText);
        svgStats.appendChild(optimizedSizeText);
        svgStats.appendChild(savingsText);
        
        svgInfo.appendChild(svgName);
        svgInfo.appendChild(svgStats);
        
        // Create SVG actions
        const svgActions = document.createElement('div');
        svgActions.className = 'svg-actions';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => downloadSvg(fileName, optimizedSvgContent));
        
        svgActions.appendChild(downloadBtn);
        
        // Assemble result item
        resultItem.appendChild(svgPreview);
        resultItem.appendChild(svgInfo);
        resultItem.appendChild(svgActions);
        
        return resultItem;
    }
    
    function switchTab(resultItem, tabName) {
        // Update tab buttons
        const tabButtons = resultItem.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update content visibility
        const contentDivs = resultItem.querySelectorAll('.svg-content');
        contentDivs.forEach(div => {
            if (div.dataset.content === tabName) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    }
    
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    function downloadSvg(fileName, svgContent) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.replace(/\.svg$/, '') + '-optimized.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    function downloadAllSvgs() {
        if (optimizedSvgs.length === 0) {
            showToast('No optimized SVGs to download.', 'error');
            return;
        }
        
        if (optimizedSvgs.length === 1) {
            // If there's only one SVG, download it directly
            downloadSvg(optimizedSvgs[0].name, optimizedSvgs[0].content);
            return;
        }
        
        // Create a zip file with all optimized SVGs
        const zip = new JSZip();
        
        optimizedSvgs.forEach(svg => {
            const fileName = svg.name.replace(/\.svg$/, '') + '-optimized.svg';
            zip.file(fileName, svg.content);
        });
        
        zip.generateAsync({ type: 'blob' })
            .then(content => {
                const url = URL.createObjectURL(content);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'optimized-svgs.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error creating zip file:', error);
                showToast('Error creating zip file.', 'error');
            });
    }
    
    function showToast(message, type = 'info') {
        // Check if toast container exists, create if not
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toastContainer.removeChild(toast);
                
                // Remove container if empty
                if (toastContainer.children.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }, 300);
        });
        
        toast.appendChild(closeBtn);
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('hiding');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toastContainer.removeChild(toast);
                        
                        // Remove container if empty
                        if (toastContainer.children.length === 0 && toastContainer.parentNode) {
                            document.body.removeChild(toastContainer);
                        }
                    }
                }, 300);
            }
        }, 5000);
    }
}); 