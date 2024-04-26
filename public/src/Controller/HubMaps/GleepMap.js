import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class GleepMap extends HubMap {

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.45, 100);
        pointLight.position.set(2.20, 1.65, 0.80);
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
    }
}