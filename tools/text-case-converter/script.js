// Text Case Converter Tool

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const optionBtns = document.querySelectorAll('.option-btn');
    const characterCount = document.getElementById('character-count');
    const wordCount = document.getElementById('word-count');
    
    let activeCase = null;
    
    // Set up event listeners
    inputText.addEventListener('input', function() {
        updateStats();
        if (activeCase) {
            convertText(activeCase);
        }
    });
    
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            optionBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the target case
            activeCase = this.getAttribute('data-case');
            
            // Convert text
            convertText(activeCase);
        });
    });
    
    copyBtn.addEventListener('click', function() {
        copyToClipboard();
    });
    
    // Update character and word count
    function updateStats() {
        const text = inputText.value;
        characterCount.textContent = `${text.length} character${text.length !== 1 ? 's' : ''}`;
        
        // Count words (split by whitespace and filter out empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordNum = words.length || 0;
        wordCount.textContent = `${wordNum} word${wordNum !== 1 ? 's' : ''}`;
    }
    
    // Convert text based on selected case
    function convertText(caseType) {
        const text = inputText.value;
        
        if (!text) {
            resultText.textContent = '';
            return;
        }
        
        let result = '';
        
        switch(caseType) {
            case 'lower':
                result = toLowerCase(text);
                break;
            case 'upper':
                result = toUpperCase(text);
                break;
            case 'title':
                result = toTitleCase(text);
                break;
            case 'sentence':
                result = toSentenceCase(text);
                break;
            case 'camel':
                result = toCamelCase(text);
                break;
            case 'pascal':
                result = toPascalCase(text);
                break;
            case 'snake':
                result = toSnakeCase(text);
                break;
            case 'kebab':
                result = toKebabCase(text);
                break;
            case 'constant':
                result = toConstantCase(text);
                break;
            case 'alternating':
                result = toAlternatingCase(text);
                break;
            case 'inverse':
                result = toInverseCase(text);
                break;
            case 'capitalize':
                result = toCapitalizedCase(text);
                break;
            default:
                result = text;
        }
        
        resultText.textContent = result;
    }
    
    // Copy text to clipboard
    function copyToClipboard() {
        const text = resultText.textContent;
        
        if (!text) return;
        
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy text', true);
            });
    }
    
    // Show toast notification
    function showToast(message, isError = false) {
        // Remove any existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        if (isError) {
            toast.style.backgroundColor = '#ef4444';
        }
        
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});

// Case conversion functions

// Convert to lowercase
function toLowerCase(text) {
    return text.toLowerCase();
}

// Convert to uppercase
function toUpperCase(text) {
    return text.toUpperCase();
}

// Convert to title case
function toTitleCase(text) {
    return text.replace(/\w\S*/g, function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

// Convert to sentence case
function toSentenceCase(text) {
    // Split text into sentences (ending with . ! ? followed by a space or newline)
    const sentences = text.split(/([.!?]\s+|\n)/);
    
    // Process each sentence or separator
    return sentences.map(function(sentence) {
        // If it's a separator, return it unchanged
        if (/[.!?]\s+|\n/.test(sentence)) {
            return sentence;
        }
        
        // Trim the sentence and check if it's empty
        const trimmed = sentence.trim();
        if (!trimmed) return sentence;
        
        // Capitalize first letter and lowercase the rest
        return sentence.charAt(0).toUpperCase() + sentence.substr(1).toLowerCase();
    }).join('');
}

// Convert to camel case
function toCamelCase(text) {
    // Normalize the text by replacing special characters and multiple spaces
    const normalized = text
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    // Split by spaces
    const words = normalized.split(' ');
    
    // Lowercase first word, capitalize the rest
    return words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

// Convert to pascal case
function toPascalCase(text) {
    // Similar to camel case but capitalize all words
    const normalized = text
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    const words = normalized.split(' ');
    
    return words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

// Convert to snake case
function toSnakeCase(text) {
    // Normalize and replace spaces with underscores
    return text
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\s/g, '_');
}

// Convert to kebab case
function toKebabCase(text) {
    // Similar to snake case but with hyphens
    return text
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\s/g, '-');
}

// Convert to constant case
function toConstantCase(text) {
    // Similar to snake case but uppercase
    return text
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase()
        .replace(/\s/g, '_');
}

// Convert to alternating case
function toAlternatingCase(text) {
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        // Alternate between lowercase and uppercase
        if (i % 2 === 0) {
            result += text[i].toLowerCase();
        } else {
            result += text[i].toUpperCase();
        }
    }
    
    return result;
}

// Convert to inverse case
function toInverseCase(text) {
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        // Switch case for each character
        if (char === char.toUpperCase()) {
            result += char.toLowerCase();
        } else {
            result += char.toUpperCase();
        }
    }
    
    return result;
}

// Capitalize each word (first letter only)
function toCapitalizedCase(text) {
    return text.replace(/\b\w/g, function(match) {
        return match.toUpperCase();
    });
} 