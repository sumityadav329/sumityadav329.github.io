/**
 * Neural Network Visualization
 * Creates an animated 3D neural network with nodes and connections
 */

class NeuralNetwork {
    constructor(scene, portfolioScene) {
        this.scene = scene;
        this.portfolioScene = portfolioScene;
        this.nodes = [];
        this.connections = [];
        this.group = new THREE.Group();

        this.init();
    }

    init() {
        // Create network structure (3 layers)
        const layers = [
            { count: 5, z: -10 },
            { count: 8, z: 0 },
            { count: 5, z: 10 }
        ];

        const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });

        // Create nodes for each layer
        layers.forEach((layer, layerIndex) => {
            const layerNodes = [];
            const spacing = 3;
            const startY = -(layer.count - 1) * spacing / 2;

            for (let i = 0; i < layer.count; i++) {
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
                node.position.set(
                    layerIndex * 8 - 8,
                    startY + i * spacing,
                    layer.z
                );

                // Add glow effect
                const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.2,
                    blending: THREE.AdditiveBlending
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                node.add(glow);

                this.group.add(node);
                layerNodes.push(node);
            }
            this.nodes.push(layerNodes);
        });

        // Create connections between layers
        for (let i = 0; i < layers.length - 1; i++) {
            this.createConnections(this.nodes[i], this.nodes[i + 1]);
        }

        // Position the network
        this.group.position.set(-20, 0, -20);
        this.group.rotation.y = Math.PI / 4;
        this.scene.add(this.group);

        // Register animation
        this.portfolioScene.registerAnimationCallback((deltaTime, elapsedTime) => {
            this.animate(deltaTime, elapsedTime);
        });
    }

    createConnections(fromLayer, toLayer) {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        fromLayer.forEach(fromNode => {
            toLayer.forEach(toNode => {
                const points = [
                    fromNode.position.clone(),
                    toNode.position.clone()
                ];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial.clone());

                this.group.add(line);
                this.connections.push({
                    line: line,
                    from: fromNode,
                    to: toNode
                });
            });
        });
    }

    animate(deltaTime, elapsedTime) {
        // Pulse nodes
        this.nodes.forEach((layer, layerIndex) => {
            layer.forEach((node, nodeIndex) => {
                const offset = layerIndex * 0.5 + nodeIndex * 0.1;
                const pulse = Math.sin(elapsedTime * 2 + offset) * 0.3 + 0.7;
                node.material.emissiveIntensity = pulse;
                node.scale.setScalar(0.8 + pulse * 0.2);
            });
        });

        // Animate connection opacity (data flow effect)
        this.connections.forEach((conn, index) => {
            const offset = index * 0.1;
            const flow = Math.sin(elapsedTime * 3 + offset);
            conn.line.material.opacity = 0.2 + Math.abs(flow) * 0.3;
        });

        // Gentle rotation
        this.group.rotation.y += deltaTime * 0.1;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    setScale(scale) {
        this.group.scale.setScalar(scale);
    }

    toggle(visible) {
        this.group.visible = visible;
    }
}

window.NeuralNetwork = NeuralNetwork;
