<script>
    import { gsapAnimate, gsapHover, gsapTilt } from '$lib/actions/gsapAction.js';
    
    const services = [
        {
            icon: 'fas fa-code',
            title: 'Software Development',
            description: 'Custom enterprise solutions built with cutting-edge technologies for scalable growth.',
            color: 'primary'
        },
        {
            icon: 'fas fa-mobile-alt',
            title: 'Mobile Apps',
            description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
            color: 'purple'
        },
        {
            icon: 'fas fa-globe',
            title: 'Web Development',
            description: 'Modern, responsive websites and web applications with exceptional user experiences.',
            color: 'cyan'
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Digital Marketing',
            description: 'Data-driven marketing strategies that boost visibility and drive conversions.',
            color: 'gold'
        },
        {
            icon: 'fas fa-server',
            title: 'IT Infrastructure',
            description: 'Robust infrastructure solutions including cloud services and network management.',
            color: 'accent'
        },
        {
            icon: 'fas fa-graduation-cap',
            title: 'Training',
            description: 'Professional IT training programs to upskill your team with latest technologies.',
            color: 'pink'
        }
    ];
</script>

<section class="services-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">What We Do</span>
        <h2 class="section-title">Our Services</h2>
        <p class="section-subtitle">Comprehensive IT solutions tailored to your business needs</p>
    </div>

    <div class="services-grid">
        {#each services as service, i}
            <div 
                class="service-card" 
                use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.1, start: 'top 90%' }}
                use:gsapTilt={{ max: 8, scale: 1.02 }}
            >
                <div class="service-icon {service.color}" use:gsapAnimate={{ type: 'scaleIn', delay: i * 0.1 + 0.2 }}>
                    <i class={service.icon}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="/services" class="service-link" use:gsapHover={{ scale: 1.05, y: -2 }}>
                    Learn More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        {/each}
    </div>
</section>

<style>
    .services-section {
        padding: 100px 5%;
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
        margin-bottom: 15px;
    }

    .section-subtitle {
        font-size: 1.1rem;
        color: var(--text-muted);
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 30px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .service-card {
        padding: 40px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        transition: transform 0.3s, box-shadow 0.3s;
        will-change: transform;
    }

    .service-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .service-icon {
        width: 70px;
        height: 70px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        margin-bottom: 25px;
    }

    .service-icon.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
    .service-icon.purple { background: linear-gradient(135deg, var(--purple), #ec4899); }
    .service-icon.cyan { background: linear-gradient(135deg, var(--cyan), #22d3ee); }
    .service-icon.gold { background: linear-gradient(135deg, var(--gold), #fbbf24); }
    .service-icon.accent { background: linear-gradient(135deg, var(--accent), #22c55e); }
    .service-icon.pink { background: linear-gradient(135deg, #ec4899, #f43f5e); }

    .service-card h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 15px;
    }

    .service-card p {
        color: var(--text-muted);
        line-height: 1.7;
        margin-bottom: 20px;
    }

    .service-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--accent);
        font-weight: 600;
        transition: gap 0.3s;
    }

    .service-link:hover {
        gap: 15px;
    }
</style>
