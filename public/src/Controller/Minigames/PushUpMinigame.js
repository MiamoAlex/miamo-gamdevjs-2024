import { Minigame } from "./Minigame.js";

export class PushUpMinigame extends Minigame {

    state = true;
    clicks = 10;
    clickBool = false;

    constructor(uiManager) {
        super(uiManager);
        this.pushup = document.querySelector('.pushup');
        this.person = document.querySelector('.pushup__person');
        this.coach = document.querySelector('.pushup__coach');
        this.bubble = document.querySelector('.pushup__bubble');
        this.pushup.addEventListener('click', () => { this.pushupHandler() });
        this.setTimer(13000);
        this.bubble.textContent = this.clicks;
        this.playSoundtrack('pushUpBgm');
    }

    pushupHandler(ev) {
        if (this.state) {
            this.clickBool = !this.clickBool;
            if (this.clickBool) {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/pushup/up', 'sfx');
                this.person.src = 'assets/sprites/minigames/pushup/character1.png';
            } else {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/pushup/down', 'sfx');
                this.person.src = 'assets/sprites/minigames/pushup/character2.png';
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/pushup/coach', 'sfx', [], 1 + Math.random() * 0.15);
                this.clicks--;
                this.bubble.textContent = this.clicks;
            }
            if (this.clicks === 0) {
                this.state = false;
                this.coach.src = 'assets/sprites/minigames/pushup/coachWin.png';
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/pushup/win', 'sfx');
                clearInterval(this.timerInterval);
                this.handleGameResult(true);
            }
        }
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 400);
    }
}