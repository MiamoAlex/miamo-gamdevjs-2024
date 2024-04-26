import * as THREE from 'three';
import { UiController } from "../UiController.js";
import { HubPlayerController } from "../HubPlayerController.js";

export class hubController extends UiController {
    constructor(uiManager) {
        const domElements = {
            hub: {
                element: '.hub',
                events: ['click']
            },
            game: {
                element: '.hub__game',
                events: ['mousemove', 'mousedown', 'mouseup', 'click', 'mouseout']
            },
            quest: {
                element: '.hub__quest'
            },
            dialogs: {
                element: '.hub__dialog'
            },
            dialogBox: {
                element: '.hub__dialog-text'
            },
            backtrack: {
                element: '.hub__backtrack'
            },
            playerPos: {
                element: '.hub__minimap-player'
            },
            power: {
                element: '.hub__power'
            },
            objective: {
                element: '.hub__objective'
            },
            time: {
                element: '.hub__time'
            }
        };
        super(uiManager, domElements);
        this.initHub();
        addEventListener('keydown', (ev) => {
            switch (ev.key) {
                // case '1':
                //     console.log(this.currentMap.camera.rotation)
                //     break;
                // case '2':
                //     console.log(this.playerController.playerEntity.position)
                //     break;
                // // MODE DEBUG ROTATION DE CAMERA
                // case '3':
                //     document.addEventListener('mousedown', (ev) => this.playerController.mouseHandler(ev));
                //     document.addEventListener('mousemove', (ev) => this.playerController.mouseHandler(ev));
                //     document.addEventListener('mouseup', (ev) => this.playerController.mouseHandler(ev));
                //     document.addEventListener('mouseout', (ev) => this.playerController.mouseHandler(ev));
                //     document.addEventListener('wheel', (ev) => this.playerController.mouseHandler(ev));
                //     break;
                // case '4':
                //     this.playerController.initEditor();
                //     break;
                // case '5':
                //     this.playerController.transformControls.detach();
                //     this.playerController.editor = false;
                //     this.playerController.unlockPlayer();
                //     break;
            }
        })
    }

    // Objets de calcul
    raycaster = new THREE.Raycaster();
    mousePosition = new THREE.Vector2(0, 0)

    customPlaylist = [];

    async initHub() {
        this.powerLevelChanges();
        this.clock = new THREE.Clock();
        this.uiManager.theaterRenderer.loadTheater(this.uiRenderer.getElement('game'));
        this.playerController = new HubPlayerController(this.uiManager);
        await this.loadMap(this.dataManager.save?.currentMap ?? 'Entrance', false);
        this.update(0);
        this.uiRenderer.getElement('power').style.clipPath = `polygon(0 ${100 - this.getPowerLevel()}%, 100% ${100 - this.getPowerLevel()}%, 100% 100%, 0% 100%)`;
    }

    /**
     * loadMap() loads a HUB map (JS controller & GLTF Files)
     * @param {string} name Map's name
     */
    async loadMap(name, transition = true) {
        this.lock = true;

        if (transition) {
            const animation = this.dataManager.animations[Math.floor(Math.random() * this.dataManager.animations.length)];
            await this.uiManager[`${animation.name}Transition`](this.uiRenderer.getElement('game'));
        }

        // Clearing the previous map
        this.uiManager.theaterRenderer.purgeScene();
        this.dataManager.save.currentMap = name;

        clearTimeout(this.currentMap?.timeout);

        const map = (await import(`../HubMaps/${name}Map.js`))[`${name}Map`];
        const entities = await (await fetch(`assets/entities/${name}Entities.json`)).json();
        this.currentMap = new map(this.uiManager, name, entities);
        this.playerController.currentMap = this.currentMap;

        if (this.currentMap.mapData.backtrack) {
            this.uiRenderer.getElement('backtrack').classList.remove('hide');
            this.backtrackMap = this.currentMap.mapData.backtrack;
        } else {
            this.uiRenderer.getElement('backtrack').classList.add('hide');
        }

        this.uiRenderer.getElement('playerPos').style.left = `${this.currentMap.mapData.mapPos?.x ?? 0}%`;
        this.uiRenderer.getElement('playerPos').style.top = `${this.currentMap.mapData.mapPos?.y ?? 0}%`;

        this.lock = false;
    }

    update(time) {
        const deltaTime = time - this.lastFrameTimeMs;
        const elapsedTime = this.clock.getElapsedTime();

        // Rappel de la fonction à la prochaine frame
        if (time < this.lastFrameTimeMs + (1000 / 65)) {
            requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.lastFrameTimeMs = time;
        const currentTime = new Date();
        const hours = ('0' + currentTime.getHours()).slice(-2);
        const minutes = ('0' + currentTime.getMinutes()).slice(-2);
        const seconds = ('0' + currentTime.getSeconds()).slice(-2);
        this.uiRenderer.getElement('time').textContent = `${hours}:${minutes}:${seconds}`;

        if (!this.lock) {
            this.uiManager.theaterRenderer.render();
            this.playerController.updatePlayerPos();
            if (this.currentMap?.updateLogic) {
                this.currentMap.updateLogic();
            }
        }
        requestAnimationFrame(this.update.bind(this));
    }



    /**
     * gameHandler() gère les interractions avec le canvas
     * @param {Event} ev 
     */
    async gameHandler(ev) {
        if (!this.currentMap) { return };

        switch (ev.type) {
            case 'mouseup':
            case 'mouseout':
                this.mousedown = false;
                break;
            case 'mousedown':
                this.mousedown = true;
                break;
            case 'click':
                const entityId = this.intersects[0]?.object.userData.id;
                if (entityId) {
                    const entity = this.currentMap.findEntityById(entityId, this.intersects[0].object.userData.type);
                    const entityPos = this.intersects[0].point;
                    this.playerController.currentEntity = entity;
                    entityPos.y = 0.65;
                    const move = await this.playerController.setDestination(entityPos);
                    if (!move || this.playerController.lock) return;
                    this.handleEntity(entity);
                }
                break;
            case 'mousemove':
                const rect = this.uiRenderer.getElement('game').getBoundingClientRect();
                const mouseX = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
                const mouseY = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
                this.mousePosition.set(mouseX, mouseY);
                this.raycaster.setFromCamera(this.mousePosition, this.currentMap.camera);
                this.intersects = this.raycaster.intersectObjects(this.currentMap.scene.children, true);
                if (this.intersects.length > 0) {
                    const entityId = this.intersects[0].object.userData.id;
                    const entityType = this.intersects[0].object.userData.type;
                    this.playerController.lastEntity = this.intersects[0].object;
                    if (entityId && entityType !== 'layout') {
                        this.uiRenderer.getElement('hub').style.cursor = 'pointer';
                    } else {
                        this.uiRenderer.getElement('hub').style.cursor = 'crosshair';
                        const targetPositon = this.intersects[0].point;
                        targetPositon.y = 0.22;
                        this.playerController.cursorArea.position.set(targetPositon.x, targetPositon.y, targetPositon.z);
                    }
                }
                break;
        }
    }

    /**
     * hubHandler gère les interreractions avec les différentes interfaces du HUB
     * @param {event} ev 
     */
    hubHandler(ev) {
        switch (ev.target.classList[0]) {
            case 'hub__quest-close':
            case 'hub__shop-close':
                ev.target.parentElement.classList.add('hide');
                this.playerController.unlockPlayer();
                this.audioManager.stopVoiceline();
                break;

            case 'hub__shop-checkbox':
                if (ev.target.checked) {
                    this.customPlaylist.push(ev.target.parentElement.dataset.game);
                } else {
                    console.log(ev.target.dataset.game);
                    this.customPlaylist = this.customPlaylist.filter(game => game !== ev.target.parentElement.dataset.game);
                }
                break;

            case 'hub__shop-play':
                if (this.customPlaylist.length > 0) {
                    this.uiManager.updateView('minigame', 'main', { style: "gleep", minigames: this.customPlaylist, ennemy: "bizaroid" }, true);
                }
                break;

            case 'hub__quest-start':
                this.uiManager.updateView('minigame', 'main', this.currentMinigames, true);
                break;

            case 'hub__backtrack':
                if (!this.playerController.lock) {
                    this.audioManager.loadAudioFile('sfx/travel', 'sfx');
                    this.loadMap(this.backtrackMap);
                }
                break;

            case 'hub__dialog':
                if (!this.uiManager.currentSubtitle) {
                    this.renderCurrentDialog();
                    this.powerLevelChanges();
                } 
                break;
        }
    }

    getPowerLevel() {
        let power = 0;
        this.dataManager.save.progress.forEach(progress => {
            if (progress === 'tuto') {
                power += 20;
            } else if (progress === 'lobby') {
                power += 25;
            } else if (progress === 'wizard' || progress === 'grandma' || progress === 'gleep') {
                power += 15;
            } else if (progress === 'coach') {
                power += 10;
            }
        });
        return power;
    }

    powerLevelChanges() {
        const level = this.getPowerLevel();
        if (level === 0 && !this.dataManager.save.progress.includes('introDialog')) {
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('welcomeGym');
        } else if ((level === 0 && this.dataManager.save.progress.includes('introDialog'))) {
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('meetupGym');
        } else if (level >= 20 && level < 35) {
            this.dataManager.save.playerSprite = 'flabbyShirt';
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('grindGym');
        } else if (level >= 35 && level < 65) {
            this.dataManager.save.playerSprite = 'flabbyMuscle1';
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('grindGym');
        } else if (level >= 65 && level < 80) {
            this.dataManager.save.playerSprite = 'flabbyMuscle2';
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('grindGym');
        } else if (level >= 80 && level < 100) {
            this.dataManager.save.playerSprite = 'flabbyMuscle3';
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('objectiveCoach');
            if (!this.dataManager.save.progress.includes('maxPower')) {
                setTimeout(() => {
                    this.uiManager.dataManager.unlockProgress('progress', 'maxPower');
                    const dialog = {
                        trigger: "dialog",
                        dialog: "dialogPower",
                        meshRef: this.playerController.playerEntity,
                        lines: [
                            {
                                "portrait": "sprites/portrait.png",
                                "fr": "je le sens !! mon power level est maximal !!! serait on en train de me dire que la grande porte centrale s'est déverouillée ?",
                                "en": "i can feel it !! my power level is complete ! would that mean that the big central door is now unlocked ?"
                            }
                        ],
                    }
                    this.handleEntity(dialog);
                }, 800);
            }
        } else if (level === 100) {
            this.dataManager.save.playerSprite = 'flabbyMuscle3';
            this.uiRenderer.getElement('objective').textContent = this.uiRenderer.translateValue('objectiveLoop');
        }
    }

    renderCurrentDialog() {
        this.dialogId++;
        const dialog = this.currentDialog[this.dialogId];
        if (dialog) {
            if (dialog.trigger) {
                this.handleEntity({ trigger: dialog.trigger });
            }
            if (dialog.portrait) {
                this.uiManager.loadSubtitle(dialog[this.dataManager.save.lang], this.uiRenderer.getElement('dialogBox'));
                this.uiRenderer.getElement('dialogs').classList.remove('hide');
                this.playerController.lockPlayer();

                this.audioManager.loadAudioFile(`voiceline/${this.dialogName}/${this.dialogId}_${this.dataManager.save.lang}`, 'voiceline');
                if (dialog.npc) {
                    this.currentMap.npc = dialog.npc;
                }
            } else {
                this.currentDialog = null;
                this.uiRenderer.getElement('dialogs').classList.add('hide');
                this.playerController.unlockPlayer();
            }
        } else {
            this.currentDialog = null;
            this.uiRenderer.getElement('dialogs').classList.add('hide');
            this.playerController.unlockPlayer();
        }
    }

    /**
     * handleEntity()
     * @param {object} entity 
     */
    handleEntity(entity) {
        switch (entity.trigger) {
            case 'door':
                this.audioManager.loadAudioFile('sfx/travel', 'sfx');
                this.loadMap(entity.map);
                break;

            case 'audio':
                this.audioManager.loadAudioFile(entity.audio, 'sfx');
                break;

            case 'quest':
                this.audioManager.loadAudioFile('sfx/quest', 'sfx');
                document.querySelector('.hub__quest-name').dataset.i18n = `${entity.name}Name`;
                document.querySelector('.hub__quest-character').dataset.i18n = `${entity.name}Character`;
                document.querySelector('.hub__quest-job').dataset.i18n = `${entity.name}Job`;
                document.querySelector('.hub__quest-note').dataset.i18n = `${entity.name}Note`;
                document.querySelector('.hub__quest-portrait').src = `assets/sprites/${entity.name}.gif`;
                this.audioManager.loadAudioFile(`voiceline/cards/${entity.name}_${this.dataManager.save.lang}`, 'voiceline');
                this.currentMinigames = entity;
                this.playerController.lockPlayer();
                this.uiRenderer.translateArea('quest');
                setTimeout(() => {
                    this.uiManager.loadSubtitle(this.uiRenderer.translateValue(`${entity.name}Desc`), document.querySelector('.hub__quest-dialog'))
                }, 300);
                this.uiRenderer.getElement('quest').classList.remove('hide');
                break;

            case 'dialog':
                this.audioManager.loadAudioFile('sfx/dialog', 'sfx');
                this.dialogName = entity.dialog;
                this.currentMap.npc = entity.meshRef;
                this.currentDialog = entity.lines;
                this.dialogId = -1;
                this.renderCurrentDialog();
                break;

            default:
                if (entity.trigger) {
                    this.currentMap[`${entity.trigger}Event`](entity);
                }
                break;
        }
    }
}