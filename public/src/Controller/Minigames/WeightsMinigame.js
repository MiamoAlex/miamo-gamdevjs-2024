import { Minigame } from "./Minigame.js";

export class WeightsMinigame extends Minigame {

    state = true;
    sequence = [];
    colors = ['red', 'blue', 'green', 'yellow'];
    try = [];

    constructor(uiManager) {
        super(uiManager);
        this.area = document.querySelector('.weights__area');
        this.weights = document.querySelector('.weights__weights');
        this.sequenceArea = document.querySelector('.weights__model')
        this.setTimer(12000);
        this.playSoundtrack('weightsBgm');
        this.generateSequence();

        document.querySelectorAll('.weights__weight').forEach((element) => {
            element.draggable = true;
            element.addEventListener('dragstart', (ev) => this.dragStart(ev));
            element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
            element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
        });

        this.area.addEventListener('dragover', (ev) => { this.dragOver(ev) });
        this.area.addEventListener('dragenter', (ev) => { this.dragEnter(ev) });
        this.area.addEventListener('drop', this.drop.bind(this));

        this.area.addEventListener('click', (ev) => {
            if (ev.target.classList[0] === 'weights__tag') {
                const id = ev.target.dataset.placement
                this.weights.innerHTML += `<img id="${this.try[id]}" class="weights__weight weights__${this.try[id]}" src="assets/sprites/minigames/weights/${this.try[id]}.png">`;
                this.id++;
                this.try.splice(ev.target.dataset.placement, 1);
                ev.target.remove();

                document.querySelectorAll('.weights__weight').forEach((element) => {
                    element.draggable = true;
                    element.addEventListener('dragstart', (ev) => this.dragStart(ev));
                    element.addEventListener('dragover', (ev) => { this.dragOver(ev) });
                    element.addEventListener('dragEnter', (ev) => { this.dragEnter(ev) });
                });
            }
        });
    }

    dragStart(ev) {
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/weights/up', 'sfx');
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
            if (draggedElement && draggedElement.classList.contains('weights__weight')) {
                this.uiManager.audioManager.loadAudioFile('sfx/minigames/weights/drop', 'sfx');
                this.weights.removeChild(draggedElement);
                this.try.push(draggedElement.id);
                this.area.querySelector('.weights__placement').innerHTML += `<div data-placement="${this.try.length - 1}" class="weights__tag weights__tag-${draggedElement.id}"></div>`;
                if (this.try.length === this.sequence.length && this.try.every((value, index) => value === this.sequence[index])) {
                    clearInterval(this.timerInterval);
                    this.handleGameResult(true);
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/weights/reussite', 'sfx');
                }
            }
        }
    }

    generateSequence() {
        this.sequence = [];
        for (let i = 0; i < 4; i++) {
            const random = Math.floor(Math.random() * this.colors.length);
            this.sequence.push(this.colors[random]);
            this.colors.splice(random, 1);
            this.sequenceArea.innerHTML += `<div class="weights__tag weights__tag-${this.sequence[i]}"></div>`;
        }
    }

    gameOver() {
        this.state = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/weights/fail', 'sfx');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}