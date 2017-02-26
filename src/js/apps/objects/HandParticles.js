"use strict";
const THREE = require('three');
const glslify = require('glslify');

export default class Particles extends THREE.Points  {
    constructor(params) {
        let geometry = new THREE.BufferGeometry();
        // this._createParticle();
        let mat = new THREE.RawShaderMaterial({
            transparent : true,
            uniforms : {
                boneMatrices : {value : null},
                bindMatrix : {value : null},
                bindMatrixInverse : {value : null},
                uTime : {value : 0},
            },
            blending: THREE.AdditiveBlending,
            depthTest : false,
            vertexShader : glslify('../../shaders/particle.vert'),
            fragmentShader : glslify('../../shaders/particle.frag')
        });

        super(geometry, mat);

        this.params = params;
        this._createParticle();


    }
    _createParticle(){
        let geometry = this.params.geometry;
        this.totalParticleSize = geometry.vertices.length * 5; //this.params.totalParticleSize || 1000;

        this.positions = new Float32Array( this.totalParticleSize * 3);

        this.positions2 = new Float32Array( this.totalParticleSize * 3);
        this.skinIndices = new Float32Array( this.totalParticleSize * 4);
        this.skinIndices2 = new Float32Array( this.totalParticleSize * 4);
        this.skinWeights = new Float32Array( this.totalParticleSize * 4);
        this.skinWeights2 = new Float32Array( this.totalParticleSize * 4);
        let speeds = new Float32Array(this.totalParticleSize * 4);
        let randomPositions = new Float32Array(this.totalParticleSize * 3);

        for(let ii = 0; ii < this.totalParticleSize; ii++){
            let index1 = THREE.Math.randInt(0, geometry.vertices.length - 1);
            let index2 = THREE.Math.randInt(0, geometry.vertices.length - 1);
            while(index1 == index2){
                index2 = THREE.Math.randInt(0, geometry.vertices.length - 1);
            }

            let vertex1, skinIndex1, skinWeight1;
            let vertex2, skinIndex2, skinWeight2;
            vertex1 = geometry.vertices[index1];
            skinIndex1 = geometry.skinIndices[index1];
            skinWeight1 = geometry.skinWeights[index1]

            vertex2 = geometry.vertices[index2];
            skinIndex2 = geometry.skinIndices[index2];
            skinWeight2 = geometry.skinIndices[index2];

            setValues(this.positions, vertex1.toArray(), ii, 3 );
            setValues(this.skinIndices, skinIndex1.toArray(), ii, 4 );
            setValues(this.skinWeights, skinWeight1.toArray(), ii, 4 );
            setValues(this.positions2, vertex2.toArray(), ii, 3 );
            setValues(this.skinIndices2, skinIndex2.toArray(), ii, 4 );
            setValues(this.skinWeights2, skinWeight2.toArray(), ii, 4 );

            speeds[ii * 4] = THREE.Math.randFloat(1, 5);
            speeds[ii * 4 + 1] = THREE.Math.randFloat(0, Math.PI * 2);
            speeds[ii * 4 + 2] = THREE.Math.randFloat(0, 1);
            speeds[ii * 4 + 3] = THREE.Math.randFloat(0, 1);
            let val = 1;
            randomPositions[ii * 3] = THREE.Math.randFloat(10.0, 25.0);
            randomPositions[ii * 3 + 1] = THREE.Math.randFloat(-val, val);
            randomPositions[ii * 3 + 2] = THREE.Math.randFloat(-val, val);
        }

        function setValues(array, value, num, unit){
            array[num * unit + 0] = value[0];
            array[num * unit + 1] = value[1];
            array[num * unit + 2] = value[2];
            if(value[3])
                array[num * unit + 3] = value[3];
        }

        this.positionAttributre = new THREE.BufferAttribute(this.positions, 3);
        this.skinWeightAttribute = new THREE.BufferAttribute(this.skinWeights, 4);
        this.skinIndexAttribute = new THREE.BufferAttribute(this.skinIndices, 4);

        this.position2Attributre = new THREE.BufferAttribute(this.positions2, 3);
        this.skinWeight2Attribute = new THREE.BufferAttribute(this.skinWeights2, 4);
        this.skinIndex2Attribute = new THREE.BufferAttribute(this.skinIndices2, 4);


        this.geometry.addAttribute("position", this.positionAttributre);
        this.geometry.addAttribute("skinIndex", this.skinIndexAttribute);
        this.geometry.addAttribute("skinWeight", this.skinWeightAttribute);
        this.geometry.addAttribute("position2", this.position2Attributre);
        this.geometry.addAttribute("skinIndex2", this.skinIndex2Attribute);
        this.geometry.addAttribute("skinWeight2", this.skinWeight2Attribute);
        this.geometry.addAttribute("speed", new THREE.BufferAttribute(speeds, 4));
        this.geometry.addAttribute("randomValue", new THREE.BufferAttribute(randomPositions, 3));

        this.positionAttributre.needsUpdate = true;
        this.skinWeightAttribute.needsUpdate = true;
        this.skinIndexAttribute.needsUpdate = true;
        this.position2Attributre.needsUpdate = true;
        this.skinWeight2Attribute.needsUpdate = true;
        this.skinIndex2Attribute.needsUpdate = true;
    }
    update(geometry){
        this.material.uniforms.boneMatrices.value = this.params.parent.skeleton.boneMatrices;
        this.material.uniforms.bindMatrix.value = this.params.parent.bindMatrix;
        this.material.uniforms.bindMatrixInverse.value = this.params.parent.bindMatrixInverse;
        this.material.uniforms.uTime.value += 1/60;

        // console.log(this.params.mesh.bindMatrix);

    }
}