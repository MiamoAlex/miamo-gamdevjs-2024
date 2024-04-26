import { Minigame } from "./Minigame.js";

export class SignalMinigame extends Minigame {

    state = true;
    elements = [];

    ready = true;
    counts = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('signalBgm');
        this.setTimer(15000, true);

        this.area = document.querySelector('.signal');

        this.hero = document.querySelector('.signal__hero');
        this.ufo = document.querySelector('.signal__ufo');
        this.ready = true;

        const rect = this.area.getBoundingClientRect();
        this.ufoPos = Math.floor(Math.random() * (rect.width / 1.7));
        this.ufo.style.left = `${this.ufoPos}px`;

        this.area.addEventListener('mousemove', (ev) => {
            if (this.state && this.ready) {
                const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
                const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
                const scaleX = parseFloat(matrixValues[0]);
                const scaleY = parseFloat(matrixValues[3]);
                const rect = this.area.getBoundingClientRect();
                const adjustedX = (ev.clientX - rect.left) / scaleX;
                const adjustedY = (ev.clientY - rect.top) / scaleY;
                this.hero.style.left = `${adjustedX - 16}px`;
                this.playerPosition = adjustedX;
                this.mouse = { x: adjustedX, y: adjustedY };
                if (Math.abs((this.ufoPos + 50) - this.playerPosition) < 90 && this.ready) {
                    this.ready = false;
                    this.counts++;
                    if (this.counts >= 4) {
                        this.state = false;
                        this.ufo.src = 'assets/sprites/minigames/signal/ufoWin.gif'
                        this.hero.src = 'assets/sprites/minigames/signal/characterEnd.gif'
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/signal/ufoFlyingAway', 'sfx');
                        this.handleGameResult(true);
                        this.ufo.style.left = `1500px`;
                    } else {
                        setTimeout(() => {
                            const rect = this.area.getBoundingClientRect();
                            this.ufoPos = Math.floor(Math.random() * (rect.width / 1.7));
                            this.ufo.style.left = `${this.ufoPos}px`;
                            this.ready = true;
                            this.uiManager.audioManager.loadAudioFile('sfx/minigames/signal/alienSpeaking', 'sfx');
                        }, 1500);
                    }
                }


            }
        });
    }

    gameOver() {
        this.state = false;
        clearInterval(this.timerInterval);
        setTimeout(() => {
            this.handleGameResult(false);
        }, 3500);
    }
}