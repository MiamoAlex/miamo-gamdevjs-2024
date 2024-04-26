import { Minigame } from "./Minigame.js";

export class DopeOMaxMinigame extends Minigame {

    state = true;
    clicks = 0;
    clickBool = false;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.dopeomax');
        this.syringe = document.querySelector('.dopeomax__syringe');
        this.area.addEventListener('mousedown', (ev) => { this.dopemaxHandler(ev) });
        this.setTimer(16000);
        this.playSoundtrack('dopeomaxBgm');
    }

    dopemaxHandler(ev) {
        if (!this.state) {
            return
        }
        switch (ev.target.classList[0]) {
            case 'dopemax__syringe-top':
                if (this.clicks === 0) {
                    ev.target.classList.add('dopemax__syringe-up');
                    this.syringe.classList.add('dopemax__syringe-flip');
                    document.querySelector('.dopeomax__syringe-liquid').classList.add('dopeomax__full');
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/dopeomax/syringe1', 'sfx');
                    setTimeout(() => {
                        this.clicks++;
                    }, 1800);
                } else {
                    document.querySelector('.dopeomax__syringe-liquid').classList.remove('dopeomax__full');
                    ev.target.classList.remove('dopemax__syringe-up');
                    this.state = false;
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/dopeomax/syringe2', 'sfx');
                    setTimeout(() => {
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/dopeomax/win', 'sfx');
                        clearInterval(this.timerInterval);
                        this.handleGameResult(true)
                    }, 1500);
                }
                break;
        }
        if (this.state) {
            if (this.clicks > 20) {
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
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}