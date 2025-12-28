/**
 * Asset Loader with Progress Tracking
 * Manages loading of 3D assets and displays loading screen
 */

class PortfolioLoader {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        this.loadingBar = document.getElementById('loading-bar');

        this.setupLoadingManager();
    }

    setupLoadingManager() {
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log(`Started loading: ${url}`);
            this.updateLoadingText('Initializing AI Systems...');
        };

        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            this.updateProgress(progress);

            // Update loading text based on progress
            if (progress < 30) {
                this.updateLoadingText('Loading Neural Networks...');
            } else if (progress < 60) {
                this.updateLoadingText('Compiling Shaders...');
            } else if (progress < 90) {
                this.updateLoadingText('Initializing 3D Environment...');
            } else {
                this.updateLoadingText('Almost Ready...');
            }
        };

        this.loadingManager.onLoad = () => {
            console.log('Loading complete!');
            this.updateProgress(100);
            this.updateLoadingText('Welcome to the Future');

            // Fade out loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 500);
        };

        this.loadingManager.onError = (url) => {
            console.error(`Error loading: ${url}`);
            this.updateLoadingText('Error loading assets');
        };
    }

    updateProgress(progress) {
        if (this.loadingBar) {
            this.loadingBar.style.width = `${progress}%`;
        }
        if (this.loadingProgress) {
            this.loadingProgress.textContent = `${Math.round(progress)}%`;
        }
    }

    updateLoadingText(text) {
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 1000);
        }
    }

    getTextureLoader() {
        return this.textureLoader;
    }

    getLoadingManager() {
        return this.loadingManager;
    }
}

window.PortfolioLoader = PortfolioLoader;
