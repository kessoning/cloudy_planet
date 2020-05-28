const globeFragmentShader = `
    /* fBM
    * Thanks to:
    *
    * thebookofshaders.com, by Patricio Gonzalez Vivo
    * https://thebookofshaders.com/13/
    *
    * Domain Warping and fBM, by Inigo Quilez
    * https://www.iquilezles.org/www/articles/warp/warp.htm
    * https://www.iquilezles.org/www/articles/fbm/fbm.htm
    *
    * Code made, adapted, modified and merged by Giovanni Muzio - Kesson
    * https://kesson.io
    */

    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;            
    uniform float radius;
    
    uniform float size;            
    uniform float details;          

    varying vec3 vPosition;

    #define NUM_OCTAVES 8

    //	<https://www.shadertoy.com/view/4dS3Wd>
    //	By Morgan McGuire @morgan3d, http://graphicscodex.com
    //
    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123); }

    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), u);
    }

    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);

        // Four corners in 2D of a tile
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        // Simple 2D lerp using smoothstep envelope between the values.
        // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
        //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
        //			smoothstep(0.0, 1.0, f.y)));

        // Same code, with the clamps in smoothstep and common subexpressions
        // optimized away.
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    // This one has non-ideal tiling properties that I'm still tuning
    float noise(vec3 x) {
        const vec3 step = vec3(110, 241, 171);

        vec3 i = floor(x);
        vec3 f = fract(x);
    
        // For performance, compute the base input to a 1D hash from the integer part of the argument and the 
        // incremental change to the 1D based on the 3D -> 1D wrapping
        float n = dot(i, step);

        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                    mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                    mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
    }


    float fbm( in vec3 x) {    
        // float G = exp2(-H);
        float f = 1.0;
        float a = 0.5;
        float t = 0.0;
        for( int i=0; i < NUM_OCTAVES; i++ ) {
            t += a*noise(vec3(f*x));
            f *= 2.0;
            a *= 0.475;
        }
        return t;
    }

    void main(void) {

        vec3 st = (vPosition.xyz / radius) * size;
        
        vec3 color = vec3(0.0);

        // First layer of warping
        vec3 q = vec3(
                fbm( st.xyz + vec3(0.01)*time ),
                fbm( st.xyz + vec3(5.2,1.3, 1.0) ),
                fbm( st.xyz + vec3(1.0, 1.0, 1.0) ) );

        // Second layer of warping
        vec3 r = vec3(
                fbm( st.xyz + details * q + vec3(1.7, 9.2, 1.0) + 0.1 * time ),
                fbm( st.xyz + details * q + vec3(8.3, 2.8, 1.0) + 0.0125 * time ),
                fbm( st.xyz + details * q + vec3(2.8, 8.3, 1.0) + 0.0125 * time ) );

        // float f = fbm(st + vec2(fbm(st + vec2(fbm(st + r)))));
        float f = fbm(st + r);

        vec3 baseColor = vec3(0.00, 0.10, 0.980);
        vec3 colorMixA = vec3(0.00, 0.09, 0.89);
        vec3 colorMixB = vec3(0.14, 0.38, 0.61);
        vec3 finalColor = vec3(1.0, 1.0, 1.0) ;
        
        color = mix(baseColor, colorMixA, clamp((f*f)*1.0,0.0,1.0));
        color = mix(color, colorMixB,clamp(length(q)*1.0,0.0,1.0));
        color = mix(color, finalColor, clamp(length(r.x)*2.0,0.0,1.0));

        gl_FragColor = vec4((f*f*f+0.5*f*f+0.5*f)*color, 1.0);
        
    }
`;

export default globeFragmentShader;