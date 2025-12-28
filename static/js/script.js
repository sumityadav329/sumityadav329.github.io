/**
 * Main Application - Initializes and Coordinates All 3D Components
 */

// Check for WebGL support
function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

// Initialize the 3D portfolio
function init3DPortfolio() {
    // Check WebGL support
    if (!checkWebGLSupport()) {
        console.warn('WebGL not supported, falling back to 2D version');
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('fallback-content').style.display = 'block';
        return;
    }

    // Initialize loader
    const loader = new PortfolioLoader();

    // Initialize scene
    const portfolioScene = new PortfolioScene();
    const scene = portfolioScene.getScene();
    const camera = portfolioScene.getCamera();
    const renderer = portfolioScene.getRenderer();

    // Initialize controls
    const controls = new PortfolioControls(camera, renderer.domElement, portfolioScene);

    // Initialize raycaster for interactions
    const raycaster = new PortfolioRaycaster(camera, renderer.domElement, scene);

    // Create background effects
    const matrixBg = new MatrixBackground(scene, portfolioScene);
    const neuralNet = new NeuralNetwork(scene, portfolioScene);
    const dataViz = new DataVisualization(scene, portfolioScene);

    // Create content sections
    const heroScene = new HeroScene(scene, portfolioScene, raycaster);
    const skillsWorld = new SkillsWorld(scene, portfolioScene, raycaster);
    const projectsGallery = new ProjectsGallery(scene, portfolioScene, raycaster);
    const contactTerminal = new ContactTerminal(scene, portfolioScene, raycaster);

    // Setup navigation system
    setupNavigation(controls, {
        home: { position: new THREE.Vector3(0, 5, 15), lookAt: new THREE.Vector3(0, 0, 0) },
        skills: { position: new THREE.Vector3(0, 5, -15), lookAt: new THREE.Vector3(0, 0, -30) },
        projects: { position: new THREE.Vector3(0, 5, -45), lookAt: new THREE.Vector3(0, 0, -60) },
        contact: { position: new THREE.Vector3(0, 5, -75), lookAt: new THREE.Vector3(0, 0, -90) }
    });

    // Setup UI event listeners
    setupUIListeners();

    console.log('3D Portfolio initialized successfully!');
}

function setupNavigation(controls, sections) {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-3d-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const section = btn.dataset.section;

            if (sections[section]) {
                controls.moveTo(
                    sections[section].position,
                    sections[section].lookAt
                );
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case '1':
                controls.moveTo(sections.home.position, sections.home.lookAt);
                break;
            case '2':
                controls.moveTo(sections.skills.position, sections.skills.lookAt);
                break;
            case '3':
                controls.moveTo(sections.projects.position, sections.projects.lookAt);
                break;
            case '4':
                controls.moveTo(sections.contact.position, sections.contact.lookAt);
                break;
        }
    });
}

function setupUIListeners() {
    // Skill details modal
    window.addEventListener('showSkillDetails', (e) => {
        const skillData = e.detail;
        const modal = document.getElementById('skill-modal');
        const modalContent = document.getElementById('skill-modal-content');

        if (modal && modalContent) {
            modalContent.innerHTML = `
                <h3>${skillData.name}</h3>
                <p>Category: ${skillData.category.toUpperCase()}</p>
                <p>Proficiency: ${skillData.proficiency}%</p>
                <div class="skill-bar">
                    <div class="skill-bar-fill" style="width: ${skillData.proficiency}%"></div>
                </div>
            `;
            modal.style.display = 'flex';
        }
    });

    // Close modal
    const modal = document.getElementById('skill-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Help toggle
    const helpBtn = document.getElementById('help-btn');
    const helpPanel = document.getElementById('help-panel');

    if (helpBtn && helpPanel) {
        helpBtn.addEventListener('click', () => {
            helpPanel.classList.toggle('visible');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DPortfolio);
} else {
    init3DPortfolio();
}