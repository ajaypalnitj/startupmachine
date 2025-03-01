document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const characterCount = document.getElementById('character-count');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const encodeOptions = document.querySelector('.encode-options');
    const decodeOptions = document.querySelector('.decode-options');
    
    // Encode options
    const encodeSpecial = document.getElementById('encode-special');
    const encodeExtended = document.getElementById('encode-extended');
    const encodeNumeric = document.getElementById('encode-numeric');
    
    // Decode options
    const decodeAll = document.getElementById('decode-all');
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Current mode (encode or decode)
    let currentMode = 'encode';
    
    // Initialize
    updateCharacterCount();
    
    // Event Listeners
    inputText.addEventListener('input', updateCharacterCount);
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyToClipboard);
    
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
    }
    
    function handleConversion() {
        const text = inputText.value;
        
        if (!text.trim()) {
            showToast('Please enter some text to convert', 'error');
            return;
        }
        
        let result;
        if (currentMode === 'encode') {
            result = encodeHtmlEntities(text);
        } else {
            result = decodeHtmlEntities(text);
        }
        
        resultText.textContent = result;
        showToast(`Text ${currentMode}d successfully`, 'success');
    }
    
    function encodeHtmlEntities(text) {
        // Special characters to always encode
        const specialChars = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        let result = '';
        
        // Process each character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const code = char.charCodeAt(0);
            
            // Check if it's a special character that should always be encoded
            if (encodeSpecial.checked && specialChars[char]) {
                result += encodeNumeric.checked ? 
                    `&#${code};` : 
                    specialChars[char];
            }
            // Check if it's an extended character (non-ASCII)
            else if (encodeExtended.checked && code > 127) {
                // Use numeric entities for all extended characters
                result += `&#${code};`;
            }
            // Otherwise, keep the character as is
            else {
                result += char;
            }
        }
        
        return result;
    }
    
    function decodeHtmlEntities(text) {
        // Create a temporary element
        const tempElement = document.createElement('div');
        
        // Set the HTML content (browser will decode entities)
        tempElement.innerHTML = text;
        
        // Get the decoded text
        return tempElement.textContent;
    }
    
    function clearAll() {
        inputText.value = '';
        resultText.textContent = '';
        updateCharacterCount();
    }
    
    function copyToClipboard() {
        const textToCopy = resultText.textContent;
        
        if (!textToCopy) {
            showToast('Nothing to copy', 'error');
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