import { Minigame } from "./Minigame.js";

export class HeroFlyingMinigame extends Minigame {

    state = true;
    elements = [];

    constructor(uiManager) {
        super(uiManager);
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/heroflying/wind', 'music');
        this.setTimer(11000, true)
        this.area = document.querySelector('.heroflying');
        this.area.addEventListener('click', (ev) => { this.areaHandler(ev) })

        this.pen = document.querySelector('.heroflying__hero')
        this.area.addEventListener('mousemove', (ev) => {
            if (this.state) {
                const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
                if (ev.target.classList[0] === 'heroflying__bird') {
                    this.pen.src = 'assets/sprites/minigames/heroflying/heroFalling.png';
                    this.pen.classList.add('heroflying__hero-dead');
                    this.gameOver();
                    this.state = false;
                }
                const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
                const scaleX = parseFloat(matrixValues[0]);
                const scaleY = parseFloat(matrixValues[3]);

                const rect = this.area.getBoundingClientRect();

                const adjustedX = (ev.clientX - rect.left) / scaleX;
                const adjustedY = (ev.clientY - rect.top) / scaleY;

                this.pen.style.top = `${adjustedY - 40}px`;
                this.pen.style.left = `${adjustedX - 120}px`;

                this.mouse = { x: adjustedX, y: adjustedY };
            }

        });
        this.interval = setInterval(() => {
            this.generateFly();
        }, (Math.random() * 1200) + 1000);
    }

    areaHandler(ev) {
        if (this.state) {
            if (ev.target.classList[0] === 'yogafly__fly') {
                this.flies++;
                ev.target.remove();
                if (this.flies > 7) {
                    this.state = false;
                    clearInterval(this.interval)
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 1000);
                }
            }
        }
    }

    generateFly() {
        if (this.state) {  
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/heroflying/oiseau.wav', 'sfx');
            this.area.insertAdjacentHTML('beforeend', `<img style="top: ${Math.random() * 85}%" draggable="false" class="heroflying__bird" src="assets/sprites/minigames/heroflying/bird${Math.floor(Math.random() * 2) + 1}.png">`);
        }
    }

    gameOver() {
        this.state = false;
        clearInterval(this.interval)
        clearInterval(this.timerInterval);
        setTimeout(() => {
            this.handleGameResult(false);
        }, 3500);
    }
}