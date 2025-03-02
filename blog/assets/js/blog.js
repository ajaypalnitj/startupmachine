// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Category filtering functionality
    const categoryButtons = document.querySelectorAll('.category-button');
    const blogPosts = document.querySelectorAll('.post-card');
    
    if (categoryButtons.length > 0) {
        // Check if there's a category in URL hash
        const initialCategory = window.location.hash.substring(1) || 'all';
        filterPostsByCategory(initialCategory);
        
        // Update active button based on hash
        document.querySelectorAll(`.category-button[data-category="${initialCategory}"]`).forEach(button => {
            button.classList.add('active');
        });
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                filterPostsByCategory(category);
                
                // Update URL hash without scrolling
                const scrollPosition = window.pageYOffset;
                window.location.hash = category;
                window.scrollTo(0, scrollPosition);
            });
        });
    }
    
    function filterPostsByCategory(category) {
        if (category === 'all') {
            blogPosts.forEach(post => {
                post.style.display = 'flex';
            });
        } else {
            blogPosts.forEach(post => {
                const postCategories = post.getAttribute('data-categories');
                if (postCategories && postCategories.includes(category)) {
                    post.style.display = 'flex';
                } else {
                    post.style.display = 'none';
                }
            });
        }
    }
    
    // Social sharing functionality
    const shareButtons = document.querySelectorAll('.social-icons a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('data-url') || window.location.href;
            const title = this.getAttribute('data-title') || document.title;
            
            if (this.classList.contains('share-x')) {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 'share-x', 'width=550, height=400');
            } else if (this.classList.contains('share-facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 'share-facebook', 'width=550, height=400');
            } else if (this.classList.contains('share-linkedin')) {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 'share-linkedin', 'width=550, height=400');
            }
        });
    });
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't interfere with category buttons
        if (this.classList.contains('category-button')) {
            return;
        }
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Table of Contents Active State
document.addEventListener('DOMContentLoaded', function() {
    const singlePost = document.querySelector('.single-post');
    
    // Only run if we're on a single post page
    if (singlePost) {
        const headings = document.querySelectorAll('.post-content h2, .post-content h3');
        const tocLinks = document.querySelectorAll('.table-of-contents a');
        
        // Create an array of section positions
        const sections = Array.from(headings).map(heading => {
            return {
                id: heading.id,
                offset: heading.offsetTop - 100
            };
        });
        
        // Handle scroll events to highlight the active TOC item
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            
            // Find the current section
            let currentSection = sections[0]?.id;
            
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].offset <= scrollPosition) {
                    currentSection = sections[i].id;
                }
            }
            
            // Set active class on the current TOC item
            tocLinks.forEach(link => {
                const href = link.getAttribute('href').substring(1);
                
                if (href === currentSection) {
                    link.classList.add('toc-active');
                } else {
                    link.classList.remove('toc-active');
                }
            });
        });
        
        // Smooth scroll to section when clicking TOC links
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, '#' + targetId);
                }
            });
        });
    }
});

// Back to Top Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show or hide the button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.overlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-active');
            overlay.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            document.body.classList.remove('mobile-menu-active');
            overlay.classList.remove('active');
        });
    }
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Category filtering on index page
    const categoryButtons = document.querySelectorAll('.category-pill');
    const postCards = document.querySelectorAll('.post-card');
    
    if (categoryButtons.length > 0 && postCards.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter posts
                postCards.forEach(card => {
                    const categories = card.getAttribute('data-categories');
                    
                    if (category === 'all' || categories.includes(category)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Initialize Swiper if it exists on the page
    if (typeof Swiper !== 'undefined' && document.querySelector('.featured-swiper')) {
        const featuredSwiper = new Swiper('.featured-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Load More Button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const spinner = this.querySelector('.fa-spinner');
            const text = this.querySelector('span');
            
            // Show loading state
            spinner.style.display = 'inline-block';
            text.textContent = 'Loading...';
            
            // Simulate loading delay
            setTimeout(() => {
                // This would normally load more posts from the server
                // For this demo, we'll just show a message
                spinner.style.display = 'none';
                text.textContent = 'No more posts to load';
                this.disabled = true;
                this.classList.add('disabled');
                
                showNotification('All posts have been loaded', 'info');
            }, 1500);
        });
    }
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Add icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Table of Contents for single post pages
    const tableOfContents = document.querySelector('.table-of-contents');
    
    if (tableOfContents) {
        const tocLinks = tableOfContents.querySelectorAll('a');
        const headings = document.querySelectorAll('.post-content h2, .post-content h3');
        
        // Smooth scroll for TOC links
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
        
        // Highlight active TOC item on scroll
        if (headings.length > 0) {
            window.addEventListener('scroll', function() {
                let current = '';
                
                headings.forEach(heading => {
                    const sectionTop = heading.offsetTop - 150;
                    
                    if (window.pageYOffset >= sectionTop) {
                        current = heading.getAttribute('id');
                    }
                });
                
                tocLinks.forEach(link => {
                    link.classList.remove('toc-active');
                    const href = link.getAttribute('href').substring(1);
                    
                    if (href === current) {
                        link.classList.add('toc-active');
                    }
                });
            });
        }
    }
    
    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            padding: 12px 20px;
            border-radius: 4px;
            background-color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 280px;
            animation: slide-in 0.3s ease;
            transition: opacity 0.3s ease;
        }
        
        .notification-info {
            border-left: 4px solid #3182ce;
        }
        
        .notification-success {
            border-left: 4px solid #38a169;
        }
        
        .notification-warning {
            border-left: 4px solid #dd6b20;
        }
        
        .notification-error {
            border-left: 4px solid #e53e3e;
        }
        
        .notification.fade-out {
            opacity: 0;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-info i {
            color: #3182ce;
        }
        
        .notification-success i {
            color: #38a169;
        }
        
        .notification-warning i {
            color: #dd6b20;
        }
        
        .notification-error i {
            color: #e53e3e;
        }
        
        @keyframes slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 