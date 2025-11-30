// Punto base de la API pública del portafolio
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

class Portfolio {
    constructor() {
        this.projectsList = document.getElementById('projects-list');
        this.itsonId = this.getItsonIdFromURL();
        this.currentTheme = null;
        this.init();
    }

    async init() {
        if (this.itsonId) {
            await this.loadProjects();
        } else {
            this.showError('ITSon ID no configurado. Agrega ?itsonId=TU_ID en la URL.');
        }

        this.setupNavigation();
        this.animateIntro();
        this.setupScrollAnimations();
        this.animateSkills();
        this.setupThemeBySection();
    }

    getItsonIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('itsonId');
        if (fromQuery) return fromQuery;

        try {
            const rawUser = localStorage.getItem('user');
            if (rawUser) {
                const user = JSON.parse(rawUser);
                if (user && (user.itsonId || user.itsonID)) {
                    return user.itsonId || user.itsonID;
                }
            }
        } catch (_) {}
        return '252538';
    }

    async loadProjects() {
        try {
            const url = `${API_BASE}/publicProjects/${this.itsonId}`;
            const response = await fetch(url);
            const projects = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(projects)}`);
            }

            if (Array.isArray(projects) && projects.length > 0) {
                this.renderProjects(projects);
            } else {
                this.showError('No hay proyectos disponibles. Verifica el Backoffice.');
            }
        } catch (error) {
            this.showError(`Error: ${error.message}`);
        }
    }

    renderProjects(projects) {
        this.projectsList.innerHTML = '';
        const created = [];

        projects.forEach((project) => {
            const card = this.createProjectCard(project);
            this.projectsList.appendChild(card);
            created.push(card);
        });

        if (window.gsap) {
            gsap.from(created, {
                autoAlpha: 0,
                y: 40,
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.12,
                clearProps: 'all'
            });
        }

        if (window.ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-item';

        const imageUrl = project.images && project.images.length > 0
            ? project.images[0]
            : 'https://via.placeholder.com/400x200?text=Project';

        const title = this.escapeHtml(project.title || 'Sin título');
        const description = this.escapeHtml(project.description || '');
        const technologies = Array.isArray(project.technologies) ? project.technologies : [];

        const techHtml = technologies.length > 0
            ? `<div class="project-tech">${technologies.map(tech =>
                `<span class="tech-tag">${this.escapeHtml(tech)}</span>`
            ).join('')}</div>`
            : '';

        const repoLink = project.repository
            ? `<a href="${this.escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="project-link">Ver proyecto</a>`
            : '';

        card.innerHTML = `
            <img src="${this.escapeHtml(imageUrl)}" alt="${title}" class="project-image" onerror="this.src='https://via.placeholder.com/400x200?text=Project'">
            <div class="project-content">
                <h3 class="project-title">${title}</h3>
                <p class="project-description">${description}</p>
                ${techHtml}
                ${repoLink}
            </div>
        `;
        return card;
    }

    showError(message) {
        this.projectsList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <p>${message}</p>
            </div>
        `;
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* Intro */
    animateIntro() {
        if (!window.gsap) return;

        gsap.from('.name', { duration: 1.1, y: 40, autoAlpha: 0, ease: 'power3.out', clearProps: 'all' });
        gsap.from('.role', { duration: 0.9, y: 20, autoAlpha: 0, delay: 0.25, ease: 'power2.out', clearProps: 'all' });
        gsap.from('.sidebar-intro', { duration: 1, y: 30, autoAlpha: 0, delay: 0.4, clearProps: 'all' });

        gsap.from('.nav-link', {
            duration: 0.6,
            autoAlpha: 0,
            y: 12,
            stagger: 0.12,
            delay: 0.55,
            ease: 'power2.out',
            clearProps: 'all'
        });

        gsap.from('.social-link', {
            duration: 0.6,
            autoAlpha: 0,
            y: 10,
            stagger: 0.1,
            delay: 0.9,
            clearProps: 'all'
        });
    }

    setupScrollAnimations() {
        if (!window.ScrollTrigger || !window.gsap) return;
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section, {
                autoAlpha: 0,
                y: 70,
                duration: 0.9,
                ease: 'power3.out',
                immediateRender: false,
                clearProps: 'all',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });

        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                autoAlpha: 0,
                x: -40,
                duration: 0.6,
                ease: 'power2.out',
                immediateRender: false,
                clearProps: 'all',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    animateSkills() {
        if (!window.gsap || !window.ScrollTrigger) return;
        const skillCards = document.querySelectorAll('.skill-card');
        if (!skillCards.length) return;

        gsap.from(skillCards, {
            autoAlpha: 0,
            scale: 0.85,
            y: 30,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
            immediateRender: false,
            clearProps: 'all',
            scrollTrigger: {
                trigger: '#habilidades',
                start: 'top 75%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    }

    /* ================== TEMAS DINÁMICOS POR SECCIÓN ================== */
    setupThemeBySection() {
        if (!window.ScrollTrigger || !window.gsap) return;
        gsap.registerPlugin(ScrollTrigger);

        const themeConfig = {
            'sobre-mi': 'theme-sobre-mi',
            'habilidades': 'theme-habilidades',
            'proyectos': 'theme-proyectos'
        };

        Object.entries(themeConfig).forEach(([sectionId, themeClass]) => {
            ScrollTrigger.create({
                trigger: `#${sectionId}`,
                start: 'top center',
                onEnter: () => this.applyTheme(themeClass),
                onEnterBack: () => this.applyTheme(themeClass)
            });
        });

        // Aplicar primer tema según posición inicial
        const firstVisible = Object.keys(themeConfig).find(id => {
            const el = document.getElementById(id);
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0;
        });
        if (firstVisible) {
            this.applyTheme(themeConfig[firstVisible], false);
        }
    }

    applyTheme(themeClass, animate = true) {
        if (this.currentTheme === themeClass) return;
        const body = document.body;

        // Remover cualquier tema anterior
        body.classList.remove('theme-sobre-mi', 'theme-habilidades', 'theme-proyectos');
        body.classList.add(themeClass);

        // Animar cambios en variables principales (suavizado extra)
        if (animate && window.gsap) {
            gsap.to(body, {
                duration: 0.6,
                ease: 'power2.out',
                // Podemos animar nada directamente: la transición se da por CSS
                // pero disparamos un "tick" para forzar repintado si fuese necesario.
                onUpdate: () => {}
            });
        }

        this.currentTheme = themeClass;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});