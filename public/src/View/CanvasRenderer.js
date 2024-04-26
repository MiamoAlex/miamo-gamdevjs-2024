export class CanvasRenderer {

    // Référence à l'élément de canvas
    canvas;
    ctx;

    // Particules de l'application 🤩
    particles = [];

    pointer = {
        x: 0,
        y: 0
    };

    trail = true;

    visuals = {
    };

    constructor() {
        this.canvas = document.querySelector('.canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Redimentionnement de l'écran
        addEventListener('resize', () => {
            this.resize();
        });

        // Déplacement du curseur
        addEventListener('mousemove', (ev) => {
            this.pointer.x = ev.clientX;
            this.pointer.y = ev.clientY;
        });

        // Chargement des particules
        for (const key in this.visuals) {
            const url = this.visuals[key];
            const img = new Image();
            img.src = `/assets/sprites/particles/${url}`;
            this.visuals[key] = img;
        }

        let lastTime = 0;
        const fpsInterval = 1000 / 60;

        const animate = () => {
            requestAnimationFrame(animate);

            const now = Date.now();
            const elapsed = now - lastTime;

            if (elapsed > fpsInterval) {
                lastTime = now - (elapsed % fpsInterval);

                this.updateParticles();
                this.drawParticles();
            }
        };
        animate();
    }

    resize() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.x = Math.random() * innerWidth;
        }
    }

    /**
    * addParticle() ajoute une particule magique à l'écran
    * @param {String} name Nom de la particule à ajouter
    */
    addParticle(name, parameters) {
        let particle = {
            name,
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            size: (Math.random() * 0.7) + 0.1,
            vx: Math.random() * 2 + 0.11,
            vy: Math.random() * 2 + 0.11,
            parameters
        }
        particle = { ...particle, ...parameters };
        this.particles.push(particle);
    }

    /**
     * updateParticles()
     */
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Boundary checks with offset
            if (particle.x > innerWidth + particle.size) {
                particle.x = -particle.size * 2;
            } else if (particle.x < -particle.size * 2) {
                particle.x = innerWidth + particle.size;
            }

            if (particle.y > innerHeight + particle.size) {
                particle.y = -particle.size * 2;
            } else if (particle.y < -particle.size * 2) {
                particle.y = innerHeight + particle.size;
            }

            if (particle.shrink) {
                particle.size -= particle.shrink;
            }

            // Check for size and remove if necessary
            if (particle.size < 0) {
                this.particles.splice(i, 1);
            }
        }
    }



    /**
     * drawParticles() fait le rendu des particules
     */
    drawParticles() {
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        // Particles 
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            this.ctx.drawImage(this.visuals[particle.name], particle.x, particle.y, 32 * particle.size, 32 * (particle.sizeY ?? particle.size));
        }
    }
}