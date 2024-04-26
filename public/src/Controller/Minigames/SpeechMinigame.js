import { Minigame } from "./Minigame.js";

export class SpeechMinigame extends Minigame {

    state = true;
    sequence = [];
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.setTimer(15000);
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/speech/silence', 'music');
        this.bubble = document.querySelector('.speech__bubble');
        const keydownListener = (e) => {
            if (this.state) {
                const key = e.key.toLowerCase();
                if ((key >= 'a' && key <= 'z') || (key >= '0' && key <= '9') || key === '-' || key === '.') {
                    this.bubble.textContent += key;
                    this.uiManager.audioManager.loadAudioFile('sfx/minigames/speech/talk', 'sfx', [], 1 + Math.random() * 0.25);
                    if (this.bubble.textContent.length > 70) {
                        this.state = false;
                        clearInterval(this.timerInterval);
                        this.handleGameResult(true);
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/speech/applause', 'sfx', [], 1);
                        document.body.removeEventListener('keydown', keydownListener);
                    }
                }
            }
        };
        document.body.addEventListener('keydown', keydownListener);
    }

    gameOver() {
        this.state = false;
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}