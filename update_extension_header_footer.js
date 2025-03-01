// Script to update header and footer of all extension pages
const fs = require('fs');
const path = require('path');

// Define the extensions directory
const extensionsDir = path.join(__dirname, 'extensions');

// Get all extension directories
const extensionDirs = fs.readdirSync(extensionsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Header template
const headerTemplate = `
    <header>
        <nav>
            <div class="logo">
                <a href="../../index.html">
                    <img src="../../logo.png" alt="StartupMachine Logo" width="120">
                    <span>StartupMachine</span>
                </a>
            </div>
            <div class="nav-links">
                <a href="../../index.html">Home</a>
                <a href="../../extensions.html">Extensions</a>
                <a href="../../tools.html">Tools</a>
                <a href="../../about.html">About</a>
            </div>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>
    <div class="overlay"></div>
`;

// Footer template
const footerTemplate = `
    <footer>
        <div class="container">
            <div class="footer-top">
                <div class="footer-logo">
                    <a href="../../index.html">
                        <img src="../../logo.png" alt="StartupMachine Logo">
                        <span>StartupMachine</span>
                    </a>
                </div>
                <ul class="main-links">
                    <li><a href="../../tools.html">Tools</a></li>
                    <li><a href="../../extensions.html">Extensions</a></li>
                    <li><a href="../../about.html">About</a></li>
                </ul>
            </div>
            
            <div class="footer-row">
                <h4>Popular Tools</h4>
                <ul class="footer-links">
                    <li><a href="../../tools/svg-optimizer/">SVG Optimizer</a></li>
                    <li><a href="../../tools/css-gradient-generator/">CSS Gradient Generator</a></li>
                    <li><a href="../../tools/color-palette-generator/">Color Palette Generator</a></li>
                </ul>
            </div>
            
            <div class="footer-row">
                <h4>Popular Extensions</h4>
                <ul class="footer-links">
                    <li><a href="../citation-helper/">Citation Helper</a></li>
                    <li><a href="../mood-tracker/">Mood Tracker</a></li>
                    <li><a href="../kindness-reminders/">Kindness Reminders</a></li>
                </ul>
            </div>
            
            <div class="footer-bottom">
                <p>© 2025 StartupMachine. All rights reserved.</p>
            </div>
        </div>
    </footer>
`;

// Process each extension directory
extensionDirs.forEach(extensionDir => {
    // Process index.html
    const indexPath = path.join(extensionsDir, extensionDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log(`Processing ${extensionDir}/index.html...`);
        
        // Read the file
        let content = fs.readFileSync(indexPath, 'utf8');
        
        // Update header
        content = content.replace(/<header>[\s\S]*?<\/header>/, headerTemplate.trim());
        
        // Add overlay div if it doesn't exist
        if (!content.includes('<div class="overlay"></div>')) {
            content = content.replace(/<\/header>/, '</header>\n    <div class="overlay"></div>');
        }
        
        // Update footer
        content = content.replace(/<footer>[\s\S]*?<\/footer>/, footerTemplate.trim());
        
        // Write the updated content back to the file
        fs.writeFileSync(indexPath, content);
        
        console.log(`Updated ${extensionDir}/index.html`);
    }
    
    // Process privacy.html if it exists
    const privacyPath = path.join(extensionsDir, extensionDir, 'privacy.html');
    if (fs.existsSync(privacyPath)) {
        console.log(`Processing ${extensionDir}/privacy.html...`);
        
        // Read the file
        let content = fs.readFileSync(privacyPath, 'utf8');
        
        // Update header
        content = content.replace(/<header>[\s\S]*?<\/header>/, headerTemplate.trim());
        
        // Add overlay div if it doesn't exist
        if (!content.includes('<div class="overlay"></div>')) {
            content = content.replace(/<\/header>/, '</header>\n    <div class="overlay"></div>');
        }
        
        // Update footer
        content = content.replace(/<footer>[\s\S]*?<\/footer>/, footerTemplate.trim());
        
        // Write the updated content back to the file
        fs.writeFileSync(privacyPath, content);
        
        console.log(`Updated ${extensionDir}/privacy.html`);
    }
});

console.log('All extension pages have been updated!'); 