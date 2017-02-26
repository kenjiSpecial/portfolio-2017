"use strict";

const THREE = require('three');
import KeyObject from './KeyObject'
import Loader from '../loader/Loader';
import AppModel from '../models/AppModel';

export default class KeyObjectAbout extends KeyObject {
    constructor(params) {
        super(params)

        this.appModel = new AppModel();
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
        this.appModel.addEventListener('appStartChange', this._appStartChange.bind(this));
        this.appModel.addEventListener('stateChange', this._stateChange.bind(this));
    }
    _createMesh(){
        super._createMesh('#886644', '#cc9966');
    }
    _addCollisionMesh(){
        if(this.name == 'col'){
            this.collisionBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2 * 3 - 0.4, 2, 2), new THREE.MeshBasicMaterial({
                color: 0xffff00,
                wireframe: true,
                transparent: true,
                opacity: 0.01
            }));
            this.add(this.collisionBoxMesh);
            setTimeout(function(){
                this.collisionBoxMesh.updateMatrixWorld();
                this.remove(this.collisionBoxMesh);
            }.bind(this), 0)


            this.collisionBoxMesh.parentObject = this;
        }
    }
    keydown(){

        super.keydown();
    }
    keyup(){
        if(this.collisionBoxMesh && this.isDown){
            window.open('http://webgl-sketch-dojo.kenji-special.info/', '_blank');
        }
        super.keyup();

    }
    select(){
    }
    unselect(){
    }

    _updateColor(){

    }
    _transformToHome(){
        TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeOut})
    }
    _appStartChange(){
        TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeOut})
    }
    _stateChange(){
        if(this.appModel.state == "about" || this.appModel.state == 'works'){
            TweenMax.to(this, 1.2, {baseRate : 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }
    }

}