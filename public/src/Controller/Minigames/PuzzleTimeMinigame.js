import { Minigame } from "./Minigame.js";

export class PuzzleTimeMinigame extends Minigame {

    state = true;
    sequence = [];
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(17000);
        this.playSoundtrack('puzzletimeBgm');

        const random = Math.floor(Math.random() * 2) + 1;
        document.querySelectorAll('.puzzletime__piece').forEach((element) => {
            // element.src = element.src.replace('2', random);
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        document.querySelectorAll('.puzzletime__slot').forEach((element) => {
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
            element.addEventListener('drop', this.drop.bind(this));
        });

    }

    drop(ev) {
        if (this.state) {
            this.uiManager.audioManager.loadAudioFile('sfx/minigames/puzzletime/drop', 'sfx');
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text/plain");
            const draggedElement = document.querySelector(`#${data}`);
            if (draggedElement && draggedElement.id === ev.target.dataset.item) {
                draggedElement.draggable = false;
                ev.target.style.backgroundImage = `url(${draggedElement.src})`;
                // ev.target.style.backgroundSize = `100% 100%`;
                draggedElement.remove();
                this.status++;
                if (this.status >= 4) {
                    this.state = false;
                    this.handleGameResult(true);
                }
            }
        }
    }

    dragStart(ev) {
        ev.dataTransfer.setData("text/plain", ev.target.id);
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/puzzletime/drag', 'sfx');
    }

    dragOver(ev) {
        ev.preventDefault();
    }

    dragEnter(ev) {
        ev.preventDefault();
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}