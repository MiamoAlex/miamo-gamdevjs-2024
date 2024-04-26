import { Minigame } from "./Minigame.js";

export class SwarmMinigame extends Minigame {

    state = true;
    elements = [];
    flies = 0;

    constructor(uiManager) {
        super(uiManager);
        this.playSoundtrack('swarm');
        this.area = document.querySelector('.swarm');
        this.setTimer(14000)
        this.pen = document.querySelector('.swarm__eprouvette')
        this.area.addEventListener('mousemove', (ev) => {
            const transformMatrix = window.getComputedStyle(document.querySelector('.minigame')).transform;

            const matrixValues = transformMatrix.substring(7, transformMatrix.length - 1).split(', ');
            const scaleX = parseFloat(matrixValues[0]);
            const scaleY = parseFloat(matrixValues[3]);

            const rect = this.area.getBoundingClientRect();

            const adjustedX = (ev.clientX - rect.left) / scaleX;
            const adjustedY = (ev.clientY - rect.top) / scaleY;

            this.pen.style.top = `${adjustedY - 50}px`;
            this.pen.style.left = `${adjustedX - 60}px`;

            this.mouse = { x: adjustedX, y: adjustedY };
        });
        this.interval = setInterval(() => {
            if (this.state) {
                this.generateFly();
            }
        }, 400 + Math.random() * 1500);
    }

    areaHandler(ev) {
        if (this.state) {
            if (ev.target.classList[0] === 'swarm__fly') {
                this.flies++;
                ev.target.remove();
                if (this.flies > 16) {
                    this.state = false;
                    clearInterval(this.interval);
                    setTimeout(() => {
                        this.handleGameResult(true);
                    }, 1000);
                }
            }
        }
    }

    generateFly() {
        const img = document.createElement('img');
        img.style.top = `${Math.random() * 85}%`;
        img.draggable = false;
        this.uiManager.audioManager.loadAudioFile('sfx/minigames/swarm/insect.ogg', 'sfx', null, 1 + Math.random() * 0.4);
        img.classList.add('swarm__fly');
        img.src = `assets/sprites/minigames/swarm/bug${Math.floor(Math.random() * 4) + 1}.gif`;
        img.style.animationDuration = `${Math.random() * 3 + 1}s`;
        this.area.appendChild(img);
        img.addEventListener('mouseover', (ev) => {
            if (this.state) {
                ev.target.remove();
                this.flies++;
                if (this.flies > 10) {
                    this.state = false;
                    clearInterval(this.timerInterval);
                    this.handleGameResult(true);
                }
            }
        })
    }

    gameOver() {
        this.state = false;
        clearInterval(this.interval)
        setTimeout(() => {
            this.handleGameResult(false);
        }, 1000);
    }
}