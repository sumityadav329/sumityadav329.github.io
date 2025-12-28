/**
 * Projects Gallery - 3D Project Showcases
 * Displays projects as interactive 3D cards/screens
 */

class ProjectsGallery {
    constructor(scene, portfolioScene, raycaster) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.raycaster = raycaster;
        this.group = new THREE.Group();
        this.projects = [];

        this.init();
    }

    init() {
        // Project data
        const projectsData = [
            {
                name: 'AI Agents Hub App',
                description: 'AI Agents web application with debug code generation, chat, food analysis, and video summarization',
                url: 'https://agenticai-sumityadav329.streamlit.app/',
                color: 0x3498db
            },
            {
                name: 'AI Image Generator',
                description: 'Generate stunning photorealistic images from text prompts using cutting-edge AI',
                url: 'https://huggingface.co/spaces/sumityadav329/text-to-image-webapp',
                color: 0x9b59b6
            },
            {
                name: 'Book Recommender',
                description: 'NLP-based book recommendation system analyzing content for similar themes and styles',
                url: 'https://book-recommender-app-3q48.onrender.com/',
                color: 0x2ecc71
            }
        ];

        this.createProjectCards(projectsData);

        // Position the gallery
        this.group.position.set(0, 0, -60);
        this.scene.add(this.group);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createProjectCards(projectsData) {
        const spacing = 8;
        const startX = -(projectsData.length - 1) * spacing / 2;

        projectsData.forEach((projectData, index) => {
            // Create card
            const cardGroup = new THREE.Group();

            // Main card surface
            const geometry = new THREE.BoxGeometry(6, 4, 0.2);
            const material = new THREE.MeshStandardMaterial({
                color: projectData.color,
                emissive: projectData.color,
                emissiveIntensity: 0.2,
                metalness: 0.6,
                roughness: 0.3
            });

            const card = new THREE.Mesh(geometry, material);

            // Add frame
            const frameGeometry = new THREE.BoxGeometry(6.3, 4.3, 0.1);
            const frameMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.z = -0.15;
            card.add(frame);

            // Add glow effect
            const glowGeometry = new THREE.BoxGeometry(6.5, 4.5, 0.3);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: projectData.color,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            card.add(glow);

            cardGroup.add(card);

            // Position card
            cardGroup.position.set(startX + index * spacing, 0, 0);
            cardGroup.userData = {
                projectData: projectData,
                baseY: 0,
                floatOffset: index * 0.5
            };

            this.group.add(cardGroup);
            this.projects.push(cardGroup);

            // Make interactive
            this.raycaster.addInteractiveObject(
                card,
                (obj) => {
                    window.open(projectData.url, '_blank');
                },
                {
                    onEnter: (obj) => {
                        obj.material.emissiveIntensity = 0.6;
                        obj.parent.scale.setScalar(1.1);
                        obj.parent.position.z += 1;
                    },
                    onExit: (obj) => {
                        obj.material.emissiveIntensity = 0.2;
                        obj.parent.scale.setScalar(1);
                        obj.parent.position.z -= 1;
                    }
                }
            );
        });
    }

    animate(deltaTime, elapsedTime) {
        // Floating animation for cards
        this.projects.forEach(project => {
            const userData = project.userData;
            project.position.y = userData.baseY + Math.sin(elapsedTime * 0.5 + userData.floatOffset) * 0.3;

            // Gentle rotation
            project.rotation.y = Math.sin(elapsedTime * 0.2 + userData.floatOffset) * 0.05;
        });
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }
}

window.ProjectsGallery = ProjectsGallery;
