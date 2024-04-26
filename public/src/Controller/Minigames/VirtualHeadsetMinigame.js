import { Minigame } from "./Minigame.js";

export class VirtualHeadsetMinigame extends Minigame {

    state = true;
    sequence = [];
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(11000);
        this.playSoundtrack('gleepor2');
        document.querySelectorAll('.virtualheadset__item').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        document.querySelectorAll('.virtualheadset__slot').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
            element.addEventListener('drop', this.drop.bind(this));
        });
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
            if (draggedElement && draggedElement.id === ev.target.dataset.item) {
                draggedElement.draggable = false;
                ev.target.appendChild(draggedElement);
                this.status++;
                if (this.status >= 3) {
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