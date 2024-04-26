import { Minigame } from "./Minigame.js";

export class FourGamingMinigame extends Minigame {
    state = true;
    elements = [];
    status = 1;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.fourgaming');
        this.setTimer(15000)
        this.area.addEventListener('click', (ev) => { this.areaHandler(ev) });
    }

    areaHandler(ev) {
        if (this.state) {
            this.status++;
            if (this.status === 5) {
                this.state = false;
                this.area.style.backgroundImage = `url(assets/sprites/minigames/fourgaming/5.gif)`;
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 1000);
                this.uiManager.audioManager.loadAudioFile(`sfx/minigames/fourgaming/${this.status - 1}.ogg`);
            } else {
                this.uiManager.audioManager.loadAudioFile(`sfx/minigames/fourgaming/${this.status - 1}.ogg`);
                this.area.style.backgroundImage = `url(assets/sprites/minigames/fourgaming/${this.status}.png)`;
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