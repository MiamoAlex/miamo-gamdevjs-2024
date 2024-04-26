import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class WizardMap extends HubMap {

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        this.ambient.intensity = .15
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.55, 100);
        pointLight.position.set(0.07, 1.55, 2.37);
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
    }
}