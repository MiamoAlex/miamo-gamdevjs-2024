import { UiRenderer } from './View/UiRenderer.js';
import { CanvasRenderer } from './View/CanvasRenderer.js';

import { UiManager } from './Controller/UiManager.js';
import { RequestManager } from './Controller/RequestManager.js';
import { AudioManager } from './Controller/AudioManager.js';

import { DataManager } from './Model/DataManager.js';

import * as THREE from 'three';

export class Core {

    // Modèle
    dataManager = DataManager;

    // Vue
    uiRenderer = UiRenderer;
    canvasRenderer = CanvasRenderer;

    // Controleur
    uiManager = UiManager;
    audioManager = AudioManager;
    requestManager = RequestManager;


    constructor() {
        this.dataManager = new DataManager();

        this.uiRenderer = new UiRenderer();
        this.canvasRenderer = new CanvasRenderer();

        this.audioManager = new AudioManager(this.uiRenderer, this.dataManager.save?.settings?.volume ?? 0.5);
        this.requestManager = new RequestManager();

        this.uiManager = new UiManager(this.dataManager, this.uiRenderer, this.audioManager, this.requestManager, this.canvasRenderer);
        this.uiManager.gameCore = this.gameCore;
        this.initApp();

        const startTime = new Date();
        addEventListener('beforeunload', () => {
            this.dataManager.saveData();
        })
        addEventListener("contextmenu", e => e.preventDefault());
    }

    async initApp() {
        this.uiRenderer.currentDictionnary = await this.requestManager.getDictionnary(this.dataManager.save.lang ?? 'fr');
        this.uiRenderer.translateArea('body');
    }
}

addEventListener('load', () => {
    const core = new Core();
    console.log('Gleep Gym !')
});