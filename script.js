// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    let currentSection = 0;
    const container = document.getElementById('container');
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;
    const progressBar = document.getElementById('progressBar');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');

    // Initialize page indicators
    function initIndicators() {
        for (let i = 0; i < totalSections; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSection(i));
            pageIndicator.appendChild(dot);
        }
    }

    function updateProgress() {
        const progress = (currentSection / (totalSections - 1)) * 100;
        progressBar.style.width = progress + '%';
    }

    function updateButtons() {
        prevBtn.disabled = currentSection === 0;
        nextBtn.disabled = currentSection === totalSections - 1;
    }

    function updateIndicators() {
        const dots = document.querySelectorAll('.indicator-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
    }

    function goToSection(index) {
        if (index >= 0 && index < totalSections) {
            currentSection = index;
            container.style.transform = `translateX(-${currentSection * 100}vw)`;
            updateProgress();
            updateButtons();
            updateIndicators();
            
            // Scroll each section to top when navigating
            sections[currentSection].scrollTop = 0;
        }
    }

    // Make these functions global so onclick handlers in HTML can access them
    window.nextSection = function() {
        goToSection(currentSection + 1);
    }

    window.prevSection = function() {
        goToSection(currentSection - 1);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.nextSection();
        if (e.key === 'ArrowLeft') window.prevSection();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            window.nextSection();
        }
        if (touchEndX - touchStartX > 50) {
            window.prevSection();
        }
    }

    // Mouse wheel navigation (optional - horizontal scroll with wheel)
    let isScrolling = false;
    container.addEventListener('wheel', (e) => {
        const section = sections[currentSection];
        const isAtTop = section.scrollTop === 0;
        const isAtBottom = section.scrollHeight - section.scrollTop === section.clientHeight;
        
        if ((e.deltaY < 0 && isAtTop && currentSection > 0) || 
            (e.deltaY > 0 && isAtBottom && currentSection < totalSections - 1)) {
            
            if (!isScrolling) {
                isScrolling = true;
                if (e.deltaY > 0) {
                    window.nextSection();
                } else {
                    window.prevSection();
                }
                setTimeout(() => isScrolling = false, 900);
            }
        }
    });

    // Initialize
    initIndicators();
    updateButtons();
    updateProgress();
});
