import {
    Mesh,
    ShaderMaterial,
    IcosahedronGeometry,
    Vector2,
} from 'three/build/three.module';

import SphereVertexShader from '../shaders/SphereShader/MeshShaders/SphereVertexShader';
import SphereFragmentShader from '../shaders/SphereShader/MeshShaders/SphereFragmentShader';

class Sphere {

    constructor(r, d) {

        let uniforms = {
            time: { value: 0.0 },
            radius: { value: r },
            sound: { value: null },
            resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
            size: { value: 0.02 },
            details: { value: 8.0 }
        }

        this.material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: SphereVertexShader,
            fragmentShader: SphereFragmentShader,
        });

        this.geometry = new IcosahedronGeometry(r, d);

        this.mesh = new Mesh(this.geometry, this.material);

    }

    update = (time) => {

        if (this.mesh.material.uniforms) {

            const t = time * 0.001;

            this.mesh.material.uniforms.time.value = t;
            this.mesh.material.uniforms.radius.value = 2.0;

            this.mesh.material.needsUpdate = true;
            this.mesh.material.elementsNeedUpdate = true;

        }
    }
}

export default Sphere;