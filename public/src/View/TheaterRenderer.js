import * as THREE from 'three';
import { GLTFLoader } from '../../three/examples/jsm/loaders/GLTFLoader.js';
import { RenderPass } from '../../three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from '../../three/examples/jsm/postprocessing/EffectComposer.js';

export class TheaterRenderer {
    scene;
    renderer;

    textureLoader = new THREE.TextureLoader();
    gltfLoader = new GLTFLoader();

    geometries = {};
    materials = {}

    baseMaterials = {
        explosion: { map: 'explosion.png', wrap: { x: 1, y: 1 }, transparent: true },
    }

    baseVideos = {
        circle: { name: 'circle' },
    }

    baseModels = {
        earth: { name: 'earth' }
    }

    constructor(uiManager) {
        THREE.ColorManagement.enabled = true;
        this.uiManager = uiManager;
        this.uiRenderer = uiManager.uiRenderer;

        this.scene = new THREE.Scene();
        this.environmentScene = new THREE.Scene();
        this.environmentScene.name = 'Enviromment';
        this.scene.add(this.environmentScene);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, transparent: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding

        this.renderer.toneMapping = THREE.CineonToneMapping;

        this.canvas = this.renderer.domElement;
        this.canvas.hidden = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene)

        addEventListener('resize', () => this.resize());

        this.init()
    }

    async init() {
        for (const key in this.baseMaterials) {
            this.materials[key] = await this.createMaterial(this.baseMaterials[key].map, THREE.MeshStandardMaterial, this.baseMaterials[key].wrap, this.baseMaterials[key].transparent);
        }
        this.loadModels(Object.values(this.baseModels));
    }


    /**
     * resize() redimmentionne le canvas dans son parent actuel si besoin
    */
    resize() {
        if (this.parent) {
            const rect = this.parent.getBoundingClientRect();
            this.renderScene.camera.aspect = rect.width / rect.height;
            this.renderScene.camera.updateProjectionMatrix();
            this.renderer.setSize(rect.width, rect.height);
            this.composer.setSize(rect.width, rect.height);
            this.renderScene.setSize(rect.width, rect.height);
            this.parent.appendChild(this.canvas);
        }
    }

    /**
     * loadScene() charge une scène 3D et place le canvas à l'endroit souhaité d'une page
     * @param {Object} scene 
     * @param {*} parent 
     */
    loadTheater(parent) {
        // Nettoyage de la scène précédente
        this.purgeScene(true);
        // Placement du canvas
        const rect = parent.getBoundingClientRect();
        this.renderer.setSize(rect.width, rect.height);
        this.renderScene.setSize(rect.width * window.devicePixelRatio, rect.height * window.devicePixelRatio);
        parent.appendChild(this.canvas);
        this.parent = parent;
        this.canvas.hidden = false;
    }

    /**
     * render() genere une image de l'état actuel du jeu
    */
    render() {
        if (this.renderScene.camera) {
            this.composer.render()
        }
    }

    /**
    * loadModels() charge les modeles contenus dans le tableau models et les transforme en géométrie de scène
    * réutilisable
    * @param {Array<String>} models Modeles d'une map
    */
    async loadModels(models) {
        return new Promise((resolve, reject) => {
            const loader = this.gltfLoader;
            let loadedCount = 0;

            for (let i = 0; i < models.length; i++) {
                const model = models[i].name;
                loader.load(
                    `assets/models/${models[i].asset ?? models[i].name}.glb`,
                    (gltf) => {
                        const geometry = gltf.scene.children[0].geometry;
                        this.geometries[model] = geometry;
                        let ogMaterials;

                        if (Array.isArray(gltf.scene.children[0].material)) {
                            ogMaterials = gltf.scene.children[0].material.map(material => {
                                const basicMaterial = new THREE.MeshStandardMaterial();
                                basicMaterial.copy(material);
                                if (basicMaterial.map) {
                                    basicMaterial.map.magFilter = THREE.NearestFilter;
                                    basicMaterial.map.minFilter = THREE.NearestFilter;
                                }
                                return basicMaterial;
                            });
                        } else {
                            let basicMaterial;
                            if (models[i].matType === undefined) {
                                basicMaterial = new THREE.MeshStandardMaterial({ transparent: true, });
                            } else {
                                basicMaterial = new models[i].matType();
                            }
                            basicMaterial.copy(gltf.scene.children[0].material);
                            basicMaterial.transparent = false;
                            basicMaterial.depthWrite = true;
                            basicMaterial.alphaTest = 0.5;
                            if (basicMaterial.map) {
                                basicMaterial.map.magFilter = THREE.NearestFilter;
                                basicMaterial.map.minFilter = THREE.NearestFilter;
                            }
                            ogMaterials = [basicMaterial];
                        }

                        if (ogMaterials[0].map) {
                            this.materials[model] = ogMaterials[0];
                        }

                        loadedCount++;
                        if (loadedCount === models.length) {
                            resolve();
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('An error occurred while loading the model:', error);
                        reject(error);
                    }
                );
            }
        });
    }

    /**
     * purgeScene() nettoie la scène 3D de toute entité
     */
    purgeScene() {
        if (this.environmentScene.children) {
            while (this.environmentScene.children.length > 0) {
                this.environmentScene.remove(this.environmentScene.children[0]);
            }
        }

    }

    /**
     * createMesh génere un modele à une position
     * @param {string} model 
     * @param {object} position 
     */
    createMesh(model, position, rotation, scale) {
        const mesh = new THREE.Mesh(this.geometries[model], this.materials[model]);
        this.scene.add(mesh);
        if (position) {
            mesh.position.set(position.x, position.y, position.z);
        }
        if (rotation) {
            mesh.rotation.set(rotation.x * Math.PI / 180, rotation.y * Math.PI / 180, rotation.z * Math.PI / 180);
        }
        if (scale) {
            mesh.scale.set(scale.x, scale.y, scale.z);
        }
        return mesh;
    }


    /**
     * createMaterial() charge une texture three.js et la retourne sous forme de promesse.
     * @param {string} texturePath Chemin de la texture à charger.
     * @returns {Promise<THREE.Texture>} Promesse résolue avec la texture chargée.
     */
    async createMaterial(texturePath, type = THREE.MeshStandardMaterial, wrap = { x: 8, y: 8 }, transparent = false) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                `assets/sprites/textures/${texturePath}`,
                (tex) => {
                    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                    tex.repeat.set(wrap.x, wrap.y);
                    tex.anisotropy = 16
                    tex.magFilter = THREE.NearestFilter;
                    tex.minFilter = THREE.NearestFilter;
                    const material = new type({ map: tex, side: THREE.DoubleSide, transparent });
                    resolve(material);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
 * loadVideos() charge les videos du tableau videos et les transforme en materiaux
 * @param {Array<Object>} textures textures d'une map
*/
    async loadVideos(videos) {
        // Get the parent element
        const parentElement = document.querySelector('.animatedtextures');
        // Clear the parent element
        // parentElement.innerHTML = '';
        return new Promise((resolve, reject) => {
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                const videoElement = document.createElement('video');
                videoElement.id = video.name;
                videoElement.autoplay = true;
                videoElement.loop = true;
                videoElement.muted = true;
                videoElement.src = `./assets/animtex/${video.name}.webm`;
                parentElement.appendChild(videoElement);
                videoElement.play();
                const videoTexture = new THREE.VideoTexture(videoElement);
                this.materials[video.name] = new THREE.MeshStandardMaterial({ map: videoTexture, transparent: false, side: THREE.DoubleSide, depthTest: true, depthWrite: true, alphaTest: 0.5 });
                if (this.uiManager.currentController.currentMap?.materials) {
                    this.uiManager.currentController.currentMap.materials[video.name] = this.materials[video.name];
                }
                if (i === videos.length - 1) {
                    resolve();
                }
            }
        });
    }

}