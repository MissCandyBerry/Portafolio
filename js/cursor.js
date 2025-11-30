// Spotlight controlado por variables de tema (ya no fija color aquí)
class Spotlight {
    constructor() {
        this.spotSize = 320;
        this.init();
    }

    init() {
        const root = document.documentElement;
        root.style.setProperty('--spot-size', `${this.spotSize}px`);

        document.addEventListener('mousemove', (e) => {
            if (!window.gsap) {
                root.style.setProperty('--spot-x', `${e.clientX}px`);
                root.style.setProperty('--spot-y', `${e.clientY}px`);
                return;
            }
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