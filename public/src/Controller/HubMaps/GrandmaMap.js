import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class GrandmaMap extends HubMap {

    tick = 200;

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }
    async generateMap() {
        await super.generateMap();
        this.slavGrandma = this.scene.getObjectByName('slavGrandma');
        this.coolGrandma = this.scene.getObjectByName('coolGrandma');
        this.pointLight = new THREE.PointLight(0xFFCDEF, 0.40, 100);
        this.pointLight.position.set(2.20817594431930087, 1.6504365147296607, 2.8005138135332693);
        this.scene.add(this.pointLight);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.bias = -0.001;
        this.pointLight.shadow.mapSize.width = 512;
        this.pointLight.shadow.mapSize.height = 512;

        this.disco = this.scene.getObjectByName('disco');

        this.timeout = setTimeout(() => {
            this.uiManager.audioManager.stopMusic();
            this.uiManager.audioManager.loadAudioFile('voiceline/grandmaBack/0_fr', 'sfx');
            this.slavGrandma.material = this.materials.slavGrandmaIdle;
            this.coolGrandma.material = this.materials.coolGrandma;
            this.tick = 700;
            this.timeout = setTimeout(() => {
                this.slavGrandma.material = this.materials.slavGrandmaSlow;
                this.coolGrandma.material = this.materials.coolGrandmaSlow;
                this.uiManager.audioManager.loadAudioFile('music/gleepGymGrandmas', 'music');
            }, 2000);
        }, 6000);

        this.changeLight();
    }

    updateLogic() {
        super.updateLogic();
        if (this.disco) {
            this.disco.rotation.y += 0.01;
        }
    }

    changeLight() {
        const colors = [
            0xff0000, // Rouge
            0x00ff00, // Vert
            0x0000ff, // Bleu
            0xffff00, // Jaune
            0xffa500, // Orange
            0x9400d3, // Violet
            0xffc0cb  // Rose
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.pointLight.color.setHex(randomColor);
        setTimeout(() => {
            this.changeLight();
        }, this.tick);
    }
} 