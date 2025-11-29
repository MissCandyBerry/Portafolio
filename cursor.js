class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.speed = 0.2;

        // Spotlight config (CSS variables)
        this.spotSize = 300; 
        this.spotColor = 'rgba(201, 126, 206, 0.15)'; // acento suave (puedes ajustar)

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.onMouseEnter());
        document.addEventListener('mouseleave', () => this.onMouseLeave());

        // Inicializa variables CSS del spotlight
        document.documentElement.style.setProperty('--spot-size', `${this.spotSize}px`);
        document.documentElement.style.setProperty('--spot-color', this.spotColor);

        this.animate();
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Cursor principal
        this.cursor.style.left = this.mouseX + 'px';
        this.cursor.style.top = this.mouseY + 'px';

        // Actualiza variables CSS para el spotlight
        document.documentElement.style.setProperty('--spot-x', `${this.mouseX}px`);
        document.documentElement.style.setProperty('--spot-y', `${this.mouseY}px`);
    }

    onMouseEnter() {
        this.cursor.style.opacity = '1';
        this.cursorFollower.style.opacity = '0.5';
    }

    onMouseLeave() {
        this.cursor.style.opacity = '0';
        this.cursorFollower.style.opacity = '0';
    }

    animate() {
        this.followerX += (this.mouseX - this.followerX) * this.speed;
        this.followerY += (this.mouseY - this.followerY) * this.speed;

        this.cursorFollower.style.left = this.followerX + 'px';
        this.cursorFollower.style.top = this.followerY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});