import { Minigame } from "./Minigame.js";

export class GemsMinigame extends Minigame {

    state = true;
    elements = [];
    clicks = 0;
    instruments = ['trompette', 'guitar'];
    instrument = '';

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(12000);
        this.playSoundtrack('gemBgm');
        this.area = document.querySelector('.gems');
        this.pen = document.querySelector('.gems__pickaxe');

        if (Math.random() > .999) {
            this.instrument = 'gong';
        } else {
            this.instrument = this.instruments[Math.floor(Math.random() * this.instruments.length)];
        }
        document.querySelector('.gems__trumpet').src = `assets/sprites/minigames/gem/${this.instrument}.png`;

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

        this.gem = document.querySelector('.gems__gem');
        this.gem.addEventListener('click', (ev) => {
            if (this.state) {
                this.clicks++;
                this.pen.classList.add('shake');
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/gem/pickaxe.wav', 'sfx', [], 1 + Math.random() * .2)
                setTimeout(() => {
                    this.pen.classList.remove('shake');
                }, 100);
                if (this.clicks === 12) {
                    this.state = false;
                    this.uiManager.audioManager.loadAudioFile(`sfx/minigames/gem/${this.instrument}`, 'sfx', [], 1 + Math.random() * .2)
                    ev.target.src = 'assets/sprites/minigames/gem/gemBroken.png';
                    document.querySelector('.gems__trumpet').classList.remove('hide')
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 800);
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