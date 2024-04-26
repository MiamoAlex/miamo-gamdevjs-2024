import { Minigame } from "./Minigame.js";

export class PapyPrisonMinigame extends Minigame {
    state = true;
    elements = [];
    pieces = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('papyprisonBgm');
        this.area = document.querySelector('.papyprison');
        this.pen = document.querySelector('.papyprison__marto');
        this.setTimer(16000);
        this.area.addEventListener('click', (ev) => { this.areaHandler(ev) });
        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);
            const rect = this.area.getBoundingClientRect();
            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;
            this.pen.style.top = `${adjustedY - 200}px`;
            this.pen.style.left = `${adjustedX - 400}px`;
            this.mouse = { x: adjustedX, y: adjustedY };
        });
    }

    areaHandler(ev) {
        if (this.state) {
            this.pen.src = 'assets/sprites/minigames/papyprison/marto.gif';
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/papyprison/pan.ogg')
            setTimeout(() => {
                this.pen.src = 'assets/sprites/minigames/papyprison/marto.png';
            }, 400);
            if (ev.target.classList.contains('papyprison__piece')) {
                this.pieces++;
                ev.target.remove();
                if (this.pieces > 2) {
                    this.state = false;
                    clearInterval(this.timerInterval);
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/papyprison/merci.ogg')
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 1000);
                    this.pieces++;
                }
            }
        }
    }

    gameOver() {
        this.state = false;
        clearInterval(this.interval)
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}