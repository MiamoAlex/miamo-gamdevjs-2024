import { Minigame } from "./Minigame.js";

export class BasketMinigame extends Minigame {

    state = true;
    clicks = 0;
    clickBool = false;

    constructor(uiManager) {
        super(uiManager);
        this.basket = document.querySelector('.basket');
        this.person = document.querySelector('.basket__person');
        this.ball = document.querySelector('.basket__ball');
        this.basket.addEventListener('click', (ev) => { this.basketHandler(ev) });
        this.setTimer(13000);
        this.playSoundtrack('basketBgm');
    }

    basketHandler(ev) {
        if (this.state && ev.target.classList[0] === 'basket__ball' && this.clicks < 4) {
            this.clicks++;
            this.ball.src = `assets/sprites/minigames/basket/ball${this.clicks}.gif`;
            this.person.src = `assets/sprites/minigames/basket/character${this.clicks}.png`;
            this.uiManager.audioManager.loadAudioFile(`sfx/minigames/basket/clic${this.clicks}`, 'sfx');
            if (this.clicks === 3) {
                this.state = false;
                this.basket.style.backgroundImage = 'url(assets/sprites/minigames/basket/bgWin.jpg)';
                this.person.style.opacity = 0;
                this.ball.style.opacity = 0;
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    this.handleGameResult(true);
                }, 3500);
            }
        }
    }

    gameOver() {
        this.state = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/basket/fail', 'sfx');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 400);
    }
}