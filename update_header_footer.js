// Script to update header and footer of all tool pages
const fs = require('fs');
const path = require('path');

// Define the tools directory
const toolsDir = path.join(__dirname, 'tools');

// Get all tool directories
const toolDirs = fs.readdirSync(toolsDir, { withFileTypes: true })
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
                    <li><a href="../svg-optimizer/">SVG Optimizer</a></li>
                    <li><a href="../css-gradient-generator/">CSS Gradient Generator</a></li>
                    <li><a href="../color-palette-generator/">Color Palette Generator</a></li>
                </ul>
            </div>
            
            <div class="footer-row">
                <h4>Popular Extensions</h4>
                <ul class="footer-links">
                    <li><a href="../../extensions/citation-helper/">Citation Helper</a></li>
                    <li><a href="../../extensions/mood-tracker/">Mood Tracker</a></li>
                    <li><a href="../../extensions/kindness-reminders/">Kindness Reminders</a></li>
                </ul>
            </div>
            
            <div class="footer-bottom">
                <p>© 2025 StartupMachine. All rights reserved.</p>
            </div>
        </div>
    </footer>
`;

// Process each tool directory
toolDirs.forEach(toolDir => {
    const indexPath = path.join(toolsDir, toolDir, 'index.html');
    
    // Check if index.html exists
    if (fs.existsSync(indexPath)) {
        console.log(`Processing ${toolDir}/index.html...`);
        
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
        
        console.log(`Updated ${toolDir}/index.html`);
    }
});

console.log('All tool pages have been updated!'); 