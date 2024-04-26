export class Minigame {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.gamesController = uiManager.currentController;
        clearInterval(this.timerInterval);
        this.renderHearts();
    }


    /**
     * playOst joue la musique de fond du mini-jeu
     * @param {*} ost 
     */
    playSoundtrack(ost) {
        this.uiManager.audioManager.loadAudioFile(`music/minigames/${ost}`, 'music')
    }

    /**
     * Fonction triggered avec la logique générale d'un mini jeu 
     * @param {boolean} gameWon - Booléen indiquant si le jeu a été gagné ou perdu
    */
    handleGameResult(gameWon) {
        if (!gameWon) {
            this.gamesController.lives--;
            this.uiManager.audioManager.loadAudioFile(`sfx/${this.gamesController.currentLevel}/Lost.ogg`, 'sfx');
        } else {
            this.state = false;
            this.uiManager.audioManager.loadAudioFile(`sfx/${this.gamesController.currentLevel}/Win.ogg`, 'sfx');
        }
        clearInterval(this.timerInterval);
        // Mettre à jour l'affichage des vies
        this.renderHearts();

        // Planifier l'ouverture d'un nouveau mini-jeu après un délai
        setTimeout(() => {
            this.gamesController.gameHandler(gameWon ? 'Win' : 'Lose');
        }, 1500);
    }

    renderHearts() {
        let hearts = '';
        for (let i = 0; i < 4; i++) {
            if (this.gamesController.lives > i) {
                hearts += `<img draggable="false" src="assets/sprites/fullHeart_${this.gamesController.currentLevel}.gif" alt="heart" class="minigame__heart">`;
            } else {
                hearts += `<img draggable="false" src="assets/sprites/emptyHeart_${this.gamesController.currentLevel}.gif" alt="heart" class="minigame__heart">`;
            }
        }
        this.uiManager.uiRenderer.getElement('lives').innerHTML = hearts;
    }

    setTimer(time, win) {
        const timerElement = document.querySelector('#timer');
        timerElement.classList.remove('hide');
        let remainingTime = time / 1000;
        const updateTimer = () => {
            if (remainingTime <= 0) {
                timerElement.classList.add('hide');
                if (win) {
                    this.handleGameResult(true)
                } else {
                    this.gameOver();
                }
                clearInterval(timerInterval);
            } else {
                if (timerElement) {
                    timerElement.innerText = remainingTime;
                }
                remainingTime--;
            }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        this.timerInterval = timerInterval;
    }

}