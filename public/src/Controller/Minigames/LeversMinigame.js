import { Minigame } from "./Minigame.js";

export class LeversMinigame extends Minigame {

    state = true;
    clicks = 0;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.levers');
        this.levers = document.querySelector('.levers__levers');
        this.area.addEventListener('click', (ev) => { this.leversHandler(ev) });
        this.setTimer(12000)
        this.playSoundtrack('gleepor2');
    }

    leversHandler(ev) {
        if (this.state) {
            if (ev.target.className === 'levers__lever') {
                this.clicks++;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/levers/lever', 'sfx', [], 1 + Math.random() * 0.2)
                ev.target.src = 'assets/sprites/minigames/levers/levierBas.png';
                ev.target.className = 'levers__lever --clicked';
                if (this.clicks === 8) {
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/levers/win', 'sfx', [])
                    this.state = false;
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 800);
                    document.querySelector('.levers__spark').classList.remove('hide');
                    setTimeout(() => {
                        document.querySelector('.levers__flabby').src = 'assets/sprites/minigames/levers/emptyBell.png';
                        document.querySelector('.levers__bell').src = 'assets/sprites/minigames/levers/fullBell.png';
                    }, 300);

                }
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