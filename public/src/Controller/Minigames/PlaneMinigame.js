import { Minigame } from "./Minigame.js";

export class PlaneMinigame extends Minigame {

    state = true;
    clicks = 0;
    clickBool = false;
    playerRotation = 0;
    status = ''

    constructor(uiManager) {
        super(uiManager);
        this.plane = document.querySelector('.plane__plane');
        this.player = document.querySelector('.plane__character');
        this.area = document.querySelector('.plane');
        this.area.addEventListener('mousedown', (ev) => { this.planeHandler(ev) });
        this.setTimer(8000, true);
        this.playSoundtrack('planeBgm');
        this.updateEntities();
        this.updatePlayer();
    }

    planeHandler(ev) {
        if (this.state) {
            if (ev.button === 0) {
                this.playerRotation -= 6;
            } else if (ev.button === 2) {
                this.playerRotation += 6;
            }
            this.player.style.transform = `rotate(${this.playerRotation}deg)`;
            this.handlePlayer();
        }
    }

    gameOver() {
        this.state = false;
        if (this.playerRotation < -45) {
            this.player.classList.add('plane__character-left');
        } else if (this.playerRotation > 45) {
            this.player.classList.add('plane__character-right');
        }
        setTimeout(() => {
            this.handleGameResult(false);
        }, 2000);
    }

    updatePlayer() {
        if (this.planeRotation > 0) {
            this.playerRotation += 9;
        } else {
            this.playerRotation -= 9;
        }
        this.player.style.transform = `rotate(${this.playerRotation}deg)`;
        this.handlePlayer();
        setTimeout(() => {
            this.updatePlayer();
        }, 500);
    }

    handlePlayer() {
        if (this.state && (this.playerRotation < -45 || this.playerRotation > 45)) {
            clearInterval(this.timerInterval);
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/plane/slip', 'sfx', [], 1 + Math.random() * 0.2);
            this.gameOver();
        }
    }

    updateEntities() {
        if (this.state) {
            this.planeRotation = this.planeRotation > 0 ? -20 : 20;
            this.plane.style.transform = `rotate(${this.planeRotation}deg)`;
        } else {
            this.planeRotation = 0;
        }

        setTimeout(() => {
            this.updateEntities();
        }, (Math.random() * 4000) + 2000);
    }
}