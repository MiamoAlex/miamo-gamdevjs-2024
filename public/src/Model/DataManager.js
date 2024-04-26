export class DataManager {
    // Tableau d'animations de transition
    animations = [
        { name: "fade", time: 300 },
    ]

    save = null;

    availableLanguages = ['fr', 'en'];
    browserLang = Intl.getCanonicalLocales(navigator.language)[0].split("-")[0];
    selectedLang = this.availableLanguages.includes(this.browserLang) ? this.browserLang : 'en';

    constructor() {
        // this.save = null;
        this.save = JSON.parse(localStorage.getItem('mimosave'));
        if (!this.save || !this.save.playerSprite) {
            this.save = {
                lang: this.selectedLang ?? 'fr',
                currentRoom: 'Entrance',
                playerSprite: 'flabbyIdle',
                progress: [],
                minigames: [],
                objective: 'welcomeGym'
            };
            this.saveData();
        }
    }

    defaultSave() {
        return {
            lang: 'en' ?? 'fr',
            currentRoom: 'Entrance',
            playerSprite: 'flabbyIdle',
            progress: [],
            minigames: [],
            objective: 'welcomeGym'
        };
    }

    /**
    * unlockProgress() dévérouille un avancement sur la sauvegarde du joueur
    * @param {string} unlock identifiant à débloquer
    * @param {string} type type de donnée
    */
    unlockProgress(type, unlock) {
        const typeKeys = type.split('.');
        let currentSave = this.save;
        for (const key of typeKeys) {
            if (!currentSave.hasOwnProperty(key)) {
                currentSave[key] = {};
            }
            currentSave = currentSave[key];
        }
        if (!currentSave.includes(unlock)) {
            currentSave.push(unlock);
        }
    }

    /**
     * map()
     * @param {*} val 
     * @param {*} minA 
     * @param {*} maxA 
     * @param {*} minB 
     * @param {*} maxB 
     * @returns 
     */
    map(val, minA, maxA, minB, maxB) {
        return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
    }

    /**
     * formToObj() converti un objet formulaire en objet JSON
     * @param {FormData} formData Objet formulaire
     * @returns {Object} Objet formatté
     */
    formToObj(formData) {
        var obj = {};
        for (const key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    }

    /**
     * saveData() sauvegarde les données relatives au site
     */
    saveData() {
        // localStorage.setItem('mimosave', JSON.stringify('{}'));
        localStorage.setItem('mimosave', JSON.stringify(this.save));
    }
}