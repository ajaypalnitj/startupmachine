// Script to fix any issues with tool and extension pages
const fs = require('fs');
const path = require('path');

// Define the directories
const toolsDir = path.join(__dirname, 'tools');
const extensionsDir = path.join(__dirname, 'extensions');

// Footer template that matches exactly with the home page
const correctFooterTemplate = `
    <footer>
        <div class="footer-container">
            <div class="footer-row main-nav">
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

// Correct footer template for extensions
const correctExtensionFooterTemplate = `
    <footer>
        <div class="footer-container">
            <div class="footer-row main-nav">
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

// Fix functions
function fixDuplicateOverlays(content) {
    // Remove duplicate overlay divs 
    // The regex matches any sequence of overlay divs and replaces with a single one
    return content.replace(/(<div class="overlay"><\/div>\s*)+/g, '<div class="overlay"></div>\n    ');
}

function fixFooter(content, template) {
    // Replace the entire footer with the correct template
    return content.replace(/<footer>[\s\S]*?<\/footer>/, template.trim());
}

function fixFiles(directoryPath, isTools = true) {
    // Get all directories
    const directories = fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    // Choose the correct footer template
    const footerTemplate = isTools ? correctFooterTemplate : correctExtensionFooterTemplate;
    
    // Process each directory
    directories.forEach(dirName => {
        // Process index.html
        const indexPath = path.join(directoryPath, dirName, 'index.html');
        if (fs.existsSync(indexPath)) {
            console.log(`Fixing ${dirName}/index.html...`);
            
            // Read the file
            let content = fs.readFileSync(indexPath, 'utf8');
            
            // Fix duplicate overlay divs
            content = fixDuplicateOverlays(content);
            
            // Fix footer
            content = fixFooter(content, footerTemplate);
            
            // Write the updated content back to the file
            fs.writeFileSync(indexPath, content);
            
            console.log(`Fixed ${dirName}/index.html`);
        }
        
        // Process privacy.html if it exists
        const privacyPath = path.join(directoryPath, dirName, 'privacy.html');
        if (fs.existsSync(privacyPath)) {
            console.log(`Fixing ${dirName}/privacy.html...`);
            
            // Read the file
            let content = fs.readFileSync(privacyPath, 'utf8');
            
            // Fix duplicate overlay divs
            content = fixDuplicateOverlays(content);
            
            // Fix footer
            content = fixFooter(content, footerTemplate);
            
            // Write the updated content back to the file
            fs.writeFileSync(privacyPath, content);
            
            console.log(`Fixed ${dirName}/privacy.html`);
        }
    });
}

// Fix tool pages
console.log("Fixing tool pages...");
fixFiles(toolsDir, true);

// Fix extension pages
console.log("Fixing extension pages...");
fixFiles(extensionsDir, false);

console.log('All pages have been fixed!'); 