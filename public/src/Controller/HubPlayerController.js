import { UiManager } from './UiManager.js';
import * as THREE from 'three';

// import { TransformControls } from '/three/examples/jsm/controls/TransformControls.js';

export class HubPlayerController {
    uiManager = UiManager;

    playerPos = new THREE.Vector3(0, 1, 0);

    mouse = new THREE.Vector2();

    // Lock du joueur
    lock = false;

    constructor(uiManager) {
        this.uiManager = uiManager;
        this.generatePlayer();
    }

    /**
     * generatePlayer() génère les entités du joueur
     */
    async generatePlayer() {
        this.playerEntity = new THREE.Group();
        this.playerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.uiManager.theaterRenderer.materials.playerSprite);
        this.playerMesh.renderOrder = 1000
        this.playerMesh.castShadow = true;
        this.playerEntity.castShadow = true;
        this.playerEntity.add(this.playerMesh);
        this.uiManager.theaterRenderer.scene.add(this.playerEntity);

        await this.uiManager.theaterRenderer.loadVideos([{ name: 'circle' }]);

        // Zone du curseur
        this.cursorArea = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), this.uiManager.theaterRenderer.materials.circle);
        this.cursorArea.rotation.x = Math.PI / 2;
        this.uiManager.theaterRenderer.scene.add(this.cursorArea);
        this.cursorArea.renderOrder = 100;

        await this.uiManager.theaterRenderer.loadVideos([{ name: this.uiManager.dataManager.save.playerSprite }]);
        this.playerMesh.material = this.uiManager.theaterRenderer.materials[this.uiManager.dataManager.save.playerSprite];
    }

    /**
     * setPosition() met à jour la position du joueur instantanément
     */
    setPosition(position) {
        const newPos = new THREE.Vector3(position.x, position.y, position.z);
        this.playerEntity.position.copy(newPos);
        this.playerPos.copy(newPos);
    }

    /**
     * lockPlayer() vérouille le joueur sur place
     */
    lockPlayer() {
        this.lock = true;
    }

    /**
     * unlockPlayer() dévérouille le joueur le joueur
     */
    unlockPlayer() {
        this.lock = false;
    }

    async setDestination(pos) {
        this.playerPos.copy(pos);
        return new Promise((resolve) => {
            clearInterval(this.travelInterval);
            this.travelInterval = setInterval(() => {
                if (!this.isMoving) {
                    if (this.playerPos.distanceTo(pos) < 2.5) {
                        clearInterval(this.travelInterval);
                        resolve(true);
                        this.isMoving = false;
                    } else {
                        clearInterval(this.travelInterval);
                        resolve(false);
                    }
                }
            }, 80);
        });
    }



    /**
    * updatePlayerPos() met à jour dynamiquement la position du joueur vers la position cible
    */
    updatePlayerPos() {
        if (!this.playerEntity || this.lock) { return };

        const distance = this.playerEntity.position.distanceTo(this.playerPos);
        const speed = 0.05;
        const lerpFactor = Math.min(1, speed / distance);
        if (distance > 0.9) {
            this.isMoving = true;
            this.playerPos.y = 0.66;
            this.playerEntity.position.lerp(this.playerPos, lerpFactor);
        } else {
            this.isMoving = false;
        }
        const targetPosition = this.currentMap.camera.position.clone();
        targetPosition.y = this.playerEntity.position.y;
        this.playerEntity.lookAt(targetPosition);

        const angle = Math.sin(Date.now() * 0.012) * 8;
        if ((this.currentEntity && distance > 0.9) || (!this.currentEntity && distance > 0.1)) {
            this.playerEntity.rotation.z = angle * Math.PI / 180;
        }
    }

    /**
     * mouseHandler() gère les évenements de la souris
     * @param {Event} ev Evenements de déplacements et de clics de la souris 
     */
    mouseHandler(ev) {
        const { type, button, clientX, clientY, deltaY } = ev;

        const boundingBox = document.querySelector('canvas').getBoundingClientRect();
        const canvasWidth = boundingBox.width;
        const canvasHeight = boundingBox.height;
        const offsetX = boundingBox.left;
        const offsetY = boundingBox.top;


        if (type === 'mousedown') {
            this.lastMousePosition = { x: clientX, y: clientY };
            if (button === 0) {
                this.mouse.x = ((clientX - offsetX) / canvasWidth) * 2 - 1;
                this.mouse.y = - ((clientY - offsetY) / canvasHeight) * 2 + 1;
                this.CLICK_PRESSED = true;
            } else if (button === 1) {
                this.WHEEL_PRESSED = true;
            }
        } else if (type === 'mousemove' && this.lastMousePosition) {
            this.rotateCamera(ev);
        } else if (type === 'mouseup') {
            this.CLICK_PRESSED = false;
        }
    }

    rotateCamera(ev) {
        if (!this.CLICK_PRESSED) {
            return;
        }

        const dx = ev.clientX - this.lastMousePosition.x;
        const dy = ev.clientY - this.lastMousePosition.y;

        const camera = this.currentMap.camera;

        // Créer les quaternions de rotation
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -dx * 0.01);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -dy * 0.01);

        // Appliquer les quaternions à la caméra
        camera.quaternion.multiplyQuaternions(q1, camera.quaternion);
        camera.quaternion.multiplyQuaternions(camera.quaternion, q2);

        // Mettre à jour la position de la souris
        this.lastMousePosition.x = ev.clientX;
        this.lastMousePosition.y = ev.clientY;
    }

    // Editeur de contenu
    initEditor() {
        this.transformControls = new TransformControls(this.uiManager.currentController.currentMap.camera, document.querySelector('canvas'));
        this.transformControls.translationSnap = 0.1;
        this.uiManager.theaterRenderer.scene.add(this.transformControls);
        this.lockPlayer();
        document.body.addEventListener('mouseup', (ev) => this.editorHandler(ev));
        document.body.addEventListener('keydown', (ev) => this.editorHandler(ev));
        this.editor = true;
    }

    /**
     * editorHandler()
     * @param {event} ev 
     */
    editorHandler(ev) {
        if (!this.editor) { return }
        setTimeout(() => {
            switch (ev.type) {
                case 'mouseup':
                    if (this.lastEntity) {
                        this.transformControls.attach(this.lastEntity);
                    }
                    console.log({
                        position:
                            { x: this.lastEntity.position.x, y: this.lastEntity.position.y, z: this.lastEntity.position.z },
                        rotation:
                            { x: this.lastEntity.rotation.x, y: this.lastEntity.rotation.y, z: this.lastEntity.rotation.z, },
                        scale:
                            { x: this.lastEntity.scale.x, y: this.lastEntity.scale.y, z: this.lastEntity.scale.z, }
                    })
                    break;
                case 'keydown':
                    switch (ev.code) {
                        case 'KeyR':
                            this.transformControls.setMode('rotate')
                            break;
                        case 'KeyS':
                            this.transformControls.setMode('scale')
                            break;
                        case 'KeyT':
                            this.transformControls.setMode('translate')
                            break;
                    }
            }
        }, 200);

    }
}