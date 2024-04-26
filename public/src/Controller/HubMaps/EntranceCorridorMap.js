import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class EntranceCorridorMap extends HubMap {
    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.4, 100);
        pointLight.position.set(5.5, 1, 4.5);
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
    }
}