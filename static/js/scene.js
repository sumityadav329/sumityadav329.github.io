/**
 * Main 3D Scene Setup for Interactive Portfolio
 * Handles scene initialization, camera, renderer, and lighting
 */

class PortfolioScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.animationCallbacks = [];
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000510, 0.0008);

        // Setup camera
        this.setupCamera();
        
        // Setup renderer
        this.setupRenderer();
        
        // Setup lights
        this.setupLights();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Start animation loop
        this.animate();
    }

    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Add canvas to DOM
        const canvas = this.renderer.domElement;
        canvas.id = 'portfolio-canvas';
        document.getElementById('canvas-container').appendChild(canvas);
    }

    setupLights() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x4488ff, 0.3);
        this.scene.add(ambientLight);

        // Main directional light (sun-like)
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 500;
        this.scene.add(mainLight);

        // Accent lights for AI/ML theme (cyan and purple)
        const accentLight1 = new THREE.PointLight(0x00ffff, 1, 50);
        accentLight1.position.set(-15, 10, -15);
        this.scene.add(accentLight1);

        const accentLight2 = new THREE.PointLight(0xff00ff, 1, 50);
        accentLight2.position.set(15, 10, -15);
        this.scene.add(accentLight2);

        // Hemisphere light for natural color gradient
        const hemiLight = new THREE.HemisphereLight(0x4488ff, 0x002244, 0.4);
        this.scene.add(hemiLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    registerAnimationCallback(callback) {
        this.animationCallbacks.push(callback);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Call all registered animation callbacks
        this.animationCallbacks.forEach(callback => {
            callback(deltaTime, elapsedTime);
        });

        this.renderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}

// Export for use in other modules
window.PortfolioScene = PortfolioScene;
