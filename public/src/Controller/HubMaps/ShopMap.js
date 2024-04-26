import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class ShopMap extends HubMap {
    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        this.ambient.intensity = .15
        this.pointLight = new THREE.PointLight(0xFFCDEF, 0.8, 100);
        this.pointLight.position.set(
            -2.554659846675972,
            0.6605713641282587,
            2.5
        );
        this.scene.add(this.pointLight);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.bias = -0.001;
        this.pointLight.shadow.mapSize.width = 512;
        this.pointLight.shadow.mapSize.height = 512;
        this.playerController.playerEntity.rotation.set(0, Math.PI, 0);

        //
        if (!this.dataManager.save.progress.includes('moneyGag')) {
            this.dataManager.unlockProgress('progress', 'moneyGag')
            const dialog = {
                trigger: "dialog",
                dialog: "shopDialog",
                meshRef: this.playerController.playerEntity,
                lines: [
                    {
                        "portrait": "sprites/portrait.png",
                        "fr": "il y a de l argent partout dans cette salle.. carrement j en marche sur la tete",
                        "en": "there is money everywhere in this room.. im so shocked im walking upside down"
                    },
                    {
                        npc: this.scene.getObjectByName("bizaroid"),
                        "portrait": "sprites/portrait.png",
                        "fr": "BIENVENUE DANS MON MONDE SECRET OU TU PEUX REJOUER LES MINI JEUX DEJA JOUER A LINFINI !!!",
                        "en": "WELCOME TO MY SECRET WORLD WHERE YOU CAN REPLAY THE MINI GAMES YOU ALREADY UNLOCKED !!!"
                    },
                    {
                        npc: this.playerController.playerEntity,
                        "portrait": "sprites/portrait.png",
                        "fr": "what the helllllllll",
                        "en": "what the helllllllll"
                    }
                ],
            }
            this.uiManager.currentController.handleEntity(dialog);
        }
    }

    shopEvent() {
        document.querySelector('.hub__shop').classList.remove('hide');
        const list = document.querySelector('.hub__shop-games')
        list.innerHTML = '';
        for (let i = 0; i < this.dataManager.save.minigames.length; i++) {
            const minigame = this.dataManager.save.minigames[i];
            list.innerHTML += `<li class="hub__shop-item" data-game="${minigame}">
            <input type="checkbox" class="hub__shop-checkbox">
                <img class="hub__shop-vignette" src="assets/sprites/vignette/${minigame}.jpg">
                <span>${minigame}</span>
            </li>`;
        }
    }
}