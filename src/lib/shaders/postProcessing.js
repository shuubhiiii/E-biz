// Post-processing shaders for enhanced visual effects

export const chromaticAberrationShader = {
    uniforms: {
        tDiffuse: { value: null },
        uIntensity: { value: 0.005 },
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uIntensity;
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
            vec2 center = vUv - 0.5;
            float dist = length(center);
            
            float intensity = uIntensity * (1.0 + sin(uTime) * 0.2);
            vec2 offset = center * dist * intensity;
            
            float r = texture2D(tDiffuse, vUv - offset).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv + offset).b;
            
            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `
};

export const filmGrainShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uIntensity: { value: 0.1 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;
        
        float random(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            float grain = random(vUv * uTime) * uIntensity;
            color.rgb += grain - uIntensity * 0.5;
            
            gl_FragColor = color;
        }
    `
};

export const vignetteShader = {
    uniforms: {
        tDiffuse: { value: null },
        uDarkness: { value: 0.5 },
        uOffset: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uDarkness;
        uniform float uOffset;
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            vec2 center = vUv - 0.5;
            float dist = length(center);
            
            float vignette = smoothstep(0.8 * uOffset, 0.2, dist);
            color.rgb = mix(color.rgb * (1.0 - uDarkness), color.rgb, vignette);
            
            gl_FragColor = color;
        }
    `
};

export const glitchShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uIntensity: { value: 0.3 },
        uSeed: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uIntensity;
        uniform float uSeed;
        varying vec2 vUv;
        
        float random(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
            vec2 uv = vUv;
            
            // Random horizontal shift
            float shiftAmount = random(vec2(uTime * 0.1, floor(vUv.y * 20.0))) * uIntensity;
            
            // Apply shift randomly
            if (random(vec2(uTime, uSeed)) > 0.9) {
                uv.x += shiftAmount * (random(vec2(floor(vUv.y * 50.0), uTime)) - 0.5);
            }
            
            // RGB split
            float r = texture2D(tDiffuse, uv + vec2(shiftAmount * 0.02, 0.0)).r;
            float g = texture2D(tDiffuse, uv).g;
            float b = texture2D(tDiffuse, uv - vec2(shiftAmount * 0.02, 0.0)).b;
            
            // Scanlines
            float scanline = sin(vUv.y * 500.0 + uTime * 10.0) * 0.02;
            
            gl_FragColor = vec4(r + scanline, g + scanline, b + scanline, 1.0);
        }
    `
};

export const bloomShader = {
    uniforms: {
        tDiffuse: { value: null },
        uThreshold: { value: 0.8 },
        uIntensity: { value: 1.5 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uThreshold;
        uniform float uIntensity;
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            
            // Extract bright areas
            float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            vec3 bloom = vec3(0.0);
            
            if (brightness > uThreshold) {
                bloom = (color.rgb - uThreshold) * uIntensity;
            }
            
            // Simple blur for bloom
            vec2 texelSize = vec2(1.0 / 1920.0, 1.0 / 1080.0);
            for (int i = -2; i <= 2; i++) {
                for (int j = -2; j <= 2; j++) {
                    vec2 offset = vec2(float(i), float(j)) * texelSize * 2.0;
                    vec4 sample = texture2D(tDiffuse, vUv + offset);
                    float sampleBrightness = dot(sample.rgb, vec3(0.299, 0.587, 0.114));
                    if (sampleBrightness > uThreshold) {
                        bloom += (sample.rgb - uThreshold) * uIntensity * 0.04;
                    }
                }
            }
            
            gl_FragColor = vec4(color.rgb + bloom, 1.0);
        }
    `
};

// Morphing blob shader for organic shapes
export const morphBlobShader = {
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: null },
        uColor1: { value: null },
        uColor2: { value: null },
        uColor3: { value: null }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        
        // 3D Simplex noise
        vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise3D(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
            float n_ = 1.0/7.0;
            vec3 ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
            vUv = uv;
            vNormal = normal;
            
            vec3 pos = position;
            
            // Multi-layer noise for organic deformation
            float noise1 = snoise3D(pos * 1.5 + uTime * 0.3) * 0.3;
            float noise2 = snoise3D(pos * 3.0 - uTime * 0.2) * 0.15;
            float noise3 = snoise3D(pos * 6.0 + uTime * 0.4) * 0.075;
            
            pos += normal * (noise1 + noise2 + noise3);
            
            vPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        void main() {
            // Gradient based on position
            float t = (vPosition.y + 1.5) / 3.0;
            vec3 color = mix(uColor1, uColor2, t);
            color = mix(color, uColor3, sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5);
            
            // Fresnel effect
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
            color += vec3(0.3, 0.5, 1.0) * fresnel * 0.5;
            
            // Pulsing
            float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
            color *= pulse;
            
            gl_FragColor = vec4(color, 0.9);
        }
    `
};

// Liquid metal shader
export const liquidMetalShader = {
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: null },
        uEnvMap: { value: null }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
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
        
        void main() {
            vec3 viewDir = normalize(vViewPosition);
            vec3 normal = normalize(vNormal);
            
            // Reflection
            vec3 reflection = reflect(-viewDir, normal);
            
            // Animated rainbow gradient
            float t = reflection.x * 0.5 + 0.5 + uTime * 0.2;
            vec3 color = vec3(
                sin(t * 6.28) * 0.5 + 0.5,
                sin(t * 6.28 + 2.09) * 0.5 + 0.5,
                sin(t * 6.28 + 4.19) * 0.5 + 0.5
            );
            
            // Metallic sheen
            float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 5.0);
            color = mix(color * 0.3, color, fresnel);
            
            // Specular highlight
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            float specular = pow(max(dot(reflection, lightDir), 0.0), 32.0);
            color += vec3(1.0) * specular * 0.5;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

// Plasma shader
export const plasmaShader = {
    uniforms: {
        uTime: { value: 0 },
        uResolution: { value: null },
        uColor1: { value: null },
        uColor2: { value: null },
        uColor3: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv;
            
            // Multiple plasma waves
            float v1 = sin(uv.x * 10.0 + uTime);
            float v2 = sin(10.0 * (uv.x * sin(uTime * 0.5) + uv.y * cos(uTime * 0.3)) + uTime);
            float v3 = sin(sqrt(100.0 * ((uv.x - 0.5) * (uv.x - 0.5) + (uv.y - 0.5) * (uv.y - 0.5)) + 1.0) + uTime);
            float v4 = sin(sqrt(50.0 * ((uv.x - cos(uTime)) * (uv.x - cos(uTime)) + (uv.y - sin(uTime)) * (uv.y - sin(uTime))) + 1.0) + uTime);
            
            float v = (v1 + v2 + v3 + v4) * 0.25;
            
            // Color mapping
            vec3 color = mix(uColor1, uColor2, v * 0.5 + 0.5);
            color = mix(color, uColor3, sin(v * 3.14159) * 0.5 + 0.5);
            
            gl_FragColor = vec4(color, 0.8);
        }
    `
};
