import { Minigame } from "./Minigame.js";

export class FormMinigame extends Minigame {

    state = true;
    elements = [];

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(15000);
        this.playSoundtrack('formBgm');
        this.area = document.querySelector('.form');
        this.area.querySelectorAll('input').forEach(element => {
            element.addEventListener('mouseover', (ev) => {
                if (this.state && !this.elements.includes(ev.target)) {
                    this.elements.push(ev.target)
                    if (this.elements.length >= 4 && this.elements.includes(document.querySelector('.form__signature'))) {
                        clearInterval(this.timerInterval);
                        this.state = false;
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/form/handshake', 'sfx', [], 1 + Math.random() * 0.2);
                        document.querySelector('.form__hands').classList.remove('hide');
                        setTimeout(() => {
                            this.handleGameResult(true);
                        }, 2500);
                    }
                }
            });
        });

        this.canvas = document.querySelector('.form__canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pen = document.querySelector('.form__pen')

        const rect = this.area.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
            if (Math.random() > 0.97) {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/form/writing', 'sfx');
            }
            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);

            const rect = this.area.getBoundingClientRect();

            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;

            this.pen.style.top = `${adjustedY - 68}px`;
            this.pen.style.left = `${adjustedX - 15}px`;

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
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}