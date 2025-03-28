import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// Инициализация шаблона
const init = () => {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const scene = new THREE.Scene();
    const canvas = document.querySelector('.canvas');
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.set(280, 110, 100);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    // Свет
    const lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    lightHemisphere.position.set(0, 50, 0);
    scene.add(lightHemisphere);


    // Модель
    const loader = new GLTFLoader();

    let mixer = null;

    loader.load("model/Heli_bell.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(3, 3, 3);

        mixer = new THREE.AnimationMixer(model);
        const action1 = mixer.clipAction(gltf.animations[0]);
        const action2 = mixer.clipAction(gltf.animations[1]);
        const action3 = mixer.clipAction(gltf.animations[3]);

        action1.setLoop(THREE.LoopOnce);
        action1.clampWhenFinished = true;
        action1.enable = true;

        action2.timeScale = 10000;
        action3.timeScale = 10000;

        action1.play();
        action2.play();
        action3.play();
        console.log(mixer)

        scene.add(model);
    });


    // Анимация 
    const clock = new THREE.Clock();

    const animate = () => {
        const delta = clock.getDelta();

        if (mixer) {
            mixer.update(delta);
        }
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
        controls.update();
    }

    animate();

    // Базовые обпаботчики событий длы поддержки ресайза
    window.addEventListener('resize', () => {
        // Обновляем размеры
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Обновляем соотношение сторон камеры
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Обновляем renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.render(scene, camera);
    });

    // Сделать во весь экран по двойному клику мыши
    window.addEventListener('dblclick', () => {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
};

init();


