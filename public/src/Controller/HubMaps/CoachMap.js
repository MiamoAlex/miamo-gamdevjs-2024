import * as THREE from 'three';
import { HubMap } from './HubMap.js';

export class CoachMap extends HubMap {

    constructor(uiManager, name, settings) {
        super(uiManager, name, settings);
        this.generateMap();
    }

    async generateMap() {
        await super.generateMap();
        const pointLight = new THREE.PointLight(0xFFCDEF, 0.35, 100);
        pointLight.position.set(-0.0006078045861993807, 1.3600467391090956, -0.5442758807918262);
        this.scene.add(pointLight);
        pointLight.castShadow = true;
        pointLight.shadow.bias = -0.001;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
        this.playerController.playerEntity.rotation.set(0, Math.PI, 0);


        if (!this.dataManager.save.progress.includes('coachIntro')) {
            this.dataManager.unlockProgress('progress', 'coachIntro');
            const dialog = {
                trigger: "dialog",
                dialog: "coachIntro",
                meshRef: this.playerController.playerEntity,
                lines: [
                    {
                        "portrait": "sprites/portrait.png",
                        "fr": "*bruit d etonnement* SOLIDE NANA ???",
                        "en": "*shocked* solid gal ?.??,"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "Hahahah !! BRAVO solide nana, je t'avais bien dit que viendraient ici ! Alors cher collegue humain, prêt pour l'épreuve finale ?",
                        "en": "hAHAHAHAH ! WELL DONE solid gal, i told he'd would come here ! So, dear human colleague, ready for the final challenge ?"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "Tu dois avoir tant de questions, auxquelles je vais repondre au travers de 2 minutes de cinémtiques que personne n'a demandé, et apres on se bat et c'est la fin c'est parti!",
                        "en": "You must have so much questions, that i'm planning on answering through 2 minutes of cutscenes that nobody asked for, then we fight and it's the end of the game"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "",
                        "en": "",
                        trigger: "cutscene"
                    }
                ],
            }
            this.uiManager.currentController.handleEntity(dialog);
        } if (this.dataManager.save.progress.includes('coach') && !this.dataManager.save.progress.includes('coachEnding')) {
            this.dataManager.unlockProgress('progress', 'coachEnding');
            await this.uiManager.theaterRenderer.loadVideos([{ name: 'flabbyAlien' }]);
            const dialog = {
                trigger: "dialog",
                dialog: "coachEnding",
                meshRef: this.playerController.playerEntity,
                lines: [
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "Hahahaha tu t'es bien battu monsieur mou mais tu ne pourras arreter notre plan !! Avec solide nana à mes cotés, nous envahirons quand meme le monde !",
                        "en": "you fought well mister flabby but you aint stopping our plan... with solid gal by my side, we will still invade the world !"
                    },
                    {
                        npc: this.playerController.playerEntity,
                        "portrait": "sprites/portrait.png",
                        "fr": "ha mais vous êtes des alien en fait moi aussi",
                        "en": "oh... you mean you guys are aliens???? im one too"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "gleep gleep gleep ?",
                        "en": "gleep gleep gleep ?"
                    },
                    {
                        npc: this.playerController.playerEntity,
                        "portrait": "sprites/portrait.png",
                        "fr": "⟒⊑ ⍜⎍⟟ ⏚⍜⋏ ⏃⌰⌰⟒⋉ ⎐⟟⟒⋏⌇ ⍜⋏ ⎅⟒⏁⍀⎍⟟⏁ ⌰⏃ ⏁⟒⍀⍀⟒",
                        "en": "⟒⊑ ⍜⎍⟟ ⏚⍜⋏ ⏃⌰⌰⟒⋉ ⎐⟟⟒⋏⌇ ⍜⋏ ⎅⟒⏁⍀⎍⟟⏁ ⌰⏃ ⏁⟒⍀⍀⟒",
                        trigger: "skin"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "Parfait on ça alors !",
                        "en": "Alright then let's do this !"
                    },
                    {
                        npc: this.scene.getObjectByName("coach"),
                        "portrait": "sprites/portrait.png",
                        "fr": "",
                        "en": "",
                        "trigger": "ending",
                    }
                ],
            }
            this.uiManager.currentController.handleEntity(dialog);
        }
    }

    cutsceneEvent() {
        this.uiManager.updateView('cutscenes', 'main', 'coach', true);
    }

    endingEvent() {
        this.uiManager.updateView('credits', 'main', null, true);
    }

    skinEvent() {
        this.uiManager.currentController.playerController.playerMesh.material = this.uiManager.theaterRenderer.materials.flabbyAlien
    }
}