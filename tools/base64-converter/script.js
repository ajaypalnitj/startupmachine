document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const characterCount = document.getElementById('character-count');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const encodeOptions = document.querySelector('.encode-options');
    const decodeOptions = document.querySelector('.decode-options');
    
    // Encode options
    const encodeUrlSafe = document.getElementById('encode-url-safe');
    const encodeNoPadding = document.getElementById('encode-no-padding');
    
    // Decode options
    const decodeUrlSafe = document.getElementById('decode-url-safe');
    const decodeFixPadding = document.getElementById('decode-fix-padding');
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Current mode (encode or decode)
    let currentMode = 'encode';
    
    // File data
    let fileData = null;
    let fileName_original = '';
    
    // Initialize
    updateCharacterCount();
    
    // Event Listeners
    inputText.addEventListener('input', function() {
        updateCharacterCount();
        fileData = null;
        fileName_original = '';
        fileName.textContent = 'No file chosen';
        downloadBtn.disabled = true;
    });
    
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadResult);
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Accordion functionality
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            accordionItem.classList.toggle('active');
        });
    });
    
    // Functions
    function updateCharacterCount() {
        const text = inputText.value;
        const count = text.length;
        characterCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }
    
    function switchTab(tab) {
        currentMode = tab;
        
        // Update tab buttons
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tab) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Show/hide appropriate options
        if (tab === 'encode') {
            encodeOptions.classList.remove('hidden');
            decodeOptions.classList.add('hidden');
            convertBtn.textContent = 'Encode';
        } else {
            encodeOptions.classList.add('hidden');
            decodeOptions.classList.remove('hidden');
            convertBtn.textContent = 'Decode';
        }
        
        // Clear result when switching tabs
        resultText.textContent = '';
        downloadBtn.disabled = true;
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        fileName_original = file.name;
        fileName.textContent = file.name;
        
        const reader = new FileReader();
        
        if (currentMode === 'encode') {
            reader.readAsArrayBuffer(file);
            reader.onload = function(e) {
                fileData = e.target.result;
                inputText.value = `[Binary file: ${file.name} (${formatFileSize(file.size)})]`;
                updateCharacterCount();
            };
        } else {
            reader.readAsText(file);
            reader.onload = function(e) {
                fileData = null;
                inputText.value = e.target.result;
                updateCharacterCount();
            };
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    function handleConversion() {
        let input = inputText.value;
        
        if (!input.trim() && !fileData) {
            showToast('Please enter some text or upload a file', 'error');
            return;
        }
        
        let result;
        try {
            if (currentMode === 'encode') {
                if (fileData) {
                    result = encodeFile(fileData);
                } else {
                    result = encodeText(input);
                }
                downloadBtn.disabled = false;
            } else {
                result = decodeBase64(input);
                // Check if result is binary data
                if (isBinaryData(result)) {
                    resultText.textContent = '[Binary data - use Download button to save]';
                    downloadBtn.disabled = false;
                    return;
                } else {
                    downloadBtn.disabled = false;
                }
            }
            
            resultText.textContent = result;
            showToast(`${currentMode === 'encode' ? 'Encoding' : 'Decoding'} successful`, 'success');
        } catch (error) {
            resultText.textContent = `Error: ${error.message}`;
            showToast(`Failed to ${currentMode}: ${error.message}`, 'error');
            downloadBtn.disabled = true;
        }
    }
    
    function encodeText(text) {
        // Convert text to base64
        let base64;
        
        try {
            base64 = btoa(unescape(encodeURIComponent(text)));
            
            // Apply URL-safe encoding if selected
            if (encodeUrlSafe.checked) {
                base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
            }
            
            // Remove padding if selected
            if (encodeNoPadding.checked) {
                base64 = base64.replace(/=+$/, '');
            }
            
            return base64;
        } catch (e) {
            throw new Error('Invalid input for Base64 encoding');
        }
    }
    
    function encodeFile(arrayBuffer) {
        // Convert array buffer to base64
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;
        
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        let base64 = btoa(binary);
        
        // Apply URL-safe encoding if selected
        if (encodeUrlSafe.checked) {
            base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
        }
        
        // Remove padding if selected
        if (encodeNoPadding.checked) {
            base64 = base64.replace(/=+$/, '');
        }
        
        return base64;
    }
    
    function decodeBase64(base64) {
        // Handle URL-safe encoding if selected
        if (decodeUrlSafe.checked) {
            base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
        }
        
        // Fix padding if selected
        if (decodeFixPadding.checked) {
            // Add padding if needed
            while (base64.length % 4 !== 0) {
                base64 += '=';
            }
        }
        
        try {
            // Try to decode as text
            const decoded = atob(base64);
            
            // Check if the result is binary
            if (isBinaryData(decoded)) {
                // Return binary data
                return decoded;
            }
            
            // Try to convert to UTF-8
            try {
                return decodeURIComponent(escape(decoded));
            } catch (e) {
                // If UTF-8 conversion fails, return the raw decoded data
                return decoded;
            }
        } catch (e) {
            throw new Error('Invalid Base64 input');
        }
    }
    
    function isBinaryData(string) {
        // Check if the string contains a significant number of non-printable characters
        let nonPrintable = 0;
        const threshold = 0.1; // 10% threshold
        
        for (let i = 0; i < string.length; i++) {
            const code = string.charCodeAt(i);
            // Check for non-printable characters (except common whitespace)
            if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126) {
                nonPrintable++;
            }
            
            // Early exit if we've already checked enough characters
            if (i > 100 && nonPrintable / i > threshold) {
                return true;
            }
        }
        
        return nonPrintable / string.length > threshold;
    }
    
    function downloadResult() {
        let content = resultText.textContent;
        
        // If content indicates binary data, use the decoded binary data
        if (content === '[Binary data - use Download button to save]') {
            try {
                const base64 = inputText.value;
                let modifiedBase64 = base64;
                
                // Handle URL-safe encoding if selected
                if (decodeUrlSafe.checked) {
                    modifiedBase64 = modifiedBase64.replace(/-/g, '+').replace(/_/g, '/');
                }
                
                // Fix padding if selected
                if (decodeFixPadding.checked) {
                    // Add padding if needed
                    while (modifiedBase64.length % 4 !== 0) {
                        modifiedBase64 += '=';
                    }
                }
                
                const binaryString = atob(modifiedBase64);
                const bytes = new Uint8Array(binaryString.length);
                
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const blob = new Blob([bytes], { type: 'application/octet-stream' });
                downloadBlob(blob, 'decoded_file');
                return;
            } catch (e) {
                showToast('Failed to download binary data', 'error');
                return;
            }
        }
        
        // For text content
        if (currentMode === 'encode') {
            // For encoded content
            const blob = new Blob([content], { type: 'text/plain' });
            let downloadName = fileName_original ? `${fileName_original}.b64` : 'encoded.b64';
            downloadBlob(blob, downloadName);
        } else {
            // For decoded text content
            const blob = new Blob([content], { type: 'text/plain' });
            downloadBlob(blob, 'decoded.txt');
        }
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
        showToast('Download started', 'success');
    }
    
    function clearAll() {
        inputText.value = '';
        resultText.textContent = '';
        fileData = null;
        fileName_original = '';
        fileName.textContent = 'No file chosen';
        fileInput.value = '';
        updateCharacterCount();
        downloadBtn.disabled = true;
    }
    
    function copyToClipboard() {
        const textToCopy = resultText.textContent;
        
        if (!textToCopy || textToCopy === '[Binary data - use Download button to save]') {
            showToast('Nothing to copy or binary data cannot be copied', 'error');
            return;
        }
        
        // Use the Clipboard API if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast('Copied to clipboard!', 'success');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showToast('Failed to copy to clipboard', 'error');
                });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast('Copied to clipboard!', 'success');
                } else {
                    showToast('Failed to copy to clipboard', 'error');
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy to clipboard', 'error');
            }
            
            document.body.removeChild(textarea);
        }
    }
    
    function showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to body
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}); 