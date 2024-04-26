import { TheaterRenderer } from "../View/TheaterRenderer.js";

export class UiManager {
    domElements = {
        body: {
            element: 'body',
            events: ['click']
        },
        transition: {
            element: '.main__transition'
        },
        main: {
            element: '.main',
        },
        canvas: {
            element: '.canvas',
            events: ['mousemove']
        }
    }

    subtitleTimeout = 50;

    controllers = {};
    // Controlleur d'interfaces actuel
    currentController;

    constructor(dataManager, uiRenderer, audioManager, requestManager, canvasRenderer) {
        this.dataManager = dataManager;
        this.uiRenderer = uiRenderer;
        this.audioManager = audioManager;
        this.requestManager = requestManager;
        this.canvasRenderer = canvasRenderer;
        this.theaterRenderer = new TheaterRenderer(this);

        this.uiRenderer.appendDomElements(this.domElements);

        // Binding des évenements
        for (const key in this.domElements) {
            const element = this.domElements[key];
            if (element.events) {
                element.events.forEach(event => {
                    if (this[`${key}Handler`]) {
                        this.uiRenderer.getElement(key).addEventListener(event, (ev) => this[`${key}Handler`](ev));
                    }
                });
            }
        }

        // Fonction callback à exécuter quand une mutation est observée
        var callback = (mutationsList) => {
            for (var mutation of mutationsList) {
                if (!this.isTransitionning && mutation.type === 'attributes' && ['id', 'maxlength', 'name'].includes(mutation.attributeName)) {
                    return;
                }
            }
        };

        // Crée une instance de l'observateur lié à la fonction de callback
        this.observer = new MutationObserver(callback);

        // Configure l'observateur
        this.observer.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['id', 'maxlength', 'name', 'class'] });

        this.initApp();
    };

    /**
     * initApp()
     */
    async initApp() {
        this.uiRenderer.currentDictionnary = await this.requestManager.getDictionnary(this.dataManager.save.lang);
        // this.updateView('hub', 'main', null, false);
        this.updateView('intro', 'main', null, false);
        // this.updateView('cutscenes', 'main', null, false);
        // this.updateView('minigame', 'main', null, false);
        // this.updateView('credits', 'main', null, false);
        // this.updateView('mainMenu', 'main', null, false);
    }

    /**
     * updateView() modifie la page en cours de visionnage, et charge son nouveau controlleur d'interface
     * @param {string} view New screen to load in the game
     * @param {Node} target Where to send the new screen
     * @param {Object} data Optional data to format on the screen
     * @param {boolean} transition Should there be an animated transition?
     */
    async updateView(view, target, data, transition, specialData) {
        if (transition && this.isTransitionning) {
            return;
        }
        if (this.audioManager.locked) {
            this.audioManager.locked = false;
            this.audioManager.musicPlayer?.resumeMusic();
        }

        this.audioManager.stopVoiceline();

        this.currentView = view;
        this.isTransitionning = true;
        this.canvasRenderer.trail = true;
        clearInterval(this.interval);
        this.uiRenderer.getElement('main').scrollTop = 0;
        this.dataManager.saveData();
        
        document.querySelector('.animatedtextures').innerHTML = '';

        const animation = this.dataManager.animations[Math.floor(Math.random() * this.dataManager.animations.length)];
        const delay = transition ? animation.time : 0;
        if (transition) {
            if (typeof transition === 'string') {
                animation = this.dataManager.animations.find(anim => anim.name === transition);
            }
            await this[`${animation.name}Transition`](this.uiRenderer.getElement(target));
        }

        const corePartial = await this.requestManager.getPartial(view);

        this.uiRenderer.renderPartial(corePartial, target, this.dataManager.save, transition, animation);

        if (this.theaterRenderer.scene.children) {
            const childrenToRemove = [];
            for (let i = 0; i < this.theaterRenderer.scene.children.length; i++) {
                const child = this.theaterRenderer.scene.children[i];
                if (child.name !== 'Enviromment') {
                    childrenToRemove.push(child);
                }
            }
            childrenToRemove.forEach(child => {
                this.theaterRenderer.scene.remove(child);
            });
        }

        this.currentLayout = view;
        this.currentData = data;


        setTimeout(async () => {
            if (this.currentController) {
                this.currentController.inactive = true;
            }
            const ControllerClass = this.controllers[view] || (await import(`./UIs/${view}Controller.js`))[`${view}Controller`];
            this.currentController = new ControllerClass(this, data, specialData);
            this.controllers[view] = ControllerClass;
            this.isTransitionning = false;
        }, delay);
    }

    /**
     * hideMusicPlayer() cache le player de musique du site
     */
    hideMusicPlayer() {
        this.audioManager.musicPlayer?.pauseMusic();
        document.querySelector('.musicplayer').classList.add('hide');
    }

    /**
     * loadSubtitle() charges un sous titre à afficher dans un emplacement 
     * @param {string} subtitle 
     * @param {Node} container 
    */
    loadSubtitle(subtitle, container) {
        // Si le même sous-titre est déjà en cours, ne fait rien
        if (this.currentSubtitle === subtitle) {
            return;
        }
        // Annule tout délai existant
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        container.innerHTML = '';

        // Mise à jour du sous-titre actuel
        this.currentSubtitle = subtitle;
        let index = 0;

        let printSubtitle = () => {
            let delay = this.subtitleTimeout;
            if (index < subtitle.length) {
                let currentChar = subtitle[index];
                if (currentChar === '£') {
                    container.innerHTML += '<br>';
                } else {
                    container.innerHTML += currentChar;
                }
                if ((currentChar === '.' || currentChar === '!') && index > 1 && subtitle[index - 1] === '.') {
                    delay = this.subtitleTimeout * 10;
                }
                index++;
                this.timeoutId = setTimeout(printSubtitle, delay);
            } else {
                this.currentSubtitle = null;
            }
        };

        printSubtitle();
    }

    // TRANSITIONS //
    fadeTransition(target) {
        return new Promise((resolve) => {
            // this.audioManager.loadAudioFile('sfx/transition');
            target.classList.add('fade');
            setTimeout(() => {
                resolve();
            }, 500);
            setTimeout(() => {
                target.classList.remove('fade');
            }, 1300);
        });
    }

    bodyHandler(ev) {
        switch (ev.target.tagName) {
            case 'A':
                this.audioManager.loadAudioFile('sfx/link');
                break;
            case 'BUTTON':
                this.audioManager.loadAudioFile('sfx/button');
                break;
        }
    }
} 