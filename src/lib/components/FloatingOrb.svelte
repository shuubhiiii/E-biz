<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';

    export let color = '#6366f1';
    export let size = 1;

    let canvas;
    let scene, camera, renderer, orb, glow, clock;
    let mouse = { x: 0, y: 0 };

    onMount(() => {
        init();
        animate();
        
        return () => {
            renderer.dispose();
        };
    });

    function init() {
        const rect = canvas.parentElement.getBoundingClientRect();
        
        scene = new THREE.Scene();
        clock = new THREE.Clock();
        
        camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
        camera.position.z = 3;
        
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        createOrb();
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });
    }

    function createOrb() {
        const orbColor = new THREE.Color(color);
        
        // Main orb with procedural shader
        const geometry = new THREE.SphereGeometry(size, 64, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uColor: { value: orbColor },
                uFresnelColor: { value: new THREE.Color(0x00ff88) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                uniform float uTime;
                
                // Simplex noise
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
                    vNormal = normalize(normalMatrix * normal);
                    
                    vec3 pos = position;
                    
                    // Procedural displacement
                    float noise = snoise(uv * 5.0 + uTime * 0.3) * 0.1;
                    pos += normal * noise;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                uniform float uTime;
                uniform vec2 uMouse;
                uniform vec3 uColor;
                uniform vec3 uFresnelColor;
                
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
                    // Fresnel effect
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
                    
                    // Animated noise pattern
                    float noise = snoise(vUv * 8.0 + uTime * 0.5) * 0.5 + 0.5;
                    float noise2 = snoise(vUv * 16.0 - uTime * 0.3) * 0.5 + 0.5;
                    
                    // Base color with noise variation
                    vec3 color = uColor * (0.8 + noise * 0.4);
                    
                    // Add iridescence
                    float iridescence = sin(vNormal.x * 10.0 + uTime) * 0.5 + 0.5;
                    color = mix(color, uFresnelColor, iridescence * 0.3);
                    
                    // Fresnel glow
                    color = mix(color, uFresnelColor, fresnel * 0.8);
                    
                    // Pulsing highlight
                    float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
                    color *= pulse;
                    
                    // Energy lines
                    float lines = smoothstep(0.48, 0.5, fract(vUv.y * 20.0 + uTime * 0.5));
                    color += vec3(1.0) * lines * 0.1;
                    
                    gl_FragColor = vec4(color, 0.95);
                }
            `,
            transparent: true
        });

        orb = new THREE.Mesh(geometry, material);
        scene.add(orb);

        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(size * 1.3, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: orbColor }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                uniform float uTime;
                uniform vec3 uColor;
                
                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 4.0);
                    
                    float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
                    
                    gl_FragColor = vec4(uColor, fresnel * 0.4 * pulse);
                }
            `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        glow = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glow);

        // Entry animation
        gsap.from(orb.scale, {
            x: 0, y: 0, z: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
        });
        gsap.from(glow.scale, {
            x: 0, y: 0, z: 0,
            duration: 1.5,
            delay: 0.1,
            ease: 'elastic.out(1, 0.5)'
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsed = clock.getElapsedTime();

        if (orb) {
            orb.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
            orb.rotation.y = elapsed * 0.3;
            orb.material.uniforms.uTime.value = elapsed;
            
            // Mouse interaction
            gsap.to(orb.rotation, {
                x: mouse.y * 0.3,
                y: elapsed * 0.3 + mouse.x * 0.3,
                duration: 0.5,
                overwrite: true
            });
        }

        if (glow) {
            glow.rotation.copy(orb.rotation);
            glow.material.uniforms.uTime.value = elapsed;
        }

        renderer.render(scene, camera);
    }
</script>

<div class="orb-container">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .orb-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
    }
    
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
