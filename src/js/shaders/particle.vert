#ifdef GL_ES
precision highp float;
#endif

#define MAX_BONES 1019

attribute vec3 position;
attribute vec3 position2;

attribute vec4 skinIndex;
attribute vec4 skinWeight;

attribute vec4 skinIndex2;
attribute vec4 skinWeight2;
attribute vec3 randomValue;

attribute vec4 speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform mat4 boneMatrices[ MAX_BONES ];
uniform float uTime;

mat4 getBoneMatrix( const in float i ) {
    mat4 bone = boneMatrices[ int(i) ];
    return bone;
}

void main(){
    gl_PointSize = randomValue.x;

    mat4 boneMatX = getBoneMatrix( skinIndex.x );
    mat4 boneMatY = getBoneMatrix( skinIndex.y );
    mat4 boneMatZ = getBoneMatrix( skinIndex.z );
    mat4 boneMatW = getBoneMatrix( skinIndex.w );

    vec3 transformed = vec3( position );

    vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
    vec4 skinned = vec4( 0.0 );
    skinned += boneMatX * skinVertex * skinWeight.x;
    skinned += boneMatY * skinVertex * skinWeight.y;
    skinned += boneMatZ * skinVertex * skinWeight.z;
    skinned += boneMatW * skinVertex * skinWeight.w;
    skinned  = bindMatrixInverse * skinned;

    mat4 boneMat2X = getBoneMatrix( skinIndex2.x );
    mat4 boneMat2Y = getBoneMatrix( skinIndex2.y );
    mat4 boneMat2Z = getBoneMatrix( skinIndex2.z );
    mat4 boneMat2W = getBoneMatrix( skinIndex2.w );

    vec3 transformed2 = vec3(position2);

    vec4 skinVertex2 = bindMatrix * vec4( transformed2, 1.0 );
    vec4 skinned2 = vec4( 0.0 );
    skinned2 += boneMat2X * skinVertex2 * skinWeight2.x;
    skinned2 += boneMat2Y * skinVertex2 * skinWeight2.y;
    skinned2 += boneMat2Z * skinVertex2 * skinWeight2.z;
    skinned2 += boneMat2W * skinVertex2 * skinWeight2.w;
    skinned2  = bindMatrixInverse * skinned2;

    float uRate = mix(speed.z, speed.w, (cos(uTime * speed.x + speed.y) + 1.) /2.);
    vec4 mvPosition = modelViewMatrix * mix(skinned , skinned2 , uRate);
    gl_Position = projectionMatrix * mvPosition;

}