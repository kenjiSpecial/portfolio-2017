"use strict";

const THREE = require('three');
import Loader from '../loader/Loader';
import KeyObject from './KeyObject'
import AppModel from '../models/AppModel';
import {works} from '../utils/config';
import KeyObjectParticles3 from './KeyObjectParticles3'

export default class KeyObjectEnter extends KeyObject {
    constructor(params) {
        super(params);

        this.appModel = new AppModel();
        this.appModel.addEventListener('stateChange', this._onStateChange.bind(this));
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));
    }
    _createMesh(){
        let main = `${this.name}/sub0`;
        let pt = new KeyObjectParticles3({
            mainGeometry : this.loader.geometries['button'],
            subGeometry : this.loader.geometries[main],
        });
        this.add(pt);
        this.particleMesh = pt;

        this.name = 'Enter'; //this.name.replace('Button', '').toLowerCase();
    }

    rollover(){
        if(this.isOver) return;
        this.isOver = true;
        if(this.particleMesh){
            TweenMax.killTweensOf([this.particleMesh.uniforms.uRollover]);
            TweenMax.to(this.particleMesh.uniforms.uRollover, 0.6, {value: 1, ease: Quint.easeOut });
        }
    }
    keydown(){

        if(this.isActive ){
            let url = works[this.appModel.workNum].url;
            console.log(url);
            if(url){
                var win = window.open(url, '_blank');
                win.focus();
            }
            // this.dispatchEvent({type: 'backToHome'});
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
        if(this.particleMesh){
            TweenMax.killTweensOf([this.particleMesh.uniforms.uRollover]);
            TweenMax.to(this.particleMesh.uniforms.uRollover, 0.6, {value: 0, ease: Quint.easeOut });
        }
    }
    active(){
        if(this.isActive) return;
        TweenMax.killTweensOf([this.particleMesh.uniforms.uTranslate]);
        TweenMax.to( this.particleMesh.uniforms.uTranslate, 0.6, {
            value: 1, ease: Quint.easeOut
        });

        this.isActive = true;
    }
    inactive(){
        if(!this.isActive) return;

        TweenMax.killTweensOf([this.particleMesh.uniforms.uTranslate]);
        this.isActive = false;
        TweenMax.to( this.particleMesh.uniforms.uTranslate, 0.6, {
            value: 0, ease: Quint.easeOut
        });
    }
    _onStateChange(){
        if(this.appModel.state == "home"){
            this.inactive();
        }else if(this.appModel.state == "works"){
            let delay;
            delay = 1;
            TweenMax.delayedCall( delay, this.active.bind(this));
        }

    }
    _updateColor(){

    }
    _transformToHome(){
        this.inactive();
    }
}