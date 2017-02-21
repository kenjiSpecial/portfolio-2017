"use strict";

const THREE = require('three');
import KeyObject from './KeyObject'
import Loader from '../loader/Loader';
import AppModel from '../models/AppModel';

export default class KeyObjectWorks extends KeyObject {
    constructor(params) {
        super(params)

        this.appModel = new AppModel();
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
        this.appModel.addEventListener('appStartChange', this._appStartChange.bind(this));
        this.appModel.addEventListener('stateChange', this._stateChange.bind(this));
    }
    _createMesh(){
        super._createMesh();

        this.mainColor = new THREE.Color(0x666666);
        this.targetColor = new THREE.Color(0xDD4141);
        this.baseColor = new THREE.Color(0x3f3f3f);

        this.curColor = new THREE.Color();
        this.colorRate = 0;
        this.baseRate = 1;
        this._updateColor();
    }
    _addCollisionMesh(){
        if(this.name == 'r'){
            this.collisionBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2 * 5 - 0.4, 2, 2), new THREE.MeshBasicMaterial({
                color: 0xffff00,
                wireframe: true,
                // transparent: true,
                // opacity: 0.01
            }));
            this.add(this.collisionBoxMesh);
            setTimeout(function(){
                this.collisionBoxMesh.updateMatrixWorld();
                this.remove(this.collisionBoxMesh);
            }.bind(this), 0)


            this.collisionBoxMesh.parentObject = this;
        }
    }
    select(){
        super.select();
        TweenMax.to(this, 1, {delay: 0.7, colorRate : 1, onUpdate: this._updateColor, onUpdateScope: this})
        TweenMax.to(this.scale, 1, {delay: 0.7, y: 0.01});
    }
    unselect(){

        let delay = 0.3
        super.unselect(delay);
        TweenMax.to(this, 1., { ease: Quint.easeInOut, colorRate : 0, onUpdate: this._updateColor, onUpdateScope: this})
        this.isOver = false;

        if(this.meshes){
            TweenMax.killTweensOf([this.meshes['sub1'].scale, this.meshes['sub1'].material, this.meshes['sub0'].scale, this.meshes['sub0'].material,]);
            this.meshes['sub0'].visible = true;
            TweenMax.to(this.meshes['sub0'].scale, 1.2, {
                y: 1, onComplete: function(){
                }, onCompleteScope: this, ease: Quint.easeInOut,  delay: delay
            });
            TweenMax.to(this.meshes['sub0'].material, 1.2, {opacity: 1, ease: Quint.easeInOut,  delay: delay});

            TweenMax.to(this.meshes['sub1'].scale, 1.2, {
                y: 0.01, onComplete: function(){
                    this.meshes['sub1'].visible = false;
                }, onCompleteScope: this, ease: Quint.easeInOut,  delay: delay
            });
            TweenMax.to(this.meshes['sub1'].material, 1.2, {opacity: 0.01, ease: Quint.easeInOut,  delay: delay});
        }
    }
    _updateColor(){

        this.curColor.r = this.baseRate * this.baseColor.r +  (1-this.baseRate) * ((1 - this.colorRate) * this.mainColor.r + this.colorRate * this.targetColor.r);
        this.curColor.g = this.baseRate * this.baseColor.g +  (1-this.baseRate) * ((1 - this.colorRate) * this.mainColor.g + this.colorRate * this.targetColor.g);
        this.curColor.b = this.baseRate * this.baseColor.b +  (1-this.baseRate) * ((1 - this.colorRate) * this.mainColor.b + this.colorRate * this.targetColor.b);

        if(this.meshes){
            this.meshes['main'].material.color = this.curColor;
            this.meshes['sub0'].material.color = this.curColor;
            this.meshes['sub1'].material.color = this.curColor;
        }else{
            this.mesh.material.color = this.curColor;
        }
    }
    _transformToHome(){
        if(this.appModel.state == "works"){
            this.unselect();
        }else{
            TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut })
        }
    }
    _appStartChange(){
        TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeOut})
    }
    _stateChange(){
        if(this.appModel.state !== "works"&& this.appModel.state != 'home'){
            TweenMax.to(this, 1, {baseRate : 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }
    }
}