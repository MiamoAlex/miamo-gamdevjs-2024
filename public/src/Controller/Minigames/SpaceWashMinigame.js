import { Minigame } from "./Minigame.js";

export class SpaceWashMinigame extends Minigame {

    state = true;
    elements = [];
    clean = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(12000);
        this.ufo = document.querySelector('.spacewash__dirty');
        this.playSoundtrack('spacewashBgm');
        this.area = document.querySelector('.spacewash');
        this.pen = document.querySelector('.spacewash__sponge');

        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);
            const rect = this.area.getBoundingClientRect();
            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;
            this.pen.style.top = `${adjustedY - 68}px`;
            this.pen.style.left = `${adjustedX - 85}px`;

            // Sauvegarde la position précédente de la souris
            const prevX = this.mouse ? this.mouse.x : adjustedX;
            const prevY = this.mouse ? this.mouse.y : adjustedY;

            this.mouse = { x: adjustedX, y: adjustedY };

            // Dessine une ligne entre la position précédente et la nouvelle position
            if (this.mouse && this.ctx) {
                this.ctx.beginPath();
                this.ctx.moveTo(prevX, prevY);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });

        document.querySelector('.spacewash__ship').addEventListener('mousemove', () => {
            if (this.state) {
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacewash/cleaning', 'sfx');
                    setTimeout(() => {
                        this.isPlaying = false;
                    }, 800);
                }
                this.clean++;
                this.ufo.style.opacity = 1 - (this.clean / 400);
                if (this.clean === 400) {
                    this.state = false;
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacewash/clean', 'sfx');
                    document.querySelector('.spacewash__win').classList.remove('hide');
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 3000);
                }
            }
        });
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}