// Requiere que gsap esté cargado antes (ya lo tienes en el HTML)
class Spotlight {
    constructor() {
        this.spotSize = 320;
        this.spotColor = 'rgba(246,208,220,0.12)';
        this.init();
    }

    init() {
        const root = document.documentElement;
        root.style.setProperty('--spot-size', `${this.spotSize}px`);
        root.style.setProperty('--spot-color', this.spotColor);

        document.addEventListener('mousemove', (e) => {
            gsap.to(root, {
                '--spot-x': `${e.clientX}px`,
                '--spot-y': `${e.clientY}px`,
                duration: 0.45,
                ease: 'power2.out'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Spotlight();
});