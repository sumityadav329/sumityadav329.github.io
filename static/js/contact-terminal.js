/**
 * Contact Terminal - Futuristic Contact Interface
 * Creates a 3D terminal-style contact section
 */

class ContactTerminal {
    constructor(scene, portfolioScene, raycaster) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.raycaster = raycaster;
        this.group = new THREE.Group();
        this.socialButtons = [];

        this.init();
    }

    init() {
        // Create terminal screen
        this.createTerminalScreen();

        // Create social media buttons
        this.createSocialButtons();

        // Position the terminal
        this.group.position.set(0, 0, -90);
        this.scene.add(this.group);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createTerminalScreen() {
        // Main terminal
        const geometry = new THREE.BoxGeometry(10, 6, 0.3);
        const material = new THREE.MeshStandardMaterial({
            color: 0x001a1a,
            emissive: 0x003333,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });

        const terminal = new THREE.Mesh(geometry, material);

        // Add screen glow
        const glowGeometry = new THREE.PlaneGeometry(9.5, 5.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = 0.16;
        terminal.add(glow);

        // Add border lines
        const borderMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 2
        });

        const borderPoints = [
            new THREE.Vector3(-4.75, 2.75, 0.16),
            new THREE.Vector3(4.75, 2.75, 0.16),
            new THREE.Vector3(4.75, -2.75, 0.16),
            new THREE.Vector3(-4.75, -2.75, 0.16),
            new THREE.Vector3(-4.75, 2.75, 0.16)
        ];

        const borderGeometry = new THREE.BufferGeometry().setFromPoints(borderPoints);
        const border = new THREE.Line(borderGeometry, borderMaterial);
        terminal.add(border);

        this.group.add(terminal);
    }

    createSocialButtons() {
        const socialData = [
            { name: 'GitHub', url: 'https://github.com/sumityadav329', color: 0x333333 },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/sumityadav329', color: 0x0077b5 },
            { name: 'Twitter', url: 'https://twitter.com/sumityadav329', color: 0x1da1f2 }
        ];

        const spacing = 4;
        const startX = -(socialData.length - 1) * spacing / 2;

        socialData.forEach((social, index) => {
            const geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
            const material = new THREE.MeshStandardMaterial({
                color: social.color,
                emissive: social.color,
                emissiveIntensity: 0.4,
                metalness: 0.7,
                roughness: 0.3
            });

            const button = new THREE.Mesh(geometry, material);
            button.position.set(startX + index * spacing, -4, 0);
            button.rotation.x = Math.PI / 2;

            // Add glow
            const glowGeometry = new THREE.CylinderGeometry(1, 1, 0.4, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: social.color,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            button.add(glow);

            this.group.add(button);
            this.socialButtons.push(button);

            // Make interactive
            this.raycaster.addInteractiveObject(
                button,
                () => {
                    window.open(social.url, '_blank');
                },
                {
                    onEnter: (obj) => {
                        obj.material.emissiveIntensity = 0.8;
                        obj.scale.setScalar(1.2);
                    },
                    onExit: (obj) => {
                        obj.material.emissiveIntensity = 0.4;
                        obj.scale.setScalar(1);
                    }
                }
            );
        });
    }

    animate(deltaTime, elapsedTime) {
        // Pulse social buttons
        this.socialButtons.forEach((button, index) => {
            const offset = index * 0.5;
            const pulse = Math.sin(elapsedTime * 2 + offset) * 0.1;
            button.position.y = -4 + pulse;
        });
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }
}

window.ContactTerminal = ContactTerminal;
