"use strict";

const THREE = require('three');
const TweenMax = require('gsap');
import Loader from '../loader/Loader';

export default class LoaderMesh extends THREE.Object3D {
    constructor() {
        super();

        this.meshes = [];
        this.loader = new Loader();
    }
    updateMesh(percent, loadedCnt){
        return;

        let mat = new THREE.MeshStandardMaterial({
            color : 0x3F3F3F,
            roughness : 0,
            metalness : 0,
            // wireframe : true
            transparent : true,
            opacity: 0
        });

        let num10 = parseInt( percent / 10);
        let num0 = percent % 10


        let number = new THREE.Object3D();
        this.add(number);
        if(percent == 100){
            let mesh = new THREE.Mesh(this.loader.geometries['1'], mat);
            mesh.rotation.x = Math.PI/2;
            mesh.position.x = -1.25;
            mesh.scale.set(0.6, 0.6, 0.6);
            number.add(mesh)
            this.meshes.push(mesh);

            mesh = new THREE.Mesh(this.loader.geometries['0'], mat);
            mesh.rotation.x = Math.PI/2;
            mesh.scale.set(0.6, 0.6, 0.6);
            mesh.position.x = 0;
            number.add(mesh);
            this.meshes.push(mesh);

            mesh = new THREE.Mesh(this.loader.geometries['0'], mat);
            mesh.rotation.x = Math.PI/2;
            mesh.scale.set(0.6, 0.6, 0.6);
            mesh.position.x = 1.25;
            number.add(mesh);
            this.meshes.push(mesh);
        }else{
            let mesh = new THREE.Mesh(this.loader.geometries[num10], mat);
            mesh.rotation.x = Math.PI/2;
            mesh.position.x = -1.1;
            number.add(mesh)
            this.meshes.push(mesh);
            mesh = new THREE.Mesh(this.loader.geometries[num0], mat);
            mesh.rotation.x = Math.PI/2;
            mesh.position.x = 1.1;
            number.add(mesh);
            this.meshes.push(mesh);
        }
        //
        // number.position.z =  0;
        // number.position.x = 0; // THREE.Math.randFloat(-100, 100);
        // number.position.y = 0;//THREE.Math.randFloat(-100, 100);
        // number.scale.x = 1/ Math.pow(25, loadedCnt );
        // number.scale.y = 1/ Math.pow(25, loadedCnt );
        // number.scale.z = 1/ Math.pow(25, loadedCnt );

        TweenMax.to(mat, 0.6, {opacity: 1});
    }

    destroy(){

        this.meshes.forEach((mesh)=>{
            TweenMax.to(mesh.material, 0.6, {opacity: 0, onComplete : function(){
                mesh.geometry.dispose();
                mesh.material.dispose();
                this.remove(mesh);
            }, onCompleteScope: this})

        });

        this.meshes = undefined;
    }
}