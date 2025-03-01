// Meta Tags Generator Tool
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Form Inputs
    const pageUrl = document.getElementById('page-url');
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    const pageKeywords = document.getElementById('page-keywords');
    const pageAuthor = document.getElementById('page-author');
    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const ogImage = document.getElementById('og-image');
    const twitterCard = document.getElementById('twitter-card');
    const twitterSite = document.getElementById('twitter-site');
    const robots = document.getElementById('robots');
    const canonical = document.getElementById('canonical');
    const viewport = document.getElementById('viewport');
    const charset = document.getElementById('charset');
    const language = document.getElementById('language');
    
    // DOM Elements - Character Counts
    const titleCount = document.getElementById('title-count');
    const descriptionCount = document.getElementById('description-count');
    const ogTitleCount = document.getElementById('og-title-count');
    const ogDescriptionCount = document.getElementById('og-description-count');
    
    // DOM Elements - Buttons and Containers
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resultsContainer = document.getElementById('results-container');
    const metaCode = document.getElementById('meta-code');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // DOM Elements - Preview Elements
    const previewTitle = document.getElementById('preview-title');
    const previewUrl = document.getElementById('preview-url');
    const previewDescription = document.getElementById('preview-description');
    const fbUrl = document.getElementById('fb-url');
    const fbTitle = document.getElementById('fb-title');
    const fbDescription = document.getElementById('fb-description');
    const fbImage = document.getElementById('fb-image');
    const twitterUrl = document.getElementById('twitter-url');
    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');
    const twitterImage = document.getElementById('twitter-image');
    
    // Event Listeners
    pageTitle.addEventListener('input', () => {
        updateCharCount(pageTitle, titleCount, 60);
        updatePreview();
    });
    
    pageDescription.addEventListener('input', () => {
        updateCharCount(pageDescription, descriptionCount, 160);
        updatePreview();
    });
    
    ogTitle.addEventListener('input', () => {
        updateCharCount(ogTitle, ogTitleCount, 60);
        updatePreview();
    });
    
    ogDescription.addEventListener('input', () => {
        updateCharCount(ogDescription, ogDescriptionCount, 160);
        updatePreview();
    });
    
    pageUrl.addEventListener('input', updatePreview);
    ogImage.addEventListener('input', updatePreview);
    
    generateBtn.addEventListener('click', generateMetaTags);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
    
    // Initialize character counts
    updateCharCount(pageTitle, titleCount, 60);
    updateCharCount(pageDescription, descriptionCount, 160);
    updateCharCount(ogTitle, ogTitleCount, 60);
    updateCharCount(ogDescription, ogDescriptionCount, 160);
    
    // Functions
    function updateCharCount(inputElement, countElement, limit) {
        const count = inputElement.value.length;
        countElement.textContent = count;
        
        if (count > limit) {
            countElement.style.color = '#ef4444';
        } else {
            countElement.style.color = '#6b7280';
        }
    }
    
    function updatePreview() {
        // Get values, using fallbacks where appropriate
        const urlValue = pageUrl.value || 'https://example.com/page';
        const titleValue = pageTitle.value || 'Your Page Title';
        const descriptionValue = pageDescription.value || 'Brief description of your page content that will appear in search results.';
        const ogTitleValue = ogTitle.value || titleValue;
        const ogDescriptionValue = ogDescription.value || descriptionValue;
        const ogImageValue = ogImage.value;
        
        // Extract domain from URL
        let domain = 'example.com';
        try {
            if (urlValue) {
                const url = new URL(urlValue);
                domain = url.hostname;
            }
        } catch (e) {
            // Invalid URL, use default
        }
        
        // Update Google preview
        previewTitle.textContent = titleValue;
        previewUrl.textContent = urlValue;
        previewDescription.textContent = descriptionValue;
        
        // Update Facebook/LinkedIn preview
        fbUrl.textContent = domain;
        fbTitle.textContent = ogTitleValue;
        fbDescription.textContent = ogDescriptionValue;
        
        if (ogImageValue) {
            fbImage.innerHTML = '';
            const img = document.createElement('img');
            img.src = ogImageValue;
            img.alt = 'Preview image';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            fbImage.appendChild(img);
        } else {
            fbImage.innerHTML = '<div class="image-placeholder">Image Preview</div>';
        }
        
        // Update Twitter preview
        twitterUrl.textContent = domain;
        twitterTitle.textContent = ogTitleValue;
        twitterDescription.textContent = ogDescriptionValue;
        
        if (ogImageValue) {
            twitterImage.innerHTML = '';
            const img = document.createElement('img');
            img.src = ogImageValue;
            img.alt = 'Preview image';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            twitterImage.appendChild(img);
        } else {
            twitterImage.innerHTML = '<div class="image-placeholder">Image Preview</div>';
        }
    }
    
    function generateMetaTags() {
        // Validate required fields
        if (!pageUrl.value) {
            showToast('Please enter a page URL', 'error');
            pageUrl.focus();
            return;
        }
        
        if (!pageTitle.value) {
            showToast('Please enter a page title', 'error');
            pageTitle.focus();
            return;
        }
        
        if (!pageDescription.value) {
            showToast('Please enter a page description', 'error');
            pageDescription.focus();
            return;
        }
        
        // Generate meta tags HTML
        let metaTagsHtml = '';
        
        // Basic meta tags
        metaTagsHtml += `<meta charset="${escapeHtml(charset.value)}">\n`;
        metaTagsHtml += `<meta name="viewport" content="${escapeHtml(viewport.value)}">\n`;
        metaTagsHtml += `<title>${escapeHtml(pageTitle.value)}</title>\n`;
        metaTagsHtml += `<meta name="description" content="${escapeHtml(pageDescription.value)}">\n`;
        
        if (pageKeywords.value) {
            metaTagsHtml += `<meta name="keywords" content="${escapeHtml(pageKeywords.value)}">\n`;
        }
        
        if (pageAuthor.value) {
            metaTagsHtml += `<meta name="author" content="${escapeHtml(pageAuthor.value)}">\n`;
        }
        
        // Robots directive
        metaTagsHtml += `<meta name="robots" content="${escapeHtml(robots.value)}">\n`;
        
        // Canonical URL
        if (canonical.value) {
            metaTagsHtml += `<link rel="canonical" href="${escapeHtml(canonical.value)}">\n`;
        } else {
            metaTagsHtml += `<link rel="canonical" href="${escapeHtml(pageUrl.value)}">\n`;
        }
        
        // Language
        metaTagsHtml += `<html lang="${escapeHtml(language.value)}">\n`;
        
        // Open Graph tags
        metaTagsHtml += '\n<!-- Open Graph / Facebook -->\n';
        metaTagsHtml += `<meta property="og:type" content="website">\n`;
        metaTagsHtml += `<meta property="og:url" content="${escapeHtml(pageUrl.value)}">\n`;
        metaTagsHtml += `<meta property="og:title" content="${escapeHtml(ogTitle.value || pageTitle.value)}">\n`;
        metaTagsHtml += `<meta property="og:description" content="${escapeHtml(ogDescription.value || pageDescription.value)}">\n`;
        
        if (ogImage.value) {
            metaTagsHtml += `<meta property="og:image" content="${escapeHtml(ogImage.value)}">\n`;
        }
        
        // Twitter Card tags
        metaTagsHtml += '\n<!-- Twitter -->\n';
        metaTagsHtml += `<meta property="twitter:card" content="${escapeHtml(twitterCard.value)}">\n`;
        metaTagsHtml += `<meta property="twitter:url" content="${escapeHtml(pageUrl.value)}">\n`;
        metaTagsHtml += `<meta property="twitter:title" content="${escapeHtml(ogTitle.value || pageTitle.value)}">\n`;
        metaTagsHtml += `<meta property="twitter:description" content="${escapeHtml(ogDescription.value || pageDescription.value)}">\n`;
        
        if (ogImage.value) {
            metaTagsHtml += `<meta property="twitter:image" content="${escapeHtml(ogImage.value)}">\n`;
        }
        
        if (twitterSite.value) {
            metaTagsHtml += `<meta property="twitter:site" content="${escapeHtml(twitterSite.value)}">\n`;
        }
        
        // Display the generated meta tags
        metaCode.textContent = metaTagsHtml;
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Show success message
        showToast('Meta tags generated successfully!', 'success');
    }
    
    function copyToClipboard() {
        const textToCopy = metaCode.textContent;
        
        if (!textToCopy) {
            showToast('No meta tags to copy', 'error');
            return;
        }
        
        // Use the Clipboard API
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showToast('Meta tags copied to clipboard!', 'success');
                
                // Change button text temporarily
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy to clipboard', 'error');
            });
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
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
    
    // Initialize preview
    updatePreview();
}); 