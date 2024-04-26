import { Minigame } from "./Minigame.js";

export class HikerMinigame extends Minigame {
    state = true;
    elements = [];
    status = 1;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('hikerBgm');
        this.area = document.querySelector('.hiker');
        this.setTimer(15000)
        document.body.addEventListener('keyup', (ev) => { this.areaHandler(ev) });
        this.currentKey = this.randomKey();
        document.querySelector('.hiker__key').textContent = this.currentKey;
    }

    areaHandler(ev) {
        if (this.state) {
            if (ev.key.toLowerCase() === this.currentKey.toLowerCase()) {
                this.currentKey = this.randomKey();
                document.querySelector('.hiker__key').textContent = this.currentKey;
                this.status++;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/hiker/herbe.ogg')
                this.area.style.backgroundImage = `url(assets/sprites/minigames/hiker/${this.status}.png)`;
                if (this.status === 5) {
                    document.querySelector('.hiker__key').remove();
                    this.state = false;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/hiker/picnic.ogg')
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 1000);
                }
            }
        }
    }

    randomKey = () => String.fromCharCode(97 + Math.floor(Math.random() * 26));

    gameOver() {
        this.state = false;
        clearInterval(this.interval)
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}