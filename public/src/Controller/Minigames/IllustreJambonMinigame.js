import { Minigame } from "./Minigame.js";

export class IllustreJambonMinigame extends Minigame {

    state = true;
    sequence = [];
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(11000);
        this.playSoundtrack('hamBender');

        document.querySelectorAll('.illustrejambon__bouquet').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        document.querySelector('.illustrejambon__jambon').addEventListener('dragover', (ev) => { this.dragOver(ev) });
        document.querySelector('.illustrejambon__jambon').addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        document.querySelector('.illustrejambon__jambon').addEventListener('drop', this.drop.bind(this));
    }

    dragStart(ev) {
        ev.dataTransfer.setData("text/plain", ev.target.id);
    }

    dragOver(ev) {
        ev.preventDefault();
    }

    dragEnter(ev) {
        ev.preventDefault();
    }

    drop(ev) {
        ev.preventDefault();
        if (this.state) {
            const data = ev.dataTransfer.getData("text/plain");
            const draggedElement = document.querySelector(`#${data}`);
            if (draggedElement) {
                draggedElement.remove();
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/illustrejambon/raoup', 'sfx')
                this.status++;
                if (this.status >= 4) {
                    this.state = false;
                    clearInterval(this.timerInterval);
                    this.handleGameResult(true);
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