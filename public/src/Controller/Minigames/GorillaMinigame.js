import { Minigame } from "./Minigame.js";

export class GorillaMinigame extends Minigame {

    state = true;
    clicks = 0;
    clickBool = false;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.gorilla');
        this.gorilla = document.querySelector('.gorilla__gorilla');
        this.person = document.querySelector('.gorilla__person');
        this.area.addEventListener('mousedown', (ev) => { this.gorillaHandler(ev) });
        this.setTimer(14000);
        this.playSoundtrack('marimbaFou');

        setTimeout(() => {
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/gorilla/gorille', 'sfx');
            this.gorilla.src = document.querySelector('.gorilla__gorilla').src = 'assets/sprites/minigames/gorilla/gorillaOn.gif';
        }, 1200);
    }

    gorillaHandler(ev) {
        if (this.state) {
            this.person.src = 'assets/sprites/minigames/gorilla/hommeGorille.png';
            this.person.style.width = '25%';
            if (this.clickBool && ev.button === 0) {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/gorilla/humain', 'sfx', [], 1 + Math.random() * 0.15);
                this.clicks++;
                this.clickBool = !this.clickBool;
                this.person.style.transform = 'scaleX(-1)';
            } else if (!this.clickBool && ev.button === 2) {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/gorilla/humain', 'sfx', [], 1 + Math.random() * 0.15);
                this.clicks++;
                this.clickBool = !this.clickBool;
                this.person.style.transform = 'scaleX(1)';
            }
            if (this.clicks > 30) {
                this.gorilla.src = 'assets/sprites/minigames/gorilla/harambestill.png';
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/gorilla/degouter', 'sfx');
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