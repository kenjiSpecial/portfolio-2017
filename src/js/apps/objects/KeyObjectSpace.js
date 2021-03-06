"use strict";

const THREE = require('three');
import KeyObject from './KeyObject'
import Loader from '../loader/Loader';
import AppModel from '../models/AppModel';

export default class KeyObjectMore extends KeyObject {
    constructor(params) {
        super(params)

        this.name = " ";
        this.appModel = new AppModel();
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
        this.appModel.addEventListener('appStartChange', this._appStartChange.bind(this));
        this.appModel.addEventListener('stateChange', this._stateChange.bind(this));
    }
    _createMesh(){
        super._createMesh();

        this.mainColor = new THREE.Color(0x666666);
        // this.mainColor = new THREE.Color(0x444444);
        this.targetColor = new THREE.Color(0xDD4141);
        this.baseColor = new THREE.Color(0x3f3f3f);
        this.curColor = new THREE.Color();
        this.baseRate = 1;
        this._updateColor();
    }
    _addCollisionMesh(){
            this.collisionBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(12, 2, 2), new THREE.MeshBasicMaterial({
                color: 0xffff00,
                wireframe: true,

            }));
            // this.collisionBoxMesh.position.x = -1.1;
            this.add(this.collisionBoxMesh);
            setTimeout(function(){
                this.collisionBoxMesh.updateMatrixWorld();
                this.remove(this.collisionBoxMesh);
            }.bind(this), 0)


            this.collisionBoxMesh.parentObject = this;

    }
    keydown(){
        TweenMax.killTweensOf([this.appModel.spaceRate]);
        TweenMax.to(this.appModel, 0.6, {spaceRate: 0.12});
        super.keydown();
    }
    keyup(){
        TweenMax.killTweensOf([this.appModel.spaceRate]);
        TweenMax.to(this.appModel, 0.6, {spaceRate: 0, ease: Quint.easeOut});
        super.keyup();
    }
    select(){
    }
    unselect(){
    }

    _updateColor(){

        this.curColor.r = this.baseRate * this.baseColor.r +  (1-this.baseRate) *  this.mainColor.r;
        this.curColor.g = this.baseRate * this.baseColor.g +  (1-this.baseRate) *  this.mainColor.g;
        this.curColor.b = this.baseRate * this.baseColor.b +  (1-this.baseRate) *  this.mainColor.b;

        if(this.meshes){
            this.meshes['main'].material.color = this.curColor;
            this.meshes['sub0'].material.color = this.curColor;
            this.meshes['sub1'].material.color = this.curColor;
        }else{
            this.mesh.material.color = this.curColor;
        }
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