#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tBase;
uniform float uRate;

void main(){
    vec4 baseCol = texture2D(tDiffuse, vUv);
    vec4 outlineCol = texture2D(tBase, vUv);
    float gray = 1.0 - smoothstep(0.0, 1.0, (baseCol.r + baseCol.g +  baseCol.b)/3.0 * baseCol.a);
    if(vUv.x <= uRate){
        gray = gray * uRate;
    }else{
        gray = 0.0;
    }

    gl_FragColor = mix(baseCol, outlineCol, gray);

//    if(baseCol.a == 0.0{
//        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//    }
}