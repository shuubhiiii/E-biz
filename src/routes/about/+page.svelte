<script>
    import { fly } from 'svelte/transition';
    import CTASection from '$lib/components/CTASection.svelte';
    import { gsapAnimate, gsapTilt, gsapCounter, gsapSplitText } from '$lib/actions/gsapAction.js';

    const timeline = [
        { year: '2003', title: 'Foundation', text: 'Started with a vision to deliver quality IT solutions' },
        { year: '2008', title: 'Global Expansion', text: 'Extended services to clients across 5 countries' },
        { year: '2014', title: 'ISO Certified', text: 'Achieved ISO 9001:2015 certification' },
        { year: '2019', title: '500+ Projects', text: 'Milestone of 500 successful project deliveries' },
        { year: '2024', title: 'Innovation Hub', text: 'Launched AI and ML focused development center' }
    ];

    const values = [
        { icon: 'fas fa-lightbulb', title: 'Innovation', desc: 'Constantly pushing boundaries with new technologies' },
        { icon: 'fas fa-handshake', title: 'Integrity', desc: 'Building trust through transparent practices' },
        { icon: 'fas fa-star', title: 'Excellence', desc: 'Delivering quality that exceeds expectations' },
        { icon: 'fas fa-users', title: 'Collaboration', desc: 'Working together for shared success' }
    ];

    const team = [
        { name: 'Rajesh Kumar', role: 'CEO & Founder', initials: 'RK' },
        { name: 'Priya Sharma', role: 'CTO', initials: 'PS' },
        { name: 'Amit Patel', role: 'Head of Development', initials: 'AP' },
        { name: 'Neha Gupta', role: 'Project Director', initials: 'NG' }
    ];
</script>

<svelte:head>
    <title>About Us - e-Biz Technocrats</title>
    <meta name="description" content="Learn about e-Biz Technocrats' 20+ years journey in delivering excellence in IT solutions globally.">
</svelte:head>

<!-- Page Hero -->
<section class="page-hero">
    <div class="page-hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">Our Story</span>
        <h1 class="page-title" use:gsapSplitText={{ type: 'chars', stagger: 0.04, delay: 0.2, scrollTrigger: false }}>About Us</h1>
        <p class="page-subtitle">Two decades of excellence in digital transformation</p>
    </div>
</section>

<!-- About Content -->
<section class="about-section">
    <div class="about-grid">
        <div class="about-text" use:gsapAnimate={{ type: 'fadeInLeft' }}>
            <h2>Pioneering Digital Excellence Since 2003</h2>
            <p>
                e-Biz Technocrats began with a simple mission: to deliver world-class IT solutions 
                that empower businesses to thrive in the digital age. What started as a small team 
                of passionate developers has grown into a global technology partner trusted by 
                enterprises across 15+ countries.
            </p>
            <p>
                Our ISO 9001:2015 certification reflects our commitment to quality processes and 
                continuous improvement. With over 500 successful projects delivered, we've built 
                a reputation for technical excellence, innovation, and client satisfaction.
            </p>
            <div class="about-highlights">
                <div class="highlight" use:gsapAnimate={{ type: 'scaleIn', delay: 0.2 }}>
                    <span class="highlight-number" use:gsapCounter={{ target: 20, suffix: '+', duration: 2 }}>0+</span>
                    <span class="highlight-label">Years</span>
                </div>
                <div class="highlight" use:gsapAnimate={{ type: 'scaleIn', delay: 0.3 }}>
                    <span class="highlight-number" use:gsapCounter={{ target: 500, suffix: '+', duration: 2.5 }}>0+</span>
                    <span class="highlight-label">Projects</span>
                </div>
                <div class="highlight" use:gsapAnimate={{ type: 'scaleIn', delay: 0.4 }}>
                    <span class="highlight-number" use:gsapCounter={{ target: 50, suffix: '+', duration: 2 }}>0+</span>
                    <span class="highlight-label">Team</span>
                </div>
            </div>
        </div>
        <div class="about-visual" use:gsapAnimate={{ type: 'fadeInRight', delay: 0.3 }}>
            <div class="visual-box" use:gsapTilt={{ max: 15, scale: 1.02 }}>
                <i class="fas fa-building"></i>
            </div>
        </div>
    </div>
</section>

<!-- Timeline -->
<section class="timeline-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Our Journey</span>
        <h2>Milestones</h2>
    </div>
    
    <div class="timeline">
        {#each timeline as item, i}
            <div 
                class="timeline-item" 
                class:right={i % 2 !== 0}
                use:gsapAnimate={{ type: i % 2 === 0 ? 'fadeInLeft' : 'fadeInRight', delay: i * 0.15, start: 'top 85%' }}
            >
                <div class="timeline-content">
                    <span class="timeline-year">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                </div>
                <div class="timeline-dot"></div>
            </div>
        {/each}
    </div>
</section>

<!-- Values -->
<section class="values-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">What Drives Us</span>
        <h2>Our Values</h2>
    </div>
    
    <div class="values-grid">
        {#each values as value, i}
            <div 
                class="value-card"
                use:gsapAnimate={{ type: 'scaleIn', delay: i * 0.1, start: 'top 90%' }}
                use:gsapTilt={{ max: 10, scale: 1.02 }}
            >
                <div class="value-icon">
                    <i class={value.icon}></i>
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
            </div>
        {/each}
    </div>
</section>

<!-- Team -->
<section class="team-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Leadership</span>
        <h2>Our Team</h2>
    </div>
    
    <div class="team-grid">
        {#each team as member, i}
            <div 
                class="team-card"
                use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.1, start: 'top 90%' }}
                use:gsapTilt={{ max: 8, scale: 1.02 }}
            >
                <div class="team-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <span class="team-role">{member.role}</span>
                <div class="team-social">
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        {/each}
    </div>
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
    }

    .section-header {
        text-align: center;
        margin-bottom: 50px;
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 800;
    }

    /* About Section */
    .about-section {
        padding: 80px 5%;
    }

    .about-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 60px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
    }

    .about-text h2 {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 25px;
    }

    .about-text p {
        color: var(--text-muted);
        line-height: 1.8;
        margin-bottom: 20px;
        font-size: 1.05rem;
    }

    .about-highlights {
        display: flex;
        gap: 40px;
        margin-top: 30px;
    }

    .highlight {
        text-align: center;
    }

    .highlight-number {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--accent);
        font-family: 'Space Mono', monospace;
    }

    .highlight-label {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .about-visual {
        display: flex;
        justify-content: center;
    }

    .visual-box {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
        color: rgba(255,255,255,0.2);
    }

    /* Timeline */
    .timeline-section {
        padding: 80px 5%;
        background: linear-gradient(180deg, transparent, rgba(99,102,241,0.05), transparent);
    }

    .timeline {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, var(--accent), var(--purple));
    }

    .timeline-item {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        position: relative;
    }

    .timeline-item.right {
        flex-direction: row-reverse;
    }

    .timeline-content {
        width: 45%;
        padding: 25px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
    }

    .timeline-item.right .timeline-content {
        text-align: right;
    }

    .timeline-year {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--accent);
        display: block;
        margin-bottom: 8px;
    }

    .timeline-content h3 {
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    .timeline-content p {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .timeline-dot {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 16px;
        background: var(--accent);
        border-radius: 50%;
        border: 3px solid var(--dark);
    }

    /* Values */
    .values-section {
        padding: 80px 5%;
    }

    .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        max-width: 1100px;
        margin: 0 auto;
    }

    .value-card {
        text-align: center;
        padding: 40px 30px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        transition: transform 0.3s, border-color 0.3s;
    }

    .value-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent);
    }

    .value-icon {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin: 0 auto 20px;
    }

    .value-card h3 {
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .value-card p {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    /* Team */
    .team-section {
        padding: 80px 5%;
    }

    .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        max-width: 1100px;
        margin: 0 auto;
    }

    .team-card {
        text-align: center;
        padding: 40px 30px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        transition: transform 0.3s;
    }

    .team-card:hover {
        transform: translateY(-8px);
    }

    .team-avatar {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: 700;
        margin: 0 auto 20px;
    }

    .team-card h3 {
        font-size: 1.2rem;
        margin-bottom: 5px;
    }

    .team-role {
        color: var(--accent);
        font-size: 0.9rem;
        display: block;
        margin-bottom: 15px;
    }

    .team-social {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .team-social a {
        width: 35px;
        height: 35px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }

    .team-social a:hover {
        background: var(--accent);
        color: var(--dark);
    }

    @media (max-width: 968px) {
        .about-grid {
            grid-template-columns: 1fr;
        }

        .timeline::before {
            left: 20px;
        }

        .timeline-item,
        .timeline-item.right {
            flex-direction: row;
            padding-left: 50px;
        }

        .timeline-content {
            width: 100%;
        }

        .timeline-item.right .timeline-content {
            text-align: left;
        }

        .timeline-dot {
            left: 20px;
        }
    }
</style>
