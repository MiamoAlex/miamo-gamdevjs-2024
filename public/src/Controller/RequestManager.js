export class RequestManager {

    /**
     * getPartial() récupère un partial HTML et le retourne
     * @param {String} partialName 
     * @returns 
     */
    async getPartial(partialName) {
        const req = await fetch(`./views/${partialName}.html`);
        return await req.text();
    }

    /**
     * getDictionnary() lance une requête retournant un dictionnaire de données lié à une langue
     * @param {string} lang Langue du dictionnaire à requêter 
     * @returns {object} Dictionnare de langue
     */
    async getDictionnary(lang = 'fr') {
        const req = await fetch(`./assets/dictionnaries/${lang}.json`);
        return await req.json();
    }

    /**
     * getDynamicData() retourne le nombre de visiteurs du site notamment
     * @returns {Object}
     */
    async getDynamicData(route) {
        const req = await fetch(`${route}`);
        return await req.json();
    }
}