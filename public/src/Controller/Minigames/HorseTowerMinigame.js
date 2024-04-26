import { Minigame } from "./Minigame.js";

export class HorseTowerMinigame extends Minigame {

    state = true;
    sequence = [];
    stage = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(15000);
        this.playSoundtrack('horseTowerBgm');
        document.querySelectorAll('.horsetower__cheval').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        document.querySelector('.horsetower__tower').addEventListener('dragover', (ev) => { this.dragOver(ev) });
        document.querySelector('.horsetower__tower').addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        document.querySelector('.horsetower__tower').addEventListener('drop', this.drop.bind(this));
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
            if (draggedElement && parseInt(draggedElement.dataset.id) == this.stage + 1) {
                this.stage++;
                draggedElement.remove();
                ev.target.src = `assets/sprites/minigames/horsetower/stage${this.stage}.png`;
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/horsetower/cheval', 'sfx')
                if (this.stage == 4) {
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/horsetower/veryGood.mp3', 'sfx')
                    document.querySelector('.horsetower__trophy').classList.remove('hide');
                    document.querySelector('.horsetower__gentleman').src = 'assets/sprites/minigames/horsetower/gentlemateRAINBOW.png';
                    document.querySelector('.horsetower__gentleman').classList.add('rainbow');
                    this.state = false;
                    clearInterval(this.timerInterval);
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 2000);
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