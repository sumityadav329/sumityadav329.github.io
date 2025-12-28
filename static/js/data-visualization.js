/**
 * Data Visualization in 3D Space
 * Creates floating data visualizations for skills and stats
 */

class DataVisualization {
    constructor(scene, portfolioScene) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.visualizations = [];

        this.init();
    }

    init() {
        // This will be populated with skill data later
        // For now, create a sample visualization
        this.createSampleVisualization();
    }

    createSampleVisualization() {
        const group = new THREE.Group();

        // Create floating data particles
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < particleCount; i++) {
            // Create a sphere of particles
            const radius = 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            // Color gradient from blue to purple
            const t = Math.random();
            colors.push(
                0.2 + t * 0.6,
                0.2,
                0.8 + t * 0.2
            );

            sizes.push(Math.random() * 2 + 1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        group.add(particles);

        group.position.set(20, 5, -20);
        this.scene.add(group);

        this.visualizations.push({
            group: group,
            particles: particles,
            rotationSpeed: 0.2
        });

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createBarChart(data, position) {
        const group = new THREE.Group();
        const barWidth = 0.5;
        const barSpacing = 1;
        const maxHeight = 5;

        data.forEach((value, index) => {
            const height = (value / 100) * maxHeight;
            const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.5 + index * 0.1, 0.8, 0.5),
                emissive: new THREE.Color().setHSL(0.5 + index * 0.1, 0.8, 0.3),
                emissiveIntensity: 0.3,
                metalness: 0.5,
                roughness: 0.3
            });

            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(
                index * barSpacing - (data.length * barSpacing) / 2,
                height / 2,
                0
            );

            group.add(bar);
        });

        group.position.copy(position);
        this.scene.add(group);

        return group;
    }

    animate(deltaTime, elapsedTime) {
        this.visualizations.forEach(viz => {
            viz.group.rotation.y += deltaTime * viz.rotationSpeed;

            // Gentle floating motion
            viz.group.position.y += Math.sin(elapsedTime * 0.5) * 0.01;
        });
    }

    addVisualization(type, data, position) {
        let viz;

        switch (type) {
            case 'bar':
                viz = this.createBarChart(data, position);
                break;
            // Add more visualization types as needed
        }

        if (viz) {
            this.visualizations.push({
                group: viz,
                rotationSpeed: 0.1
            });
        }
    }
}

window.DataVisualization = DataVisualization;
