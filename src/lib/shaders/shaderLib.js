/**
 * Custom Shader Library
 * Advanced GLSL shaders for procedural graphics
 */

// Noise functions for procedural generation
export const noiseUtils = `
    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
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

    // 3D Simplex noise
    vec4 permute4(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise3(vec3 v) {
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
        vec4 p = permute4(permute4(permute4(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
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

    // FBM (Fractal Brownian Motion)
    float fbm(vec2 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 8; i++) {
            if(i >= octaves) break;
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    float fbm3(vec3 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 8; i++) {
            if(i >= octaves) break;
            value += amplitude * snoise3(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    // Voronoi noise
    vec2 hash2(vec2 p) {
        return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    float voronoi(vec2 p) {
        vec2 n = floor(p);
        vec2 f = fract(p);
        float md = 8.0;
        for(int j = -1; j <= 1; j++) {
            for(int i = -1; i <= 1; i++) {
                vec2 g = vec2(float(i), float(j));
                vec2 o = hash2(n + g);
                vec2 r = g + o - f;
                float d = dot(r, r);
                md = min(md, d);
            }
        }
        return sqrt(md);
    }
`;

// Holographic/Iridescent shader
export const holographicShader = {
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime;

        ${noiseUtils}

        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            
            vec3 pos = position;
            
            // Procedural displacement
            float noise = snoise(vec2(pos.x * 2.0 + uTime * 0.5, pos.y * 2.0)) * 0.1;
            pos += normal * noise;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vViewPosition = -mvPosition.xyz;
            vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
            
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        ${noiseUtils}

        void main() {
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
            
            // Iridescent color shift
            float colorShift = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
            colorShift += snoise(vUv * 5.0 + uTime * 0.2) * 0.3;
            
            vec3 color1 = uColor1;
            vec3 color2 = uColor2;
            vec3 color3 = uColor3;
            
            vec3 iridescence = mix(color1, color2, colorShift);
            iridescence = mix(iridescence, color3, sin(colorShift * 3.14159) * 0.5 + 0.5);
            
            // Holographic scan lines
            float scanLine = sin(vWorldPosition.y * 50.0 + uTime * 5.0) * 0.1 + 0.9;
            
            // Edge glow
            float edgeGlow = fresnel * 2.0;
            
            vec3 finalColor = iridescence * scanLine + edgeGlow * color2;
            float alpha = 0.6 + fresnel * 0.4;
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};

// Nebula/Cosmic shader
export const nebulaShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        ${noiseUtils}

        void main() {
            vec2 uv = vUv;
            
            // Multi-layered FBM noise for nebula clouds
            float n1 = fbm(uv * 3.0 + uTime * 0.1, 6);
            float n2 = fbm(uv * 5.0 - uTime * 0.15, 5);
            float n3 = fbm(uv * 8.0 + vec2(uTime * 0.08, -uTime * 0.1), 4);
            
            // Combine noise layers
            float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
            nebula = smoothstep(0.0, 1.0, nebula + 0.3);
            
            // Voronoi for stars
            float stars = voronoi(uv * 30.0);
            stars = pow(1.0 - stars, 20.0);
            
            // Color mixing
            vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
            color = mix(color, uColor3, n2 * 0.5 + 0.5);
            
            // Add glow
            float glow = fbm(uv * 2.0 + uTime * 0.05, 3) * 0.5 + 0.5;
            color += uColor2 * glow * 0.3;
            
            // Add stars
            color += vec3(stars);
            
            float alpha = nebula * 0.8 + stars;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

// Energy field/Force field shader
export const energyFieldShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;

        ${noiseUtils}

        void main() {
            vUv = uv;
            vNormal = normal;
            vPosition = position;
            
            vec3 pos = position;
            
            // Wave displacement
            float wave = sin(pos.y * 5.0 + uTime * 2.0) * 0.05;
            wave += snoise(pos.xy * 3.0 + uTime) * 0.02;
            pos += normal * wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor;

        ${noiseUtils}

        void main() {
            // Hex pattern
            vec2 hexUv = vUv * 20.0;
            vec2 hexId = floor(hexUv);
            vec2 hexF = fract(hexUv) - 0.5;
            
            float hexDist = max(abs(hexF.x), abs(hexF.y * 0.866 + hexF.x * 0.5));
            hexDist = max(hexDist, abs(hexF.y * 0.866 - hexF.x * 0.5));
            
            float hexLine = smoothstep(0.4, 0.45, hexDist);
            
            // Energy flow
            float flow = snoise(vUv * 10.0 + vec2(0.0, -uTime * 2.0));
            flow = smoothstep(0.2, 0.8, flow);
            
            // Pulse effect
            float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
            
            // Edge detection
            float edge = 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
            
            vec3 color = uColor * (hexLine * 0.5 + flow * pulse);
            color += uColor * edge * 0.5;
            
            float alpha = (hexLine * 0.3 + flow * 0.5) * pulse;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

// Data stream/Matrix shader
export const dataStreamShader = {
    vertexShader: `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float character(float n, vec2 p) {
            p = floor(p * vec2(4.0, 4.0) + 2.5);
            if(clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y) {
                float char = mod(floor(n / exp2(p.x + 5.0 * p.y)), 2.0);
                return char;
            }
            return 0.0;
        }

        void main() {
            vec2 uv = vUv;
            vec2 grid = vec2(40.0, 80.0);
            vec2 cell = floor(uv * grid);
            vec2 cellUv = fract(uv * grid);
            
            // Column speed variation
            float speed = random(vec2(cell.x, 0.0)) * 2.0 + 1.0;
            float offset = random(vec2(cell.x, 1.0)) * 100.0;
            
            // Scrolling
            float scroll = mod(uTime * speed + offset, grid.y + 20.0);
            float y = cell.y + scroll;
            
            // Character variation
            float charSeed = random(vec2(cell.x, floor(y)));
            float char = character(charSeed * 65535.0, cellUv - 0.5);
            
            // Fade trail
            float trail = smoothstep(0.0, 20.0, scroll - cell.y);
            trail *= smoothstep(grid.y + 20.0, grid.y, scroll - cell.y);
            
            // Head glow
            float head = smoothstep(2.0, 0.0, abs(scroll - cell.y - grid.y));
            
            vec3 color = uColor * char * trail;
            color += vec3(1.0) * char * head;
            
            // Scanline effect
            float scanline = sin(uv.y * 800.0) * 0.04 + 0.96;
            color *= scanline;
            
            gl_FragColor = vec4(color, char * trail + head);
        }
    `
};

// Aurora/Plasma shader
export const auroraShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        ${noiseUtils}

        void main() {
            vec2 uv = vUv;
            
            // Multiple wave layers
            float wave1 = sin(uv.x * 5.0 + uTime + snoise(uv * 2.0 + uTime * 0.3) * 2.0);
            float wave2 = sin(uv.x * 3.0 - uTime * 0.7 + snoise(uv * 3.0 - uTime * 0.2) * 1.5);
            float wave3 = sin(uv.x * 7.0 + uTime * 0.5 + snoise(uv * 4.0 + uTime * 0.4) * 1.0);
            
            // Combine waves for aurora shape
            float aurora = wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25;
            aurora = aurora * 0.5 + 0.5;
            
            // Vertical falloff
            float falloff = smoothstep(0.0, 0.5, uv.y) * smoothstep(1.0, 0.5, uv.y);
            
            // Aurora bands
            float band = smoothstep(aurora - 0.1, aurora, uv.y) * smoothstep(aurora + 0.3, aurora, uv.y);
            
            // Color gradient based on height and noise
            float colorMix = snoise(vec2(uv.x * 3.0 + uTime * 0.2, uTime * 0.1));
            vec3 color = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, colorMix));
            color = mix(color, uColor3, smoothstep(0.3, 0.7, uv.y + colorMix * 0.2));
            
            // Shimmer effect
            float shimmer = snoise(uv * 20.0 + uTime * 2.0) * 0.1 + 0.9;
            
            float alpha = band * falloff * shimmer;
            color *= shimmer;
            
            gl_FragColor = vec4(color, alpha * 0.7);
        }
    `
};

// Wormhole/Portal shader
export const wormholeShader = {
    vertexShader: `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        ${noiseUtils}

        void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            float angle = atan(uv.y, uv.x);
            
            // Spiral distortion
            float spiral = angle + dist * 10.0 - uTime * 2.0;
            float spiralNoise = snoise(vec2(spiral * 2.0, dist * 5.0 + uTime));
            
            // Tunnel rings
            float rings = sin(dist * 30.0 - uTime * 5.0 + spiralNoise * 2.0);
            rings = smoothstep(0.0, 0.5, rings);
            
            // Central glow
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            glow = pow(glow, 2.0);
            
            // Edge darkness
            float edge = smoothstep(0.5, 0.3, dist);
            
            // Swirling particles
            float particles = snoise(vec2(angle * 5.0 + uTime, dist * 10.0 - uTime * 3.0));
            particles = smoothstep(0.5, 1.0, particles);
            
            vec3 color = mix(uColor1, uColor2, rings);
            color += uColor2 * glow * 2.0;
            color += vec3(particles * 0.5);
            
            float alpha = edge * (rings * 0.5 + glow + particles * 0.3);
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

// Particle field with procedural motion
export const proceduralParticleShader = {
    vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        attribute float seed;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        uniform float uTime;
        uniform float uPixelRatio;

        ${noiseUtils}

        void main() {
            vColor = customColor;
            
            vec3 pos = position;
            
            // Procedural motion based on seed
            float t = uTime * 0.5 + seed * 100.0;
            pos.x += snoise(vec2(t, seed)) * 5.0;
            pos.y += snoise(vec2(t + 100.0, seed)) * 5.0;
            pos.z += snoise(vec2(t + 200.0, seed)) * 5.0;
            
            // Orbital motion
            float orbitSpeed = seed * 0.5 + 0.2;
            float orbitRadius = length(position.xz);
            float angle = atan(position.z, position.x) + uTime * orbitSpeed;
            pos.x = cos(angle) * orbitRadius + snoise(vec2(t * 0.3, seed * 2.0)) * 2.0;
            pos.z = sin(angle) * orbitRadius + snoise(vec2(t * 0.3 + 50.0, seed * 2.0)) * 2.0;
            
            // Vertical wave
            pos.y += sin(uTime * 2.0 + seed * 6.28) * 2.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            float sizeAtten = 300.0 / -mvPosition.z;
            gl_PointSize = size * uPixelRatio * sizeAtten;
            
            // Distance fade
            vAlpha = smoothstep(100.0, 20.0, -mvPosition.z) * 0.8;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;

        void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            
            if(dist > 0.5) discard;
            
            // Soft glow
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            glow = pow(glow, 1.5);
            
            // Core - reduced brightness
            float core = 1.0 - smoothstep(0.0, 0.15, dist);
            
            vec3 color = vColor * glow * 0.6 + vec3(1.0) * core * 0.2; // Reduced intensity
            float alpha = glow * vAlpha * 0.4; // Much lower alpha
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

// Terrain/Landscape shader
export const terrainShader = {
    vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vNormal;
        
        uniform float uTime;
        uniform float uElevationScale;

        ${noiseUtils}

        void main() {
            vUv = uv;
            
            vec3 pos = position;
            
            // Multi-octave terrain
            float elevation = fbm(uv * 4.0 + uTime * 0.05, 6) * uElevationScale;
            elevation += fbm(uv * 8.0 - uTime * 0.03, 4) * uElevationScale * 0.3;
            
            pos.z = elevation;
            vElevation = elevation / uElevationScale;
            
            // Calculate normal from neighbors
            float delta = 0.01;
            float elevL = fbm((uv + vec2(-delta, 0.0)) * 4.0 + uTime * 0.05, 6) * uElevationScale;
            float elevR = fbm((uv + vec2(delta, 0.0)) * 4.0 + uTime * 0.05, 6) * uElevationScale;
            float elevU = fbm((uv + vec2(0.0, delta)) * 4.0 + uTime * 0.05, 6) * uElevationScale;
            float elevD = fbm((uv + vec2(0.0, -delta)) * 4.0 + uTime * 0.05, 6) * uElevationScale;
            
            vec3 tangent = normalize(vec3(delta * 2.0, 0.0, elevR - elevL));
            vec3 bitangent = normalize(vec3(0.0, delta * 2.0, elevU - elevD));
            vNormal = normalize(cross(tangent, bitangent));
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vNormal;
        
        uniform float uTime;
        uniform vec3 uColorLow;
        uniform vec3 uColorMid;
        uniform vec3 uColorHigh;

        ${noiseUtils}

        void main() {
            // Height-based coloring
            vec3 color = mix(uColorLow, uColorMid, smoothstep(-0.3, 0.2, vElevation));
            color = mix(color, uColorHigh, smoothstep(0.3, 0.8, vElevation));
            
            // Simple lighting
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            float diffuse = max(dot(vNormal, lightDir), 0.0);
            
            // Grid lines
            vec2 grid = abs(fract(vUv * 30.0 - 0.5) - 0.5);
            float gridLine = smoothstep(0.02, 0.05, min(grid.x, grid.y));
            
            color *= (diffuse * 0.6 + 0.4);
            color *= gridLine * 0.5 + 0.5;
            
            // Glow at peaks
            float peakGlow = smoothstep(0.5, 1.0, vElevation);
            color += uColorHigh * peakGlow * 0.3;
            
            gl_FragColor = vec4(color, 0.9);
        }
    `
};

export default {
    noiseUtils,
    holographicShader,
    nebulaShader,
    energyFieldShader,
    dataStreamShader,
    auroraShader,
    wormholeShader,
    proceduralParticleShader,
    terrainShader
};
