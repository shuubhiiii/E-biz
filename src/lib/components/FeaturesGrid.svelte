<script>
    import { gsapAnimate, gsapHover, gsapTilt } from '$lib/actions/gsapAction.js';
    
    const features = [
        { icon: 'fas fa-shield-alt', title: 'ISO Certified', desc: 'ISO 9001:2015 certified processes' },
        { icon: 'fas fa-clock', title: '24/7 Support', desc: 'Round-the-clock assistance' },
        { icon: 'fas fa-users', title: 'Expert Team', desc: '50+ skilled professionals' },
        { icon: 'fas fa-rocket', title: 'Fast Delivery', desc: 'Agile development methodology' },
        { icon: 'fas fa-lock', title: 'Secure', desc: 'Enterprise-grade security' },
        { icon: 'fas fa-headset', title: 'Dedicated PM', desc: 'Personal project manager' }
    ];
</script>

<section class="features-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Why Choose Us</span>
        <h2 class="section-title">The e-Biz Advantage</h2>
    </div>

    <div class="features-grid">
        {#each features as feature, i}
            <div 
                class="feature-card"
                use:gsapAnimate={{ type: 'scaleIn', delay: i * 0.08, start: 'top 90%' }}
                use:gsapTilt={{ max: 12, scale: 1.03 }}
            >
                <div class="feature-icon" use:gsapAnimate={{ type: 'rotateIn', delay: i * 0.08 + 0.2 }}>
                    <i class={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
            </div>
        {/each}
    </div>
</section>

<style>
    .features-section {
        padding: 100px 5%;
        background: linear-gradient(180deg, transparent, rgba(99,102,241,0.05), transparent);
    }

    .section-header {
        text-align: center;
        margin-bottom: 60px;
    }

    .section-tag {
        display: inline-block;
        padding: 8px 20px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--accent);
        margin-bottom: 20px;
    }

    .section-title {
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 800;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .feature-card {
        text-align: center;
        padding: 35px 25px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        transition: transform 0.3s, border-color 0.3s;
    }

    .feature-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent);
    }

    .feature-card:hover .feature-icon {
        transform: scale(1.1);
        border-color: var(--accent);
    }

    .feature-icon {
        width: 70px;
        height: 70px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: var(--accent);
        margin: 0 auto 20px;
        transition: transform 0.3s, border-color 0.3s;
    }

    .feature-card h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .feature-card p {
        color: var(--text-muted);
        font-size: 0.9rem;
    }
</style>
