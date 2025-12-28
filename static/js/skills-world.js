/**
 * Skills World - 3D Skills Visualization
 * Displays skills as floating 3D orbs in a planetary system
 */

class SkillsWorld {
    constructor(scene, portfolioScene, raycaster) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.raycaster = raycaster;
        this.group = new THREE.Group();
        this.skills = [];

        this.init();
    }

    init() {
        // Define skills with categories and proficiency
        const skillsData = [
            // Machine Learning (Blue)
            { name: 'Python', category: 'ml', proficiency: 95, color: 0x3498db },
            { name: 'TensorFlow', category: 'ml', proficiency: 85, color: 0x3498db },
            { name: 'PyTorch', category: 'ml', proficiency: 80, color: 0x3498db },
            { name: 'Scikit-Learn', category: 'ml', proficiency: 90, color: 0x3498db },

            // Deep Learning (Purple)
            { name: 'Neural Networks', category: 'dl', proficiency: 85, color: 0x9b59b6 },
            { name: 'CNNs', category: 'dl', proficiency: 80, color: 0x9b59b6 },
            { name: 'LLMs', category: 'dl', proficiency: 75, color: 0x9b59b6 },
            { name: 'Gen AI', category: 'dl', proficiency: 80, color: 0x9b59b6 },

            // Tools & Platforms (Green)
            { name: 'Docker', category: 'tools', proficiency: 85, color: 0x2ecc71 },
            { name: 'AWS', category: 'tools', proficiency: 75, color: 0x2ecc71 },
            { name: 'Git', category: 'tools', proficiency: 90, color: 0x2ecc71 },
            { name: 'MongoDB', category: 'tools', proficiency: 80, color: 0x2ecc71 },
        ];

        this.createSkillOrbs(skillsData);

        // Position the skills world
        this.group.position.set(0, 0, -30);
        this.scene.add(this.group);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createSkillOrbs(skillsData) {
        const radius = 8;
        const angleStep = (Math.PI * 2) / skillsData.length;

        skillsData.forEach((skillData, index) => {
            const angle = angleStep * index;
            const size = 0.3 + (skillData.proficiency / 100) * 0.5;

            // Create orb
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: skillData.color,
                emissive: skillData.color,
                emissiveIntensity: 0.3,
                metalness: 0.8,
                roughness: 0.2,
                transparent: true,
                opacity: 0.9
            });

            const orb = new THREE.Mesh(geometry, material);

            // Position in orbit
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 2;

            orb.position.set(x, y, z);
            orb.userData = {
                skillData: skillData,
                angle: angle,
                radius: radius,
                baseY: y,
                orbitSpeed: 0.1 + Math.random() * 0.1
            };

            // Add glow
            const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: skillData.color,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            orb.add(glow);

            this.group.add(orb);
            this.skills.push(orb);

            // Make interactive
            this.raycaster.addInteractiveObject(
                orb,
                (obj) => {
                    console.log('Clicked skill:', obj.userData.skillData.name);
                    this.showSkillDetails(obj.userData.skillData);
                },
                {
                    onEnter: (obj) => {
                        obj.material.emissiveIntensity = 0.8;
                        obj.scale.setScalar(1.3);
                    },
                    onExit: (obj) => {
                        obj.material.emissiveIntensity = 0.3;
                        obj.scale.setScalar(1);
                    }
                }
            );
        });
    }

    showSkillDetails(skillData) {
        // Show skill details in UI overlay
        const event = new CustomEvent('showSkillDetails', {
            detail: skillData
        });
        window.dispatchEvent(event);
    }

    animate(deltaTime, elapsedTime) {
        // Orbit skills around center
        this.skills.forEach(skill => {
            const userData = skill.userData;
            userData.angle += deltaTime * userData.orbitSpeed;

            skill.position.x = Math.cos(userData.angle) * userData.radius;
            skill.position.z = Math.sin(userData.angle) * userData.radius;
            skill.position.y = userData.baseY + Math.sin(elapsedTime * 0.5 + userData.angle) * 0.5;

            // Rotate orbs
            skill.rotation.y += deltaTime * 0.5;
        });

        // Gentle rotation of entire group
        this.group.rotation.y += deltaTime * 0.05;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }
}

window.SkillsWorld = SkillsWorld;
