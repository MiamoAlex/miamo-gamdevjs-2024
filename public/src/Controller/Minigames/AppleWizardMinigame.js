import { Minigame } from "./Minigame.js";

export class AppleWizardMinigame extends Minigame {

    state = true;
    sequence = 'APPLINGTON';
    sequences = ['APPLINGTON', 'APPLE', '4PPL3', 'A.P.P.L.E', 'APPLE-APPLE']
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.sequence = this.sequences[Math.floor(Math.random() * this.sequences.length)];
        document.querySelector('.applewizard__sequence').textContent = this.sequence;
        this.setTimer(10000);
        this.playSoundtrack('poisonSoda');
        this.apple = document.querySelector('.applewizard__apple');
        this.input = document.querySelector('.applewizard__input');
        const keydownListener = (e) => {
            if (this.state) {
                const key = e.key;
                const isAlphaNumeric = (key.length === 1 && /[a-zA-Z0-9]/.test(key)) || key === '-' || key === '.';
                if (isAlphaNumeric && this.input.textContent.length < 15 && key !== 'Backspace') {
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/applewizard/touche', 'sfx', [], 1 + Math.random() * 0.3);
                    this.input.textContent += e.key;
                    if (this.input.textContent.toLowerCase() === this.sequence.toLowerCase()) {
                        this.state = false;
                        clearInterval(this.timerInterval);
                        this.handleGameResult(true);
                        document.body.removeEventListener('keydown', keydownListener);
                    }
                } else if (e.key === "Backspace") {
                    this.input.textContent = this.input.textContent.slice(0, -1);
                }
            }
            
        };

        document.body.addEventListener('keydown', keydownListener);
    }

    gameOver() {
        this.state = false;
        document.querySelector('.applewizard__gameover').classList.remove('hide');
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}