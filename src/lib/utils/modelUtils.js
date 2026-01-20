/**
 * 3D Model Utilities for Blender/Houdini Content
 * 
 * This module provides utilities for working with 3D content exported from:
 * - Blender (GLTF/GLB format)
 * - Houdini (Alembic/OBJ/VDB via converters)
 */

import * as THREE from 'three';

/**
 * Recommended export settings for Blender:
 * 
 * Format: GLTF 2.0 (.glb for single file)
 * 
 * Include:
 * - ✓ Selected Objects / Visible Objects
 * - ✓ Custom Properties
 * - ✓ Cameras (optional)
 * - ✓ Punctual Lights (optional)
 * 
 * Transform:
 * - +Y Up
 * - Apply Modifiers
 * 
 * Geometry:
 * - ✓ Apply Modifiers
 * - ✓ UVs
 * - ✓ Normals
 * - ✓ Tangents (for normal maps)
 * - ✓ Vertex Colors
 * - ✓ Materials
 * - ✓ Compression (Draco)
 * 
 * Animation:
 * - ✓ Animations
 * - ✓ Shape Keys (for morph targets)
 * - ✓ Skinning
 */

// Placeholder geometries that simulate common Blender exports
export function createPlaceholderModels() {
    return {
        // Stylized character placeholder
        character: createStylizedCharacter(),
        
        // Product visualization placeholder
        product: createProductModel(),
        
        // Architectural placeholder
        architecture: createArchitecturalModel(),
        
        // Abstract art placeholder
        abstract: createAbstractModel(),
        
        // Logo/brand placeholder
        logo: createLogoModel()
    };
}

function createStylizedCharacter() {
    const group = new THREE.Group();
    
    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.1,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    group.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
        color: 0xffd4a3,
        metalness: 0,
        roughness: 0.7
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;
    group.add(head);
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 2.55, 0.35);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 2.55, 0.35);
    group.add(rightEye);
    
    return group;
}

function createProductModel() {
    const group = new THREE.Group();
    
    // Phone-like device
    const phoneGeo = new THREE.BoxGeometry(0.8, 1.6, 0.08);
    const phoneMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        metalness: 0.9,
        roughness: 0.1
    });
    const phone = new THREE.Mesh(phoneGeo, phoneMat);
    group.add(phone);
    
    // Screen
    const screenGeo = new THREE.PlaneGeometry(0.7, 1.4);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0f,
        emissive: 0x6366f1,
        emissiveIntensity: 0.2
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.041;
    group.add(screen);
    
    // Camera bump
    const cameraGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
    const cameraMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    const camera = new THREE.Mesh(cameraGeo, cameraMat);
    camera.rotation.x = Math.PI / 2;
    camera.position.set(-0.25, 0.6, -0.05);
    group.add(camera);
    
    return group;
}

function createArchitecturalModel() {
    const group = new THREE.Group();
    
    // Building base
    const baseGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const baseMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        metalness: 0.5,
        roughness: 0.5
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);
    
    // Main tower
    const towerGeo = new THREE.BoxGeometry(1.5, 5, 1.5);
    const towerMat = new THREE.MeshStandardMaterial({
        color: 0x4a4a5a,
        metalness: 0.3,
        roughness: 0.6
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 2.6;
    group.add(tower);
    
    // Glass panels
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < 4; i++) {
        const glassGeo = new THREE.PlaneGeometry(1.3, 0.8);
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.y = 1 + i * 1.2;
        glass.position.z = 0.76;
        group.add(glass);
    }
    
    return group;
}

function createAbstractModel() {
    const group = new THREE.Group();
    
    // Torus knot
    const knotGeo = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
    const knotMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.7,
        roughness: 0.2
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    group.add(knot);
    
    // Orbiting spheres
    for (let i = 0; i < 5; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x00ff88,
            emissiveIntensity: 0.2
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        
        const angle = (i / 5) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 2;
        sphere.position.z = Math.sin(angle) * 2;
        sphere.position.y = Math.sin(angle * 2) * 0.5;
        
        group.add(sphere);
    }
    
    return group;
}

function createLogoModel() {
    const group = new THREE.Group();
    
    // e-Biz "e" shape approximation
    const ringGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32, Math.PI * 1.5);
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.6,
        roughness: 0.3
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.z = Math.PI / 4;
    group.add(ring);
    
    // Middle bar
    const barGeo = new THREE.BoxGeometry(0.8, 0.15, 0.2);
    const bar = new THREE.Mesh(barGeo, ringMat);
    bar.position.x = 0.2;
    group.add(bar);
    
    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0.6, -0.5, 0);
    group.add(glow);
    
    return group;
}

/**
 * Material presets for imported models
 */
export const materialPresets = {
    holographic: (color = 0x6366f1) => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(color) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
                float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                
                vec3 color = uColor;
                color += vec3(sin(vUv.y * 50.0 + uTime * 5.0) * 0.1);
                color = mix(color, vec3(0.0, 1.0, 0.5), fresnel * 0.5);
                
                float scanline = sin(vPosition.y * 20.0 + uTime * 3.0) * 0.05 + 0.95;
                color *= scanline;
                
                gl_FragColor = vec4(color, 0.8 + fresnel * 0.2);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    }),
    
    glass: (color = 0x6366f1) => new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0,
        roughness: 0,
        transmission: 0.9,
        thickness: 0.5,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0
    }),
    
    neon: (color = 0x00ff88) => new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        metalness: 0.5,
        roughness: 0.2
    }),
    
    chrome: () => new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0,
        envMapIntensity: 1.5
    }),
    
    matte: (color = 0x6366f1) => new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0,
        roughness: 1
    })
};

/**
 * Animation utilities for imported models
 */
export const animationUtils = {
    // Rotate model continuously
    rotate: (model, speed = { x: 0, y: 0.01, z: 0 }) => {
        return () => {
            model.rotation.x += speed.x;
            model.rotation.y += speed.y;
            model.rotation.z += speed.z;
        };
    },
    
    // Float up and down
    float: (model, amplitude = 0.5, frequency = 1) => {
        const startY = model.position.y;
        return (time) => {
            model.position.y = startY + Math.sin(time * frequency) * amplitude;
        };
    },
    
    // Pulse scale
    pulse: (model, min = 0.95, max = 1.05, speed = 2) => {
        return (time) => {
            const scale = min + (max - min) * (Math.sin(time * speed) * 0.5 + 0.5);
            model.scale.setScalar(scale);
        };
    },
    
    // Orbit around point
    orbit: (model, center = new THREE.Vector3(), radius = 5, speed = 1) => {
        return (time) => {
            model.position.x = center.x + Math.cos(time * speed) * radius;
            model.position.z = center.z + Math.sin(time * speed) * radius;
        };
    }
};

/**
 * VDB/Volume utilities (for Houdini smoke/fire simulations)
 * Note: Actual VDB support requires conversion to textures or point clouds
 */
export function createVolumetricEffect(type = 'smoke', resolution = 64) {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    
    // Volumetric raymarching shader
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: resolution },
            uDensity: { value: type === 'smoke' ? 0.5 : 1.0 },
            uColor: { value: new THREE.Color(type === 'smoke' ? 0x888888 : 0xff4400) }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            void main() {
                vPosition = position;
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uResolution;
            uniform float uDensity;
            uniform vec3 uColor;
            
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            // 3D noise function
            float hash(vec3 p) {
                p = fract(p * vec3(443.897, 441.423, 437.195));
                p += dot(p, p.yzx + 19.19);
                return fract((p.x + p.y) * p.z);
            }
            
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                
                return mix(
                    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
                    f.z
                );
            }
            
            float fbm(vec3 p) {
                float value = 0.0;
                float amplitude = 0.5;
                
                for (int i = 0; i < 5; i++) {
                    value += amplitude * noise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                
                return value;
            }
            
            void main() {
                vec3 rayDir = normalize(vPosition);
                float density = 0.0;
                
                // Simple raymarching
                for (int i = 0; i < 32; i++) {
                    vec3 samplePos = vPosition + rayDir * float(i) * 0.1;
                    float d = fbm(samplePos * 0.5 + uTime * 0.2);
                    
                    // Sphere falloff
                    float dist = length(samplePos) / 5.0;
                    d *= smoothstep(1.0, 0.0, dist);
                    
                    density += d * uDensity * 0.02;
                }
                
                vec3 color = uColor * density;
                float alpha = min(density, 0.8);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false
    });

    return new THREE.Mesh(geometry, material);
}
