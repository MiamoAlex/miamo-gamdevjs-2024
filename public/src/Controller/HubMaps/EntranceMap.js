import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class EntranceMap extends HubMap {
    currentSpot = 'pos1';

    cameras = {
        pos1: {
            pos: { x: -4.5, y: 1.85, z: 2.5 }, rot: { x: -0.5465152168457076, y: -0.7760267390922149, z: -0.40280010362863855 }
        },
        pos2: {
            pos: { x: 1, y: 1.7, z: 1.0 }, rot: {
                "x": -0.6434108964543548,
                "y": -0.5413837881285692,
                "z": -0.36874421035263427,
            }
        },
    }
    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.4, 100);
        pointLight.position.set(-2, 1.5, 2.5);
        pointLight.target = this.scene.getObjectByName('EntranceRoom');
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;

        //
        if (!this.dataManager.save.progress.includes('introDialog')) {
            this.dataManager.unlockProgress('progress', 'introDialog');
            const dialog = {
                trigger: "dialog",
                dialog: "introDialog",
                meshRef: this.playerController.playerEntity,
                lines: [
                    {
                        portrait: "sprites/portrait.png",
                        npc: this.playerController.playerEntity,
                        fr: "ben ben elle est passer ou la joli madame !!!",
                        en: "whh where did the pretty lady go !!!"
                    },
                    {
                        portrait: "sprites/portrait.png",
                        npc: this.scene.getObjectByName('gleep'),
                        fr: "sois le bienvenue au club de gym gleep gym  ! !!! la premiere salle de sport conçue pour les humains, par les humains :) toi aussi, deviens le plus fort et rejoins les étoiles musculairement parlant !!!",
                        en: "please be welcome to the gym club gleep gym !!! the first gym designed for humans, by humans : ) you too, become the strongest and reach for the stars (physically speaking of course) !!!"
                    },
                    {
                        portrait: "sprites/portrait.png",
                        npc: this.scene.getObjectByName('gleep'),
                        fr: "tu souhaites nou rejoindre pas vrai ? c est très simple, il te suffit de traverser le sas cosmique euh le couloir, et francis te guidera dans ton initiation",
                        en: "you want to join us? its pretty simple, you just got walk through the cosmic airlock, i mean the corridor, and francis will guide you through your initiation"
                    },
                    {
                        portrait: "sprites/portrait.png",
                        npc: this.playerController.playerEntity,
                        fr: "bon d accord je vais aller voir",
                        en: "well ok i ll go see"
                    }
                ],
            }
            this.uiManager.currentController.handleEntity(dialog);
        }
    }

    /**
     * updateLogic()
    */
    updateLogic() {
        if (!this.uiManager.currentController.currentDialog) {
            this.updateCamera();
        } else {
            super.updateLogic();
        }
    }

    /**
     * updateCamera()
     */
    updateCamera() {
        const position = this.playerController.playerEntity.position
        if (position.x < 1.2) {
            this.currentSpot = 'pos1';
        } else {
            this.currentSpot = 'pos2';
        }
        this.camera.position.lerp(this.cameras[this.currentSpot].pos, 0.025);
        // 
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(this.cameras[this.currentSpot].rot.x, this.cameras[this.currentSpot].rot.y, this.cameras[this.currentSpot].rot.z));

        // Appliquer l'interpolation slerp
        this.camera.quaternion.slerp(quaternion, 0.02);
    }
}