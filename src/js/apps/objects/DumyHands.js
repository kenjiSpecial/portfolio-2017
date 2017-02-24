"use strict";

import Hand from './Hand';

const THREE = require('three');
const glslify = require('glslify');

const MAX = 40;

export default class DummyHands extends THREE.Object3D {
    constructor(params) {
        super()

        this.hands = [];
        for(let ii = 0; ii < MAX; ii++){
            let hand = new Hand(params);
            hand.position.z = 1.5;
            hand.position.x = THREE.Math.randFloat(-10, 10);
            hand.position.y = THREE.Math.randFloat(-10, 10);
            hand.speedX = 0;
            hand.speedY = 0;
            hand.aclX = 0;
            hand.aclY = 0;
            this.add(hand);
            this.hands.push(hand);
        }
    }
    animateIn(){
        this.hands.forEach((hand)=>{hand.animateIn();})
    }
    update(targetHand){
        let sepDist = 1;
        let cohDist = 1.5;
        let aliDist = 2;
        let sepForce = 0.15 * 0.001;
        let cohForce = 0.1 * 0.001;
        let aliForce = 0.3 * 0.001;

        let   spareX, spareY
            , sforceX, sforceY
            , cforceX, cforceY
            , aforceX, aforceY;
        let distSquared;
        let length;
        let current = MAX;
        // console.log(targetHand.mesh.position.x);

        // while(current--){
        for(current = 0; current < this.hands.length; current++){
            sforceX = 0;
            sforceY = 0
            cforceX = 0;
            cforceY = 0
            aforceX = 0;
            aforceY = 0;
            let hand = this.hands[current];

            spareX = hand.position.x - targetHand.mesh.position.x;
            spareY = hand.position.y - targetHand.mesh.position.y;
            distSquared = spareX * spareX + spareY * spareY

            distSquared = distSquared < 1 ? 1 : distSquared;
            hand.speedX -= (0.1* spareX);
            hand.speedY -= (0.1 * spareY);

            let target = this.hands.length;

            this.rule1(hand, current);
            this.rule2(hand, targetHand.mesh);
            this.rule3(hand, current);

            let speed = Math.sqrt(hand.speedX * hand.speedX + hand.speedY * hand.speedY);
            if (speed >= 10) {
                var r = 10/ speed;
                hand.speedX *= r;
                hand.speedY *= r;
            }

            hand.position.x += hand.speedX / 60;
            hand.position.y += hand.speedY / 60;

            hand.rotateZ(Math.atan2( hand.speedY, hand.speedX)/180 * Math.PI)

            hand.prevSpeedX = hand.speedX;
            hand.prevSpeedY = hand.speedY;
        }

    }
    rule1(hand1, current){
        let c = {x: 0, y: 0};
        let vel = 100;

        for(let ii = 0; ii < this.hands.length; ii++){
            let hand = this.hands[ii];
            if(current != ii){
                c.x += hand.position.x;
                c.y += hand.position.y;
            }
        }

        c.x  = c.x/(this.hands.length-1);
        c.y  = c.y/(this.hands.length-1);

        hand1.speedX += (c.x - hand1.speedX)/4000;
        hand1.speedY += (c.y - hand1.speedY)/4000;
    }
    rule2(hand1, mainHand){
        for( var i = 0; i < this.hands.length; i++){
            if(hand1 != this.hands[i]){
                var d = this.getDistance(hand1.position, this.hands[i].position);
                // console.log(d);
                if(d < 2.4){
                    hand1.speedX -= (this.hands[i].position.x - hand1.position.x);
                    hand1.speedY -= (this.hands[i].position.y - hand1.position.y);
                }
            }
        }

        var d = this.getDistance(hand1.position, mainHand.position);
        // console.log(d);
        if(d < 5){
            hand1.speedX -= (mainHand.position.x - hand1.position.x);
            hand1.speedY -= (mainHand.position.y - hand1.position.y);
        }
    }
    rule3(hand1, current){
        var pv = {x: 0, y: 0};
        for(let i = 0; i < this.hands.length; i++){
            if(current != i){
                pv.x += this.hands[i].speedX;
                pv.y += this.hands[i].speedY;
            }
        }

        pv.x = pv.x/(this.hands.length-1);
        pv.y = pv.y/(this.hands.length-1);

        hand1.speedX += (pv.x - hand1.speedX)/10;
        hand1.speedY += (pv.y - hand1.speedY)/10;

    }
    getDistance( pos1, pos2){
        let dx = pos1.x - pos2.x;
        let dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// double-dog-leg hypothenuse approximation
// http://forums.parallax.com/discussion/147522/dog-leg-hypotenuse-approximation
function hypot(a, b){
    a = Math.abs(a)
    b = Math.abs(b)
    var lo = Math.min(a, b)
    var hi = Math.max(a, b)
    return hi + 3 * lo / 32 + Math.max(0, 2 * lo - hi) / 8 + Math.max(0, 4 * lo - hi) / 16
}