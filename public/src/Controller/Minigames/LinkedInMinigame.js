import { Minigame } from "./Minigame.js";

export class LinkedInMinigame extends Minigame {

    clicks = 0;
    state = true;

    constructor(uiManager) {
        super(uiManager);
        this.linkedin = document.querySelector('.linkedin');
        this.linkedin.addEventListener('click', (ev) => { this.linkedinHandler(ev) });
        this.setTimer(14000);
        this.playSoundtrack('linkedinBgm');
    }

    linkedinHandler(ev) {
        if (this.state && ev.target.classList[0] === 'linkedin__button') {
            this.clicks++;
            ev.target.classList.add('linkedin__button-active')
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/linkedin/accept', 'sfx');
            if (this.clicks === 8) {
                this.state = false;
                clearInterval(this.timerInterval);
                this.handleGameResult(true);
            }
        }
    }

    gameOver() {
        this.state = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/linkedin/fail', 'sfx');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}