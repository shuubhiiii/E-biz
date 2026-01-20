<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';

    let canvas;
    let scene, camera, renderer, mesh, clock;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;
        
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
            vPosition = position;
            
            vec3 pos = position;
            
            // Multiple noise layers for organic motion
            float noise1 = snoise(uv * 3.0 + uTime * 0.3) * 0.3;
            float noise2 = snoise(uv * 6.0 - uTime * 0.2) * 0.15;
            float noise3 = snoise(uv * 12.0 + uTime * 0.4) * 0.075;
            
            // Mouse interaction ripple
            vec2 mousePos = uMouse * 0.5 + 0.5;
            float mouseDist = distance(uv, mousePos);
            float mouseWave = sin(mouseDist * 20.0 - uTime * 4.0) * exp(-mouseDist * 3.0) * 0.2;
            
            pos.z = noise1 + noise2 + noise3 + mouseWave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        varying vec3 vPosition;
        
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
            // Animated gradient based on noise
            float noise = snoise(vUv * 4.0 + uTime * 0.2) * 0.5 + 0.5;
            float noise2 = snoise(vUv * 8.0 - uTime * 0.15) * 0.5 + 0.5;
            
            // Color mixing
            vec3 color = mix(uColor1, uColor2, noise);
            color = mix(color, uColor3, noise2 * 0.5);
            
            // Mouse glow effect
            vec2 mousePos = uMouse * 0.5 + 0.5;
            float mouseDist = distance(vUv, mousePos);
            float glow = exp(-mouseDist * 5.0) * 0.5;
            color += vec3(0.3, 0.4, 1.0) * glow;
            
            // Scanlines
            float scanline = sin(vUv.y * 100.0 + uTime * 2.0) * 0.03 + 1.0;
            color *= scanline;
            
            // Vignette
            float vignette = 1.0 - smoothstep(0.3, 0.8, distance(vUv, vec2(0.5)));
            
            // Edge fade
            float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) *
                        smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            
            gl_FragColor = vec4(color * vignette, edge * 0.4);
        }
    `;

    onMount(() => {
        init();
        animate();
        
        return () => {
            renderer.dispose();
            cancelAnimationFrame(animationId);
        };
    });

    let animationId;

    function init() {
        scene = new THREE.Scene();
        clock = new THREE.Clock();
        
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1.5;
        
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const geometry = new THREE.PlaneGeometry(4, 2.5, 64, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uColor1: { value: new THREE.Color(0x0a0a0f) },
                uColor2: { value: new THREE.Color(0x6366f1) },
                uColor3: { value: new THREE.Color(0x00ff88) }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);
        
        gsap.from(mesh.scale, {
            x: 0.5, y: 0.5, z: 0.5,
            duration: 2,
            ease: 'elastic.out(1, 0.5)'
        });
    }
    
    function onMouseMove(e) {
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const elapsed = clock.getElapsedTime();
        
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;
        
        if (mesh) {
            mesh.material.uniforms.uTime.value = elapsed;
            mesh.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
            mesh.rotation.x = mouse.y * 0.1;
            mesh.rotation.y = mouse.x * 0.1;
        }
        
        renderer.render(scene, camera);
    }
</script>

<div class="shader-hero">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .shader-hero {
        position: absolute;
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
