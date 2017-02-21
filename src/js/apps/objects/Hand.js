/**
 * Created by ksait on 2/19/2017.
 */

const THREE = require('three');

export default class Hand extends THREE.Object3D {
    constructor(params) {
        super()

        this.camera = params.camera;
        this.geometry = params.geometry;
        this.controller = params.controller;
        this.model = params.model;

        this._isRollover = false;
        this.isPrevRollover = false;
        this.visible = false;
        this.isActive  = false;

        this._createHand();
        this.model.addEventListener('stateChange', this._onStateChange.bind(this));
    }
    _createHand(){

        let mat = new THREE.MeshStandardMaterial({
            color : 0xccccbb,
            // color : 0xff,
            roughness : 0,
            metalness : 0,
            transparent : true,
            shading : THREE.FlatShading
            // wireframe : true
        });
        mat.skinning = true;

        this.mesh = new THREE.SkinnedMesh(this.geometry, mat);
        this.mesh.rotation.y = Math.PI;
        this.mesh.position.z = 2;
        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.add(this.mesh);

        this.animations = [];

        this.geometry.animations.forEach((_anim)=>{
            let animationName = _anim.name;
            this.animations[animationName] = this.mixer.clipAction(_anim).setLoop(THREE.LoopOnce);
            this.animations[animationName].clampWhenFinished = true;
        });

        window.geometry = this.geometry;
        this.fingerNames = [ "Bone.003" ];

        this.collideBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5 , 1.5), new THREE.MeshBasicMaterial({color : 0xffff00, transparent : true, opacity: 0.01}));

        this.root = this;
        this.matrix = this.matrixWorld;

        this.bones = this.getBoneList( this.mesh );

        this.collidableMeshList = [];

    }
    animateIn(){
        this.visible = true;
        TweenMax.fromTo(this.mesh.material, 1, {opacity : 0.01}, {opacity : 1, onUpdate : function(){
            if(this.mouse && this.camera) this.mouseMove(this.mouse, this.camera);
        }, onUpdateScope : this, ease : Quint.easeOut, onComplete : function(){
            this.isActive = true;
        }, onCompleteScope: this});
    }
    getBoneList(object){

        var boneList = [];

        if ( object && object.isBone ) {
            this.fingerNames.forEach((fingerName)=>{
                if(object.name == fingerName){
                    boneList.push( object );
                }

            })

        }

        for ( var i = 0; i < object.children.length; i ++ ) {

            boneList.push.apply( boneList, this.getBoneList( object.children[ i ] ) );

        }

        return boneList;

    }
    update(dt = 1/60){
        this.mixer.update(dt);

        let vector = new THREE.Vector3();

        let boneMatrix = new THREE.Matrix4();
        let matrixWorldInv = new THREE.Matrix4();

        matrixWorldInv.getInverse( this.root.matrixWorld );

        for ( let i = 0, j = 0; i < this.bones.length; i ++ ) {
            let bone = this.bones[ i ];

            if ( bone.parent && bone.parent.isBone ) {

                boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
                vector.setFromMatrixPosition( boneMatrix );
                this.collideBoxMesh.position.copy(vector);
            }
        }

        this._updateCollide();

    }
    _updateCollide(){


        let isRollover = false;
        let collidedObject;
        this.collideBoxMesh.updateMatrixWorld();
        if(this.collidableMeshList.length > 0){
            let originPoint = this.collideBoxMesh.position.clone();

            for(let vertexIndex = 0; vertexIndex < this.collideBoxMesh.geometry.vertices.length ; vertexIndex++){

                let localVertex = this.collideBoxMesh.geometry.vertices[vertexIndex].clone();
                let globalVertex = localVertex.applyMatrix4( this.collideBoxMesh.matrix );
                let directionVector = globalVertex.sub( this.collideBoxMesh.position );

                let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize());
                let collisionResults = ray.intersectObjects(this.collidableMeshList);

                if ( collisionResults.length > 0 && collisionResults[0].distance - directionVector.length() < 0 ) {

                    collidedObject = collisionResults[0]
                    isRollover = true;
                    break;
                }

            }
        }

        if(this.isActive) this._updateRollOver(isRollover, collidedObject);


    }
    _updateRollOver(isRollover, collideObject){

        this.isRollover = isRollover;
        this.prevCollidedObject = this.collidedObject;

        if(collideObject){
            this.collidedObject = collideObject.object;
        }else{
            this.collidedObject = null;
        }

        if(this.isNotRolloutable) return;

        if(this.collidedObject  && this.collidedObject != this.prevCollidedObject){
            this.controller.doRollover({key : this.collidedObject.parentObject.name});
        }

        if(this.prevCollidedObject && this.collidedObject != this.prevCollidedObject){
            this.controller.doMouseUp({key: this.prevCollidedObject.parentObject.name})
            this.controller.doRollout({key : this.prevCollidedObject.parentObject.name});
        }
    }
    addKeyboard(keyboard){
        keyboard.children.forEach((child)=>{this.addCollidableMesList(child)});
    }
    addCollidableMesList(mesh){
        if(mesh.collisionBoxMesh) this.collidableMeshList.push(mesh.collisionBoxMesh);
    }
    mouseMove(mouse, camera){
        this.camera = camera;
        this.mouse = mouse;
        let vector = new THREE.Vector3(
                mouse.x,
                mouse.y,
                0.5
        );

        vector.unproject( this.camera );

        let dir = vector.sub( this.camera.position ).normalize();

        let distance = - this.camera.position.z / dir.z;

        let pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
        this.mesh.position.copy(pos);
        this.mesh.position.z = 1.5;
    }
    rollOver(){
        let action = this.animations['Grab'];
        action.paused = false;
        action.timeScale = 3;
        action.play();
    }
    rollOut(){
        if(this.isNotRolloutable) return;

        let action = this.animations['Grab'];
        let from = this.animations['Touch'];

        action.paused = false;
        action.timeScale = -3;
        action.play();

        this.isLeftDown = false;

        TweenMax.to(action, 0.3, {weight: 1});
        TweenMax.to(from, 0.3, {weight: 0});
    }
    mouseDown(){
        if(this.isMouseDown && this.isRollover) return;
        this.isMouseDown = true;

        let from = this.animations['Grab'];
        let to = this.animations['Touch'];
        to.paused = false;
        to.timeScale = 3;
        to.play();

        TweenMax.to(to, 0.3, {weight: 1});
        TweenMax.to(from, 0.3, {weight: 0});

        if(this.isNotRolloutableTimer) clearTimeout(this.isNotRolloutableTimer);
        this.isNotRolloutable = true;
        this.isNotRolloutableTimer = setTimeout(()=>{this.isNotRolloutable = false;},500)

        if(this.collidedObject && this.collidedObject.parentObject && this.collidedObject.parentObject.name){
            this.controller.doMouseDown({key: this.collidedObject.parentObject.name})
            this.mouseDownObject = this.collidedObject;
        }
    }
    mouseUp(){
        if(!this.isMouseDown) return;
        this.isMouseDown = false;

        let from = this.animations['Touch'];
        from.paused = false;
        from.timeScale = -3;
        from.play();

        if(this.mouseDownObject){
            this.controller.doMouseUp({key: this.mouseDownObject.parentObject.name})
        }
    }
    _onStateChange(){
        if(this.model.state == "home"){
            this.prevCollidedObject = this.collidedObject;
            this.collidedObject = null;
        }
    }
    get isRollover(){
        return this._isRollover;
    }
    set isRollover(value){
        this.isPrevRollover = this._isRollover;
        this._isRollover = value

        if(this._isRollover && !this.isPrevRollover){
            this.rollOver();
        }else if(!this._isRollover && this.isPrevRollover){
            this.rollOut();
        }

    }
}
