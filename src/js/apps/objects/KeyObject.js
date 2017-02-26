"use strict";

const THREE = require('three');
import Loader from '../loader/Loader';
import KeyObjectParticles from './KeyObjectParticles';
import KeyObjectParticles2 from './KeyObjectParticles2';
import {MultipleButtons} from '../utils/config'

export default class KeyObject extends THREE.Object3D {
    constructor(params) {
        super()

        this.name = params.name;
        this.isSelected = false;

        this.loader = new Loader();
        this._createMesh();
        this._addCollisionMesh();
    }
    _createMesh(color, rollColor){

        if(this.name.indexOf('Button') > -1) this._createMultipleMesh(color, rollColor);
        else                                 this._createSingleMesh(color, rollColor);
    }
    _addCollisionMesh(){
        // console.log('_addCollisionMesh');
        this.collisionBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color : 0x000000, transparent: true, opacity: 0.01, wireframe : true }));
        this.add(this.collisionBoxMesh);
        setTimeout(function(){
            this.collisionBoxMesh.updateMatrixWorld();
            this.remove(this.collisionBoxMesh);
        }.bind(this), 0);


        this.collisionBoxMesh.parentObject = this;
    }
    _createMultipleMesh( color, rollColor){

        let pt = new KeyObjectParticles2({
            mainGeometry : this.loader.geometries[MultipleButtons[this.name][0]],
            subGeometry : this.loader.geometries[MultipleButtons[this.name][1]],
            color : color,
            rollColor : rollColor
        });
        this.add(pt);
        this.particleMesh = pt;

        this.name = this.name.replace('Button', '').toLowerCase();

    }

    _createSingleMesh( color, rollColor ){

        let pt = new KeyObjectParticles({
            geometry : this.loader.geometries[this.name],
            color : color,
            rollColor : rollColor
        });
        this.add(pt);
        this.particleMesh = pt;
    }
    rollover(){
        if(this.isOver) return;
        if(this.name == 'button') return;

        this.isOver = true;
        if(this.particleMesh){
            TweenMax.killTweensOf([this.particleMesh.uniforms.uRollover]);
            TweenMax.to(this.particleMesh.uniforms.uRollover, 0.6, {value: 1, ease: Quint.easeOut });
        }
    }
    keydown(){
        if(this.isDown) return;

        this.isDown = true;

        TweenMax.killTweensOf([this.scale]);
        TweenMax.to(this.scale, 0.3, {y: 0.3, ease: Quint.easeOut});

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

    }
    unselect(delay = 0){
        if(!this.isSelected) return;

        this.isDown = false;
        this.isSelected = false;

        TweenMax.to(this.scale, 1.2, {y: 1, ease: Quint.easeInOut, delay: delay });
    }

    rollout(){
        if(!this.isOver) return;

        this.isOver = false;

        if(this.particleMesh){
            TweenMax.killTweensOf([this.particleMesh.uniforms.uRollover]);
            TweenMax.to(this.particleMesh.uniforms.uRollover, 0.6, {value: 0, ease: Quint.easeOut });
        }
    }
}