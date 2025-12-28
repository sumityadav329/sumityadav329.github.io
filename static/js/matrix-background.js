/**
 * Matrix-style Background Effect
 * Creates falling code/binary rain effect for AI/ML theme
 */

class MatrixBackground {
    constructor(scene, portfolioScene) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.particles = null;
        this.particleCount = 2000;

        this.init();
    }

    init() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const colors = [];

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            // Random position in a large area
            positions.push(
                (Math.random() - 0.5) * 100,
                Math.random() * 100,
                (Math.random() - 0.5) * 100
            );

            // Random velocity (falling speed)
            velocities.push(Math.random() * 0.5 + 0.1);

            // Color variation (green to cyan for matrix effect)
            const colorChoice = Math.random();
            if (colorChoice < 0.7) {
                colors.push(0, 1, 0.3); // Green
            } else if (colorChoice < 0.9) {
                colors.push(0, 1, 1); // Cyan
            } else {
                colors.push(0.5, 0.5, 1); // Light blue
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Create material
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime) => this.animate(deltaTime));
    }

    animate(deltaTime) {
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.attributes.velocity.array;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Move particle down
            positions[i3 + 1] -= velocities[i] * deltaTime * 20;

            // Reset particle when it goes below threshold
            if (positions[i3 + 1] < -50) {
                positions[i3 + 1] = 50;
                positions[i3] = (Math.random() - 0.5) * 100;
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    setOpacity(opacity) {
        this.particles.material.opacity = opacity;
    }

    toggle(visible) {
        this.particles.visible = visible;
    }
}

window.MatrixBackground = MatrixBackground;
