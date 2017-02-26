"use strict";

const THREE = require('three');
const glslify = require('glslify');

export default class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(10, window.innerWidth / window.innerHeight, 0.1, 1000)

        this.lookAt(new THREE.Vector3());
        this.theta0 = 0;
        this.target0 = 0;
        this.theta1 = 0;
        this.target1 = 0;
        this.rad = 120;

        this.lookAtTarget = new THREE.Vector3();

        this.isMouseMove = false;

        this.MAX_THETA0 = 0;
        this.MAX_THETA1 = 0;
    }
    update(){
        this.theta0 += (this.target0 - this.theta0) * 0.03;
        this.theta1 += (this.target1 - this.theta1) * 0.03;

        this.position.x = Math.sin(this.theta0) * this.rad
        this.position.y = Math.sin(this.theta1) * this.rad;
        this.position.z = Math.cos(this.theta1) * Math.cos(this.theta0) * this.rad;

        this.lookAt(this.lookAtTarget)
    }
    camerZoomIn(callBack, loadedCnt){
        // this.loadedCnt = loadedCnt;
        // let targetRad =  60/Math.pow(30, loadedCnt);
        // TweenMax.to(this, this.isDebug ? 1 : 1.2, {rad: targetRad, delay: 0.1, onComplete: callBack, ease: Quint.easeInOut });
        TweenMax.delayedCall(0.0, callBack);
    }
    loadDone(callback, callback2, loaderMesh){
        // console.log('loadDone');

        // TweenMax.to(this, this.isDebug ? 2 : 2, { loadedCnt: 0, onUpdate : function(){
        //     this.rad = 60/Math.pow(30, (this.loadedCnt));
        // }, onUpdateScope: this, onComplete : function(){
        //     this.near = 2;
        //
        //     loaderMesh.destroy();
        //     if(callback2) callback2();

            // TweenMax.to(this, this.isDebug ? 0.6 : 0.6, {rad : 120, onUpdate : function(){
            // }, onUpdateScope : this, onComplete: callback})

        // }, onCompleteScope: this, ease:Quint.easeIn });

        this.updateProjectionMatrix();
        TweenMax.to(this, 0.6, {MAX_THETA0: 20/180 * Math.PI, MAX_THETA1: 20/180*Math.PI});
        if(callback) TweenMax.delayedCall(0.6, callback);
        if(callback2) TweenMax.delayedCall(0.6, callback2);
    }
    updateMouse(mouse){
        this.target0 = mouse.x * this.MAX_THETA0; //Math.PI/180 * 30;
        this.target1 = mouse.y * this.MAX_THETA1; //Math.PI/180 * 30;
    }
    animateStartAbout(){
        TweenMax.to(this, 1.5, {rad: 120, ease: Quint.easeInOut});
    }
}

