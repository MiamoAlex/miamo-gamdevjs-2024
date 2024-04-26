import { UiController } from "../UiController.js";
import * as THREE from 'three';

export class mainMenuController extends UiController {
    constructor(uiManager) {
        const domElements = {
            mainMenu: {
                element: '.mainmenu',
                events: ['click']
            },
        };
        super(uiManager, domElements);
        this.clock = new THREE.Clock();

        this.audioManager.loadAudioFile('music/mainMenu', 'music');

        this.uiManager.theaterRenderer.loadTheater(this.uiRenderer.getElement('mainMenu'));
        this.earth = new THREE.Mesh(this.uiManager.theaterRenderer.geometries.earth, this.uiManager.theaterRenderer.materials.earth);
        this.earth.position.set(0, -0.95, 0);
        this.earth.rotation.y += Math.PI / 4;

        this.uiManager.theaterRenderer.scene.add(this.earth);
        this.ambient = new THREE.AmbientLight(0x623896, 0.6);
        this.camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0.2, 0.2);
        this.uiManager.theaterRenderer.renderScene.camera = this.camera;
        this.uiManager.theaterRenderer.scene.add(this.ambient);
        this.update(0);

        const pointLight = new THREE.PointLight(0xffffff, 0.7, 50);
        pointLight.position.set(0, 0.2, 0.25);
        this.uiManager.theaterRenderer.scene.add(pointLight);
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
    }

    async mainMenuHandler(ev) {
        switch (ev.target.id) {
            case 'intro':
                this.uiManager.updateView('cutscenes', 'main', null, true);
                break;
            case 'hub':
                this.uiManager.updateView('hub', 'main', null, true);
                break;
            case 'fr':
                this.dataManager.save.lang = 'fr';
                this.uiRenderer.currentDictionnary = await this.requestManager.getDictionnary(this.dataManager.save.lang);
                this.uiRenderer.translateArea('body');
                break;
            case 'en':
                this.dataManager.save.lang = 'en';
                this.uiRenderer.currentDictionnary = await this.requestManager.getDictionnary(this.dataManager.save.lang);
                this.uiRenderer.translateArea('body');
                break;
            case 'minigame':
                this.uiManager.updateView('credits', 'main', null, true);
                break;
            case 'reset':
                this.dataManager.save = {
                    lang: this.dataManager.save.lang,
                    currentRoom: 'Entrance',
                    playerSprite: 'flabbyIdle',
                    progress: [],
                    minigames: [],
                    objective: 'welcomeGym'
                };
                this.uiManager.updateView('hub', 'main', null, true);
                break;
        }
    }

    /**
     * update() handles all tick updates of the mainmenu
     */

    update(time) {
        const deltaTime = time - this.lastFrameTimeMs;
        const elapsedTime = this.clock.getElapsedTime();

        // Rappel de la fonction à la prochaine frame
        if (time < this.lastFrameTimeMs + (1000 / 65)) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.lastFrameTimeMs = time;

        this.lastFrameTimeMs = time;
        this.earth.rotation.x += 0.001;
        this.uiManager.theaterRenderer.render();
        requestAnimationFrame(this.update.bind(this));
    }
}