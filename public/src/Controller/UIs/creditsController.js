import { UiController } from "../UiController.js";
import * as THREE from 'three';

export class creditsController extends UiController {
    constructor(uiManager) {
        const domElements = {
            credits: {
                element: '.credits',
                events: ['click']
            },
        };
        super(uiManager, domElements);
        this.clock = new THREE.Clock();
        this.audioManager.loadAudioFile('music/credits', 'music');
        this.uiManager.theaterRenderer.loadTheater(this.uiRenderer.getElement('credits'));
        this.earth = new THREE.Mesh(this.uiManager.theaterRenderer.geometries.earth, this.uiManager.theaterRenderer.materials.earth);
        this.earth.position.set(0, -0.95, 0);
        this.uiManager.theaterRenderer.scene.add(this.earth);

        this.ambient = new THREE.AmbientLight(0x623896, 0.6);
        this.camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, -0.75, 1.5);
        this.uiManager.theaterRenderer.renderScene.camera = this.camera;
        this.uiManager.theaterRenderer.scene.add(this.ambient);
        this.update(0);

        const pointLight = new THREE.PointLight(0xffffff, 0.8, 30);
        pointLight.position.set(0, 0.2, 2.25);
        this.uiManager.theaterRenderer.scene.add(pointLight);
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;

        setTimeout(() => {
            this.audioManager.loadAudioFile('sfx/explosion', 'sfx');
            this.explosion = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), this.uiManager.theaterRenderer.materials.explosion);
            this.uiManager.theaterRenderer.scene.add(this.explosion);
            this.explosion.rotation.y = Math.PI;
            this.explosion.position.set(0, -0.7, 1.25);
            setTimeout(() => {
                this.uiManager.theaterRenderer.scene.remove(this.earth);
            }, 3500);
            setTimeout(() => {
                this.opacity = true;
            }, 15000);
        }, 50000);

        setTimeout(() => {
            this.uiManager.updateView('mainMenu', 'main', null, true);
        }, 180000);
    }

    creditsHandler(ev) {
        switch (ev.target.id) {

        }
    }

    /**
     * update() handles all tick updates of the credits
     */

    update(time) {
        const deltaTime = time - this.lastFrameTimeMs;
        const elapsedTime = this.clock.getElapsedTime();

        // Rappel de la fonction à la prochaine frame
        if (time < this.lastFrameTimeMs + (1000 / 65)) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.lastFrameTimeMs = time;

        this.lastFrameTimeMs = time;
        this.earth.rotation.y += 0.0015;

        if (this.explosion) {
            this.explosion.scale.x += 0.005;
            this.explosion.scale.y += 0.005;
            this.explosion.scale.z += 0.005;
        }

        if (this.opacity) {
            this.opacity -= 0.01;
            this.explosion.material.opacity = this.opacity;
        }

        this.camera.position.z += 0.001
        this.uiManager.theaterRenderer.render();
        requestAnimationFrame(this.update.bind(this));
    }
}