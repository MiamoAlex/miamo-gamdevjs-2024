import { Minigame } from "./Minigame.js";

export class PizzaQuizMinigame extends Minigame {

    state = true;
    clicks = 0;

    constructor(uiManager) {
        super(uiManager);
        this.pizza = document.querySelector('.pizzaquiz');
        this.pizza.addEventListener('click', (ev) => { this.pizzaHandler(ev) });
        this.setTimer(6000);
        this.playSoundtrack('enigmotron');
        this.uiManager.audioManager.loadAudioFile(`sfx/minigames/pizzaquiz/question${Math.floor(Math.random() * 3)}`, 'sfx');
    }

    pizzaHandler(ev) {
        if (this.state) {
            if (ev.target.classList[0] === 'pizzaquiz__c') {
                this.state = false;
                clearInterval(this.timerInterval);
                this.handleGameResult(true);
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