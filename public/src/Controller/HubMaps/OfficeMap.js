import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class OfficeMap extends HubMap {

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        this.gerant = this.scene.getObjectByName("gerant");
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.35, 50);
        pointLight.position.set(
            1.50,
            1.55,
            1.75
        );
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;

        if (this.uiManager.currentController.getPowerLevel() < 100) {
            this.findEntityById('door1', 'entities').trigger = 'audio';
            this.findEntityById('door1', 'entities').audio = 'sfx/locked';
        }

        if (!this.uiManager.dataManager.save.progress.includes('tuto')) {
            this.findEntityById('door2', 'entities').trigger = 'locked';
            this.findEntityById('door3', 'entities').trigger = 'locked';
            this.scene.getObjectByName('door2').material = this.materials.lobbydoorClosed;
        } else {
            this.findEntityById('gerant', 'characters').trigger = 'quest';
            this.findEntityById('gerant', 'characters').minigames = ["Form", "Mixer", "Weights", "PushUp", "Plane", "Signal"];
            this.findEntityById('gerant', 'characters').style = "tuto";
            this.findEntityById('gerant', 'characters').ennemy = "gerant";

            if (!this.uiManager.dataManager.save.progress.includes('tutoDone')) {
                this.uiManager.dataManager.unlockProgress('progress', 'tutoDone');
                const dialog = {
                    trigger: "dialog",
                    dialog: "tutoWon",
                    meshRef: this.playerController.playerEntity,
                    lines: [
                        {
                            "portrait": "sprites/portrait.png",
                            "fr": "olala jai gagner tshirt youpi top",
                            "en": "oh wo i won a tshirt yesss"
                        },
                        {
                            npc: this.gerant,
                            "portrait": "sprites/portrait.png",
                            "fr": "oui normal on en pouvait plus là.... bon mon ptit gars, le vrai challenge va commencer maintenant, tu vas etre laché dans le grand bain!!",
                            "en": "yeahh well we had to do something about this... alright little guy, the real challenge is about to start.."
                        },
                        {
                            npc: this.gerant,
                            "portrait": "sprites/portrait.png",
                            "fr": "tu vois a gauche de l'écran là, juste ici attends je te montre, c'est ton niveau de puissance voila ici c est ecris power level, en gros plus tu en as plus on va te respecter ici",
                            "en": "have you ever heard about your power level? well look at your left, im showing you right now basically the more you have the stronger you get here and more areas will open to you so yeah they want you to play minigames",
                            trigger: "zoom"
                        },
                        {
                            npc: this.playerController.playerEntity,
                            "portrait": "sprites/portrait.png",
                            "fr": "ok bien comprendre je explore la salle de gym et je fais des exercices pour gagner des points de puissance",
                            "en": "ok me understand i explore the gym room and i do exercises to increase my power level",
                        }
                    ],
                }
                this.uiManager.currentController.handleEntity(dialog);
            }
        }
        this.gerant.userData.material = 'gerantIdle';
    }

    lockedEvent() {
        const dialog = {
            trigger: "dialog",
            meshRef: this.scene.getObjectByName("shopRoom"),
            dialog: "lobbyClosed",
            lines: [
                {
                    npc: this.gerant,
                    portrait: "sprites/portrait.png",
                    fr: "eh hop hop hop t'es meme pas inscrit à la salle là viens me parler d'abord 😤",
                    en: "hey what are you doing your not even registered here come talk to me first 😤"
                }
            ]
        }
        this.uiManager.currentController.handleEntity(dialog);
    }

    /**
     * updateLogic()
     */
    updateLogic() {
        super.updateLogic();
        if (this.gerant) {
            const distance = this.gerant.position.distanceTo(this.playerController.playerEntity.position);
            if (distance < 2.2 && this.gerant.userData.material !== 'gerantIdle') {
                this.gerant.material = this.materials.gerantIdle;
                this.gerant.userData.material = 'gerantIdle';
            } else if (distance > 2.2 && this.gerant.userData.material !== 'gerantSad') {
                this.gerant.material = this.materials.gerantSad;
                this.gerant.userData.material = 'gerantSad';
            }
        }
    }

    tutoQuestEvent() {
        this.uiManager.currentController.handleEntity(
            {
                trigger: "quest",
                name: "gerant",
                ennemy: "gerant",
                minigames: ["Form", "Mixer", "Weights", "PushUp", "Signal", "Plane"],
                style: "tuto"
            }
        )
    }

    /**
     * updateCamera()
     */
    updateCamera() {

    }

    zoomEvent() {
        setTimeout(() => {
            this.uiManager.uiRenderer.getElement('hub').classList.add('hub__gagzoom');
            this.uiManager.audioManager.loadAudioFile('sfx/spring', 'sfx');
            setTimeout(() => {
                this.uiManager.audioManager.loadAudioFile('sfx/reverseSpring', 'sfx');
                this.uiManager.uiRenderer.getElement('hub').classList.remove('hub__gagzoom');
            }, 12000);
        }, 4500);
    }
}