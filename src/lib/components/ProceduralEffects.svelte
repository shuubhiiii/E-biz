<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';
    import { wormholeShader, terrainShader } from '$lib/shaders/shaderLib.js';

    export let type = 'wormhole'; // 'wormhole', 'terrain', 'particles', 'waves'
    export let intensity = 1.0;

    let canvas;
    let experience;

    onMount(() => {
        experience = new ProceduralEffect(canvas, type, intensity);
        
        return () => {
            if (experience) {
                experience.dispose();
            }
        };
    });

    class ProceduralEffect {
        constructor(canvas, type, intensity) {
            this.canvas = canvas;
            this.type = type;
            this.intensity = intensity;
            this.clock = new THREE.Clock();
            this.mouse = new THREE.Vector2();
            
            this.init();
            this.createEffect();
            this.setupEvents();
            this.animate();
        }

        init() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
            this.camera.position.z = 10;
            
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setSize(rect.width, rect.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);
        }

        createEffect() {
            switch(this.type) {
                case 'wormhole':
                    this.createWormhole();
                    break;
                case 'terrain':
                    this.createTerrain();
                    break;
                case 'particles':
                    this.createAdvancedParticles();
                    break;
                case 'waves':
                    this.createWaves();
                    break;
            }
        }

        createWormhole() {
            const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uIntensity: { value: this.intensity },
                    uResolution: { value: new THREE.Vector2(
                        this.canvas.width, 
                        this.canvas.height
                    ) }
                },
                vertexShader: wormholeShader.vertexShader,
                fragmentShader: wormholeShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            this.effect = new THREE.Mesh(geometry, material);
            this.scene.add(this.effect);
        }

        createTerrain() {
            const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(0, 0) },
                    uColor1: { value: new THREE.Color(0x0a0a0f) },
                    uColor2: { value: new THREE.Color(0x6366f1) },
                    uColor3: { value: new THREE.Color(0x00ff88) }
                },
                vertexShader: terrainShader.vertexShader,
                fragmentShader: terrainShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                wireframe: true
            });

            this.effect = new THREE.Mesh(geometry, material);
            this.effect.rotation.x = -Math.PI * 0.4;
            this.effect.position.y = -3;
            this.camera.position.z = 15;
            this.camera.position.y = 8;
            this.camera.lookAt(0, 0, 0);
            this.scene.add(this.effect);
        }

        createAdvancedParticles() {
            const count = 3000;
            const positions = new Float32Array(count * 3);
            const velocities = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                
                // Spherical distribution
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const r = Math.pow(Math.random(), 0.3) * 8;
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
                
                velocities[i3] = (Math.random() - 0.5) * 0.02;
                velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
                velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

                const t = Math.random();
                colors[i3] = 0.39 + t * 0.6;
                colors[i3 + 1] = 0.4 + t * 0.3;
                colors[i3 + 2] = 0.95 - t * 0.4;

                sizes[i] = Math.random() * 5 + 2;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
            geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(0, 0) },
                    uPixelRatio: { value: this.renderer.getPixelRatio() }
                },
                vertexShader: `
                    attribute vec3 customColor;
                    attribute float size;
                    attribute vec3 velocity;
                    
                    varying vec3 vColor;
                    varying float vAlpha;
                    
                    uniform float uTime;
                    uniform vec2 uMouse;
                    uniform float uPixelRatio;
                    
                    void main() {
                        vColor = customColor;
                        
                        vec3 pos = position;
                        
                        // Orbital motion
                        float angle = uTime * 0.2 + length(position) * 0.5;
                        mat3 rotation = mat3(
                            cos(angle), 0.0, sin(angle),
                            0.0, 1.0, 0.0,
                            -sin(angle), 0.0, cos(angle)
                        );
                        pos = rotation * pos;
                        
                        // Breathing effect
                        float breathe = sin(uTime + length(position)) * 0.3;
                        pos *= 1.0 + breathe;
                        
                        // Mouse attraction
                        vec3 mousePos = vec3(uMouse.x * 5.0, uMouse.y * 5.0, 0.0);
                        vec3 toMouse = mousePos - pos;
                        float dist = length(toMouse);
                        pos += normalize(toMouse) * (1.0 / (dist + 1.0)) * 2.0;
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * uPixelRatio * (30.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                        
                        vAlpha = smoothstep(30.0, 5.0, -mvPosition.z);
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    varying float vAlpha;
                    
                    void main() {
                        vec2 center = gl_PointCoord - 0.5;
                        float dist = length(center);
                        
                        if (dist > 0.5) discard;
                        
                        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                        glow = pow(glow, 1.5);
                        
                        gl_FragColor = vec4(vColor, glow * vAlpha * 0.8);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.effect = new THREE.Points(geometry, material);
            this.scene.add(this.effect);
        }

        createWaves() {
            const geometry = new THREE.PlaneGeometry(25, 25, 100, 100);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2(0, 0) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    uniform float uTime;
                    uniform vec2 uMouse;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        // Multiple wave layers
                        float wave1 = sin(pos.x * 0.5 + uTime) * sin(pos.y * 0.5 + uTime) * 1.5;
                        float wave2 = sin(pos.x * 1.0 - uTime * 0.7) * sin(pos.y * 1.2 + uTime * 0.8) * 0.5;
                        float wave3 = sin(pos.x * 2.0 + uTime * 1.5) * sin(pos.y * 2.5 - uTime) * 0.25;
                        
                        // Mouse ripple
                        vec2 mousePos = uMouse * 12.5;
                        float mouseDist = distance(pos.xy, mousePos);
                        float ripple = sin(mouseDist * 2.0 - uTime * 5.0) * exp(-mouseDist * 0.15) * 2.0;
                        
                        pos.z = wave1 + wave2 + wave3 + ripple;
                        vElevation = pos.z;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    uniform float uTime;
                    
                    void main() {
                        vec3 color1 = vec3(0.024, 0.714, 0.831);
                        vec3 color2 = vec3(0.388, 0.4, 0.945);
                        vec3 color3 = vec3(0.0, 1.0, 0.53);
                        
                        float t = vElevation * 0.2 + 0.5;
                        vec3 color = mix(color1, color2, t);
                        color = mix(color, color3, smoothstep(0.7, 1.0, t));
                        
                        // Grid lines
                        vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
                        float line = min(grid.x, grid.y);
                        float gridAlpha = 1.0 - min(line, 1.0);
                        
                        color = mix(color * 0.3, color, gridAlpha);
                        
                        float alpha = 0.4 + gridAlpha * 0.4;
                        alpha *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
                        alpha *= smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
                        
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            this.effect = new THREE.Mesh(geometry, material);
            this.effect.rotation.x = -Math.PI * 0.5;
            this.camera.position.set(0, 15, 12);
            this.camera.lookAt(0, 0, 0);
            this.scene.add(this.effect);
        }

        setupEvents() {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            });

            this.resizeObserver = new ResizeObserver(() => {
                const rect = this.canvas.parentElement.getBoundingClientRect();
                this.camera.aspect = rect.width / rect.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(rect.width, rect.height);
            });
            this.resizeObserver.observe(this.canvas.parentElement);
        }

        animate() {
            this.animationId = requestAnimationFrame(() => this.animate());
            
            const elapsed = this.clock.getElapsedTime();

            if (this.effect && this.effect.material.uniforms) {
                this.effect.material.uniforms.uTime.value = elapsed;
                
                if (this.effect.material.uniforms.uMouse) {
                    gsap.to(this.effect.material.uniforms.uMouse.value, {
                        x: this.mouse.x,
                        y: this.mouse.y,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }

            this.renderer.render(this.scene, this.camera);
        }

        dispose() {
            cancelAnimationFrame(this.animationId);
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            this.renderer.dispose();
        }
    }
</script>

<div class="procedural-container">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .procedural-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    canvas {
        width: 100%;
        height: 100%;
    }
</style>
