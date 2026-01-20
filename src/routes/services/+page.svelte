<script>
    import { fly } from 'svelte/transition';
    import CTASection from '$lib/components/CTASection.svelte';
    import ProceduralEffects from '$lib/components/ProceduralEffects.svelte';
    import { gsapAnimate, gsapTilt, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';

    const services = [
        {
            id: 'software',
            icon: 'fas fa-code',
            color: 'primary',
            title: 'Software Development',
            description: 'Custom enterprise software solutions designed to streamline your business operations and drive growth.',
            features: ['Enterprise Applications', 'ERP & CRM Systems', 'Cloud Solutions', 'API Development', 'Database Design', 'Legacy Modernization']
        },
        {
            id: 'mobile',
            icon: 'fas fa-mobile-alt',
            color: 'purple',
            title: 'Mobile App Development',
            description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
            features: ['iOS Development', 'Android Development', 'React Native', 'Flutter Apps', 'App Store Optimization', 'Maintenance & Support']
        },
        {
            id: 'web',
            icon: 'fas fa-globe',
            color: 'cyan',
            title: 'Web Development',
            description: 'Modern, responsive websites and web applications built with cutting-edge technologies.',
            features: ['React & Vue.js', 'Node.js Backend', 'E-commerce Solutions', 'Progressive Web Apps', 'CMS Development', 'Performance Optimization']
        },
        {
            id: 'marketing',
            icon: 'fas fa-chart-line',
            color: 'gold',
            title: 'Digital Marketing',
            description: 'Data-driven marketing strategies that increase visibility and drive conversions.',
            features: ['SEO & SEM', 'Social Media Marketing', 'Content Strategy', 'PPC Campaigns', 'Email Marketing', 'Analytics & Reporting']
        },
        {
            id: 'infrastructure',
            icon: 'fas fa-server',
            color: 'accent',
            title: 'IT Infrastructure',
            description: 'Robust infrastructure solutions to ensure your business runs smoothly and securely.',
            features: ['Cloud Migration', 'AWS & Azure Services', 'Network Security', 'DevOps Solutions', 'System Integration', '24/7 Monitoring']
        },
        {
            id: 'training',
            icon: 'fas fa-graduation-cap',
            color: 'pink',
            title: 'Education & Training',
            description: 'Professional IT training programs to upskill your team with the latest technologies.',
            features: ['Corporate Training', 'Online Courses', 'Certification Programs', 'Hands-on Workshops', 'Custom Curriculum', 'Placement Assistance']
        }
    ];
</script>

<svelte:head>
    <title>Our Services - e-Biz Technocrats</title>
    <meta name="description" content="Explore our comprehensive IT services including software development, mobile apps, web development, digital marketing, and more.">
</svelte:head>

<!-- Page Hero -->
<section class="page-hero">
    <div class="page-hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">What We Offer</span>
        <h1 class="page-title" use:gsapSplitText={{ type: 'chars', stagger: 0.03, delay: 0.2, scrollTrigger: false }}>Our Services</h1>
        <p class="page-subtitle">Comprehensive IT solutions to power your digital transformation</p>
    </div>
</section>

<!-- Services List -->
<section class="services-section">
    {#each services as service, i}
        <div 
            class="service-detail" 
            id={service.id} 
            class:reverse={i % 2 !== 0}
            use:gsapAnimate={{ type: i % 2 === 0 ? 'fadeInLeft' : 'fadeInRight', start: 'top 80%' }}
        >
            <div class="service-content">
                <div class="service-icon {service.color}" use:gsapAnimate={{ type: 'scaleIn', delay: 0.2 }}>
                    <i class={service.icon}></i>
                </div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul class="feature-list">
                    {#each service.features as feature, j}
                        <li use:gsapAnimate={{ type: 'fadeInUp', delay: j * 0.1, start: 'top 95%' }}>
                            <i class="fas fa-check-circle"></i> {feature}
                        </li>
                    {/each}
                </ul>
                <a href="/contact" class="btn btn-primary" use:gsapHover={{ scale: 1.05, y: -3, magnetic: true }}>
                    Get Started <i class="fas fa-arrow-right"></i>
                </a>
            </div>
            <div class="service-visual">
                <div class="visual-card {service.color}" use:gsapTilt={{ max: 15, scale: 1.03 }}>
                    {#if i === 0}
                        <ProceduralEffects type="particles" />
                    {:else if i === 1}
                        <ProceduralEffects type="wormhole" />
                    {:else if i === 2}
                        <ProceduralEffects type="waves" />
                    {:else if i === 3}
                        <ProceduralEffects type="terrain" />
                    {:else if i === 4}
                        <ProceduralEffects type="particles" />
                    {:else}
                        <ProceduralEffects type="wormhole" />
                    {/if}
                    <i class={service.icon}></i>
                </div>
            </div>
        </div>
    {/each}
</section>

<CTASection />

<style>
    .page-hero {
        min-height: 50vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 150px 5% 80px;
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

    .page-title {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 900;
        margin-bottom: 20px;
    }

    .page-subtitle {
        font-size: 1.2rem;
        color: var(--text-muted);
        max-width: 500px;
        margin: 0 auto;
    }

    .services-section {
        padding: 50px 5%;
        max-width: 1400px;
        margin: 0 auto;
    }

    .service-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
        padding: 80px 0;
        border-bottom: 1px solid var(--glass-border);
    }

    .service-detail.reverse {
        direction: rtl;
    }

    .service-detail.reverse > * {
        direction: ltr;
    }

    .service-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 25px;
    }

    .service-icon.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
    .service-icon.purple { background: linear-gradient(135deg, var(--purple), #ec4899); }
    .service-icon.cyan { background: linear-gradient(135deg, var(--cyan), #22d3ee); }
    .service-icon.gold { background: linear-gradient(135deg, var(--gold), #fbbf24); }
    .service-icon.accent { background: linear-gradient(135deg, var(--accent), #22c55e); }
    .service-icon.pink { background: linear-gradient(135deg, #ec4899, #f43f5e); }

    .service-content h2 {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 20px;
    }

    .service-content p {
        font-size: 1.1rem;
        color: var(--text-muted);
        line-height: 1.8;
        margin-bottom: 30px;
    }

    .feature-list {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 30px;
    }

    .feature-list li {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-muted);
    }

    .feature-list i {
        color: var(--accent);
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 28px;
        border-radius: 50px;
        font-weight: 600;
        transition: all 0.3s;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--text);
    }

    .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: var(--glow-primary);
    }

    .service-visual {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .visual-card {
        width: 300px;
        height: 300px;
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
        color: rgba(255,255,255,0.2);
        position: relative;
        overflow: hidden;
    }

    .visual-card :global(canvas) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 30px;
    }

    .visual-card i {
        position: relative;
        z-index: 2;
    }

    .visual-card.primary { background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3)); }
    .visual-card.purple { background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3)); }
    .visual-card.cyan { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(34,211,238,0.3)); }
    .visual-card.gold { background: linear-gradient(135deg, rgba(245,158,11,0.3), rgba(251,191,36,0.3)); }
    .visual-card.accent { background: linear-gradient(135deg, rgba(0,255,136,0.3), rgba(34,197,94,0.3)); }
    .visual-card.pink { background: linear-gradient(135deg, rgba(236,72,153,0.3), rgba(244,63,94,0.3)); }

    @media (max-width: 968px) {
        .service-detail {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .service-detail.reverse {
            direction: ltr;
        }

        .feature-list {
            grid-template-columns: 1fr;
        }

        .visual-card {
            width: 200px;
            height: 200px;
            font-size: 4rem;
        }
    }
</style>
