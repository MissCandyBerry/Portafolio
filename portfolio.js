const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

class Portfolio {
    constructor() {
        this.projectsList = document.getElementById('projects-list');
        this.itsonId = this.getItsonIdFromURL();
        console.log('🔍 ITSon ID configurado:', this.itsonId);
        this.init();
    }

    async init() {
        if (this.itsonId) {
            await this.loadProjects();
        } else {
            this.showError('ITSon ID no configurado');
        }
        this.setupNavigation();
    }

    getItsonIdFromURL() {
        const params = new URLSearchParams(window. location.search);
        return params.get('itsonId') || '252538';
    }

    async loadProjects() {
        try {
            const url = `${API_BASE}/publicProjects/${this.itsonId}`;
            console.log('📡 Cargando desde:', url);
            
            const response = await fetch(url);
            console.log('📊 Status:', response.status);
            
            const projects = await response.json();
            console.log('📦 Datos recibidos completos:', projects);
            console.log('📦 Es array:', Array.isArray(projects));
            console.log('📦 Largo:', projects.length);

            if (! response.ok) {
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(projects)}`);
            }

            if (Array.isArray(projects) && projects.length > 0) {
                console.log(`✅ Se encontraron ${projects.length} proyecto(s)`);
                this. renderProjects(projects);
            } else {
                console.warn('⚠️ Sin proyectos.  Respuesta:', projects);
                this.showError('No hay proyectos disponibles.  Verifica el Backoffice.');
            }
        } catch (error) {
            console.error('❌ Error completo:', error);
            this. showError(`Error: ${error.message}`);
        }
    }

    renderProjects(projects) {
        this.projectsList.innerHTML = '';

        projects.forEach((project, index) => {
            const card = this.createProjectCard(project);
            card.style.animationDelay = `${index * 0.1}s`;
            this.projectsList.appendChild(card);
        });
    }

    createProjectCard(project) {
        const card = document. createElement('div');
        card. className = 'project-item';

        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0]
            : 'https://via.placeholder.com/400x200? text=Project';

        const title = this.escapeHtml(project.title || 'Sin título');
        const description = this.escapeHtml(project. description || '');
        const technologies = Array.isArray(project.technologies) ? project.technologies : [];

        const techHtml = technologies.length > 0 
            ? `<div class="project-tech">${technologies.map(tech => 
                `<span class="tech-tag">${this.escapeHtml(tech)}</span>`
            ).join('')}</div>` 
            : '';

        const repoLink = project.repository 
            ? `<a href="${this.escapeHtml(project. repository)}" target="_blank" rel="noopener noreferrer" class="project-link">Ver proyecto</a>`
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
                if (window. pageYOffset >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link. classList.add('active');
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});