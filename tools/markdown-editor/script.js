// DOM Elements
const markdownInput = document.getElementById('markdownInput');
const markdownPreview = document.getElementById('markdownPreview');
const characterCount = document.getElementById('characterCount');
const wordCount = document.getElementById('wordCount');
const clearButton = document.getElementById('clearButton');
const sampleButton = document.getElementById('sampleButton');
const copyMarkdownButton = document.getElementById('copyMarkdownButton');
const downloadMarkdownButton = document.getElementById('downloadMarkdownButton');
const copyHtmlButton = document.getElementById('copyHtmlButton');
const downloadHtmlButton = document.getElementById('downloadHtmlButton');

// Sample Markdown for the "Sample Markdown" button
const sampleMarkdown = `# Markdown Editor & Previewer

## Introduction

This is a **live preview** Markdown editor. As you type in the editor on the left, the preview on the right will update in real-time.

## Features

- *Live preview* as you type
- **Bold** and *italic* text formatting
- Lists (ordered and unordered)
- Links and images
- Code blocks
- And more!

## Example List

1. First item
2. Second item
3. Third item

## Example Code

\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

## Example Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Example Image

![Placeholder Image](https://via.placeholder.com/150)

## Example Blockquote

> This is a blockquote.
> It can span multiple lines.

## Example Task List

- [x] Completed task
- [ ] Incomplete task

---

Feel free to edit this content or clear it to start your own Markdown document!
`;

// Event Listeners
markdownInput.addEventListener('input', updatePreview);
clearButton.addEventListener('click', clearContent);
sampleButton.addEventListener('click', loadSampleMarkdown);
copyMarkdownButton.addEventListener('click', copyMarkdown);
downloadMarkdownButton.addEventListener('click', downloadMarkdown);
copyHtmlButton.addEventListener('click', copyHtml);
downloadHtmlButton.addEventListener('click', downloadHtml);

// Initialize
function init() {
    // Check if there's saved content in localStorage
    const savedMarkdown = localStorage.getItem('markdownContent');
    if (savedMarkdown) {
        markdownInput.value = savedMarkdown;
    }
    
    updatePreview();
}

// Update preview and counts
function updatePreview() {
    // Convert markdown to HTML
    const html = markdownToHtml(markdownInput.value);
    
    // Update preview
    markdownPreview.innerHTML = html;
    
    // Update character count
    const chars = markdownInput.value.length;
    characterCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    
    // Update word count
    const words = markdownInput.value.trim() === '' ? 0 : markdownInput.value.trim().split(/\s+/).length;
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    
    // Save to localStorage
    localStorage.setItem('markdownContent', markdownInput.value);
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
    // This is a simple implementation. For a production app, use a library like marked.js
    
    // Handle code blocks
    markdown = markdown.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre><code>$2</code></pre>');
    
    // Handle inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle headers
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // Handle bold
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Handle italic
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
    markdown = markdown.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Handle strikethrough
    markdown = markdown.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Handle horizontal rule
    markdown = markdown.replace(/^---$/gm, '<hr>');
    
    // Handle blockquotes
    markdown = markdown.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Handle unordered lists
    markdown = markdown.replace(/^\s*[\-\*] (.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // Handle ordered lists
    markdown = markdown.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');
    
    // Handle task lists
    markdown = markdown.replace(/- \[x\] (.*$)/gm, '<li><input type="checkbox" checked disabled> $1</li>');
    markdown = markdown.replace(/- \[ \] (.*$)/gm, '<li><input type="checkbox" disabled> $1</li>');
    
    // Handle links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Handle images
    markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // Handle tables (basic implementation)
    const tableRegex = /\|(.+)\|\n\|[-:]+\|[-:]+\|\n((?:\|.+\|\n?)+)/g;
    markdown = markdown.replace(tableRegex, function(match, header, rows) {
        const headerCells = header.split('|').map(cell => cell.trim()).filter(Boolean);
        const headerRow = '<tr>' + headerCells.map(cell => `<th>${cell}</th>`).join('') + '</tr>';
        
        const tableRows = rows.trim().split('\n').map(row => {
            const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
            return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        }).join('');
        
        return `<table><thead>${headerRow}</thead><tbody>${tableRows}</tbody></table>`;
    });
    
    // Handle paragraphs
    markdown = markdown.replace(/^([^<].*)/gm, '<p>$1</p>');
    
    // Clean up empty paragraphs
    markdown = markdown.replace(/<p><\/p>/g, '');
    
    return markdown;
}

// Clear content
function clearContent() {
    markdownInput.value = '';
    updatePreview();
    localStorage.removeItem('markdownContent');
}

// Load sample markdown
function loadSampleMarkdown() {
    markdownInput.value = sampleMarkdown;
    updatePreview();
}

// Copy markdown to clipboard
function copyMarkdown() {
    markdownInput.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = copyMarkdownButton.textContent;
    copyMarkdownButton.textContent = 'Copied!';
    setTimeout(() => {
        copyMarkdownButton.textContent = originalText;
    }, 2000);
}

// Download markdown
function downloadMarkdown() {
    if (!markdownInput.value.trim()) {
        alert('Please enter some Markdown content first.');
        return;
    }
    
    const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-document.md';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Copy HTML to clipboard
function copyHtml() {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = markdownPreview.innerHTML;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    
    // Show feedback
    const originalText = copyHtmlButton.textContent;
    copyHtmlButton.textContent = 'Copied!';
    setTimeout(() => {
        copyHtmlButton.textContent = originalText;
    }, 2000);
}

// Download HTML
function downloadHtml() {
    if (!markdownInput.value.trim()) {
        alert('Please enter some Markdown content first.');
        return;
    }
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 16px;
            overflow: auto;
        }
        code {
            font-family: Consolas, Monaco, "Courier New", monospace;
            background-color: rgba(27, 31, 35, 0.05);
            border-radius: 3px;
            padding: 0.2em 0.4em;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            margin: 0;
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        table th, table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }
        img {
            max-width: 100%;
        }
    </style>
</head>
<body>
    ${markdownPreview.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-document.html';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Initialize the app
init(); 