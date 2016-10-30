uniform sampler2D diffuse;

varying vec3 vNormal;
varying vec2 vUv;

void main(){
        vec3 light = vec3( 0.5, 0.2, 1.0);
        light = normalize(light);

        float dProd = max(0.0, dot(vNormal, light));
        vec3 col = texture2D(diffuse, vUv).rgb;

        gl_FragColor = vec4( dProd * col.r, dProd * col.g, dProd * col.b, 1.0);
}
