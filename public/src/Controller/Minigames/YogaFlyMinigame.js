import { Minigame } from "./Minigame.js";

export class YogaFlyMinigame extends Minigame {

    state = true;
    elements = [];
    flies = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('yogaFlyBgm');
        this.setTimer(13000, true)
        this.area = document.querySelector('.yogafly');
        this.area.addEventListener('click', (ev) => { this.areaHandler(ev) })

        this.pen = document.querySelector('.yogafly__tapette')
        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;

            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);

            const rect = this.area.getBoundingClientRect();

            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;

            this.pen.style.top = `${adjustedY - 40}px`;
            this.pen.style.left = `${adjustedX - 90}px`;

            this.mouse = { x: adjustedX, y: adjustedY };
        });
        this.interval = setInterval(() => {
            this.generateFly();
        }, (Math.random() * 1200) + 1000);
    }

    areaHandler(ev) {
        if (this.state) {
            if (ev.target.classList[0] === 'yogafly__fly' && !ev.target.classList.contains('dead')) {
                this.pen.classList.add('yogafly__tapette-hit');
                setTimeout(() => {
                    this.pen.classList.remove('yogafly__tapette-hit');
                }, 200);
                this.flies++;
                ev.target.classList.add('dead')
                ev.target.src = 'assets/sprites/minigames/yogafly/moustiqueDead.png';
                ev.target.style.animationPlayState = 'paused';
                setTimeout(() => {
                    ev.target.remove();
                }, 2500);
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/yogafly/kill', 'sfx');
            }
        }
    }

    generateFly() {
        const flyElement = document.createElement('img');
        flyElement.style.top = `${Math.random() * 85}%`;
        flyElement.draggable = false;
        flyElement.classList.add('yogafly__fly');
        flyElement.classList.add(`yogafly__${Math.random() > 0.5 ? 'left' : 'right'}`);
        flyElement.src = 'assets/sprites/minigames/yogafly/moustique.png';
        this.area.appendChild(flyElement);
        flyElement.addEventListener('animationend', () => {
            if (this.state) {
                this.gameOver();
            }
        })
    }

    gameOver() {
        this.state = false;
        document.querySelector('.yogafly__homme').src = 'assets/sprites/minigames/yogafly/hommeBrise.png';
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/yogafly/dead', 'sfx');
        clearInterval(this.interval)
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}