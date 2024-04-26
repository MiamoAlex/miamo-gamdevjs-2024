import { Minigame } from "./Minigame.js";

export class SandwichPiedMinigame extends Minigame {

    state = true;
    elements = [];
    sandwiches = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('bigSteppa');
        this.area = document.querySelector('.sandwichpied');
        this.pen = document.querySelector('.sandwichpied__tapette');
        this.setTimer(10000);
        document.querySelectorAll('.sandwichpied__sandwich').forEach(sandwich => {
            sandwich.addEventListener('mouseenter', this.sansHandler.bind(this));
        });

        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;
            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);
            const rect = this.area.getBoundingClientRect();
            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;
            this.pen.style.top = `${adjustedY - 200}px`;
            this.pen.style.left = `${adjustedX - 100}px`;
            this.mouse = { x: adjustedX, y: adjustedY };
        });
    }

    sansHandler(ev) {
        if (this.state) {
            this.sandwiches++;
            ev.target.remove();
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/sandwichpied/splortch.ogg', 'sfx', null, 1 + Math.random() * 0.2);
            if (this.sandwiches > 3) {
                this.state = false;
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 1000);
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