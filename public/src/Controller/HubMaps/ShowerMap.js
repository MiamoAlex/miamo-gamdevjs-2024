import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class ShowerMap extends HubMap {
    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        this.pointLight = new THREE.PointLight(0xFFCDEF, 0.15, 50);
        this.pointLight.position.set(
            0,
            1.55,
            0
        );  
        this.scene.add(this.pointLight);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.bias = -0.001;
        this.pointLight.shadow.mapSize.width = 512;
        this.pointLight.shadow.mapSize.height = 512;
        this.lightFlicker();
        this.ambient.intensity = 0.1;
    }

    lightFlicker() {
        if (this.pointLight) {
            this.pointLight.intensity = 0.05 + Math.random() * 0.05;
        }
        setTimeout(() => this.lightFlicker(), 40 + Math.random() * 60);
    }
}