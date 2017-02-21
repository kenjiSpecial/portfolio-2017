"use strict";

const THREE = require('three');
import Loader from '../loader/Loader';
import KeyObject from './KeyObject'
import AppModel from '../models/AppModel';

export default class KeyObjectBack extends KeyObject {
    constructor(params) {
        super(params);

        if(this.name == 'ButtonNext') this.name = 'ArrowRight';
        else                          this.name = 'ArrowLeft';

        this.appModel = new AppModel();
        this.appModel.addEventListener('stateChange', this._onStateChange.bind(this));
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
    }
    _createMesh(){
        let mat = new THREE.MeshStandardMaterial({
            color : 0x3F3F3F,
            roughness : 0,
            metalness : 0,
            transparent : true
            // wireframe : true
        });


        this.meshes = {};
        let main = `${this.name}/main`;
        this.meshes['main'] = new THREE.Mesh(this.loader.geometries[main], mat);
        this.add(this.meshes['main'])

        let sub0 = `${this.name}/sub0`;
        this.meshes['sub0'] = new THREE.Mesh(this.loader.geometries[sub0], mat.clone());
        this.add(this.meshes['sub0'])


        this.mainColor = new THREE.Color(0x3f3f3f);
        this.targetColor = new THREE.Color(0x196284);
        this.curColor = new THREE.Color();
        this.colorRate = 0;

        this._updateColor();
    }

    rollover(){
        if(this.isOver) return;
        this.isOver = true;

    }
    keydown(){

        if(this.isActive ){
            this.dispatchEvent({type: 'update'});
        }

        if(this.isDown) return;

        this.isDown = true;

        TweenMax.killTweensOf([this.scale]);
        TweenMax.to(this.scale, 0.3, {y: 0.6, ease: Quint.easeOut});
    }
    keyup(){
        if(!this.isDown) return;

        this.isDown = false;
        TweenMax.killTweensOf([this.scale]);
        TweenMax.to(this.scale, 0.3, {y: 1, ease: Quint.easeOut});
    }
    select(){
        if(this.isSelected) return;

        this.isSelected = true;
        TweenMax.to(this.scale, 0.3, {y: 0.1, ease: Quint.easeOut});
    }
    unselect(){
        if(!this.isSelected) return;

        this.isSelected = false;
        TweenMax.to(this.scale, 0.3, {y: 1, ease: Quint.easeOut});
    }

    rollout(){
        if(!this.isOver) return;

        this.isOver = false;
    }
    active(){
        if(this.isActive) return;

        TweenMax.killTweensOf([this.meshes['sub0'].scale, this.meshes['sub0'].material, this]);

        TweenMax.to(this.meshes['sub0'].scale, 0.6, {y: 0, onComplete : function(){
            this.meshes['sub0'].visible = false;
        }, onCompleteScope: this, ease: Quint.easeOut });
        TweenMax.to(this.meshes['sub0'].material, 0.6, {opacity: 0, ease: Quint.easeOut});
        TweenMax.to(this, 1, { colorRate : 1, onUpdate: this._updateColor, onUpdateScope: this, onComplete: function(){
        }, onCompleteScope : this})

        this.isActive = true;
    }
    inactive(){
        if(!this.isActive) return;

        TweenMax.killTweensOf([this.meshes['sub0'].scale, this.meshes['sub0'].material, this]);

        this.isActive = false;
        TweenMax.killTweensOf([this.meshes['sub0'].scale, this.meshes['sub0'].material]);

        this.meshes['sub0'].visible = true;
        TweenMax.to(this.meshes['sub0'].scale, 0.6, {
            y: 1, onComplete: function(){
            }, onCompleteScope: this, ease: Quint.easeOut
        });
        TweenMax.to(this.meshes['sub0'].material, 0.6, {opacity: 1, ease: Quint.easeOut});
        TweenMax.to(this, 1, { colorRate : 0, onUpdate: this._updateColor, onUpdateScope: this, onComplete: function(){

        }, onCompleteScope: this})
    }
    _onStateChange(){
        if(this.appModel.state == "home"){
            this.inactive();
        }else{
            let delay;
            delay = 1;
            TweenMax.delayedCall( delay, this.active.bind(this));
        }

    }
    _updateColor(){

        this.curColor.r = (1 - this.colorRate) * this.mainColor.r + this.colorRate * this.targetColor.r;
        this.curColor.g = (1 - this.colorRate) * this.mainColor.g + this.colorRate * this.targetColor.g;
        this.curColor.b = (1 - this.colorRate) * this.mainColor.b + this.colorRate * this.targetColor.b;

        this.meshes['main'].material.color = this.curColor;
        this.meshes['sub0'].material.color = this.curColor;
    }
    _transformToHome(){
        this.inactive();
    }
}