import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class LobbyMap extends HubMap {

    cameras = {
        wall1: { pos: { x: -6, y: 2.5, z: 5.5 }, rot: { x: -0.3934823328367664, y: 0.4560009162746069, z: 0.20203376155097807 } },
        wall2: { pos: { x: 0, y: 2, z: 4.5 }, rot: { x: -0.36000010453497283, y: 0.0007452797081776499, z: 0.00028052546304704315 } },
        wall3: { pos: { x: 6, y: 3, z: 5.5 }, rot: { x: -0.3704122512371856, y: -0.4157253831358185, z: -0.22063346240620035 } }
    }

    currentSpot = 'wall1';

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        this.pointLight = new THREE.PointLight(0xFFCDEF, 0.38, 50);
        this.ambient.intensity = 0.15;
        this.pointLight.position.set(0, 1.55, 6);
        this.scene.add(this.pointLight);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.bias = -0.001;
        this.pointLight.shadow.mapSize.width = 512;
        this.pointLight.shadow.mapSize.height = 512;

        // STORY CHECKS
        const powerLevel = this.uiManager.currentController.getPowerLevel();
        if (powerLevel < 90) {
            this.findEntityById('doorCoach', 'entities').trigger = 'audio';
            this.findEntityById('doorCoach', 'entities').audio = 'sfx/locked';
        }

        if (powerLevel < 60) {
            this.findEntityById('doorWizard', 'entities').trigger = 'audio';
            this.findEntityById('doorWizard', 'entities').audio = 'sfx/locked';
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
        if (position.x < -3.5) {
            this.currentSpot = 'wall1';
        } else if (position.x < 4.5 && position.x > -3.5) {
            this.currentSpot = 'wall2';
        } else if (position.x > 4.5) {
            this.currentSpot = 'wall3';
        }
        this.camera.position.lerp(this.cameras[this.currentSpot].pos, 0.05);
        // 
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(new THREE.Euler(this.cameras[this.currentSpot].rot.x, this.cameras[this.currentSpot].rot.y, this.cameras[this.currentSpot].rot.z));
        // Appliquer l'interpolation slerp
        this.camera.quaternion.slerp(quaternion, 0.03);
    }
}