varying vec2 vUv;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

//make sure to have a resolution uniform set to the screen size
uniform vec2 resolution;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uSpaceRate;
uniform vec2 uMouse;

#pragma glslify: fxaa = require('glsl-fxaa/fxaa.glsl')

float random(float x)
{
    return fract(sin(x) * 10000.);
}

float noise(vec2 p)
{
    return random(p.x + p.y * 10000.);
}

vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }

float smoothNoise(vec2 p)
{
    vec2 interp = smoothstep(0., 1., fract(p));
    float s = mix(noise(sw(p)), noise(se(p)), interp.x);
    float n = mix(noise(nw(p)), noise(ne(p)), interp.x);
    return mix(s, n, interp.y);
}

float fractalNoise(vec2 p)
{
    float x = 0.;
    x += smoothNoise(p      );
    x += smoothNoise(p * 2. ) / 2.;
    x += smoothNoise(p * 4. ) / 4.;
    x += smoothNoise(p * 8. ) / 8.;
    x += smoothNoise(p * 16.) / 16.;
    x /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
    return x;
}

float movingNoise(vec2 p)
{
    float x = fractalNoise(p + uTime * uSpaceRate );
    float y = fractalNoise(p - uTime * uSpaceRate );
    return fractalNoise(p + vec2(x, y));
}

float nestedNoise(vec2 p)
{
    float x = movingNoise(p);
    float y = movingNoise(p + 100.);
    return movingNoise(p + vec2(x, y));
}

void main() {
    float offset = 0.0;
    float n = 0.0;

    if(uSpaceRate > 0.){
        n = nestedNoise(vUv * 6.) * 1.0;
        float lerp = uSpaceRate; //(sin( * 0.5) + 1.0) / 2.0;
        offset = mix(0.0, 2.0, lerp);
        vec2 offsetVector = normalize(uMouse - vUv) * (n * offset);

        gl_FragColor = texture2D(tDiffuse, offsetVector + vUv);
    }else{
        vec2 fragCoord = vUv * resolution;

        gl_FragColor = fxaa(tDiffuse, fragCoord, resolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
    }

}
