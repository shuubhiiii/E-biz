<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';

    let canvas;
    let scene, camera, renderer, points, clock;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let clicking = false;

    const particleCount = 100;
    const trailPositions = [];

    onMount(() => {
        init();
        animate();
        
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        };
    });

    function init() {
        scene = new THREE.Scene();
        clock = new THREE.Clock();
        
        camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2, window.innerWidth / 2,
            window.innerHeight / 2, -window.innerHeight / 2,
            0.1, 1000
        );
        camera.position.z = 100;
        
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        // Initialize trail positions
        for (let i = 0; i < particleCount; i++) {
            trailPositions.push({ x: 0, y: 0, life: 0 });
        }
        
        createParticles();
        
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onResize);
    }

    function createParticles() {
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const alphas = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            sizes[i] = 0;
            alphas[i] = 0;
            
            // Color gradient
            const t = i / particleCount;
            colors[i * 3] = 0.39 + t * 0.6;     // R
            colors[i * 3 + 1] = 0.4 + t * 0.4;  // G  
            colors[i * 3 + 2] = 0.95 - t * 0.4; // B
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uClicking: { value: 0 },
                uPixelRatio: { value: renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute float alpha;
                attribute vec3 customColor;
                
                varying float vAlpha;
                varying vec3 vColor;
                
                uniform float uPixelRatio;
                uniform float uClicking;
                uniform float uTime;
                
                void main() {
                    vAlpha = alpha;
                    vColor = customColor;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    float pulsate = 1.0 + sin(uTime * 10.0 + alpha * 10.0) * 0.2 * uClicking;
                    gl_PointSize = size * uPixelRatio * pulsate;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vAlpha;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uClicking;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Soft glow
                    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                    glow = pow(glow, 2.0);
                    
                    // Energy ring when clicking
                    float ring = smoothstep(0.3, 0.35, dist) * (1.0 - smoothstep(0.4, 0.5, dist));
                    ring *= uClicking * sin(uTime * 20.0) * 0.5 + 0.5;
                    
                    vec3 color = vColor;
                    color += vec3(0.0, 1.0, 0.5) * ring;
                    
                    gl_FragColor = vec4(color, glow * vAlpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);
    }

    function onMouseMove(e) {
        targetMouse.x = e.clientX - window.innerWidth / 2;
        targetMouse.y = -(e.clientY - window.innerHeight / 2);
    }

    function onMouseDown() {
        clicking = true;
        gsap.to(points.material.uniforms.uClicking, {
            value: 1,
            duration: 0.2
        });
    }

    function onMouseUp() {
        clicking = false;
        gsap.to(points.material.uniforms.uClicking, {
            value: 0,
            duration: 0.3
        });
    }

    function onResize() {
        camera.left = -window.innerWidth / 2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = -window.innerHeight / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsed = clock.getElapsedTime();
        
        // Smooth mouse follow
        mouse.x += (targetMouse.x - mouse.x) * 0.15;
        mouse.y += (targetMouse.y - mouse.y) * 0.15;
        
        // Update trail positions
        for (let i = trailPositions.length - 1; i > 0; i--) {
            trailPositions[i].x = trailPositions[i - 1].x;
            trailPositions[i].y = trailPositions[i - 1].y;
        }
        trailPositions[0].x = mouse.x;
        trailPositions[0].y = mouse.y;
        
        // Update particles
        const positions = points.geometry.attributes.position.array;
        const sizes = points.geometry.attributes.size.array;
        const alphas = points.geometry.attributes.alpha.array;
        
        for (let i = 0; i < particleCount; i++) {
            const trail = trailPositions[i];
            
            // Add some noise/offset
            const noise = Math.sin(elapsed * 5 + i * 0.5) * (clicking ? 15 : 3);
            const angleOffset = (i / particleCount) * Math.PI * 2 + elapsed * 2;
            
            positions[i * 3] = trail.x + Math.cos(angleOffset) * noise;
            positions[i * 3 + 1] = trail.y + Math.sin(angleOffset) * noise;
            positions[i * 3 + 2] = 0;
            
            // Size based on position in trail
            const t = 1 - i / particleCount;
            sizes[i] = (clicking ? 30 : 15) * t * t + 2;
            alphas[i] = t * t * (clicking ? 1.0 : 0.6);
        }
        
        points.geometry.attributes.position.needsUpdate = true;
        points.geometry.attributes.size.needsUpdate = true;
        points.geometry.attributes.alpha.needsUpdate = true;
        
        points.material.uniforms.uTime.value = elapsed;
        
        renderer.render(scene, camera);
    }
</script>

<div class="cursor-trail">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .cursor-trail {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
    }
    
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
