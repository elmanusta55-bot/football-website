// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on menu items
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Live score updates simulation
function updateLiveScores() {
    const liveMatches = document.querySelectorAll('.status.live');
    
    liveMatches.forEach(match => {
        let minute = parseInt(match.textContent);
        if (minute < 90) {
            minute += Math.floor(Math.random() * 3) + 1;
            match.textContent = minute + "'";
        } else {
            match.textContent = 'Bitdi';
            match.classList.remove('live');
        }
    });
}

// Update scores every 30 seconds
setInterval(updateLiveScores, 30000);

// Add news loading animation
function addNewsLoadingEffect() {
    const newsCards = document.querySelectorAll('.news-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    newsCards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNewsLoadingEffect();
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(44, 85, 48, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #2c5530, #1a3d1f)';
        navbar.style.backdropFilter = 'none';
    }
});

// News search functionality
function createNewsSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'news-search';
    searchContainer.innerHTML = `
        <input type="text" id="news-search" placeholder="Xəbərlərdə axtarış..." />
        <button id="search-btn">
            <i class="fas fa-search"></i>
        </button>
    `;
    
    const newsSection = document.querySelector('.latest-news .container');
    const h2 = newsSection.querySelector('h2');
    h2.insertAdjacentElement('afterend', searchContainer);
    
    // Search functionality
    const searchInput = document.getElementById('news-search');
    const searchBtn = document.getElementById('search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
}

// Initialize search when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNewsSearch);
} else {
    createNewsSearch();
}

// Add some CSS for search box
const searchStyles = `
.news-search {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 10px;
}

#news-search {
    padding: 12px 20px;
    border: 2px solid #4CAF50;
    border-radius: 25px;
    font-size: 1rem;
    outline: none;
    width: 300px;
    max-width: 100%;
}

#news-search:focus {
    border-color: #2c5530;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

#search-btn {
    background: #4CAF50;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
}

#search-btn:hover {
    background: #45a049;
}

@media (max-width: 480px) {
    .news-search {
        flex-direction: column;
        align-items: center;
    }
    
    #news-search {
        width: 250px;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);