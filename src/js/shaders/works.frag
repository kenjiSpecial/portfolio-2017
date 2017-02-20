
#pragma glslify: classic3  = require(glsl-noise/classic/3d)

varying vec2 vUv;

uniform float uTime;
uniform float uTime2;
uniform float uBalance;
uniform float uColorDiffuse;
uniform sampler2D bgTexture;
uniform sampler2D bgTexture1;
uniform sampler2D noise1;
uniform sampler2D noise2;
uniform sampler2D noise3;

void main() {
    vec4 noise1 = texture2D(noise1, vUv);
    vec4 noise2 = texture2D(noise2, vUv);
    vec4 noise3 = texture2D(noise3, vUv);

    float noise = (classic3(  vec3(vUv.x * 4., vUv.y * 4., uTime2/3.) ) + 1.0)/2.0;

    vec2 texPos = clamp( vec2(0.5) + (1.0 - uBalance) * (vec2(vUv.x, vUv.y) - vec2(0.5))  + uColorDiffuse *(uTime + uBalance ) *  (vec2(noise1.x, noise2.y) - vec2(0.5)), vec2(0), vec2(1.));
    vec2 texPos2 = clamp(  vec2(0.5) + uBalance * (vec2(vUv.x, vUv.y) - vec2(0.5))  + uColorDiffuse *(uTime + (1.0 - uBalance) ) *  (vec2(noise3.x, noise1.y) - vec2(0.5)), vec2(0), vec2(1.));
    texPos = texPos + (vec2(noise) - vec2(0.5)) * 0.04;
    texPos2 = texPos2 + (vec2(noise) - vec2(0.5)) * 0.04;

    vec4 bgCol = texture2D(bgTexture, texPos);
    vec4 bgCol1 = texture2D(bgTexture1, texPos2);
    vec4 col = mix(bgCol, bgCol1, uBalance);
//    vec4 col = bgCol + bgCol1;

    gl_FragColor = col;
}
