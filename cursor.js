class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.speed = 0.2;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.onMouseEnter());
        document.addEventListener('mouseleave', () => this. onMouseLeave());

        this.animate();
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.cursor.style.left = this.mouseX + 'px';
        this.cursor.style.top = this.mouseY + 'px';
    }

    onMouseEnter() {
        this.cursor.style.opacity = '1';
        this.cursorFollower.style.opacity = '0. 5';
    }

    onMouseLeave() {
        this. cursor.style.opacity = '0';
        this.cursorFollower.style.opacity = '0';
    }

    animate() {
        this.followerX += (this.mouseX - this. followerX) * this.speed;
        this.followerY += (this.mouseY - this.followerY) * this. speed;

        this.cursorFollower.style.left = this.followerX + 'px';
        this.cursorFollower.style.top = this. followerY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});