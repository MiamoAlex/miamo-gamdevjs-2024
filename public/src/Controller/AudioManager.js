import { UiRenderer } from "../View/UiRenderer.js";

export class AudioManager {
    static TYPES = {
        AMBIENT: 'ambient',
        MUSIC: 'music',
        VOICELINE: 'voiceline'
    };

    loadedSounds = {};
    startTime = 0;
    volume = 0.35;
    pausedTime = null;
    pausedCallbacks = [];

    uiRenderer = UiRenderer;

    /**
     * @constructor
        * @param {Object} uiRenderer - Le moteur d'interface utilisateur.
     */
    constructor(uiRenderer, volume) {
        this.uiRenderer = uiRenderer;
        this.context = null;
        this.volume = parseFloat(volume);
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        addEventListener('mousedown', (ev) => {
            this.unlockContext()
        }
        );
    }

    /**
     * Débloque le contexte audio.
     */
    unlockContext() {
        if (!this.context) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            // Analyzer
            this.analyzer = this.context.createAnalyser();
            this.analyzer.fftSize = 256;
            this.bufferLength = this.analyzer.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);

            this.gainNode = this.context.createGain();
            this.gainNodeMusic = this.context.createGain();
            this.gainNode.gain.value = parseInt(this.volume) || 0.45;
            this.gainNodeMusic.gain.value = parseInt(this.volume) || 0.20;
            this.gainNode.connect(this.context.destination);
            this.gainNodeMusic.connect(this.context.destination);

            const buffer = this.context.createBuffer(1, 1, 22050);
            const source = this.createSource(buffer);
            source.start(0);
        }
    }

    /**
     * getFrequencyData() retourne les données liées au fréquences de l'audio actuellement joué
     * @returns {Object}
     */
    getFrequencyData() {
        this.analyzer.getByteFrequencyData(this.frequencyData);
        return this.frequencyData;
    }

    /**
     * Crée une nouvelle source audio.
     * @param {AudioBuffer} buffer - Le buffer audio.
     * @returns {AudioBufferSourceNode} - La nouvelle source audio.
     */
    createSource(buffer, type) {
        const source = this.context.createBufferSource();
        if (buffer) {
            source.buffer = buffer
        }
        if (type === AudioManager.TYPES.MUSIC) {
            source.connect(this.gainNodeMusic);
        } else {
            source.connect(this.gainNode);
        }
        return source;
    }

    /**
     * Récupère le buffer audio d'un fichier.
     * @param {string} file - Le nom du fichier audio, avec ou sans extension.
     * @returns {Promise<AudioBuffer>} - Le buffer audio.
     */
    async fetchAudioBuffer(file) {
        let extension = file.split('.').pop();
        extension = (extension === file) ? 'mp3' : extension; // Utilise 'mp3' si aucune extension n'est trouvée
        let filePath = `./assets/audio/${file}`;
        if (extension === 'mp3' && !file.endsWith('.mp3')) {
            filePath += '.mp3'; // Ajouter '.mp3' si le fichier n'a pas d'extension
        }
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        return this.context.decodeAudioData(arrayBuffer);
    }


    /**
     * Charge et joue un fichier audio.
     * @async
     * @param {string} file - Le nom du fichier audio.
     * @param {string} type - Le type de son.
     * @param {Object[]} [callbacks] - Les callbacks basés sur la progression.
     * @param {number} [pitch=1] - Le pitch du son.
     * @param {string} [voiceId] - Identifiant unique pour les voicelines.
     */
    async loadAudioFile(file, type, callbacks, pitch = 1, startTime) {
        if (this.volume <= 0 || !this.gainNode) return;

        let source = this.createSource(null, type);

        if (!this.loadedSounds[file]) {
            this.loadedSounds[file] = await this.fetchAudioBuffer(file);
        }
        source.buffer = this.loadedSounds[file];
        source.playbackRate.value = pitch;
        if (this.reverse) {
            Array.prototype.reverse.call(source.buffer.getChannelData(0));

            // Vérifier si le canal 1 existe avant de l'inverser
            if (source.buffer.numberOfChannels > 1) {
                Array.prototype.reverse.call(source.buffer.getChannelData(1));
            }
        }


        if (type === AudioManager.TYPES.MUSIC && this.currentMusic?.file === file) return;

        this.handleAudioType(source, type, file);
        source.connect(this.analyzer);
        if (!startTime) {
            source.start(0);
        } else {
            source.start(0, startTime);
        }
        this.manageCallbacks(source, callbacks, type);
        return source;
    }

    /**
     * Gère le type de son.
     * @param {AudioBufferSourceNode} source - La source audio.
     * @param {string} type - Le type de son.
     * @param {string} file - Le fichier audio.
     */
    handleAudioType(source, type, file) {
        switch (type) {
            case AudioManager.TYPES.AMBIENT:
            case AudioManager.TYPES.MUSIC:
                if (file !== this.currentMusicFile) {
                    this.stopMusic();
                    this.currentMusicFile = file;
                    source.loop = true
                    this.currentMusic = { source, file };
                    this.musicStartTime = this.context.currentTime;
                }
                break;
            case AudioManager.TYPES.VOICELINE:
                this.stopVoiceline();
                this.voicelineId = file;
                this.currentVoiceline = { source };
                break;
        }
    }



    /**
     * Gère les callbacks pour la progression de la lecture.
     * @param {AudioBufferSourceNode} source - La source audio.
     * @param {Object[]} callbacks - Les callbacks basés sur la progression.
     * @param {string} type - Le type de son.
     * @param {string} [voiceId] - Identifiant unique pour les voicelines.
     */
    manageCallbacks(source, callbacks, type) {
        if (!callbacks) return;
        let interval;
        this.startTime = this.context.currentTime;

        interval = setInterval(() => {
            const progress = Math.floor((source.context.currentTime - this.startTime) / (source.buffer.duration / source.playbackRate.value) * 100);
            callbacks = callbacks.filter(callback => {
                if (progress >= callback.progress) {
                    callback.cb();
                    return false;
                }
                return true;
            });
            if (callbacks.length === 0) clearInterval(interval);
        }, 50);
        source.onended = () => {
            this.startTime = this.context.currentTime;
            if (this.currentMusic) {
                callbacks = callbacks.filter(callback => {
                    callback.cb();
                    return false;
                });
            }
        };

    }

    /**
     * Arrête la musique en cours.
     */
    stopMusic() {
        this.currentMusic?.source?.stop();
        this.currentMusic = null;
    }

    /**
     * Arrête la voiceline en cours.
     */
    stopVoiceline() {
        if (!this.currentVoiceline) return;
        this.currentVoiceline.source.stop();
        clearInterval(this.currentVoiceline.interval);
    }
}
