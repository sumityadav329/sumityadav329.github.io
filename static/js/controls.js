/**
 * Camera Controls for Interactive Portfolio
 * Handles user input for navigating the 3D space
 */

class PortfolioControls {
    constructor(camera, domElement, portfolioScene) {
        this.camera = camera;
        this.domElement = domElement;
        this.portfolioScene = portfolioScene;
        this.controls = null;
        this.targetPosition = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3();
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // Use OrbitControls for smooth camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.domElement);

        // Configure controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;

        // Keyboard controls
        this.setupKeyboardControls();

        // Register update in animation loop
        this.portfolioScene.registerAnimationCallback(() => this.update());
    }

    setupKeyboardControls() {
        const moveSpeed = 0.5;
        const keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            shift: false
        };

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key in keys) {
                keys[key] = true;
            }
            if (e.key === 'Shift') {
                keys.shift = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key in keys) {
                keys[key] = false;
            }
            if (e.key === 'Shift') {
                keys.shift = false;
            }
        });

        // Apply keyboard movement in animation loop
        this.portfolioScene.registerAnimationCallback(() => {
            if (this.isTransitioning) return;

            const speed = keys.shift ? moveSpeed * 2 : moveSpeed;
            const direction = new THREE.Vector3();

            if (keys.w) direction.z -= speed;
            if (keys.s) direction.z += speed;
            if (keys.a) direction.x -= speed;
            if (keys.d) direction.x += speed;

            if (direction.length() > 0) {
                direction.applyQuaternion(this.camera.quaternion);
                this.camera.position.add(direction);
                this.controls.target.add(direction);
            }
        });
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }

        // Smooth transition to target position
        if (this.isTransitioning) {
            this.camera.position.lerp(this.targetPosition, 0.05);
            this.controls.target.lerp(this.targetLookAt, 0.05);

            const distance = this.camera.position.distanceTo(this.targetPosition);
            if (distance < 0.1) {
                this.isTransitioning = false;
            }
        }
    }

    moveTo(position, lookAt, duration = 1000) {
        this.targetPosition.copy(position);
        this.targetLookAt.copy(lookAt);
        this.isTransitioning = true;
    }

    enableAutoRotate(enable = true) {
        this.controls.autoRotate = enable;
    }

    getControls() {
        return this.controls;
    }
}

window.PortfolioControls = PortfolioControls;
