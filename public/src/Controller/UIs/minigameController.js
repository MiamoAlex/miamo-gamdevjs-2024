import { UiController } from "../UiController.js";

export class minigameController extends UiController {

    timer = 60;
    lives = 4;

    score = 0;
    currentProgress = 0;
    wonGames = 0;

    startTime = new Date();

    // minigames = ['Form'];
    // minigames = ['Sisyphus', 'Gems', 'SpaceWash', 'HomeDestroyer', 'HorseTower', 'HeroFlying']

    minigames = ['Weights', 'Form', 'Mixer', 'Plane', 'VirtualHeadset',
       'Gorilla', 'Speech', 'AppleWizard', 'Levers', 'SpaceCow', 'YogaFly', 'WordSoup', 'DopeOMax',
       'Potion', 'Swarm', 'SpaceRace', 'PuzzleTime', 'PizzaQuiz', 'SandwichPied', 'IllustreJambon', 'Gems', 'SpaceWash', 'HomeDestroyer', 'HorseTower', 'HeroFlying', 'Sisyphus', 'PapyPrison', 'FourGaming', 'Hiker', 'PushUp', 'Signal', 'Truck'];

    constructor(uiManager, data) {
        const domElements = {
            minigame: {
                    element: '.minigame',
                events: ['click']
            },
            minigameCore: {
                element: '.minigame__core'
            },
            game: {
                element: '.minigame__target'
            },
            message: {
                element: '.minigame__message'
            },
            lives: {
                element: ".minigame__lives"
            },
            progress: {
                element: ".minigame__progress"
            },
            hint: {
                element: ".minigame__objective"
            },
            end: {
                element: ".minigame__ending",
                events: ['click']
            }
        };
        super(uiManager, domElements);
        this.canvas = document.querySelector('.minigame__canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = innerWidth;
        this.canvas.height = 700;
        document.querySelector('.minigame__sprite').src = `assets/sprites/${this.dataManager.save.playerSprite}.gif`;
        requestAnimationFrame(this.minigameCanvas.bind(this));
        if (!data) {
            this.currentLevel = 'tuto';
            this.uiRenderer.getElement('minigame').classList.add('minigame__tuto');
            this.minigames = this.minigames.sort((a, b) => 0.5 - Math.random());
            this.currentGames = structuredClone(this.minigames);
            this.maxLength = this.minigames.length;
            this.gameHandler();
        } else {
            this.minigames = data.minigames;
            this.ennemy = data.ennemy;
            this.currentLevel = data.style;
            this.uiRenderer.getElement('minigame').classList.add(`minigame__${data.style}`);
            document.querySelector('.minigame__decoration').src = `assets/sprites/${data.ennemy ?? 'placeholderEnnemy'}.gif`;
            this.maxLength = this.minigames.length;
            this.minigames = this.minigames.sort((a, b) => 0.5 - Math.random());
            this.currentGames = structuredClone(this.minigames);
            this.gameHandler();
        }
    }

    gameHandler(context = 'Start') {
        this.uiRenderer.getElement('minigame').classList.remove('minigame__zoom');
        document.querySelector('.minigame__message').classList.remove('hide');
        this.uiRenderer.getElement('minigame').classList.add(`minigame__${context}`);
        document.querySelector('.minigame__message').textContent = this.uiRenderer.translateValue(`${this.currentLevel}${context}`);
        this.uiRenderer.getElement('hint').textContent = '...';
        this.audioManager.stopMusic();

        const minigame = this.minigames.shift();
        if (minigame) {
            this.currentProgress++;
            this.uiRenderer.getElement('progress').textContent = `${this.currentProgress}/${this.maxLength}`;
        }
        switch (context) {
            case 'Win':
                this.wonGames++;
                this.audioManager.loadAudioFile('music/minigameInter', 'sfx', [], 1 + (this.currentProgress / 50))
                if (this.currentLevel === "wizard") {
                    this.audioManager.loadAudioFile(`sfx/${this.currentLevel}/win${Math.floor(Math.random() * 4)}_${this.dataManager.save.lang}.ogg`, 'sfx')
                }
                break;
            case 'Lose':
                this.audioManager.loadAudioFile('music/minigameInter', 'sfx')
                if (this.currentLevel === "wizard") {
                    this.audioManager.loadAudioFile(`sfx/${this.currentLevel}/lose${Math.floor(Math.random() * 5)}_${this.dataManager.save.lang}.ogg`, 'sfx')
                }
                break;
            case 'Start':
                this.audioManager.loadAudioFile('music/minigameStart', 'sfx')
                break;
        }

        setTimeout(() => {
            if (minigame && this.lives > 0) {
                this.uiRenderer.getElement('minigame').classList.remove(`minigame__${context}`);
                document.querySelector('.minigame__message').classList.add('hide');
                this.openMinigame(minigame);
                this.uiRenderer.getElement('hint').textContent = this.uiRenderer.translateValue(`hint${minigame}`);
                this.uiRenderer.getElement('minigame').classList.add('minigame__zoom');
            } else {
                this.endMinigame();
            }
        }, 2600);
    }

    /**
     * openMinigame() charge le layout et le controlleur d'un minijeu
     * @param {string} name 
     */
    async openMinigame(name) {
        const ui = await this.requestManager.getPartial(`minigames/${name}`);
        this.uiRenderer.getElement('game').innerHTML = ui;
        const minigame = await import(`../Minigames/${name}Minigame.js`);
        this.currentMinigame = new minigame[`${name}Minigame`](this.uiManager);
        this.dataManager.unlockProgress('minigames', name);
    }

    /**
     * endMinigame() gère la fin d'un minijeu
        * @param {boolean} success 
     */
    endMinigame() {
        this.uiRenderer.getElement('minigame').classList.add('minigame__unzoom');
        const endTime = new Date();
        const time = (endTime - this.startTime) / 1000;
        if (this.lives > 0) {
            this.dataManager.unlockProgress('progress', this.currentLevel);
        }
        let rank;
        switch (this.lives) {
            case 4:
                rank = 'S'
                break;
            case 3:
                rank = 'A'
                break;
            case 2:
            case 1:
                rank = 'B'
                break;
            case 0:
                rank = 'C'
                break;
        }
        this.audioManager.loadAudioFile(`music/rank${rank}`, 'voiceline')
        const img = document.querySelector('.minigame__ending-img');
        const start = document.querySelector('.minigame__ending-start');
        const idle = document.querySelector('.minigame__ending-idle');
        start.classList.add('hide');
        idle.classList.add('hide');
        setTimeout(() => {
            img.src = 'assets/sprites/startRank.gif';
            setTimeout(() => {
                start.classList.remove('hide');
                start.src = `assets/sprites/rank${rank}_start.gif`;
                setTimeout(() => {
                    idle.classList.remove('hide');
                    idle.src = `assets/sprites/rank${rank}_idle.gif`;
                }, rank === 'S' ? 800 : 600);
            }, 1400);
        }, 1400);

        document.querySelector('.minigame__ending-rank').src = `assets/sprites/rank${rank}.png`;
        document.querySelector('.minigame__ending-rank').className = `minigame__ending-rank minigame__ending-rank-${rank}`
        document.querySelector('.minigame__ending-time').textContent = `${this.uiRenderer.translateValue('time')} ${time}s`;
        document.querySelector('.minigame__ending-stats').textContent = `${this.uiRenderer.translateValue('games')} ${this.wonGames}/${this.maxLength}`;
        this.uiRenderer.getElement('end').classList.remove('hide');
    }

    /**
    * renderCanvas() s'occupe de faire le rendu visuel de l'audio analyzer dans la gameroom
    */
    minigameCanvas() {
        const frequencyData = this.audioManager.getFrequencyData();
        const barWidth = this.canvas.width / this.audioManager.bufferLength;
        const lowerBoundFreq = 10;
        const upperBoundFreq = 25000;
        const sampleRate = this.audioManager.context.sampleRate;
        const lowerBoundIndex = Math.floor(lowerBoundFreq / (sampleRate / this.audioManager.bufferLength));
        const upperBoundIndex = Math.ceil(upperBoundFreq / (sampleRate / this.audioManager.bufferLength));

        let barHeight;
        let totalBarWidth = (barWidth + 8) * (upperBoundIndex - lowerBoundIndex);
        let startX = (this.canvas.width - totalBarWidth) / 2;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = lowerBoundIndex; i < upperBoundIndex; i++) {
            barHeight = frequencyData[i] * this.canvas.height / 512;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.fillRect(startX, this.canvas.height - barHeight, barWidth, barHeight);
            startX += barWidth + 8;
        }
        requestAnimationFrame(this.minigameCanvas.bind(this));
    }


    endHandler(ev) {
        switch (ev.target.classList[0]) {
            case 'minigame__ending-quit':
                this.uiManager.updateView('hub', 'main', null, true);
                break;

            case 'minigame__ending-retry':
                this.uiRenderer.getElement('minigame').classList.remove('minigame__zoom');
                this.uiRenderer.getElement('end').classList.add('hide');
                this.uiRenderer.getElement('minigame').classList.remove('minigame__unzoom');
                this.minigames = this.currentGames.sort((a, b) => 0.5 - Math.random());
                this.lives = 4;
                this.startTime = new Date();
                this.currentProgress = 0;
                this.wonGames = 0;
                this.gameHandler();
                break;
        }
    }
}