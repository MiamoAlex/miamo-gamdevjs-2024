import { Minigame } from "./Minigame.js";

export class TruckMinigame extends Minigame {
    clicks = 0;
    state = 0;
    state = true;
    height = 10;

    constructor(uiManager) {
        super(uiManager);
        this.truck = document.querySelector('.truck');
        this.truck.addEventListener('click', (ev) => { this.truckHandler(ev) });
        this.plant = document.querySelector('.truck__plant');
        this.setTimer(16000);
        this.playSoundtrack('truckBgm');
    }

    truckHandler(ev) {
        if (this.state) {
            this.clicks++;
            this.height += 5;
            this.plant.style.height = `${this.height}%`;
            if (this.clicks === 5 && this.state < 3) {
                this.clicks = 0;
                this.state++;
                this.plant.src = `assets/sprites/minigames/truck/tree${this.state}.png`;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/truck/evolve', 'sfx');
            } else {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/truck/clic', 'sfx');
            }

            if (this.state === 3 && this.clicks === 5) {
                this.state = false;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/truck/truckGone', 'sfx');
                clearInterval(this.timerInterval);
                this.plant.style.height = `130%`;
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 1000);
            }
        }
    }

    gameOver() {
        this.state = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/truck/fail', 'sfx');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}