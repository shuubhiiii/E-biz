<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    import { 
        noiseUtils, 
        holographicShader, 
        nebulaShader, 
        auroraShader,
        wormholeShader,
        proceduralParticleShader,
        dataStreamShader
    } from '$lib/shaders/shaderLib.js';

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
            
            this.init();
            this.createProceduralParticles();
            this.createDNAHelix();
            this.createHolographicShape();
            this.createNebula();
            this.createAurora();
            this.createDataStream();
            this.createProceduralGrid();
            this.setupEvents();
            this.setupGSAPAnimations();
            this.animate();
        }

        init() {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x0a0a0f, 1);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 30;

            this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.012);
        }

        setupGSAPAnimations() {
            gsap.from(this.camera.position, {
                z: 60,
                duration: 2,
                ease: 'power3.out'
            });

            if (this.particles) {
                gsap.from(this.particles.material.uniforms.uPixelRatio, {
                    value: 0,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }

            if (this.dnaGroup) {
                gsap.from(this.dnaGroup.position, {
                    x: 60, y: 30,
                    duration: 2,
                    delay: 0.5,
                    ease: 'power3.out'
                });
                gsap.from(this.dnaGroup.rotation, {
                    z: Math.PI * 2,
                    duration: 3,
                    ease: 'power2.out'
                });
            }

            if (this.hologram) {
                gsap.from(this.hologram.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 1.5,
                    delay: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            }

            if (this.nebulaMesh) {
                gsap.from(this.nebulaMesh.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 2,
                    delay: 1,
                    ease: 'power2.out'
                });
            }

            ScrollTrigger.create({
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    
                    gsap.to(this.scene.rotation, {
                        y: progress * Math.PI * 0.5,
                        duration: 0.5,
                        overwrite: true
                    });
                    
                    gsap.to(this.camera.position, {
                        y: -progress * 15,
                        z: 30 + progress * 10,
                        duration: 0.5,
                        overwrite: true
                    });
                }
            });
        }

        // Advanced procedural particle system
        createProceduralParticles() {
            const count = 8000;
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const seeds = new Float32Array(count);

            const colorPalette = [
                new THREE.Color(0x6366f1),
                new THREE.Color(0x8b5cf6),
                new THREE.Color(0x06b6d4),
                new THREE.Color(0x00ff88),
                new THREE.Color(0xfbbf24),
            ];

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                
                // Procedural galaxy spiral distribution
                const radius = Math.pow(Math.random(), 0.5) * 50 + 3;
                const branchAngle = ((i % 5) / 5) * Math.PI * 2;
                const spinAngle = radius * 0.3;
                
                const randomFactor = Math.pow(Math.random(), 2);
                const randomX = (Math.random() - 0.5) * randomFactor * radius * 0.4;
                const randomY = (Math.random() - 0.5) * randomFactor * radius * 0.15;
                const randomZ = (Math.random() - 0.5) * randomFactor * radius * 0.4;

                positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
                positions[i3 + 1] = randomY;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                const brightness = 0.7 + Math.random() * 0.3;
                colors[i3] = color.r * brightness;
                colors[i3 + 1] = color.g * brightness;
                colors[i3 + 2] = color.b * brightness;

                sizes[i] = Math.random() * 4 + 1;
                seeds[i] = Math.random();
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uPixelRatio: { value: this.renderer.getPixelRatio() }
                },
                vertexShader: proceduralParticleShader.vertexShader,
                fragmentShader: proceduralParticleShader.fragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);
        }

        // DNA Helix with procedural glow
        createDNAHelix() {
            const points1 = [], points2 = [];
            const segments = 150;

            for (let i = 0; i < segments; i++) {
                const t = (i / segments) * Math.PI * 6;
                const y = (i / segments) * 50 - 25;
                
                points1.push(new THREE.Vector3(Math.cos(t) * 6, y, Math.sin(t) * 6));
                points2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 6, y, Math.sin(t + Math.PI) * 6));
            }

            const curve1 = new THREE.CatmullRomCurve3(points1);
            const curve2 = new THREE.CatmullRomCurve3(points2);

            const tubeGeo1 = new THREE.TubeGeometry(curve1, 150, 0.15, 8, false);
            const tubeGeo2 = new THREE.TubeGeometry(curve2, 150, 0.15, 8, false);

            // Custom DNA shader with procedural glow
            const dnaMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(0x6366f1) }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    varying vec3 vNormal;
                    uniform float uTime;
                    
                    void main() {
                        vPosition = position;
                        vNormal = normal;
                        vec3 pos = position;
                        pos += normal * sin(position.y * 0.5 + uTime * 2.0) * 0.05;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vPosition;
                    varying vec3 vNormal;
                    uniform float uTime;
                    uniform vec3 uColor;
                    
                    void main() {
                        float pulse = sin(vPosition.y * 0.3 + uTime * 3.0) * 0.3 + 0.7;
                        float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                        vec3 color = uColor * pulse + vec3(0.0, 1.0, 0.5) * glow * 0.5;
                        gl_FragColor = vec4(color, 0.7);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });

            const helix1 = new THREE.Mesh(tubeGeo1, dnaMaterial);
            const helix2 = new THREE.Mesh(tubeGeo2, dnaMaterial.clone());
            helix2.material.uniforms.uColor.value = new THREE.Color(0x00ff88);

            this.dnaGroup = new THREE.Group();
            this.dnaGroup.add(helix1);
            this.dnaGroup.add(helix2);

            // Procedural rungs with energy flow
            for (let i = 0; i < segments; i += 8) {
                const t = (i / segments) * Math.PI * 6;
                const y = (i / segments) * 50 - 25;
                
                const rungGeo = new THREE.CylinderGeometry(0.08, 0.08, 12, 8);
                const rungMat = new THREE.MeshBasicMaterial({ 
                    color: 0x06b6d4, 
                    transparent: true, 
                    opacity: 0.4 
                });
                const rung = new THREE.Mesh(rungGeo, rungMat);
                
                rung.position.set(0, y, 0);
                rung.rotation.z = Math.PI / 2;
                rung.rotation.y = t;
                
                this.dnaGroup.add(rung);
            }

            this.dnaGroup.position.set(35, 0, -15);
            this.dnaGroup.rotation.z = Math.PI * 0.1;
            this.scene.add(this.dnaGroup);
        }

        // Holographic shape with custom iridescent shader
        createHolographicShape() {
            const geometry = new THREE.IcosahedronGeometry(5, 2);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color(0x6366f1) },
                    uColor2: { value: new THREE.Color(0x00ff88) },
                    uColor3: { value: new THREE.Color(0x06b6d4) }
                },
                vertexShader: holographicShader.vertexShader,
                fragmentShader: holographicShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            this.hologram = new THREE.Mesh(geometry, material);
            this.hologram.position.set(-28, 5, 0);
            this.scene.add(this.hologram);

            // Wireframe overlay
            const wireGeo = new THREE.IcosahedronGeometry(5.2, 1);
            const wireMat = new THREE.MeshBasicMaterial({
                color: 0x6366f1,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            this.hologramWire = new THREE.Mesh(wireGeo, wireMat);
            this.hologramWire.position.copy(this.hologram.position);
            this.scene.add(this.hologramWire);
        }

        // Nebula cloud with procedural noise
        createNebula() {
            const geometry = new THREE.PlaneGeometry(40, 40, 1, 1);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    uColor1: { value: new THREE.Color(0x6366f1) },
                    uColor2: { value: new THREE.Color(0x8b5cf6) },
                    uColor3: { value: new THREE.Color(0x06b6d4) }
                },
                vertexShader: nebulaShader.vertexShader,
                fragmentShader: nebulaShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.nebulaMesh = new THREE.Mesh(geometry, material);
            this.nebulaMesh.position.set(0, 10, -30);
            this.scene.add(this.nebulaMesh);
        }

        // Aurora effect
        createAurora() {
            const geometry = new THREE.PlaneGeometry(80, 30, 1, 1);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color(0x00ff88) },
                    uColor2: { value: new THREE.Color(0x06b6d4) },
                    uColor3: { value: new THREE.Color(0x8b5cf6) }
                },
                vertexShader: auroraShader.vertexShader,
                fragmentShader: auroraShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.auroraMesh = new THREE.Mesh(geometry, material);
            this.auroraMesh.position.set(0, 25, -40);
            this.scene.add(this.auroraMesh);
        }

        // Data stream effect (Matrix-like)
        createDataStream() {
            const geometry = new THREE.PlaneGeometry(20, 40, 1, 1);
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color(0x00ff88) }
                },
                vertexShader: dataStreamShader.vertexShader,
                fragmentShader: dataStreamShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            this.dataStreamMesh = new THREE.Mesh(geometry, material);
            this.dataStreamMesh.position.set(-45, 0, -10);
            this.dataStreamMesh.rotation.y = Math.PI * 0.15;
            this.scene.add(this.dataStreamMesh);

            // Second data stream
            const stream2 = new THREE.Mesh(geometry.clone(), material.clone());
            stream2.material.uniforms.uColor.value = new THREE.Color(0x06b6d4);
            stream2.position.set(45, 0, -10);
            stream2.rotation.y = -Math.PI * 0.15;
            this.dataStreamMesh2 = stream2;
            this.scene.add(stream2);
        }

        // Procedural animated grid
        createProceduralGrid() {
            const geometry = new THREE.PlaneGeometry(150, 150, 80, 80);
            
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
                    
                    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                    float snoise(vec2 v) {
                        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                        vec2 i = floor(v + dot(v, C.yy));
                        vec2 x0 = v - i + dot(i, C.xx);
                        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                        vec4 x12 = x0.xyxy + C.xxzz;
                        x12.xy -= i1;
                        i = mod(i, 289.0);
                        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                        m = m*m; m = m*m;
                        vec3 x = 2.0 * fract(p * C.www) - 1.0;
                        vec3 h = abs(x) - 0.5;
                        vec3 ox = floor(x + 0.5);
                        vec3 a0 = x - ox;
                        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                        vec3 g;
                        g.x = a0.x * x0.x + h.x * x0.y;
                        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                        return 130.0 * dot(m, g);
                    }
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        float noise1 = snoise(uv * 3.0 + uTime * 0.2) * 3.0;
                        float noise2 = snoise(uv * 6.0 - uTime * 0.15) * 1.5;
                        float noise3 = snoise(uv * 12.0 + uTime * 0.1) * 0.5;
                        
                        vec2 mousePos = uMouse * 0.5 + 0.5;
                        float mouseDist = distance(uv, mousePos);
                        float mouseInfluence = smoothstep(0.3, 0.0, mouseDist) * 5.0;
                        
                        pos.z = noise1 + noise2 + noise3 + mouseInfluence;
                        vElevation = pos.z / 5.0;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec2 vUv;
                    varying float vElevation;
                    uniform float uTime;
                    
                    void main() {
                        vec2 grid = abs(fract(vUv * 30.0 - 0.5) - 0.5) / fwidth(vUv * 30.0);
                        float line = min(grid.x, grid.y);
                        float gridAlpha = (1.0 - min(line, 1.0)) * 0.3;
                        
                        float fade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) *
                                    smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
                        
                        vec3 lowColor = vec3(0.024, 0.714, 0.831);
                        vec3 highColor = vec3(0.388, 0.4, 0.945);
                        vec3 peakColor = vec3(0.0, 1.0, 0.53);
                        
                        vec3 color = mix(lowColor, highColor, vElevation * 0.5 + 0.5);
                        color = mix(color, peakColor, smoothstep(0.5, 1.0, vElevation));
                        
                        float pulse = sin(uTime * 2.0 + vUv.x * 10.0) * 0.1 + 0.9;
                        
                        gl_FragColor = vec4(color * pulse, gridAlpha * fade);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            this.grid = new THREE.Mesh(geometry, material);
            this.grid.rotation.x = -Math.PI * 0.5;
            this.grid.position.y = -15;
            this.scene.add(this.grid);
        }

        setupEvents() {
            window.addEventListener('mousemove', (e) => {
                this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            window.addEventListener('resize', () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                
                if (this.nebulaMesh) {
                    this.nebulaMesh.material.uniforms.uResolution.value.set(
                        window.innerWidth, 
                        window.innerHeight
                    );
                }
            });

            window.addEventListener('mousemove', (e) => {
                gsap.to(this.mouse, {
                    x: (e.clientX / window.innerWidth) * 2 - 1,
                    y: -(e.clientY / window.innerHeight) * 2 + 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        }

        animate() {
            this.animationId = requestAnimationFrame(() => this.animate());
            
            const elapsed = this.clock.getElapsedTime();
            
            this.mouse.lerp(this.targetMouse, 0.05);

            if (this.particles) {
                this.particles.material.uniforms.uTime.value = elapsed;
                this.particles.rotation.y = elapsed * 0.03;
            }

            if (this.dnaGroup) {
                this.dnaGroup.rotation.y = elapsed * 0.15;
                this.dnaGroup.children.forEach(child => {
                    if (child.material && child.material.uniforms) {
                        child.material.uniforms.uTime.value = elapsed;
                    }
                });
            }

            if (this.hologram) {
                this.hologram.rotation.x = elapsed * 0.2;
                this.hologram.rotation.y = elapsed * 0.3;
                this.hologram.material.uniforms.uTime.value = elapsed;
                this.hologramWire.rotation.x = -elapsed * 0.15;
                this.hologramWire.rotation.y = -elapsed * 0.2;
            }

            if (this.nebulaMesh) {
                this.nebulaMesh.material.uniforms.uTime.value = elapsed;
            }

            if (this.auroraMesh) {
                this.auroraMesh.material.uniforms.uTime.value = elapsed;
            }

            if (this.dataStreamMesh) {
                this.dataStreamMesh.material.uniforms.uTime.value = elapsed;
                this.dataStreamMesh2.material.uniforms.uTime.value = elapsed;
            }

            if (this.grid) {
                this.grid.material.uniforms.uTime.value = elapsed;
                this.grid.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
            }

            this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.02;
            this.camera.lookAt(0, 0, 0);

            this.renderer.render(this.scene, this.camera);
        }

        dispose() {
            cancelAnimationFrame(this.animationId);
            ScrollTrigger.getAll().forEach(t => t.kill());
            this.renderer.dispose();
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
