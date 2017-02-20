"use strict";
let instance = null;
const THREE = require('three');

export default class AppModel extends THREE.EventDispatcher {
    constructor() {
        super();

        if(!instance){
            instance = this;
            this._initialize();
        }

        return instance;
    }
    _initialize(){
        this._state = 'home';
        this._isAppStart = false;
        this._workNum = 0;
    }

    transformToHome(){
        this.dispatchEvent({type : "transformToHome"});
    }

    get state(){
        return this._state;
    }
    set state(_state){
        if(this._state == _state) return;

        this.prevState = this._state;
        this._state = _state;

        if(this._state == 'works'){
            this._workNum = -1;
            this.workNum = 0;
        }

        this.dispatchEvent({type : "stateChange"});
    }
    get isAppStart(){
        return this._isAppStart;
    }
    set isAppStart(value){
        this._isAppStart = value;
        this.dispatchEvent({type : "appStartChange"});
    }
    get workNum(){
        return this._workNum;
    }
    set workNum(val){
        if(this._workNum == val) return;

        this.prevWorkNum = this._workNum;
        this._workNum = val;
        this.dispatchEvent({type : 'workChange'});
    }

}