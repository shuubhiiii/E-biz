<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

    // Props
    export let modelPath = '';
    export let scale = 1;
    export let scrollAnimation = true;  // Animate based on scroll
    export let morphTargets = true;      // Enable morph targets from Blender
    export let customShader = false;     // Apply custom shader to model

    let canvas;
    let container;
    let scene, camera, renderer, model, mixer;
    let clock = new THREE.Clock();
    let animationId;
    let morphMeshes = [];

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        init();
        if (modelPath) {
            loadAnimatedModel(modelPath);
        }
        animate();
    });

    onDestroy(() => {
        dispose();
    });

    function init() {
        const rect = container.getBoundingClientRect();

        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 1000);
        camera.position.set(0, 0, 10);

        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.5);
        fillLight.position.set(-5, 0, 5);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x00ff88, 0.3);
        rimLight.position.set(0, -5, -5);
        scene.add(rimLight);

        // Resize
        const resizeObserver = new ResizeObserver(() => {
            const rect = container.getBoundingClientRect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(rect.width, rect.height);
        });
        resizeObserver.observe(container);
    }

    async function loadAnimatedModel(path) {
        const loader = new GLTFLoader();

        try {
            const gltf = await new Promise((resolve, reject) => {
                loader.load(path, resolve, undefined, reject);
            });

            model = gltf.scene;
            model.scale.setScalar(scale);

            // Center model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Find meshes with morph targets
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.morphTargetInfluences && child.morphTargetInfluences.length > 0) {
                        morphMeshes.push(child);
                    }

                    // Apply custom shader if enabled
                    if (customShader) {
                        applyCustomShader(child);
                    }
                }
            });

            scene.add(model);

            // Setup animation mixer
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                
                if (scrollAnimation) {
                    setupScrollAnimation(gltf.animations);
                } else {
                    // Play all animations
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).play();
                    });
                }
            }

            // Setup morph target scroll animation
            if (morphTargets && morphMeshes.length > 0) {
                setupMorphAnimation();
            }

            // Entry animation
            gsap.from(model.scale, {
                x: 0, y: 0, z: 0,
                duration: 1,
                ease: 'back.out(1.7)'
            });

        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    function applyCustomShader(mesh) {
        const originalMaterial = mesh.material;
        
        mesh.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: originalMaterial.map },
                uColor: { value: new THREE.Color(0x6366f1) },
                uFresnelPower: { value: 2.0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D uTexture;
                uniform vec3 uColor;
                uniform float uFresnelPower;
                
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);
                    
                    vec4 texColor = texture2D(uTexture, vUv);
                    vec3 color = texColor.rgb;
                    
                    // Add holographic edge glow
                    color = mix(color, uColor, fresnel * 0.5);
                    
                    // Scanlines
                    float scanline = sin(vUv.y * 100.0 + uTime * 2.0) * 0.02 + 1.0;
                    color *= scanline;
                    
                    gl_FragColor = vec4(color, texColor.a);
                }
            `,
            transparent: originalMaterial.transparent
        });
        
        mesh.userData.customMaterial = mesh.material;
    }

    function setupScrollAnimation(animations) {
        if (!mixer || animations.length === 0) return;

        const clip = animations[0];
        const action = mixer.clipAction(clip);
        action.paused = true;
        action.play();

        ScrollTrigger.create({
            trigger: container,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                action.time = clip.duration * progress;
                mixer.update(0);
            }
        });
    }

    function setupMorphAnimation() {
        morphMeshes.forEach((mesh) => {
            const morphCount = mesh.morphTargetInfluences.length;
            
            ScrollTrigger.create({
                trigger: container,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    
                    // Animate through morph targets
                    for (let i = 0; i < morphCount; i++) {
                        const targetProgress = (progress * morphCount) - i;
                        mesh.morphTargetInfluences[i] = Math.max(0, Math.min(1, targetProgress));
                    }
                }
            });
        });
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        if (mixer && !scrollAnimation) {
            mixer.update(delta);
        }

        // Update custom shader uniforms
        if (model) {
            model.traverse((child) => {
                if (child.userData.customMaterial) {
                    child.userData.customMaterial.uniforms.uTime.value = elapsed;
                }
            });
        }

        renderer.render(scene, camera);
    }

    function dispose() {
        cancelAnimationFrame(animationId);
        ScrollTrigger.getAll().forEach(t => t.kill());
        
        if (model) {
            model.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        
        if (renderer) renderer.dispose();
    }

    // Expose morph control
    export function setMorph(index, value) {
        morphMeshes.forEach((mesh) => {
            if (mesh.morphTargetInfluences[index] !== undefined) {
                gsap.to(mesh.morphTargetInfluences, {
                    [index]: value,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }
</script>

<div class="animated-model-container" bind:this={container}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .animated-model-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 500px;
    }

    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
