import { Minigame } from "./Minigame.js";

export class SpaceRaceMinigame extends Minigame {

    state = true;
    clicks = 0;
    ennemyPos = 0;

    constructor(uiManager) {
        super(uiManager);
        this.spacerace = document.querySelector('.spacerace');
        this.player = document.querySelector('.spacerace__player');
        this.computer = document.querySelector('.spacerace__ennemy');
        this.spacerace.addEventListener('mouseup', (ev) => { this.spaceraceHandler(ev) });
        this.spacerace.addEventListener('mousedown', (ev) => { this.spaceraceHandler(ev) });
        this.setTimer(17000);
        this.playSoundtrack('spaceraceBgm');
        this.interval = setInterval(() => {
            this.computer.style.left = `${this.ennemyPos += Math.random() * 2.5}%`;
        }, 250);
    }

    spaceraceHandler(ev) {
        if (this.state) {
            if (ev.target.classList[0] === 'spacerace__button' && ev.type === 'mouseup') {
                ev.target.src = 'assets/sprites/minigames/spacerace/button.png';
                this.clicks++;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacerace/boost', 'sfx');
                this.player.style.left = `${this.clicks * 2}%`;
                if (this.clicks > 40) {
                    clearInterval(this.interval);
                    this.state = false;
                    document.querySelector('.spacerace__trophy').classList.remove('hide');
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacerace/win', 'sfx');
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 1000);
                }
            } else if (ev.type === 'mousedown' && ev.target.classList[0] === 'spacerace__button') {
                ev.target.src = 'assets/sprites/minigames/spacerace/buttonPressed.png';
            }
        }
    }

    gameOver() {
        clearInterval(this.interval);
        this.state = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacerace/fail', 'sfx');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}