import { Minigame } from "./Minigame.js";

export class SpaceCowMinigame extends Minigame {

    state = true;
    beam = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('mozarellaKnife');
        this.game = document.querySelector('.spacecow');
        this.cow = document.querySelector('.spacecow__cow');
        this.game.addEventListener('mousewheel', (ev) => { this.gameHandler(ev) });
        this.setTimer(15000);
        setTimeout(() => {
            document.querySelector('.spacecow__spaceship').classList.remove('moving')
        }, 300);
        setTimeout(() => {
            this.start = true;
        }, 800);
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }

    gameHandler(ev) {
        if (this.start && this.state) {
            if (!this.sfx) {
                this.sfx = true;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/spacecow/vache', 'sfx');
            }
            if (ev.deltaY > 0 && this.state) {
                this.beam += 3;
                const scale = 1 - (this.beam / 300);
                this.cow.style.transform = `translateY(-${this.beam}%) scale(${scale})`;
                if (this.beam > 300) {
                    this.state = false;
                    clearInterval(this.timerInterval);
                    document.querySelector('.spacecow__spaceship').classList.add('gone')
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 2000);
                }
            }
        }
    }
}