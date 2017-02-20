"use strict";

const THREE = require('three');
import KeyObject from './KeyObject'
import Loader from '../loader/Loader';
import AppModel from '../models/AppModel';
import {works} from '../utils/config';

export default class KeyObjectNumber extends KeyObject {
    constructor(params) {
        super(params)

        if(parseInt(this.name) < works.length + 1){
            this.isWork = true;
        }else{
            this.isWork = false;
        }

        this.appModel = new AppModel();
        this.appModel.addEventListener('appStartChange', this._appStartChange.bind(this));
        if(this.isWork){
            this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
            this.appModel.addEventListener('stateChange', this._stateChange.bind(this));
            this.appModel.addEventListener('workChange', this._workChange.bind(this));
            this.appModel.addEventListener('workChange', this._workChange.bind(this) );
        }
    }
    _createMesh(){
        super._createMesh();

        this.mainColor = new THREE.Color(0x3f3f3f);
        this.targetColor = new THREE.Color(0x196284);
        this.targetColorActive = new THREE.Color(0xDD4141);
        this.baseColor = new THREE.Color(0x3f3f3f);

        this.curColor = new THREE.Color();
        this.colorRate = 0;
        this.baseRate1 = 0;
        this.baseRate = 1;
        this._updateColor();
    }
    select(){
        super.select();
        TweenMax.to(this, 0.6, { colorRate : 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeOut })
        TweenMax.to(this.scale, 0.6, {y: 0.01, ease: Quint.easeOut});
    }
    unselect(){
        if(!this.isSelected) return;

        TweenMax.to(this, 0.6, { colorRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeOut})
        TweenMax.to(this.scale, 0.6, {y: 1, ease: Quint.easeOut})
        this.isDown = false;
        this.isSelected = false;

    }
    _updateColor(){

        this.curColor.r = this.baseRate * this.baseColor.r +  (1-this.baseRate) * ((1 - this.baseRate1) * this.mainColor.r + this.baseRate1 * ( (1-this.colorRate) * this.targetColor.r + this.colorRate *  this.targetColorActive.r) );
        this.curColor.g = this.baseRate * this.baseColor.g +  (1-this.baseRate) * ((1 - this.baseRate1) * this.mainColor.g + this.baseRate1 * ( (1-this.colorRate) * this.targetColor.g + this.colorRate *  this.targetColorActive.g) );
        this.curColor.b = this.baseRate * this.baseColor.b +  (1-this.baseRate) * ((1 - this.baseRate1) * this.mainColor.b + this.baseRate1 * ( (1-this.colorRate) * this.targetColor.b + this.colorRate *  this.targetColorActive.b) );

        this.mesh.material.color = this.curColor;
    }
    keydown(){
        if(this.isSelected) return;
        super.keydown();
        if(this.appModel.state == 'works' && this.isWork){
            this.appModel.workNum = parseInt(this.name) - 1;
        }
    }
    keyup(){
        if(this.isSelected) return;
        super.keyup();
    }
    _transformToHome(){
        if(this.appModel.state == "works"){
            this.unselect();
            TweenMax.to(this, 1, {baseRate1: 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }else{
            TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut })
        }
    }
    _appStartChange(){
        TweenMax.to(this, 1, {baseRate : 0, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
    }
    _stateChange(){

        if(this.appModel.state !== "works"&& this.appModel.state != 'home'){
            TweenMax.to(this, 1, {baseRate : 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }else if(this.appModel.state == "works"){
            TweenMax.to(this, 1, {baseRate1: 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }else if(this.appModel.state == 'home' ){
            // TweenMax.to(this, 1, {baseRate1: 1, onUpdate: this._updateColor, onUpdateScope: this, ease: Quint.easeInOut})
        }
    }
    _workChange(){
        if(this.appModel.workNum + 1  == this.name){
            this.select();
        }else if(this.appModel.prevWorkNum + 1 == this.name){
            this.unselect();
        }
    }
}