import { Minigame } from "./Minigame.js";

export class PotionMinigame extends Minigame {

    state = true;
    ingredients = 0;

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.potion__chaudron');
        this.weights = document.querySelector('.potion__ingredients');
        this.setTimer(12000);
        this.playSoundtrack('scone');
        document.querySelectorAll('.potion__ingredients').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        this.area.addEventListener('dragover', (ev) => { this.dragOver(ev) });
        this.area.addEventListener('dragenter', (ev) => { this.dragEnter(ev) });
        this.area.addEventListener('drop', this.drop.bind(this));
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
        if (this.state) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text/plain");
            const draggedElement = document.querySelector(`#${data}`);
            draggedElement.remove();
            this.ingredients++;
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/potion/splush', 'sfx', null, 1 + Math.random() * 0.5);
            if (this.ingredients > 5) {
                this.state = false;
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 600);
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