// DOM Elements
const passwordOutput = document.getElementById('passwordOutput');
const copyButton = document.getElementById('copyButton');
const refreshButton = document.getElementById('refreshButton');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercaseCheck');
const lowercaseCheck = document.getElementById('lowercaseCheck');
const numbersCheck = document.getElementById('numbersCheck');
const symbolsCheck = document.getElementById('symbolsCheck');
const excludeSimilarCheck = document.getElementById('excludeSimilarCheck');
const excludeAmbiguousCheck = document.getElementById('excludeAmbiguousCheck');
const generateButton = document.getElementById('generateButton');
const passwordHistory = document.getElementById('passwordHistory');
const clearHistoryButton = document.getElementById('clearHistoryButton');

// Character Sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const similarChars = 'iIlL1oO0';
const ambiguousSymbols = '{}[]()\\\'"`~,;:.<>/';

// Password History
let passwordHistoryArray = [];
const maxHistoryItems = 10;

// Event Listeners
lengthSlider.addEventListener('input', updateLengthValue);
generateButton.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyPassword);
refreshButton.addEventListener('click', generatePassword);
clearHistoryButton.addEventListener('click', clearHistory);

// Initialize
function init() {
    // Load password history from localStorage
    const savedHistory = localStorage.getItem('passwordHistory');
    if (savedHistory) {
        passwordHistoryArray = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
    
    // Generate initial password
    generatePassword();
}

// Update length value display
function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
}

// Generate password
function generatePassword() {
    // Ensure at least one character type is selected
    if (!uppercaseCheck.checked && !lowercaseCheck.checked && 
        !numbersCheck.checked && !symbolsCheck.checked) {
        alert('Please select at least one character type.');
        uppercaseCheck.checked = true;
        return;
    }
    
    // Get password length
    const length = parseInt(lengthSlider.value);
    
    // Build character pool based on selected options
    let charPool = '';
    
    if (uppercaseCheck.checked) {
        charPool += uppercaseChars;
    }
    
    if (lowercaseCheck.checked) {
        charPool += lowercaseChars;
    }
    
    if (numbersCheck.checked) {
        charPool += numberChars;
    }
    
    if (symbolsCheck.checked) {
        charPool += symbolChars;
    }
    
    // Remove similar characters if option is selected
    if (excludeSimilarCheck.checked) {
        for (let i = 0; i < similarChars.length; i++) {
            charPool = charPool.replace(similarChars[i], '');
        }
    }
    
    // Remove ambiguous symbols if option is selected
    if (excludeAmbiguousCheck.checked) {
        for (let i = 0; i < ambiguousSymbols.length; i++) {
            charPool = charPool.replace(ambiguousSymbols[i], '');
        }
    }
    
    // Generate password
    let password = '';
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSymbol = false;
    
    // Use cryptographically strong random number generation
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        const randomIndex = array[i] % charPool.length;
        const char = charPool[randomIndex];
        
        password += char;
        
        // Check character types for strength calculation
        if (uppercaseChars.includes(char)) hasUppercase = true;
        if (lowercaseChars.includes(char)) hasLowercase = true;
        if (numberChars.includes(char)) hasNumber = true;
        if (symbolChars.includes(char)) hasSymbol = true;
    }
    
    // Ensure password meets requirements if possible
    if (length >= 4) {
        // If uppercase is checked but not present, replace a character
        if (uppercaseCheck.checked && !hasUppercase) {
            const randomPos = Math.floor(Math.random() * length);
            const randomChar = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
            password = password.substring(0, randomPos) + randomChar + password.substring(randomPos + 1);
            hasUppercase = true;
        }
        
        // If lowercase is checked but not present, replace a character
        if (lowercaseCheck.checked && !hasLowercase) {
            const randomPos = Math.floor(Math.random() * length);
            const randomChar = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
            password = password.substring(0, randomPos) + randomChar + password.substring(randomPos + 1);
            hasLowercase = true;
        }
        
        // If numbers are checked but not present, replace a character
        if (numbersCheck.checked && !hasNumber) {
            const randomPos = Math.floor(Math.random() * length);
            const randomChar = numberChars[Math.floor(Math.random() * numberChars.length)];
            password = password.substring(0, randomPos) + randomChar + password.substring(randomPos + 1);
            hasNumber = true;
        }
        
        // If symbols are checked but not present, replace a character
        if (symbolsCheck.checked && !hasSymbol) {
            const randomPos = Math.floor(Math.random() * length);
            const randomChar = symbolChars[Math.floor(Math.random() * symbolChars.length)];
            password = password.substring(0, randomPos) + randomChar + password.substring(randomPos + 1);
            hasSymbol = true;
        }
    }
    
    // Update password display
    passwordOutput.value = password;
    
    // Calculate and update password strength
    updatePasswordStrength(password);
    
    // Add to history
    addToHistory(password);
}

// Update password strength indicator
function updatePasswordStrength(password) {
    // Calculate password strength
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    
    // Count character types
    let charTypesCount = 0;
    if (hasUppercase) charTypesCount++;
    if (hasLowercase) charTypesCount++;
    if (hasNumbers) charTypesCount++;
    if (hasSymbols) charTypesCount++;
    
    // Calculate score (0-100)
    let score = 0;
    
    // Length score (up to 40 points)
    score += Math.min(40, length * 2);
    
    // Character variety score (up to 40 points)
    score += charTypesCount * 10;
    
    // Bonus for length and variety combined (up to 20 points)
    if (length >= 12 && charTypesCount >= 3) {
        score += 10;
    }
    if (length >= 16 && charTypesCount >= 4) {
        score += 10;
    }
    
    // Update strength indicator
    let strengthClass = '';
    let strengthLabel = '';
    
    if (score < 40) {
        strengthClass = 'weak';
        strengthLabel = 'Weak';
    } else if (score < 60) {
        strengthClass = 'fair';
        strengthLabel = 'Fair';
    } else if (score < 80) {
        strengthClass = 'good';
        strengthLabel = 'Good';
    } else {
        strengthClass = 'strong';
        strengthLabel = 'Strong';
    }
    
    // Update UI
    strengthBar.className = 'strength-bar ' + strengthClass;
    strengthText.className = 'strength-text ' + strengthClass;
    strengthText.textContent = strengthLabel;
}

// Copy password to clipboard
function copyPassword() {
    if (!passwordOutput.value) return;
    
    passwordOutput.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyButton.innerHTML;
    copyButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 5L8 13L4 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    setTimeout(() => {
        copyButton.innerHTML = originalText;
    }, 2000);
}

// Add password to history
function addToHistory(password) {
    // Add to beginning of array
    passwordHistoryArray.unshift(password);
    
    // Limit history size
    if (passwordHistoryArray.length > maxHistoryItems) {
        passwordHistoryArray = passwordHistoryArray.slice(0, maxHistoryItems);
    }
    
    // Save to localStorage
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistoryArray));
    
    // Update display
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    // Clear current display
    passwordHistory.innerHTML = '';
    
    // If history is empty, show message
    if (passwordHistoryArray.length === 0) {
        passwordHistory.innerHTML = '<div class="empty-history">No passwords generated yet</div>';
        return;
    }
    
    // Add each password to display
    passwordHistoryArray.forEach((password, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-password">${password}</div>
            <div class="history-actions">
                <button class="icon-button" title="Copy to clipboard" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2C5.44772 2 5 2.44772 5 3V11C5 11.5523 5.44772 12 6 12H13C13.5523 12 14 11.5523 14 11V3C14 2.44772 13.5523 2 13 2H6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 6C3 5.44772 3.44772 5 4 5H11C11.5523 5 12 5.44772 12 6V14C12 14.5523 11.5523 15 11 15H4C3.44772 15 3 14.5523 3 14V6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="icon-button" title="Use this password" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add event listeners for buttons
        const buttons = historyItem.querySelectorAll('.icon-button');
        buttons[0].addEventListener('click', () => copyHistoryPassword(index));
        buttons[1].addEventListener('click', () => useHistoryPassword(index));
        
        passwordHistory.appendChild(historyItem);
    });
}

// Copy password from history
function copyHistoryPassword(index) {
    const password = passwordHistoryArray[index];
    
    // Create temporary textarea to copy from
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = password;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    
    // Show feedback
    const button = document.querySelector(`.history-item:nth-child(${index + 1}) .icon-button:first-child`);
    const originalHTML = button.innerHTML;
    
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
    }, 2000);
}

// Use password from history
function useHistoryPassword(index) {
    const password = passwordHistoryArray[index];
    passwordOutput.value = password;
    updatePasswordStrength(password);
}

// Clear password history
function clearHistory() {
    if (passwordHistoryArray.length === 0) return;
    
    if (confirm('Are you sure you want to clear your password history?')) {
        passwordHistoryArray = [];
        localStorage.removeItem('passwordHistory');
        updateHistoryDisplay();
    }
}

// Initialize the app
init(); 