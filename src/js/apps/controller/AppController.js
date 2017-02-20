"use strict";

import {keyboardMouseDown, keyboardDirectories} from '../utils/config'

export default class AppController {
    constructor(model) {
        this.model = model;
    }
    setKeyboardObject(keyboardVeiw){
        this.keyboarView = keyboardVeiw;

        this.keyboarView.buttonBackView.addEventListener('backToHome', this._onBackToHome.bind(this));
    }
    _onBackToHome(){
        this.model.transformToHome();
    }
    doKeyDown(ev){
        if(this.keyboarView) this.keyboarView.doKeyDown(ev);

        if(this.model.isAppStart){
           this._updateDirecotry(ev);
        }
    }
    addPostEffectScene( postEfectScene ){
        this.postEfectScene = postEfectScene;
        console.log();
        this.postEfectScene.addEventListener('backToHome', this.updateStateToHome.bind(this))
    }
    updateStateToHome(){
        this.model.state = 'home';
    }
    doKeyUp(ev){
        if(this.keyboarView) this.keyboarView.doKeyUp(ev);
    }
    _updateDirecotry(ev){
        if(this.model.state == "home" && keyboardDirectories[ev.key]){
            this.model.state = keyboardDirectories[ev.key];
        }
    }
}