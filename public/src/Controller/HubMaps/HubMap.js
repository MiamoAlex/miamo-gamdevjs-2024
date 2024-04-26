import * as THREE from 'three';

export class HubMap {

    // Dialogues de la map du HUB
    dialogs = {};

    // Materiaux de la map du hub
    materials = {};

    // Reference de la scene du theaterRenderer
    scene;

    constructor(uiManager, name, settings) {
        this.uiManager = uiManager;
        this.name = name;
        this.dataManager = uiManager.dataManager;
        this.mapData = settings;
        this.scene = uiManager.theaterRenderer.environmentScene;
        this.playerController = uiManager.currentController.playerController;
    }

    /**
     * generateMap() prepares everything to be rendered on the map
     */
    async generateMap() {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        const { x, y, z } = this.mapData.cameraPos || { x: 0, y: 0, z: 0 };
        const mapData = this.mapData;

        const cameraPos = new THREE.Vector3(x, y, z);
        this.camera.position.copy(cameraPos);

        // Rotation de la caméra
        if (mapData.cameraRot) {
            const { x, y, z } = mapData.cameraRot;
            this.camera.rotation.x += x;
            this.camera.rotation.y += y;
            this.camera.rotation.z += z;
        }
        this.uiManager.theaterRenderer.renderScene.camera = this.camera;
        this.playerController.setPosition(mapData.playerSpawn ?? { x: 0, y: 0.65, z: 0 });

        // Chargement des textures
        if (mapData.materials) {
            for (const key in mapData.materials) {
                const currentMat = mapData.materials[key];
                this.materials[key] = await this.uiManager.theaterRenderer.createMaterial(currentMat.map, currentMat.type ?? THREE.MeshStandardMaterial, currentMat.wrap ?? { x: 8, y: 8 }, currentMat.transparent);
            }
        }

        this.ambient = new THREE.AmbientLight(0xFFCDEF, 0.1);
        this.scene.add(this.ambient);

        // Chargement des modèles
        if (mapData.models) {
            await this.uiManager.theaterRenderer.loadModels(mapData.models);
            this.geometries = this.uiManager.theaterRenderer.geometries;
        }

        // Gestion du background custom
        if (mapData.background) {
            this.uiManager.uiRenderer.getElement('game').style.backgroundImage = `url(assets/sprites/textures/${mapData.background})`;
        } else {
            this.uiManager.uiRenderer.getElement('game').style.backgroundImage = 'url(assets/sprites/textures/sky.jpg)';
        }

        // Video textures
        if (mapData.videos) {
            await this.uiManager.theaterRenderer.loadVideos(mapData.videos);
        }

        // OST
        if (mapData.ost) {
            this.uiManager.audioManager.loadAudioFile(mapData.ost, 'music');
        } else {
            this.uiManager.audioManager.loadAudioFile('music/gleepGym', 'music');
        }


        // Génération des entités
        this.generateEntities();
    }

    /**
     * generateEntities() s'occupe de la création des objets 3D de la map, ainsi que de leurs types selon leur layout 
    */
    generateEntities() {
        const layouts = this.mapData.entities;
        for (const type in layouts) {
            const layout = layouts[type];
            switch (type) {
                case 'lights':
                    this.handleLights(layout);
                    break;
                default:
                    this.handleDefaultEntities(layout, type);
                    break;
            }
        }
    }

    // Gestion des entités par défaut
    async handleDefaultEntities(layout, type) {
        const { geometries, materials } = this;
        for (let i = 0; i < layout.length; i++) {
            const entity = layout[i];
            const material = materials[entity.material] ? materials[entity.material] : this.uiManager.theaterRenderer.materials[entity.model];
            const entityMesh = this.createEntityMesh(entity, material, type);
            if (!entity.disableShadow) {
                entityMesh.castShadow = true;
                entityMesh.receiveShadow = true;
            }
            if (entity.ignoresRaycast) entityMesh.raycast = function () { };
            if (type === 'entities') entityMesh.renderOrder = 2;
            this.scene.add(entityMesh);
        }
    };

    // Gestion des entités
    createEntityMesh(entity, material, type) {
        const { geometries, materials } = this;
        const entityMesh = new THREE.Mesh(geometries[entity.model].clone(), material);
        if (!entity.id) {
            entity.id = Math.floor(Math.random() * 10000000).toString();
        }
        entityMesh.traverse(function (child) {
            if (child.isMesh && !entity.disableShadow) {
                child.castShadow = true;
                child.receiveShadow = true;
            } else if (entity.disableShadow) {
                child.castShadow = false;
                child.receiveShadow = true;
            }
        });
        entityMesh.name = entity.id;
        entityMesh.userData.id = entity.id;
        entityMesh.userData.type = type;
        if (entity.meshOrder) {
            entityMesh.renderOrder = entity.meshOrder ?? 1;
        }
        if (!entity.position) {
            entity.position = { x: 0, y: 0, z: 0 }
        }
        entityMesh.position.set(entity.position.x, entity.position.y, entity.position.z);

        entity.meshRef = entityMesh;
        if (entity.rotation) {
            entityMesh.rotation.set(entity.rotation.x * Math.PI / 180, entity.rotation.y * Math.PI / 180, entity.rotation.z * Math.PI / 180);
        }
        if (entity.scale) {
            entityMesh.scale.set(entity.scale.x, entity.scale.y, entity.scale.z);
        }
        return entityMesh;
    };

    findEntityById(id, type) {
        const entity = this.mapData.entities[type].find(entity => entity.id === id);
        if (entity) {
            return entity
        } else {
            return;
        }
    }

    updateLogic() {
        if (this.uiManager.currentController?.currentDialog) {
            const npc = this.npc;
            const distance = 1.5;
            const offset = new THREE.Vector3(0, 0, distance);
            offset.applyQuaternion(npc.quaternion);
            const newPosition = npc.position.clone().add(offset);
            this.camera.position.lerp(newPosition, 0.02);
            const quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(new THREE.Euler(npc.rotation.x, npc.rotation.y, npc.rotation.z));
            this.camera.quaternion.slerp(quaternion, 0.025);
        } else {
            this.camera.position.lerp(this.mapData.cameraPos, 0.015);
            const quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(new THREE.Euler(this.mapData.cameraRot.x, this.mapData.cameraRot.y, this.mapData.cameraRot.z));
            this.camera.quaternion.slerp(quaternion, 0.02);
        }
    }

}