"use strict";
const THREE = require('three');
const glslify = require('glslify');
function setValues(positions, vertices, faces, faceIndex, index){
    let face0, face1, face2;
    face0 = faces[faceIndex].a;
    face1 = faces[faceIndex].b;
    face2 = faces[faceIndex].c;

    let pt0 = vertices[face0];
    let pt1 = vertices[face1];
    let pt2 = vertices[face2];

    let random0 = Math.random();
    let random1 = Math.random();

    positions[ 3 * index]     =(pt0.x * random0 + pt1.x * (1 - random0)) * random1 + pt2.x * (1-random1);
    positions[ 3 * index + 1] = (pt0.y * random0 + pt1.y * (1 - random0)) * random1 + pt2.y * (1-random1);
    positions[ 3 * index + 2] = (pt0.z * random0 + pt1.z * (1 - random0)) * random1 + pt2.z * (1-random1);
}
export default class Particles extends THREE.Points  {
    constructor(params) {
        let geometry = new THREE.BufferGeometry();
        // this._createParticle();

        let totalLength = params.number || 2500; //params.geometry.vertices.length;
        let positions = new Float32Array(totalLength * 3);
        let positions2 = new Float32Array(totalLength * 3);
        let speeds = new Float32Array(totalLength * 4);
        let faces = params.geometry.faces;
        for(let ii = 0; ii < totalLength; ii++){
            let index1 = THREE.Math.randInt(0, faces.length - 1);
            setValues( positions, params.geometry.vertices, faces, index1, ii);
            setValues( positions2, params.geometry.vertices, faces, index1, ii);


            speeds[ii * 4] = THREE.Math.randFloat(1, 5);
            speeds[ii * 4 + 1] = THREE.Math.randFloat(0, Math.PI * 2);
            speeds[ii * 4 + 2] = THREE.Math.randFloat(0, 1);
            speeds[ii * 4 + 3] = THREE.Math.randFloat(0, 1);
        }

        let positionAttributre = new THREE.BufferAttribute(positions, 3);
        let positionAttributre2 = new THREE.BufferAttribute(positions2, 3);
        let speedAttributre = new THREE.BufferAttribute(speeds, 4);
        geometry.addAttribute("position", positionAttributre);
        geometry.addAttribute("position2", positionAttributre2);
        geometry.addAttribute("speed", speedAttributre);
        positionAttributre.needsUpdate = true;

        let color = params.color ? params.color : '#444444';
        let rollColor = params.rollColor ? params.rollColor : '#999999';
        let uniforms = {
                uTime : {value : 0},
                uRollover : {value: 0},
                uColor : {value : new THREE.Color(color)},
                uRollColor : {value : new THREE.Color(rollColor)}
            };
        // console.log(uniforms.uColor);
        let mat = new THREE.ShaderMaterial({
            transparent : true,
            uniforms : uniforms,
            blending: THREE.AdditiveBlending,
            depthTest : false,
            vertexShader : glslify('../../shaders/keyObjectParticle.vert'),
            fragmentShader : glslify('../../shaders/keyObjectParticle.frag')
        });

        super(geometry, mat);
        this.uniforms = uniforms;

        TweenMax.ticker.addEventListener('tick', this.update, this);

    }
    update(){

        // this.positionAttributre.needsUpdate = true;
        // this.material.uniforms.boneMatrices.value = this.params.parent.skeleton.boneMatrices;
        // this.material.uniforms.bindMatrix.value = this.params.parent.bindMatrix;
        // this.material.uniforms.bindMatrixInverse.value = this.params.parent.bindMatrixInverse;
        this.material.uniforms.uTime.value += 1/60;

        // console.log(this.params.mesh.bindMatrix);

    }
}