import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Sphere from './modules/Sphere';

class Sketch {

    constructor(mount) {

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000000);
        this.camera.position.x = -250;
        this.camera.position.y = 75;
        this.camera.position.z = 250;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1.0);
        // use ref as a mount point of the Three.js scene instead of the document.body
        mount.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = -0.5;

        const w_ = 128;
        const res = 4;

        this.sphere = new Sphere(w_, res);
        this.scene.add(this.sphere.mesh);

        this.animate();

    }

    update = () => {

        this.controls.update();

        const time = performance.now();

        this.sphere.update(time);

    }

    animate = () => {

        this.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate);

    };

}

export default Sketch;


