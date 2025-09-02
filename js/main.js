// Search functionality
document
    .querySelector('.search-input')
    ?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

document.querySelector('.search-btn')?.addEventListener('click', performSearch);

function performSearch() {
    const query = document.querySelector('.search-input').value;
    if (query.trim()) {
        // In a real application, this would trigger a search
        console.log('Searching for:', query);
    }
}

// Enhanced animations on scroll
window.addEventListener('scroll', function () {
    const cards = document.querySelectorAll('.restaurant-card');
    const reviews = document.querySelectorAll('.review');

    cards.forEach((card) => {
        // Add your scroll animation logic here
    });

    reviews.forEach((review) => {
        // Add your review scroll animation logic here
    });
});

// Initialize card animations
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.restaurant-card');
    const reviews = document.querySelectorAll('.review');

    cards.forEach((card, index) => {
        setTimeout(() => {
            // Add your card animation logic here
        }, index * 300);
    });

    reviews.forEach((review, index) => {
        setTimeout(() => {
            // Add your review animation logic here
        }, 1000 + index * 200);
    });
});

// Review hover effects
document.querySelectorAll('.review').forEach((review) => {
    review.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(8px) scale(1.02)';
    });

    review.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0) scale(1)';
    });
});


cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.8s ease, transform 0.8s ease";

    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
    }, index * 300);
});

reviews.forEach((review, index) => {
    review.style.opacity = "0";
    review.style.transform = "translateX(-20px)";
    review.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    setTimeout(() => {
        review.style.opacity = "1";
        review.style.transform = "translateX(0)";
    }, 1000 + index * 200);
});
      

// Review hover effects
document.querySelectorAll(".review").forEach((review) => {
    review.addEventListener("mouseenter", function () {
        this.style.transform = "translateX(8px) scale(1.02)";
    });

    review.addEventListener("mouseleave", function () {
        this.style.transform = "translateX(0) scale(1)";
    });
});


