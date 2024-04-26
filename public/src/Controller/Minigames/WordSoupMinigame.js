import { Minigame } from "./Minigame.js";

export class WordSoupMinigame extends Minigame {
    state = true;
    sequence = '';
    status = 0;

    constructor(uiManager) {
        super(uiManager);
        this.generateSequence();
        this.setTimer(15000);
        this.playSoundtrack('wordsoupBgm');
        this.area = document.querySelector('.wordsoup');
        const keydownListener = (e) => {
            if (this.state) {
                const key = e.key;
                if (((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z') || (key >= '0' && key <= '9') || key === '-' || key === '.')) {
                    const letter = document.querySelector(`.wordsoup__letter[data-key="${key}"]`);
                    if (letter) {
                        letter.classList.add('wordsoup__letter-active');
                        this.uiManager.audioManager.loadAudioFile('sfx/minigames/wordsoup/eat', 'sfx', [], 1 + Math.random() * 0.5);
                        this.status++;
                        if (this.status >= 4) {
                            this.state = false;
                            clearInterval(this.timerInterval);
                            setTimeout(() => {
                                letter.remove();
                                this.uiManager.audioManager.loadAudioFile('sfx/minigames/wordsoup/miam', 'sfx');
                                document.querySelector('.wordsoup').style.backgroundImage = 'url("assets/sprites/minigames/wordsoup/backgroundbienmange.png")'
                                setTimeout(() => {
                                    this.handleGameResult(true);
                                }, 1000);
                                document.body.removeEventListener('keydown', keydownListener);
                            }, 800);
                        }
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
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }

    generateSequence() {
        const excludedLetters = ['d', 'i', 'q', 'z', 'n'];
        const availableLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
            .filter(letter => !excludedLetters.includes(letter));

        this.sequence = Array.from({ length: 4 }, () => availableLetters[Math.floor(Math.random() * availableLetters.length)]).join('').toLocaleLowerCase();

        for (let i = 0; i < this.sequence.length; i++) {
            const char = this.sequence[i];
            document.querySelector('.wordsoup__letters').innerHTML += `<img style="right: ${15 + (i * 9)}%" data-key="${char}" class="wordsoup__letter" src="assets/sprites/minigames/wordsoup/${char}.png">`;
        }
    }

}