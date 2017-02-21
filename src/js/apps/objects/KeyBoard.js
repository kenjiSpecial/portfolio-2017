"use strict";

const THREE = require('three');
import {characters} from '../utils/config';
import Loader from '../loader/Loader';
import KeyObject from './KeyObject'
import KeyObjectBack from './KeyObjectBack';
import KeyObjectAbout from './KeyObjectAbout'
import KeyObjectWorks from './KeyObjectWorks'
import KeyObjectNumber from './KeyObjectNumber';
import KeyObjectEnter from './KeyObjectEnter';
import KeyObjectArrow from './KeyObjectArrow';
import KeyObjectLab from './KeyObjectLab'
import KeyObjectMore from './KeyObjectMore';
import KeyObjectSns from './KeyObjectSns';
import KeyObjectSpace from './KeyObjectSpace';
import {keyboardMouseDown, keyboardDirectories} from '../utils/config'
import AppModel from '../models/AppModel';


export default class KeyBoard extends THREE.Object3D {
    constructor(){
        super();
        this.rotation.x = Math.PI / 2;

        this.loader = new Loader();
        this.keySize = 2.2;
        this.appModel = new AppModel();
        this._createKeyBoard();
        this.appModel.addEventListener('stateChange', this._onUpdateStateChange.bind(this));
    }

    _createKeyBoard(){
        this.characterKeys = [];

        characters.forEach((characterRow) =>{
            this.characterKeys.push([]);
            characterRow.characters.forEach((chara, index) =>{
                let xPos = characterRow.x + this.keySize * index;
                let keyObject = this.getKeyObject(chara);

                keyObject.position.set(xPos, 0, characterRow.z);
                this.add(keyObject);

                this.characterKeys[this.characterKeys.length - 1].push(keyObject);
            })
        })
    }

    getKeyObject(chara){
        let keyObject;

        if(chara == "ButtonBack"){
            keyObject = new KeyObjectBack({name: chara});
            this.buttonBackView = keyObject;
        }
        else if(chara == 'a' || chara == 'ButtonS' || chara == 'ButtonD' || chara == 'ButtonF' || chara == 'ButtonG'){
            keyObject = new KeyObjectAbout({name: chara});
        }else if(chara == 'w' || chara == 'ButtonE' || chara == 'r' || chara == 'ButtonT' || chara == 'ButtonY'){
            keyObject = new KeyObjectWorks({name: chara});
        }else if(chara == '1' || chara == '2' || chara == '3' || chara == '4' || chara == '5' || chara == '6' || chara == '7' || chara == '8' || chara == '9'){
            keyObject = new KeyObjectNumber({name: chara});
        }else if( chara == 'l' || chara == 'ButtonHi' || chara == 'ButtonCol'){
            keyObject = new KeyObjectLab({name : chara});
        }else if(chara == 'ButtonEnter'){
            keyObject = new KeyObjectEnter({name: chara})
        }else if(chara == 'm' || chara == 'ButtonComma' || chara == 'ButtonPeriod' || chara == 'ButtonSlash'){
            keyObject = new KeyObjectMore({name : chara});
        }else if(chara == 'z' || chara == 'x' || chara == 'c'){
            keyObject = new KeyObjectSns({name : chara});
        }else if(chara == 'ButtonNext' || chara == 'ButtonPrev'){
            keyObject = new KeyObjectArrow({name: chara});
            if(chara == 'ButtonNext') this.nextButtonView = keyObject;
            else                      this.prevButtonView = keyObject;
        }else if(chara == 'space'){
            keyObject = new KeyObjectSpace({name: chara})
        }else{
            keyObject = new KeyObject({name: chara});
        }

        return keyObject;
    }

    doKeyDown(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.rollover();
                            character.keydown();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.rollover();
                        character.keydown();
                    }
                }

            })
        });
    }

    doKeyUp(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;
        if(keyboardDirectories[ev.key] == this.appModel.state) return; //value = undefined;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.keyup();
                            character.rollout();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.keyup();
                        character.rollout();
                    }
                }

            })
        });
    }

    doMouseDown(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.keydown();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.keydown();
                    }
                }

            })
        });
    }

    doMouseUp(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;
        if(keyboardDirectories[ev.key] == this.appModel.state) return; //value = undefined;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.keyup();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.keyup();
                    }
                }

            })
        });
    }

    doRollover(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.rollover();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.rollover();
                    }
                }

            })
        });
    }

    doRollout(ev){
        let value = keyboardMouseDown[ev.key] ? keyboardMouseDown[ev.key] : ev.key;
        if(keyboardDirectories[ev.key] == this.appModel.state) return; //value = undefined;

        this.characterKeys.forEach((characterKeyRow) =>{
            characterKeyRow.forEach((character) =>{
                if(Array.isArray(value)){
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.rollout();
                        }
                    })
                }else{
                    if(character.name == value){
                        character.rollout();
                    }
                }

            })
        });
    }

    _onUpdateStateChange(){
        //
        // let prevValue = keyboardDirectories[this.appModel.prevState];
        //
        // if(prevValue){
        //     this.characterKeys.forEach((characterKeyRow) =>{
        //         characterKeyRow.forEach((character) =>{
        //             prevValue.forEach((val) =>{
        //                 if(character.name == val){
        //                     character.unselect();
        //                 }
        //             })
        //         })
        //     });
        // }

        let value = keyboardDirectories[this.appModel.state]

        if(value){
            this.characterKeys.forEach((characterKeyRow) =>{
                characterKeyRow.forEach((character) =>{
                    value.forEach((val) =>{
                        if(character.name == val){
                            character.select();
                        }
                    })
                })
            });
        }
    }
}