<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import StatsSection from '$lib/components/StatsSection.svelte';
    import ServicesPreview from '$lib/components/ServicesPreview.svelte';
    import FeaturesGrid from '$lib/components/FeaturesGrid.svelte';
    import CTASection from '$lib/components/CTASection.svelte';
    import { gsapAnimate, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';

    let visible = false;
    let mounted = false;

    onMount(() => {
        mounted = true;
        setTimeout(() => visible = true, 100);
    });
</script>

<!-- Hero Section -->
<section class="hero">
    {#if visible}
        <div class="hero-content" in:fly={{ y: 50, duration: 800, delay: 200 }}>
            <div 
                class="hero-tag" 
                use:gsapAnimate={{ type: 'fadeInUp', delay: 0.3, scrollTrigger: false }}
            >
                🚀 Transforming Ideas Into Digital Reality
            </div>
            <h1 
                class="hero-title"
                use:gsapSplitText={{ type: 'words', animation: 'fadeInUp', stagger: 0.08, delay: 0.5, scrollTrigger: false }}
            >
                We Build Innovative Digital Solutions
            </h1>
            <p 
                class="hero-text"
                use:gsapAnimate={{ type: 'fadeInUp', delay: 0.8, scrollTrigger: false }}
            >
                From cutting-edge software development to transformative digital marketing, 
                we deliver excellence that drives business growth. 20+ years of trusted expertise.
            </p>
            <div 
                class="hero-buttons"
                use:gsapAnimate={{ type: 'fadeInUp', delay: 1.0, scrollTrigger: false }}
            >
                <a href="/contact" class="btn btn-primary" use:gsapHover={{ scale: 1.05, y: -3, magnetic: true }}>
                    <span>Start Your Project</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
                <a href="/portfolio" class="btn btn-secondary" use:gsapHover={{ scale: 1.05, y: -3 }}>
                    <span>View Portfolio</span>
                    <i class="fas fa-eye"></i>
                </a>
            </div>
        </div>
    {/if}
</section>

<!-- Stats Section -->
<StatsSection />

<!-- Services Preview -->
<ServicesPreview />

<!-- Features Grid -->
<FeaturesGrid />

<!-- CTA Section -->
<CTASection />

<style>
    .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        padding: 120px 5%;
        position: relative;
    }

    .hero-content {
        max-width: 800px;
    }

    .hero-tag {
        display: inline-block;
        padding: 10px 20px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50px;
        font-size: 0.9rem;
        margin-bottom: 25px;
        backdrop-filter: blur(10px);
    }

    .hero-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 900;
        line-height: 1.1;
        margin-bottom: 30px;
    }

    .gradient-text {
        background: linear-gradient(135deg, var(--accent), var(--cyan));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-text {
        font-size: 1.25rem;
        color: var(--text-muted);
        margin-bottom: 40px;
        max-width: 600px;
        line-height: 1.7;
    }

    .hero-buttons {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--text);
        box-shadow: var(--glow-primary);
    }

    .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 40px rgba(99,102,241,0.4);
    }

    .btn-secondary {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        color: var(--text);
        backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
        background: rgba(255,255,255,0.1);
        border-color: var(--accent);
    }

    @media (max-width: 768px) {
        .hero-buttons {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
