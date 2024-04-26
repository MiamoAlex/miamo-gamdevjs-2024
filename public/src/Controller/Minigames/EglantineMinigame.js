import { Minigame } from "./Minigame.js";

export class EglantineMinigame extends Minigame {

    state = true;
    elements = [];
    houses = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(12000);
        this.eglantine = document.querySelector('.eglantine__eglantine');
        this.playSoundtrack('eglantineBgm');
        this.area = document.querySelector('.eglantine');
        this.area.addEventListener('click', (ev) => {
            if (ev.target.classList[0] === 'eglantine__trap' && !ev.target.classList.contains('destroyed')) {
                this.houses++;
                const rect = this.area.getBoundingClientRect();
                ev.target.classList.add('destroyed');
                ev.target.src = 'assets/sprites/minigames/eglantine/trapDestroyed.png';
                this.area.insertAdjacentHTML('beforeend', `<img style="left:${ev.target.style.left}; top: ${ev.target.style.top}" src="assets/sprites/minigames/eglantine/explosion.png" class="eglantine__explosion">`);
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/eglantine/explosion', 'sfx', [], 1 + Math.random() * 0.2);
                if (this.houses === 5) {
                    clearInterval(this.timerInterval);
                    this.handleGameResult(true);
                }
            }
        });
    }

    gameOver() {
        this.state = false;
        clearInterval(this.timer);
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}