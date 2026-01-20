<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { gsap } from 'gsap';

    // Props for Houdini-style particle simulations
    export let particleCount = 50000;
    export let simulationType = 'explosion'; // 'explosion', 'vortex', 'rain', 'fire', 'smoke', 'magic'
    export let colorStart = '#6366f1';
    export let colorEnd = '#00ff88';
    export let speed = 1;
    export let size = 1;
    export let lifetime = 3;
    export let emitterPosition = { x: 0, y: 0, z: 0 };
    export let gravity = -0.1;
    export let turbulence = 0.5;
    export let enablePhysics = true;

    let canvas;
    let container;
    let scene, camera, renderer, particles;
    let clock = new THREE.Clock();
    let animationId;

    // Particle data arrays
    let positions, velocities, colors, sizes, lifetimes, ages;

    onMount(() => {
        init();
        createParticleSystem();
        animate();
    });

    onDestroy(() => {
        dispose();
    });

    function init() {
        const rect = container.getBoundingClientRect();

        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 1000);
        camera.position.z = 30;

        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
            const rect = container.getBoundingClientRect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(rect.width, rect.height);
        });
        resizeObserver.observe(container);
    }

    function createParticleSystem() {
        positions = new Float32Array(particleCount * 3);
        velocities = new Float32Array(particleCount * 3);
        colors = new Float32Array(particleCount * 3);
        sizes = new Float32Array(particleCount);
        lifetimes = new Float32Array(particleCount);
        ages = new Float32Array(particleCount);

        const colorStartVec = new THREE.Color(colorStart);
        const colorEndVec = new THREE.Color(colorEnd);

        for (let i = 0; i < particleCount; i++) {
            resetParticle(i, colorStartVec, colorEndVec);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('age', new THREE.BufferAttribute(ages, 1));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute vec3 customColor;
                attribute float size;
                attribute float age;
                attribute float lifetime;
                
                varying vec3 vColor;
                varying float vAge;
                varying float vLifetime;
                
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vColor = customColor;
                    vAge = age;
                    vLifetime = lifetime;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Size decreases as particle ages
                    float lifeRatio = 1.0 - (age / lifetime);
                    gl_PointSize = size * uPixelRatio * lifeRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAge;
                varying float vLifetime;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Soft glow with age falloff
                    float lifeRatio = 1.0 - (vAge / vLifetime);
                    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                    glow = pow(glow, 1.5);
                    
                    // Color shifts as particle ages
                    vec3 color = vColor * (0.5 + lifeRatio * 0.5);
                    
                    gl_FragColor = vec4(color, glow * lifeRatio);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function resetParticle(i, colorStartVec, colorEndVec) {
        const i3 = i * 3;
        
        // Position based on simulation type
        switch (simulationType) {
            case 'explosion':
                positions[i3] = emitterPosition.x;
                positions[i3 + 1] = emitterPosition.y;
                positions[i3 + 2] = emitterPosition.z;
                
                // Spherical velocity
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                const vel = 5 + Math.random() * 10;
                velocities[i3] = Math.sin(phi) * Math.cos(theta) * vel * speed;
                velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * vel * speed;
                velocities[i3 + 2] = Math.cos(phi) * vel * speed;
                break;
                
            case 'vortex':
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 2;
                positions[i3] = emitterPosition.x + Math.cos(angle) * radius;
                positions[i3 + 1] = emitterPosition.y - 15 + Math.random() * 2;
                positions[i3 + 2] = emitterPosition.z + Math.sin(angle) * radius;
                
                velocities[i3] = Math.sin(angle) * 2 * speed;
                velocities[i3 + 1] = 3 + Math.random() * 2 * speed;
                velocities[i3 + 2] = Math.cos(angle) * 2 * speed;
                break;
                
            case 'rain':
                positions[i3] = emitterPosition.x + (Math.random() - 0.5) * 40;
                positions[i3 + 1] = emitterPosition.y + 20 + Math.random() * 10;
                positions[i3 + 2] = emitterPosition.z + (Math.random() - 0.5) * 40;
                
                velocities[i3] = (Math.random() - 0.5) * 0.5;
                velocities[i3 + 1] = -10 - Math.random() * 5 * speed;
                velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
                break;
                
            case 'fire':
                const fireRadius = Math.random() * 3;
                const fireAngle = Math.random() * Math.PI * 2;
                positions[i3] = emitterPosition.x + Math.cos(fireAngle) * fireRadius;
                positions[i3 + 1] = emitterPosition.y - 10;
                positions[i3 + 2] = emitterPosition.z + Math.sin(fireAngle) * fireRadius;
                
                velocities[i3] = (Math.random() - 0.5) * 2;
                velocities[i3 + 1] = 5 + Math.random() * 8 * speed;
                velocities[i3 + 2] = (Math.random() - 0.5) * 2;
                break;
                
            case 'smoke':
                const smokeRadius = Math.random() * 2;
                const smokeAngle = Math.random() * Math.PI * 2;
                positions[i3] = emitterPosition.x + Math.cos(smokeAngle) * smokeRadius;
                positions[i3 + 1] = emitterPosition.y;
                positions[i3 + 2] = emitterPosition.z + Math.sin(smokeAngle) * smokeRadius;
                
                velocities[i3] = (Math.random() - 0.5) * 1;
                velocities[i3 + 1] = 1 + Math.random() * 2 * speed;
                velocities[i3 + 2] = (Math.random() - 0.5) * 1;
                break;
                
            case 'magic':
                const magicAngle = Math.random() * Math.PI * 2;
                const magicRadius = 5 + Math.random() * 3;
                const magicY = (Math.random() - 0.5) * 10;
                positions[i3] = emitterPosition.x + Math.cos(magicAngle) * magicRadius;
                positions[i3 + 1] = emitterPosition.y + magicY;
                positions[i3 + 2] = emitterPosition.z + Math.sin(magicAngle) * magicRadius;
                
                // Orbital velocity
                velocities[i3] = Math.sin(magicAngle) * 3 * speed;
                velocities[i3 + 1] = (Math.random() - 0.5) * 2;
                velocities[i3 + 2] = -Math.cos(magicAngle) * 3 * speed;
                break;
        }
        
        // Color interpolation
        const t = Math.random();
        const color = new THREE.Color().lerpColors(colorStartVec, colorEndVec, t);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Size and lifetime
        sizes[i] = (0.5 + Math.random() * 1.5) * size;
        lifetimes[i] = lifetime * (0.5 + Math.random() * 0.5);
        ages[i] = Math.random() * lifetimes[i]; // Stagger initial ages
    }

    function updateParticles(delta) {
        const colorStartVec = new THREE.Color(colorStart);
        const colorEndVec = new THREE.Color(colorEnd);
        const time = clock.getElapsedTime();

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Update age
            ages[i] += delta;
            
            // Reset dead particles
            if (ages[i] >= lifetimes[i]) {
                resetParticle(i, colorStartVec, colorEndVec);
                ages[i] = 0;
            }

            if (enablePhysics) {
                // Apply gravity
                velocities[i3 + 1] += gravity * delta * 60;
                
                // Apply turbulence (simplex noise approximation)
                const noiseX = Math.sin(positions[i3] * 0.1 + time) * turbulence;
                const noiseY = Math.cos(positions[i3 + 1] * 0.1 + time * 1.3) * turbulence;
                const noiseZ = Math.sin(positions[i3 + 2] * 0.1 + time * 0.7) * turbulence;
                
                velocities[i3] += noiseX * delta * 10;
                velocities[i3 + 1] += noiseY * delta * 10;
                velocities[i3 + 2] += noiseZ * delta * 10;
                
                // Vortex special handling
                if (simulationType === 'vortex' || simulationType === 'magic') {
                    const dx = positions[i3] - emitterPosition.x;
                    const dz = positions[i3 + 2] - emitterPosition.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist > 0.1) {
                        // Centripetal force
                        const force = 2 / (dist + 1);
                        velocities[i3] += (-dz / dist) * force * delta * 60;
                        velocities[i3 + 2] += (dx / dist) * force * delta * 60;
                    }
                }
                
                // Drag
                const drag = 0.99;
                velocities[i3] *= drag;
                velocities[i3 + 1] *= drag;
                velocities[i3 + 2] *= drag;
            }
            
            // Update position
            positions[i3] += velocities[i3] * delta;
            positions[i3 + 1] += velocities[i3 + 1] * delta;
            positions[i3 + 2] += velocities[i3 + 2] * delta;
        }

        // Update buffers
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.age.needsUpdate = true;
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        updateParticles(delta);
        
        particles.material.uniforms.uTime.value = clock.getElapsedTime();
        
        // Gentle camera rotation
        camera.position.x = Math.sin(clock.getElapsedTime() * 0.1) * 5;
        camera.lookAt(emitterPosition.x, emitterPosition.y, emitterPosition.z);
        
        renderer.render(scene, camera);
    }

    function dispose() {
        cancelAnimationFrame(animationId);
        if (particles) {
            particles.geometry.dispose();
            particles.material.dispose();
        }
        if (renderer) {
            renderer.dispose();
        }
    }

    // Expose trigger function
    export function trigger() {
        const colorStartVec = new THREE.Color(colorStart);
        const colorEndVec = new THREE.Color(colorEnd);
        
        for (let i = 0; i < particleCount; i++) {
            resetParticle(i, colorStartVec, colorEndVec);
            ages[i] = 0;
        }
    }
</script>

<div class="particle-container" bind:this={container}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .particle-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 400px;
        overflow: hidden;
    }

    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
