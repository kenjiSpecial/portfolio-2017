"use strict";

const THREE = require('three');
import Loader from '../loader/Loader';

export default class KeyObject extends THREE.Object3D {
    constructor(params) {
        super()

        this.name = params.name;
        this.isSelected = false;

        this.loader = new Loader();
        this._createMesh();
    }
    _createMesh(){
        let mat = new THREE.MeshStandardMaterial({
            color : 0x3F3F3F,
            // color : 0xff,
            roughness : 0,
            metalness : 0,
            transparent : true,
            shading : THREE.FlatShading
            // wireframe : true
        });

        if(this.name.indexOf('Button') > -1) this._createMultipleMesh(mat);
        else                                 this._createSingleMesh(mat);

    }
    _createMultipleMesh(mat){
        this.meshes = {};
        let main = `${this.name}/main`;
        this.meshes['main'] = new THREE.Mesh(this.loader.geometries[main], mat);
        this.add(this.meshes['main'])

        let sub0 = `${this.name}/sub0`;
        this.meshes['sub0'] = new THREE.Mesh(this.loader.geometries[sub0], mat.clone());
        this.add(this.meshes['sub0'])

        let sub1 = `${this.name}/sub1`;
        this.meshes['sub1'] = new THREE.Mesh(this.loader.geometries[sub1], mat.clone());
        this.add(this.meshes['sub1'])

        this.meshes['sub1'].scale.y = 0.001;
        this.meshes['sub1'].material.opacity = 0.01;
        this.meshes['sub1'].visible = false;

        this.name = this.name.replace('Button', '').toLowerCase();

    }

    _createSingleMesh(mat){
        this.mesh = new THREE.Mesh(this.loader.geometries[this.name], mat);
        this.add(this.mesh);
    }
    rollover(){
        if(this.isOver) return;

        this.isOver = true;
        if(this.meshes){
            TweenMax.killTweensOf([this.meshes['sub1'].scale, this.meshes['sub1'].material, this.meshes['sub0'].scale, this.meshes['sub0'].material,]);
            this.meshes['sub1'].visible = true;
            TweenMax.to(this.meshes['sub1'].scale, 0.6, {y: 1, onComplete : function(){
            }, onCompleteScope: this, ease: Quint.easeOut });
            TweenMax.to(this.meshes['sub1'].material, 0.6, {opacity: 1, ease: Quint.easeOut});
            TweenMax.to(this.meshes['sub0'].scale, 0.6, {y: 0.01, onComplete : function(){
                this.meshes['sub0'].visible = false;
            }, onCompleteScope: this, ease: Quint.easeOut });
            TweenMax.to(this.meshes['sub0'].material, 0.6, {opacity: 0, ease: Quint.easeOut});
        }
    }
    keydown(){
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

        if(this.meshes){
            TweenMax.killTweensOf([this.meshes['sub1'].scale, this.meshes['sub1'].material, this.meshes['sub0'].scale, this.meshes['sub0'].material,]);
            this.meshes['sub0'].visible = true;
            TweenMax.to(this.meshes['sub0'].scale, 0.6, {
                y: 1, onComplete: function(){
                }, onCompleteScope: this, ease: Quint.easeOut
            });
            TweenMax.to(this.meshes['sub0'].material, 0.6, {opacity: 1, ease: Quint.easeOut});

            TweenMax.to(this.meshes['sub1'].scale, 0.6, {
                y: 0, onComplete: function(){
                    this.meshes['sub1'].visible = false;
                }, onCompleteScope: this, ease: Quint.easeOut
            });
            TweenMax.to(this.meshes['sub1'].material, 0.6, {opacity: 0.01, ease: Quint.easeOut});
        }
    }
}