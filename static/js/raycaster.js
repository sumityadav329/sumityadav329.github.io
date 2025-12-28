/**
 * Raycaster for 3D Object Interaction
 * Handles mouse/touch picking and interaction with 3D objects
 */

class PortfolioRaycaster {
    constructor(camera, domElement, scene) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactiveObjects = [];
        this.hoveredObject = null;
        this.clickCallbacks = new Map();
        this.hoverCallbacks = new Map();

        this.init();
    }

    init() {
        // Mouse move for hover detection
        this.domElement.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        }, false);

        // Click detection
        this.domElement.addEventListener('click', (event) => {
            this.onClick(event);
        }, false);

        // Touch support for mobile
        this.domElement.addEventListener('touchstart', (event) => {
            this.onTouchStart(event);
        }, false);
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.checkIntersections();
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

            this.checkIntersections();
            this.handleClick();
        }
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.handleClick();
    }

    checkIntersections() {
        if (this.interactiveObjects.length === 0) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;

            // Handle hover state change
            if (this.hoveredObject !== object) {
                // Mouse left previous object
                if (this.hoveredObject) {
                    this.onHoverExit(this.hoveredObject);
                }

                // Mouse entered new object
                this.hoveredObject = object;
                this.onHoverEnter(object);
                this.domElement.style.cursor = 'pointer';
            }
        } else {
            // No intersection
            if (this.hoveredObject) {
                this.onHoverExit(this.hoveredObject);
                this.hoveredObject = null;
                this.domElement.style.cursor = 'default';
            }
        }
    }

    handleClick() {
        if (this.interactiveObjects.length === 0) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.onClick3DObject(object, intersects[0]);
        }
    }

    onHoverEnter(object) {
        const callback = this.hoverCallbacks.get(object.uuid);
        if (callback && callback.onEnter) {
            callback.onEnter(object);
        }
    }

    onHoverExit(object) {
        const callback = this.hoverCallbacks.get(object.uuid);
        if (callback && callback.onExit) {
            callback.onExit(object);
        }
    }

    onClick3DObject(object, intersection) {
        const callback = this.clickCallbacks.get(object.uuid);
        if (callback) {
            callback(object, intersection);
        }
    }

    addInteractiveObject(object, clickCallback = null, hoverCallbacks = null) {
        if (!this.interactiveObjects.includes(object)) {
            this.interactiveObjects.push(object);
        }

        if (clickCallback) {
            this.clickCallbacks.set(object.uuid, clickCallback);
        }

        if (hoverCallbacks) {
            this.hoverCallbacks.set(object.uuid, hoverCallbacks);
        }
    }

    removeInteractiveObject(object) {
        const index = this.interactiveObjects.indexOf(object);
        if (index > -1) {
            this.interactiveObjects.splice(index, 1);
        }
        this.clickCallbacks.delete(object.uuid);
        this.hoverCallbacks.delete(object.uuid);
    }

    getHoveredObject() {
        return this.hoveredObject;
    }
}

window.PortfolioRaycaster = PortfolioRaycaster;
