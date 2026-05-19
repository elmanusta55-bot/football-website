// Mobile Menu Toggle Functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the mobile menu button (hamburger menu)
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    
    // Get the mobile menu container
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Get the body element to prevent scrolling when menu is open
    const body = document.body;
    
    // Function to toggle mobile menu
    function toggleMobileMenu() {
        // Toggle the 'active' class on the mobile menu
        mobileMenu.classList.toggle('active');
        
        // Toggle the 'menu-open' class on the button for animation
        mobileMenuButton.classList.toggle('menu-open');
        
        // Toggle body scroll lock
        body.classList.toggle('menu-open');
        
        // Update aria-expanded attribute for accessibility
        const isExpanded = mobileMenu.classList.contains('active');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    }
    
    // Add click event listener to mobile menu button
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnButton = mobileMenuButton.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Additional utility function for smooth scrolling to sections
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}