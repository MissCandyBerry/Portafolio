// Punto base de la API pública del portafolio
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

class Portfolio {
    constructor() {
        // Contenedor donde se pintan las tarjetas de proyectos
        this.projectsList = document.getElementById('projects-list');

        // Intento obtener el itsonId desde distintos lugares (URL, localStorage, por defecto)
        this.itsonId = this.getItsonIdFromURL();
        console.log('🔍 ITSon ID configurado:', this.itsonId);

        // Inicializo todo apenas se crea la instancia
        this.init();
    }

    async init() {
        // Si tenemos un itsonId, intentamos cargar los proyectos
        if (this.itsonId) {
            await this.loadProjects();
        } else {
            // Si no hay id, muestro un mensaje para que el usuario sepa cómo configurarlo
            this.showError('ITSon ID no configurado. Agrega ?itsonId=TU_ID en la URL.');
        }
        // Activo el comportamiento del menú de navegación (resalta sección activa y hace scroll suave)
        this.setupNavigation();
    }

    getItsonIdFromURL() {
        // 1) Primero, reviso si viene como query param en la URL
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('itsonId');

        if (fromQuery) return fromQuery;

        // 2) Si no está en la URL, intento leerlo del localStorage
        // Esto es útil si vengo de un backoffice donde guardé el usuario
        try {
            const rawUser = localStorage.getItem('user');
            if (rawUser) {
                const user = JSON.parse(rawUser);
                if (user && (user.itsonId || user.itsonID)) {
                    return user.itsonId || user.itsonID;
                }
            }
        } catch (_) {
            // Si el parse falla, no rompo la app; sigo con el default
        }

        // 3) Último recurso: uso un valor por defecto para poder probar rápido
        return '252538';
    }

    async loadProjects() {
        try {
            // Construyo la URL de la API con el itsonId actual
            const url = `${API_BASE}/publicProjects/${this.itsonId}`;
            console.log('📡 Cargando desde:', url);
            
            // Hago la petición a la API
            const response = await fetch(url);
            console.log('📊 Status:', response.status);
            
            // Intento parsear el cuerpo como JSON siempre, para ver el detalle (ok o error)
            const projects = await response.json();
            console.log('📦 Datos recibidos completos:', projects);

            // Si la respuesta no es ok, lanzo un error con el status y el cuerpo
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${JSON.stringify(projects)}`);
            }

            // Si trae proyectos, los pinto; si no, aviso que no hay datos
            if (Array.isArray(projects) && projects.length > 0) {
                console.log(`✅ Se encontraron ${projects.length} proyecto(s)`);
                this.renderProjects(projects);
            } else {
                console.warn('⚠️ Sin proyectos. Respuesta:', projects);
                this.showError('No hay proyectos disponibles. Verifica el Backoffice.');
            }
        } catch (error) {
            // Ante cualquier fallo (red, parseo, etc.), muestro el error en pantalla
            console.error('❌ Error completo:', error);
            this.showError(`Error: ${error.message}`);
        }
    }

    renderProjects(projects) {
        // Limpio el contenedor antes de renderizar
        this.projectsList.innerHTML = '';

        // Por cada proyecto, creo su tarjeta y le asigno un pequeño delay para un efecto bonito
        projects.forEach((project, index) => {
            const card = this.createProjectCard(project);
            card.style.animationDelay = `${index * 0.1}s`;
            this.projectsList.appendChild(card);
        });
    }

    createProjectCard(project) {
        // Contenedor principal de la tarjeta
        const card = document.createElement('div');
        card.className = 'project-item';

        // Si no hay imagen, uso un placeholder para evitar tarjetas vacías
        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0]
            : 'https://via.placeholder.com/400x200?text=Project';

        // Título y descripción saneados para evitar inyecciones extrañas en el DOM
        const title = this.escapeHtml(project.title || 'Sin título');
        const description = this.escapeHtml(project.description || '');

        // Tecnologías como lista de etiquetas, si existen
        const technologies = Array.isArray(project.technologies) ? project.technologies : [];

        const techHtml = technologies.length > 0 
            ? `<div class="project-tech">${technologies.map(tech => 
                `<span class="tech-tag">${this.escapeHtml(tech)}</span>`
            ).join('')}</div>` 
            : '';

        // Enlace al repositorio si viene en los datos (abre en pestaña nueva)
        const repoLink = project.repository 
            ? `<a href="${this.escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer" class="project-link">Ver proyecto</a>`
            : '';

        // Armo el HTML interno de la tarjeta
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
        // Muestra un bloque ocupando todo el grid para mensajes de error o estados vacíos
        this.projectsList.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <p>${message}</p>
            </div>
        `;
    }

    setupNavigation() {
        // Tomo todos los enlaces del menú y las secciones del contenido
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        // Al hacer scroll, detecto qué sección está activa para resaltar su enlace
        window.addEventListener('scroll', () => {
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // Cuando el scroll supera el comienzo de la sección menos un margen, la considero activa
                if (window.pageYOffset >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Quito la clase active de todos y se la pone al enlace de la sección actual
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });

        // Intercepto el click para hacer un scroll suave hacia la sección en vez de salto brusco
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
        // Sanea el texto colocando el contenido como textContent, luego lo leo como HTML seguro
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Arranco el portafolio cuando el DOM ya está listo
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});