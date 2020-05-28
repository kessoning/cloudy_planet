const globeVertexShader = `
    precision mediump float;

    varying vec3 vPosition;

    void main(void) {

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
        
        vPosition = position.xyz;

    }
`;

export default globeVertexShader;