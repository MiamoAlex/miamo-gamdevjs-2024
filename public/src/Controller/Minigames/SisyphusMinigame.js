import { Minigame } from "./Minigame.js";

export class SisyphusMinigame extends Minigame {

    state = true;
    clicks = 0;
    ennemyPos = 0;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.sisyphus');
        this.player = document.querySelector('.sisyphus__player');
        this.area.addEventListener('click', (ev) => { this.sisyphusHandler(ev) });
        this.setTimer(16000);
        this.playSoundtrack('sisyphusBgm');
        setTimeout(() => {
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/sisyphus/volcan', 'sfx');
        }, 500);
    }

    sisyphusHandler(ev) {
        if (this.state) {
            this.clicks++;
            this.player.style.left = `${26 + this.clicks}%`;
            this.player.style.bottom = `${this.clicks * 1.25}%`;
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/sisyphus/step', 'sfx');
            if (this.clicks > 40) {
                this.player.src = 'assets/sprites/minigames/sisyphus/celebration.gif';
                this.player.classList.add('sisyphus__player-win')
                this.area.style.backgroundImage = 'url("assets/sprites/minigames/sisyphus/backgroundWin.png")';

                this.uiManager.audioManager.loadAudioFile('sfx/minigames/sisyphus/win', 'sfx')
                this.state = false;
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 1000);
            }
        }
    }

    gameOver() {
        clearInterval(this.interval);
        this.state = false;
        this.uiManager.audioManager.stopMusic();
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/sisyphus/volcan', 'sfx');
        this.area.style.backgroundImage = 'url("assets/sprites/minigames/sisyphus/backgroundFail.png")';
        this.area.innerHTML = '';
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}