import { Minigame } from "./Minigame.js";

export class HomeDestroyerMinigame extends Minigame {

    state = true;
    elements = [];
    houses = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(12000);
        this.ufo = document.querySelector('.homedestroyer__dirty');
        this.playSoundtrack('homedestroyerBgm');
        this.area = document.querySelector('.homedestroyer');
        this.pen = document.querySelector('.homedestroyer__ufo');

        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);
            const rect = this.area.getBoundingClientRect();
            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;
            this.pen.style.top = `${adjustedY - 50}px`;
            this.pen.style.left = `${adjustedX - 60}px`;

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
        this.area.addEventListener('mousemove', (ev) => {
            if (this.state) {
                if (ev.target.className === 'homedestroyer__home') {
                    ev.target.classList.add('destroyed')
                    ev.target.src = ev.target.src.replace('house', 'houseDestroyed')
                    this.houses++;
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/homedestroyer/houseDestroyed', 'sfx', [], 1 + Math.random() * 0.15);
                    if (this.houses === 5) {
                        this.state = false;
                        this.handleGameResult(true);
                    }
                }
            }
        })
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}