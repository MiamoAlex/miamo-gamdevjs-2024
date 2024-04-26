export class UiRenderer {

    templates = {};
    domElements = {};

    constructor() {
        const templates = document.querySelector('#templates');
        // Récupération des templates
        for (let i = 0; i < templates.children.length; i++) {
            const template = templates.children[i];
            this.templates[template.className.split('template__')[1]] = template;
        }
    }

    /**
     * appendDomElements() ajoute aux elements visuels actuels un groupe de nouveau éléments récupérables
     * @param {Object} domElements Objet contenant les différents classes des elements visuels à récuperer 
     */
    appendDomElements(domElements) {
        for (const key in domElements) {
            if (this.domElements[key]) {
                delete this.domElements[key]
            }
            this.domElements[key] = document.querySelector(domElements[key].element);
        }
    }

    /**
     * getElement() retourne un noeud du DOM à partir de l'id renseigné
     * @param {String} id Identifiant de l'objet 
     * @returns {Node} Noeud demandé
     */
    getElement(id) {
        return this.domElements[id];
    }

    /**
     * renderPartial() change l'écran actuel, effectue une transition et formatte ses données
     * @param {String} partial Html du partial récupéré 
     * @param {String} destination Identifiant de l'html à remplir avec le partial
     * @param {Object} obj Données à afficher sur l'écran
    */
    renderPartial(partial, destination, obj, transition, animation) {
        if (obj) {
            const toFormat = Array.from(partial.matchAll(/{{(.*?)}}/gi));
            for (let i = 0; i < toFormat.length; i++) {
                const tag = toFormat[i][0];
                const key = toFormat[i][1];
                if (obj[key]) {
                    partial = partial.replaceAll(tag, obj[key]);
                } else {
                    partial = partial.replaceAll(tag, '');
                }
            }
        }

        if (destination) {
            if (transition) {
                setTimeout(() => {
                    this.getElement(destination).innerHTML = partial;
                    this.translateArea('body');
                }, animation.time);
            } else {
                this.getElement(destination).innerHTML = partial;
                this.translateArea('body');
            }
        } else {
            return partial;
        }
    }

    /**
     * renderTemplate() formatte une template à partir d'un tableau d'objet et l'envoie dans le dom destination
     * @param {Node} template 
     * @param {Array<Object>} arrayObj 
     * @param {String} destination 
     */
    renderTemplate(template, arrayObj, destination, keep) {
        const toFormat = Array.from(this.templates[template].innerHTML.matchAll(/{{(.*?)}}/gi));
        let formattedTemplates = '';
        for (let i = 0; i < arrayObj.length; i++) {
            const obj = arrayObj[i];
            formattedTemplates += this.templates[template].innerHTML;
            for (let j = 0; j < toFormat.length; j++) {
                const tag = toFormat[j][0];
                const key = toFormat[j][1];
                if (obj && obj[key]) {
                    formattedTemplates = formattedTemplates.replaceAll(tag, obj[key]);
                } else {
                    formattedTemplates = formattedTemplates.replaceAll(tag, '');
                }
            }
        }
        // Retour des données
        if (destination) {
            if (keep) {
                this.getElement(destination).insertAdjacentHTML('beforeend', formattedTemplates);
            } else {
                this.getElement(destination).innerHTML = formattedTemplates;
            }
            this.translateArea(destination);
        } else {
            return formattedTemplates;
        }
    }

    /**
     * createImage() génère une image avec certains paramètres à l'écran
     * @param {String} src - Nom de l'image pour remplir l'url
     * @param {String} [className] - Classe css à attribuer à l'image
     * @param {boolean} [clear=false] - Faut-il nettoyer l'écran (propre)
     * @param {String} [alt] - Texte alternatif à attribuer à l'image
     * @param {String} [id] - Id à attribuer à l'image
     * @returns {HTMLElement} - L'élément image créé
    */
    createImage(src, className, clear = false, alt, id, destination) {
        const playground = destination ?? this.getElement('playground');

        if (clear) {
            playground.querySelectorAll('*').forEach(element => {
                if (!element.closest('.page')) {
                    element.remove();
                }
            });
        }

        const img = document.createElement('img');
        img.src = `./assets/${src}`;
        img.setAttribute('draggable', 'false')

        const attributes = { className, alt, id };
        Object.keys(attributes).forEach(key => attributes[key] !== undefined && (img[key] = attributes[key]));

        playground.appendChild(img);
        return img;
    }

    /**
     * translateArea() traduit toutes les données taggées par i18n grâce au dictionnaire actuellement chargé
     * @param {Node} area Zone du DOM à traduire à partir du dictionnaire actuel
    */
    translateArea(area) {
        const elements = this.getElement(area).querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            switch (element.tagName) {
                case 'INPUT':
                    if (element.type === 'submit') {
                        element.value = this.currentDictionnary[element.dataset.i18n];
                    } else {
                        element.placeholder = this.currentDictionnary[element.dataset.i18n];
                    }
                    break;

                case 'TEXTAREA':
                    element.placeholder = this.currentDictionnary[element.dataset.i18n];
                    break;

                default:
                    element.innerHTML = this.currentDictionnary[element.dataset.i18n];
                    break;
            }

            if (element.dataset.title) {
                element.dataset.title = this.currentDictionnary[element.dataset.i18n];
            }
        });
    }

    /**
     * translateValue() applique une valeur traduite à un élément du DOM selectionné
     * @param {String|Node} id Identifiant de l'élément ou l'élément Node lui-même
     * @param {String} value Valeur à lui attribuer
     */
    translateValue(id, value) {
        let element;
        if (typeof id === 'string') {
            element = this.getElement(id);
        } else {
            element = id;
        }

        if (value !== undefined) {
            element.innerHTML = this.currentDictionnary[value];
        } else {
            return this.currentDictionnary[id];
        }
    }
}