<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

    let canvas;
    let experience;

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);
        experience = new WebGLExperience(canvas);
        
        return () => {
            if (experience) {
                experience.dispose();
            }
        };
    });

    class WebGLExperience {
        constructor(canvas) {
            this.canvas = canvas;
            this.scene = new THREE.Scene();
            this.clock = new THREE.Clock();
            this.mouse = new THREE.Vector2();
            this.targetMouse = new THREE.Vector2();
            this.scrollProgress = 0;
            
            this.init();
            this.createStarField();
            this.createFloatingObjects();
            this.createGrid();
            this.setupEvents();
            this.setupScrollAnimation();
            this.animate();
        }

        init() {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            this.renderer.setClearColor(0x0a0a0f, 1);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 0, 50);

            this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);

            // Intro zoom animation
            gsap.from(this.camera.position, {
                z: 100,
                duration: 2.5,
                ease: 'power3.out'
            });
        }

        // 3D star field surrounding the viewer
        createStarField() {
            const count = 800;
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            const colorPalette = [
                new THREE.Color(0x6366f1),
                new THREE.Color(0x8b5cf6),
                new THREE.Color(0x06b6d4),
                new THREE.Color(0x00ff88),
                new THREE.Color(0xffffff),
            ];

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                
                // Spherical distribution around the camera
                const radius = 50 + Math.random() * 150;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                const brightness = 0.3 + Math.random() * 0.5;
                colors[i3] = color.r * brightness;
                colors[i3 + 1] = color.g * brightness;
                colors[i3 + 2] = color.b * brightness;

                sizes[i] = Math.random() * 3 + 1;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });

            this.starField = new THREE.Points(geometry, material);
            this.scene.add(this.starField);
        }

        // Floating 3D objects for depth
        createFloatingObjects() {
            this.floatingObjects = [];
            
            const geometries = [
                new THREE.OctahedronGeometry(1, 0),
                new THREE.TetrahedronGeometry(1, 0),
                new THREE.IcosahedronGeometry(1, 0),
            ];

            const material = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            for (let i = 0; i < 15; i++) {
                const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                const mesh = new THREE.Mesh(geometry, material.clone());
                
                // Position objects in 3D space around viewer
                const radius = 30 + Math.random() * 80;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                
                mesh.position.set(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                );
                
                mesh.scale.setScalar(1 + Math.random() * 3);
                mesh.userData.rotationSpeed = {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                };
                mesh.userData.floatSpeed = Math.random() * 0.5 + 0.5;
                mesh.userData.floatOffset = Math.random() * Math.PI * 2;
                
                // Random color from palette
                const colors = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0x00ff88];
                mesh.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
                
                this.floatingObjects.push(mesh);
                this.scene.add(mesh);
            }
        }

        // 3D grid floor
        createGrid() {
            const geometry = new THREE.PlaneGeometry(200, 200, 40, 40);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uCameraZ: { value: 50 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    varying float vDistance;
                    uniform float uTime;
                    uniform float uCameraZ;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        // Wave animation
                        float wave = sin(pos.x * 0.05 + uTime * 0.5) * sin(pos.y * 0.05 + uTime * 0.3) * 3.0;
                        pos.z = wave;
                        vElevation = wave * 0.3;
                        
                        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                        vDistance = length(worldPos.xyz - cameraPosition);
                        
                        gl_Position = projectionMatrix * viewMatrix * worldPos;
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    varying float vDistance;
                    
                    void main() {
                        vec2 grid = abs(fract(vUv * 25.0 - 0.5) - 0.5) / fwidth(vUv * 25.0);
                        float line = min(grid.x, grid.y);
                        float gridAlpha = (1.0 - min(line, 1.0)) * 0.2;
                        
                        // Distance fade for depth
                        float distFade = 1.0 - smoothstep(50.0, 150.0, vDistance);
                        
                        // Edge fade
                        float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                                        smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
                        
                        vec3 color = mix(vec3(0.024, 0.714, 0.831), vec3(0.388, 0.4, 0.945), vElevation + 0.5);
                        
                        gl_FragColor = vec4(color, gridAlpha * edgeFade * distFade);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            this.grid = new THREE.Mesh(geometry, material);
            this.grid.rotation.x = -Math.PI * 0.5;
            this.grid.position.y = -25;
            this.scene.add(this.grid);
        }

        setupScrollAnimation() {
            ScrollTrigger.create({
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                onUpdate: (self) => {
                    this.scrollProgress = self.progress;
                }
            });
        }

        setupEvents() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.camera.aspect = window.innerWidth / window.innerHeight;
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                }, 100);
            });

            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });
        }

        animate() {
            this.animationId = requestAnimationFrame(() => this.animate());
            
            const elapsed = this.clock.getElapsedTime();

            // Smooth mouse follow
            this.mouse.lerp(this.targetMouse, 0.05);

            // Star field rotation - feels like looking around
            if (this.starField) {
                this.starField.rotation.y = elapsed * 0.02 + this.mouse.x * 0.3;
                this.starField.rotation.x = this.mouse.y * 0.2;
            }

            // Floating objects animation
            this.floatingObjects.forEach((obj, i) => {
                obj.rotation.x += obj.userData.rotationSpeed.x;
                obj.rotation.y += obj.userData.rotationSpeed.y;
                obj.rotation.z += obj.userData.rotationSpeed.z;
                
                // Gentle floating motion
                obj.position.y += Math.sin(elapsed * obj.userData.floatSpeed + obj.userData.floatOffset) * 0.01;
            });

            // Update grid
            if (this.grid) {
                this.grid.material.uniforms.uTime.value = elapsed;
                this.grid.material.uniforms.uCameraZ.value = this.camera.position.z;
            }

            // Camera movement based on mouse - creates parallax 3D feel
            const targetX = this.mouse.x * 15;
            const targetY = this.mouse.y * 10 + 5;
            const targetZ = 50 + this.scrollProgress * 30;

            this.camera.position.x += (targetX - this.camera.position.x) * 0.03;
            this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
            this.camera.position.z += (targetZ - this.camera.position.z) * 0.03;

            // Camera rotation based on mouse for immersive look-around
            this.camera.rotation.y = -this.mouse.x * 0.1;
            this.camera.rotation.x = this.mouse.y * 0.05;

            this.renderer.render(this.scene, this.camera);
        }

        dispose() {
            cancelAnimationFrame(this.animationId);
            ScrollTrigger.getAll().forEach(t => t.kill());
            this.renderer.dispose();
            
            if (this.starField) {
                this.starField.geometry.dispose();
                this.starField.material.dispose();
            }
            if (this.grid) {
                this.grid.geometry.dispose();
                this.grid.material.dispose();
            }
            this.floatingObjects.forEach(obj => {
                obj.geometry.dispose();
                obj.material.dispose();
            });
        }
    }
</script>

<div class="webgl-container">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .webgl-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
</style>
