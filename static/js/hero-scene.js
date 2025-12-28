/**
 * Hero Scene - 3D Landing Area
 * Creates the main landing experience with holographic elements
 */

class HeroScene {
    constructor(scene, portfolioScene, raycaster) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.raycaster = raycaster;
        this.group = new THREE.Group();
        this.nameText = null;
        this.resumeButton = null;

        this.init();
    }

    init() {
        // Create holographic name display
        this.createNameDisplay();

        // Create floating resume button
        this.createResumeButton();

        // Create ambient particles
        this.createAmbientParticles();

        // Position the hero scene
        this.group.position.set(0, 0, 0);
        this.scene.add(this.group);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createNameDisplay() {
        // Create a glowing plane for the name
        const geometry = new THREE.PlaneGeometry(12, 3);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            metalness: 0.8,
            roughness: 0.2
        });

        this.nameText = new THREE.Mesh(geometry, material);
        this.nameText.position.set(0, 8, -5);

        // Add border glow
        const borderGeometry = new THREE.PlaneGeometry(12.5, 3.5);
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        this.nameText.add(border);

        this.group.add(this.nameText);
    }

    createResumeButton() {
        // Create 3D button
        const geometry = new THREE.BoxGeometry(4, 1, 0.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x4fcf70,
            emissive: 0x2ecc71,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.3
        });

        this.resumeButton = new THREE.Mesh(geometry, material);
        this.resumeButton.position.set(0, 5, -5);

        // Add glow effect
        const glowGeometry = new THREE.BoxGeometry(4.3, 1.3, 0.8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4fcf70,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.resumeButton.add(glow);

        this.group.add(this.resumeButton);

        // Make it interactive
        this.raycaster.addInteractiveObject(
            this.resumeButton,
            () => {
                // Download resume
                window.open('static/pdf/Resume_Sumit_Yadav.pdf', '_blank');
            },
            {
                onEnter: (obj) => {
                    obj.material.emissiveIntensity = 0.8;
                    obj.scale.setScalar(1.1);
                },
                onExit: (obj) => {
                    obj.material.emissiveIntensity = 0.4;
                    obj.scale.setScalar(1);
                }
            }
        );
    }

    createAmbientParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 20,
                Math.random() * 15,
                (Math.random() - 0.5) * 10 - 5
            );

            colors.push(0, 1, 1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.group.add(particles);
    }

    animate(deltaTime, elapsedTime) {
        // Gentle floating animation for name
        if (this.nameText) {
            this.nameText.position.y = 8 + Math.sin(elapsedTime * 0.5) * 0.3;
            this.nameText.rotation.y = Math.sin(elapsedTime * 0.3) * 0.05;
        }

        // Pulse resume button
        if (this.resumeButton) {
            const pulse = Math.sin(elapsedTime * 2) * 0.2 + 0.8;
            this.resumeButton.material.emissiveIntensity = 0.4 + pulse * 0.2;
        }
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }
}

window.HeroScene = HeroScene;
