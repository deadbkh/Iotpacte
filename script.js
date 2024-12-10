// Fonction pour animer les titres à l'apparition
document.addEventListener('DOMContentLoaded', () => {
    const titles = document.querySelectorAll('h2'); // Sélectionne tous les titres h2

    titles.forEach((title) => {
        // Ajoute une classe pour l'animation
        title.classList.add('hidden');
        
        // Observer quand le titre devient visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    title.classList.add('fade-in');
                    observer.unobserve(title); // Stoppe l'observation une fois l'animation jouée
                }
            });
        });
        
        observer.observe(title); // Commence à observer chaque titre
    });
});

// Effet interactif au survol
const applyHoverEffect = () => {
    const titles = document.querySelectorAll('h2');
    titles.forEach((title) => {
        title.addEventListener('mouseenter', () => {
            title.style.color = '#6a89cc'; // Change la couleur du titre
            title.style.transform = 'scale(1.1)'; // Agrandit légèrement
            title.style.transition = 'transform 0.3s ease, color 0.3s ease'; // Animation fluide
        });

        title.addEventListener('mouseleave', () => {
            title.style.color = '#4a69bd'; // Reviens à la couleur originale
            title.style.transform = 'scale(1)'; // Reviens à la taille originale
        });
    });
};

applyHoverEffect();
