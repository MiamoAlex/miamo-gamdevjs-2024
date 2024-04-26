import { Minigame } from "./Minigame.js";

export class MixerMinigame extends Minigame {

    state = true;
    clicks = 0;
    clickBool = false;
    status = ''

    constructor(uiManager) {
        super(uiManager);
        this.mixer = document.querySelector('.mixer');
        this.mixer.addEventListener('mouseup', (ev) => { this.mixerHandler(ev) });
        this.mixer.addEventListener('mousedown', (ev) => { this.mixerHandler(ev) });
        this.setTimer(24000);
        this.playSoundtrack('mixerBgm');
    }

    mixerHandler(ev) {
        if (this.state) {
            switch (ev.target.classList[0]) {
                case 'mixer__mixer':
                    if (!this.status && ev.type === 'mousedown') {
                        this.status = 'start';
                        document.querySelector('.mixer__mixer').style.backgroundImage = 'url(assets/sprites/minigames/mixer/mixerOn.gif)';
                        document.querySelector('.mixer__mixer').classList.add('shake');
                        document.querySelectorAll('.mixer__fruit').forEach(element => {
                            element.classList.add('mixer__fruit-active');
                        })
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/mixer/mixer', 'sfx', [], 1 + Math.random() * 0.2);
                        setTimeout(() => {
                            if (this.clickBool) {
                                this.state = false;
                                document.querySelector('.mixer__mixer').classList.remove('shake');
                                clearInterval(this.timerInterval);
                                document.querySelector('.mixer__mixer').innerHTML = '';
                                document.querySelector('.mixer__mixer').style.backgroundImage = 'url(assets/sprites/minigames/mixer/mixerEnd.png)';
                                this.uiManager.audioManager.loadAudioFile('sfx/minigames/mixer/win', 'sfx', [], 1 + Math.random() * 0.2);
                                this.handleGameResult(true);
                            } else {
                                this.state = false;
                                clearInterval(this.timerInterval);
                                this.gameOver();
                            }
                        }, 3000);
                    }
                    break;

                case 'mixer__couvercle':
                    if (ev.type === 'mouseup') {
                        this.clickBool = false;
                    } else if (ev.type === 'mousedown') {
                        this.clickBool = true;
                    }
                    break;
            }
        }
    }

    gameOver() {
        this.handleGameResult(false);
    }
}