<script>
    import BlenderModel from '$lib/components/BlenderModel.svelte';
    import HoudiniParticles from '$lib/components/HoudiniParticles.svelte';
    import CTASection from '$lib/components/CTASection.svelte';
    import { gsapAnimate, gsapHover, gsapTilt } from '$lib/actions/gsapAction.js';

    let activeParticleType = 'explosion';
    let particleComponent;

    const particleTypes = [
        { id: 'explosion', label: 'Explosion', icon: 'fas fa-bomb' },
        { id: 'vortex', label: 'Vortex', icon: 'fas fa-hurricane' },
        { id: 'fire', label: 'Fire', icon: 'fas fa-fire' },
        { id: 'smoke', label: 'Smoke', icon: 'fas fa-smog' },
        { id: 'rain', label: 'Rain', icon: 'fas fa-cloud-rain' },
        { id: 'magic', label: 'Magic', icon: 'fas fa-wand-magic-sparkles' }
    ];

    const showcaseModels = [
        {
            title: 'Product Visualization',
            description: 'High-fidelity 3D product renders with realistic materials and lighting.',
            features: ['PBR Materials', 'HDR Lighting', 'Interactive Controls']
        },
        {
            title: 'Architectural Viz',
            description: 'Stunning architectural visualizations for real estate and construction.',
            features: ['Accurate Lighting', 'Material Library', 'Walkthrough Support']
        },
        {
            title: 'Character Models',
            description: 'Animated characters with skeletal rigs and morph targets.',
            features: ['Skeletal Animation', 'Facial Rigs', 'Blend Shapes']
        }
    ];

    function triggerParticles() {
        if (particleComponent) {
            particleComponent.trigger();
        }
    }
</script>

<svelte:head>
    <title>3D Content Showcase - e-Biz Technocrats</title>
    <meta name="description" content="Explore our 3D content integration capabilities with Blender and Houdini assets.">
</svelte:head>

<!-- Hero Section -->
<section class="hero-3d">
    <div class="hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">3D Content Integration</span>
        <h1>Blender & Houdini<br><span class="gradient-text">for the Web</span></h1>
        <p>Stunning 3D experiences powered by professional-grade content from Blender and Houdini, seamlessly integrated into web applications.</p>
    </div>
</section>

<!-- Particle Simulation Section -->
<section class="particle-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Houdini-Style Effects</span>
        <h2>Particle Simulations</h2>
        <p>Real-time particle systems inspired by Houdini's powerful simulation tools</p>
    </div>

    <div class="particle-demo">
        <div class="particle-viewport" use:gsapAnimate={{ type: 'scaleIn', delay: 0.3 }}>
            <HoudiniParticles 
                bind:this={particleComponent}
                simulationType={activeParticleType}
                particleCount={30000}
                colorStart="#6366f1"
                colorEnd="#00ff88"
                speed={1}
                lifetime={4}
            />
        </div>

        <div class="particle-controls">
            <h3>Simulation Type</h3>
            <div class="type-buttons">
                {#each particleTypes as type, i}
                    <button 
                        class="type-btn" 
                        class:active={activeParticleType === type.id}
                        on:click={() => activeParticleType = type.id}
                        use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.05 }}
                        use:gsapHover={{ scale: 1.05, y: -2 }}
                    >
                        <i class={type.icon}></i>
                        <span>{type.label}</span>
                    </button>
                {/each}
            </div>
            
            <button class="trigger-btn" on:click={triggerParticles} use:gsapHover={{ scale: 1.05 }}>
                <i class="fas fa-play"></i> Trigger Effect
            </button>
        </div>
    </div>
</section>

<!-- 3D Model Section -->
<section class="model-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Blender Integration</span>
        <h2>3D Model Showcase</h2>
        <p>Load and interact with Blender models directly in the browser</p>
    </div>

    <div class="model-grid">
        {#each showcaseModels as model, i}
            <div class="model-card" use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.1 }} use:gsapTilt={{ max: 10 }}>
                <div class="model-preview">
                    <BlenderModel 
                        autoRotate={true}
                        enableControls={true}
                        ambientIntensity={0.6}
                        directionalIntensity={1.2}
                    />
                    <div class="model-overlay">
                        <span class="hint">Drag to rotate</span>
                    </div>
                </div>
                <div class="model-info">
                    <h3>{model.title}</h3>
                    <p>{model.description}</p>
                    <ul class="feature-tags">
                        {#each model.features as feature}
                            <li>{feature}</li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/each}
    </div>
</section>

<!-- Capabilities Section -->
<section class="capabilities-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">What We Support</span>
        <h2>3D Pipeline Capabilities</h2>
    </div>

    <div class="capabilities-grid">
        <div class="capability-card" use:gsapAnimate={{ type: 'fadeInLeft' }}>
            <div class="capability-icon">
                <i class="fas fa-cube"></i>
            </div>
            <h3>Blender Models</h3>
            <ul>
                <li>GLTF/GLB Export</li>
                <li>PBR Materials</li>
                <li>Skeletal Animations</li>
                <li>Morph Targets</li>
                <li>Draco Compression</li>
            </ul>
        </div>

        <div class="capability-card" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.1 }}>
            <div class="capability-icon houdini">
                <i class="fas fa-wind"></i>
            </div>
            <h3>Houdini FX</h3>
            <ul>
                <li>Particle Systems</li>
                <li>Fluid Simulations</li>
                <li>Destruction FX</li>
                <li>Point Clouds</li>
                <li>Procedural Content</li>
            </ul>
        </div>

        <div class="capability-card" use:gsapAnimate={{ type: 'fadeInRight', delay: 0.2 }}>
            <div class="capability-icon web">
                <i class="fas fa-globe"></i>
            </div>
            <h3>Web Integration</h3>
            <ul>
                <li>Three.js Rendering</li>
                <li>WebGL 2.0</li>
                <li>Real-time Shadows</li>
                <li>HDR Environment</li>
                <li>Post-processing</li>
            </ul>
        </div>
    </div>
</section>

<!-- Workflow Section -->
<section class="workflow-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Our Process</span>
        <h2>3D Production Workflow</h2>
    </div>

    <div class="workflow-steps">
        <div class="workflow-step" use:gsapAnimate={{ type: 'fadeInUp', delay: 0 }}>
            <div class="step-number">01</div>
            <h3>Model Creation</h3>
            <p>High-quality 3D models created in Blender with optimized topology for web performance.</p>
        </div>

        <div class="workflow-step" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.1 }}>
            <div class="step-number">02</div>
            <h3>Material Setup</h3>
            <p>PBR materials with albedo, normal, metallic, and roughness maps for realistic rendering.</p>
        </div>

        <div class="workflow-step" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.2 }}>
            <div class="step-number">03</div>
            <h3>Animation</h3>
            <p>Skeletal animations, morph targets, and procedural animations for dynamic content.</p>
        </div>

        <div class="workflow-step" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.3 }}>
            <div class="step-number">04</div>
            <h3>Optimization</h3>
            <p>Draco compression, LOD systems, and texture optimization for fast loading.</p>
        </div>

        <div class="workflow-step" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.4 }}>
            <div class="step-number">05</div>
            <h3>Integration</h3>
            <p>Seamless integration with your web application using our custom components.</p>
        </div>
    </div>
</section>

<CTASection />

<style>
    .hero-3d {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 150px 5% 80px;
    }

    .hero-content {
        max-width: 800px;
    }

    .section-tag {
        display: inline-block;
        padding: 8px 20px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50px;
        font-size: 0.875rem;
        color: var(--accent);
        margin-bottom: 20px;
    }

    h1 {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 900;
        line-height: 1.1;
        margin-bottom: 20px;
    }

    .gradient-text {
        background: linear-gradient(135deg, var(--primary), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-content > p {
        font-size: 1.2rem;
        color: var(--text-muted);
        max-width: 600px;
        margin: 0 auto;
    }

    /* Particle Section */
    .particle-section {
        padding: 80px 5%;
    }

    .section-header {
        text-align: center;
        margin-bottom: 50px;
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 15px;
    }

    .section-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
    }

    .particle-demo {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .particle-viewport {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        overflow: hidden;
        min-height: 500px;
    }

    .particle-controls {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 25px;
    }

    .particle-controls h3 {
        font-size: 1rem;
        color: var(--text-muted);
        margin-bottom: 15px;
    }

    .type-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 25px;
    }

    .type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 15px 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.3s;
    }

    .type-btn:hover {
        background: rgba(99, 102, 241, 0.1);
        color: var(--text);
    }

    .type-btn.active {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border-color: transparent;
    }

    .type-btn i {
        font-size: 1.2rem;
    }

    .type-btn span {
        font-size: 0.8rem;
    }

    .trigger-btn {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, var(--accent), #22c55e);
        border: none;
        border-radius: 12px;
        color: var(--dark);
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s;
    }

    .trigger-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--glow-accent);
    }

    /* Model Section */
    .model-section {
        padding: 80px 5%;
        background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.03));
    }

    .model-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .model-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        overflow: hidden;
    }

    .model-preview {
        height: 300px;
        position: relative;
        background: linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(26, 26, 46, 0.9));
    }

    .model-overlay {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--glass);
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.75rem;
        color: var(--text-muted);
        pointer-events: none;
    }

    .model-info {
        padding: 25px;
    }

    .model-info h3 {
        font-size: 1.3rem;
        margin-bottom: 10px;
    }

    .model-info p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 15px;
    }

    .feature-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        list-style: none;
    }

    .feature-tags li {
        padding: 5px 12px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 20px;
        font-size: 0.75rem;
        color: var(--primary);
    }

    /* Capabilities Section */
    .capabilities-section {
        padding: 80px 5%;
    }

    .capabilities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .capability-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
    }

    .capability-icon {
        width: 70px;
        height: 70px;
        margin: 0 auto 20px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
    }

    .capability-icon.houdini {
        background: linear-gradient(135deg, #ff6b35, #f7931e);
    }

    .capability-icon.web {
        background: linear-gradient(135deg, var(--accent), #22c55e);
    }

    .capability-card h3 {
        font-size: 1.3rem;
        margin-bottom: 15px;
    }

    .capability-card ul {
        list-style: none;
        text-align: left;
    }

    .capability-card li {
        padding: 8px 0;
        color: var(--text-muted);
        border-bottom: 1px solid var(--glass-border);
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .capability-card li:last-child {
        border-bottom: none;
    }

    .capability-card li::before {
        content: '✓';
        color: var(--accent);
        font-weight: bold;
    }

    /* Workflow Section */
    .workflow-section {
        padding: 80px 5%;
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.03), transparent);
    }

    .workflow-steps {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .workflow-step {
        flex: 1;
        min-width: 200px;
        max-width: 220px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 25px;
        text-align: center;
    }

    .step-number {
        font-size: 2.5rem;
        font-weight: 900;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 15px;
    }

    .workflow-step h3 {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }

    .workflow-step p {
        font-size: 0.9rem;
        color: var(--text-muted);
        line-height: 1.6;
    }

    @media (max-width: 968px) {
        .particle-demo {
            grid-template-columns: 1fr;
        }

        .particle-viewport {
            min-height: 400px;
        }

        .type-buttons {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 640px) {
        .type-buttons {
            grid-template-columns: repeat(2, 1fr);
        }

        .workflow-steps {
            flex-direction: column;
            align-items: center;
        }

        .workflow-step {
            max-width: 100%;
        }
    }
</style>
