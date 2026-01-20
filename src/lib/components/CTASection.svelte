<script>
    import { gsapAnimate, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';
</script>

<section class="cta-section" use:gsapAnimate={{ type: 'scaleIn', start: 'top 85%' }}>
    <h2 use:gsapSplitText={{ type: 'words', animation: 'fadeInUp', stagger: 0.08, delay: 0.2 }}>
        Ready to Transform Your Business?
    </h2>
    <p use:gsapAnimate={{ type: 'fadeInUp', delay: 0.4 }}>
        Let's discuss your project and bring your vision to life with our expertise.
    </p>
    <div class="cta-buttons" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.6 }}>
        <a 
            href="/contact" 
            class="btn btn-primary"
            use:gsapHover={{ scale: 1.05, y: -3, magnetic: true }}
        >
            <span>Get Free Consultation</span>
            <i class="fas fa-arrow-right"></i>
        </a>
        <a 
            href="tel:+918962733774" 
            class="btn btn-secondary"
            use:gsapHover={{ scale: 1.05, y: -3 }}
        >
            <span>Call Us Now</span>
            <i class="fas fa-phone"></i>
        </a>
    </div>
</section>

<style>
    .cta-section {
        text-align: center;
        padding: 80px 5%;
        margin: 50px 5%;
        background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
        border-radius: 30px;
        border: 1px solid var(--glass-border);
    }

    h2 {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
        font-weight: 800;
        margin-bottom: 20px;
    }

    p {
        color: var(--text-muted);
        font-size: 1.125rem;
        margin-bottom: 30px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .cta-buttons {
        display: flex;
        justify-content: center;
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
        transition: all 0.3s;
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
    }

    .btn-secondary:hover {
        border-color: var(--accent);
        background: rgba(255,255,255,0.1);
    }
</style>
