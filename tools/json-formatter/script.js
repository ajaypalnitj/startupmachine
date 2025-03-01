// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const validationResult = document.getElementById('validationResult');
const formatButton = document.getElementById('formatButton');
const validateButton = document.getElementById('validateButton');
const clearButton = document.getElementById('clearButton');
const sampleButton = document.getElementById('sampleButton');
const copyButton = document.getElementById('copyButton');
const downloadButton = document.getElementById('downloadButton');
const sortKeysCheckbox = document.getElementById('sortKeys');
const indentSizeInput = document.getElementById('indentSize');

// Sample JSON for the "Sample JSON" button
const sampleJSON = {
    "glossary": {
        "title": "example glossary",
        "GlossDiv": {
            "title": "S",
            "GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
                    "SortAs": "SGML",
                    "GlossTerm": "Standard Generalized Markup Language",
                    "Acronym": "SGML",
                    "Abbrev": "ISO 8879:1986",
                    "GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
                        "GlossSeeAlso": ["GML", "XML"]
                    },
                    "GlossSee": "markup"
                }
            }
        }
    },
    "numbers": [1, 2, 3, 4, 5],
    "boolean": true,
    "null": null,
    "date": "2023-01-01T00:00:00Z"
};

// Event Listeners
formatButton.addEventListener('click', formatJSON);
validateButton.addEventListener('click', validateJSON);
clearButton.addEventListener('click', clearInput);
sampleButton.addEventListener('click', loadSampleJSON);
copyButton.addEventListener('click', copyToClipboard);
downloadButton.addEventListener('click', downloadJSON);

// Format JSON
function formatJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showValidationMessage('Please enter JSON to format', false);
        return;
    }
    
    try {
        // Parse the JSON to validate it
        let parsedJSON = JSON.parse(input);
        
        // Format the JSON with the specified indent size
        const indentSize = parseInt(indentSizeInput.value) || 2;
        
        // Sort keys if the option is checked
        if (sortKeysCheckbox.checked) {
            parsedJSON = sortObjectKeys(parsedJSON);
        }
        
        // Convert back to string with proper formatting
        const formattedJSON = JSON.stringify(parsedJSON, null, indentSize);
        
        // Display the formatted JSON with syntax highlighting
        jsonOutput.innerHTML = syntaxHighlight(formattedJSON);
        
        // Show success message
        showValidationMessage('JSON formatted successfully', true);
    } catch (error) {
        // Show error message
        showValidationMessage(`Invalid JSON: ${error.message}`, false);
        jsonOutput.textContent = '';
    }
}

// Validate JSON
function validateJSON() {
    const input = jsonInput.value.trim();
    
    if (!input) {
        showValidationMessage('Please enter JSON to validate', false);
        return;
    }
    
    try {
        // Try to parse the JSON
        JSON.parse(input);
        
        // Show success message
        showValidationMessage('JSON is valid', true);
    } catch (error) {
        // Show error message
        showValidationMessage(`Invalid JSON: ${error.message}`, false);
    }
}

// Clear input
function clearInput() {
    jsonInput.value = '';
    jsonOutput.textContent = '';
    validationResult.textContent = '';
    validationResult.className = 'validation-result';
}

// Load sample JSON
function loadSampleJSON() {
    const indentSize = parseInt(indentSizeInput.value) || 2;
    jsonInput.value = JSON.stringify(sampleJSON, null, indentSize);
    formatJSON();
}

// Copy formatted JSON to clipboard
function copyToClipboard() {
    if (!jsonOutput.textContent) {
        showValidationMessage('No formatted JSON to copy', false);
        return;
    }
    
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = jsonOutput.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        // Execute copy command
        document.execCommand('copy');
        showValidationMessage('JSON copied to clipboard', true);
    } catch (error) {
        showValidationMessage('Failed to copy to clipboard', false);
    } finally {
        document.body.removeChild(textarea);
    }
}

// Download JSON as a file
function downloadJSON() {
    if (!jsonOutput.textContent) {
        showValidationMessage('No formatted JSON to download', false);
        return;
    }
    
    // Create a blob with the JSON content
    const blob = new Blob([jsonOutput.textContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showValidationMessage('JSON downloaded', true);
}

// Show validation message
function showValidationMessage(message, isSuccess) {
    validationResult.textContent = message;
    validationResult.className = 'validation-result ' + (isSuccess ? 'validation-success' : 'validation-error');
}

// Sort object keys alphabetically
function sortObjectKeys(obj) {
    // If not an object or is null, return as is
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
    }
    
    // Create a new object with sorted keys
    const sortedObj = {};
    Object.keys(obj).sort().forEach(key => {
        // Recursively sort nested objects
        sortedObj[key] = sortObjectKeys(obj[key]);
    });
    
    return sortedObj;
}

// Syntax highlighting for JSON
function syntaxHighlight(json) {
    // Replace special characters to prevent HTML injection
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Add syntax highlighting with regex
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Initialize with empty state
clearInput(); 