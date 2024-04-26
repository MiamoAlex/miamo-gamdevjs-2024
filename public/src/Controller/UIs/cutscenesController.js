import { UiController } from "../UiController.js";
import * as THREE from 'three';


export class cutscenesController extends UiController {
    constructor(uiManager, context) {
        const domElements = {
            cutscenes: {
                element: '.cutscenes',
                events: ['click']
            },
            video: {
                element: 'video',
                events: ['ended']
            }
        };
        super(uiManager, domElements);
        this.audioManager.stopMusic();
        this.uiRenderer.getElement('video').volume = 0.5;
        switch (context) {
            case 'coach':
                this.coachCutscene();
                break;
            default:
                this.introCutscene();
                break;
        }
    }

    videoHandler(ev) {
        this.uiManager.updateView(this.exit, 'main', null, true);
    }

    introCutscene() {
        this.exit = 'mainMenu';
        this.uiRenderer.getElement('video').src = 'assets/intro.mp4';
    }

    coachCutscene() {
        this.exit = 'hub';
        this.uiRenderer.getElement('video').src = `assets/coach${this.uiManager.dataManager.save.lang}.mp4`;
    }

    cutscenesHandler(ev) {
        switch (ev.target.classList[0]) {
            case 'cutscenes__skip':
                if (!ev.target.paused) {
                    this.uiManager.updateView(this.exit, 'main', null, true);
                }
                break;
        }
    }
}