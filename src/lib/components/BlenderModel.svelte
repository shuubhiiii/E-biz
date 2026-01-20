<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { gsap } from 'gsap';

    // Props
    export let modelPath = '';           // Path to .glb/.gltf file
    export let scale = 1;                // Model scale
    export let autoRotate = true;        // Auto rotation
    export let rotationSpeed = 0.005;    // Rotation speed
    export let enableControls = true;    // Allow orbit controls
    export let backgroundColor = null;   // Background color (null = transparent)
    export let ambientIntensity = 0.5;   // Ambient light intensity
    export let directionalIntensity = 1; // Directional light intensity
    export let envMapIntensity = 1;      // Environment map intensity
    export let playAnimations = true;    // Auto-play model animations
    export let hdrPath = '';             // Optional HDR environment map

    let canvas;
    let container;
    let scene, camera, renderer, controls, mixer;
    let model = null;
    let clock = new THREE.Clock();
    let animationId;
    let isLoading = true;
    let loadProgress = 0;
    let error = null;

    onMount(() => {
        init();
        if (modelPath) {
            loadModel(modelPath);
        }
        animate();
    });

    onDestroy(() => {
        dispose();
    });

    function init() {
        const rect = container.getBoundingClientRect();

        // Scene
        scene = new THREE.Scene();
        if (backgroundColor) {
            scene.background = new THREE.Color(backgroundColor);
        }

        // Camera
        camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
        camera.position.set(0, 1, 5);

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: !backgroundColor
        });
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.3);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0x00ff88, 0.2);
        rimLight.position.set(0, -5, -5);
        scene.add(rimLight);

        // Controls
        if (enableControls) {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = autoRotate;
            controls.autoRotateSpeed = 2;
            controls.enablePan = false;
            controls.minDistance = 2;
            controls.maxDistance = 20;
        }

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
            const rect = container.getBoundingClientRect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(rect.width, rect.height);
        });
        resizeObserver.observe(container);

        // Load HDR environment if provided
        if (hdrPath) {
            loadEnvironment(hdrPath);
        } else {
            // Create procedural environment
            createProceduralEnvironment();
        }
    }

    function createProceduralEnvironment() {
        // Create a simple gradient environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        // Create procedural environment texture
        const envScene = new THREE.Scene();
        
        // Gradient background sphere
        const envGeometry = new THREE.SphereGeometry(50, 32, 32);
        const envMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                uColor1: { value: new THREE.Color(0x0a0a0f) },
                uColor2: { value: new THREE.Color(0x1a1a2e) },
                uColor3: { value: new THREE.Color(0x6366f1) }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform vec3 uColor3;
                varying vec3 vWorldPosition;
                
                void main() {
                    vec3 direction = normalize(vWorldPosition);
                    float y = direction.y * 0.5 + 0.5;
                    
                    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, y));
                    color = mix(color, uColor3, smoothstep(0.5, 1.0, y) * 0.3);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
        
        const envMesh = new THREE.Mesh(envGeometry, envMaterial);
        envScene.add(envMesh);

        // Add some lights for reflection
        const envLight1 = new THREE.PointLight(0x6366f1, 100, 100);
        envLight1.position.set(20, 20, 20);
        envScene.add(envLight1);

        const envLight2 = new THREE.PointLight(0x00ff88, 50, 100);
        envLight2.position.set(-20, 10, -20);
        envScene.add(envLight2);

        const envCamera = new THREE.CubeCamera(0.1, 100, new THREE.WebGLCubeRenderTarget(256));
        envCamera.update(renderer, envScene);
        
        scene.environment = envCamera.renderTarget.texture;
    }

    async function loadEnvironment(path) {
        const { RGBELoader } = await import('three/addons/loaders/RGBELoader.js');
        const loader = new RGBELoader();
        
        loader.load(path, (texture) => {
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;
            
            texture.dispose();
            pmremGenerator.dispose();
        });
    }

    function loadModel(path) {
        isLoading = true;
        loadProgress = 0;
        error = null;

        // Setup loaders
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(
            path,
            (gltf) => {
                // Remove previous model
                if (model) {
                    scene.remove(model);
                    model.traverse((child) => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => m.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    });
                }

                model = gltf.scene;
                model.scale.setScalar(scale);

                // Center and position model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                model.position.sub(center);
                
                // Adjust camera based on model size
                const maxDim = Math.max(size.x, size.y, size.z);
                camera.position.z = maxDim * 2.5;
                if (controls) {
                    controls.minDistance = maxDim * 0.5;
                    controls.maxDistance = maxDim * 5;
                }

                // Setup materials for environment mapping
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        if (child.material) {
                            child.material.envMapIntensity = envMapIntensity;
                            
                            // Enhance metallic materials
                            if (child.material.metalness > 0.5) {
                                child.material.envMapIntensity = envMapIntensity * 1.5;
                            }
                        }
                    }
                });

                scene.add(model);

                // Setup animations
                if (gltf.animations && gltf.animations.length > 0 && playAnimations) {
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach((clip) => {
                        const action = mixer.clipAction(clip);
                        action.play();
                    });
                }

                // Entry animation
                gsap.from(model.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.5)'
                });

                gsap.from(model.rotation, {
                    y: Math.PI * 2,
                    duration: 1.5,
                    ease: 'power3.out'
                });

                isLoading = false;
            },
            (progress) => {
                if (progress.total > 0) {
                    loadProgress = (progress.loaded / progress.total) * 100;
                }
            },
            (err) => {
                console.error('Error loading model:', err);
                error = 'Failed to load 3D model';
                isLoading = false;
            }
        );
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (mixer) {
            mixer.update(delta);
        }

        if (controls) {
            controls.update();
        }

        if (model && !enableControls && autoRotate) {
            model.rotation.y += rotationSpeed;
        }

        renderer.render(scene, camera);
    }

    function dispose() {
        cancelAnimationFrame(animationId);
        
        if (model) {
            model.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        if (renderer) {
            renderer.dispose();
        }
        
        if (controls) {
            controls.dispose();
        }
    }

    // Expose methods
    export function setModel(path) {
        loadModel(path);
    }

    export function playAnimation(name) {
        if (mixer && model) {
            mixer.stopAllAction();
            const clip = THREE.AnimationClip.findByName(model.animations, name);
            if (clip) {
                mixer.clipAction(clip).play();
            }
        }
    }
</script>

<div class="model-container" bind:this={container}>
    <canvas bind:this={canvas}></canvas>
    
    {#if isLoading}
        <div class="loading-overlay">
            <div class="loader">
                <div class="loader-ring"></div>
                <span class="loader-text">{Math.round(loadProgress)}%</span>
            </div>
            <p>Loading 3D Model...</p>
        </div>
    {/if}
    
    {#if error}
        <div class="error-overlay">
            <i class="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
        </div>
    {/if}
</div>

<style>
    .model-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 400px;
        overflow: hidden;
        border-radius: 20px;
    }

    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }

    .loading-overlay,
    .error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(10, 10, 15, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        z-index: 10;
    }

    .loader {
        position: relative;
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
    }

    .loader-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid rgba(99, 102, 241, 0.2);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loader-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.9rem;
        font-weight: 600;
        color: #6366f1;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .error-overlay i {
        font-size: 3rem;
        color: #ef4444;
        margin-bottom: 15px;
    }

    .error-overlay p {
        color: #94a3b8;
    }
</style>
