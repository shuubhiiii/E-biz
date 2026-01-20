<script>
    import { fly } from 'svelte/transition';
    import CTASection from '$lib/components/CTASection.svelte';
    import { gsapAnimate, gsapTilt, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';

    let activeFilter = 'all';

    const projects = [
        { id: 1, title: 'Enterprise ERP System', category: 'software', desc: 'Complete business management solution', tech: ['Java', 'Spring Boot', 'React', 'PostgreSQL'] },
        { id: 2, title: 'HealthCare Mobile App', category: 'mobile', desc: 'Patient management and telemedicine', tech: ['React Native', 'Node.js', 'MongoDB'] },
        { id: 3, title: 'E-Commerce Platform', category: 'web', desc: 'Multi-vendor marketplace with 10K+ products', tech: ['Next.js', 'Stripe', 'AWS'] },
        { id: 4, title: 'Banking Dashboard', category: 'software', desc: 'Real-time financial analytics platform', tech: ['Angular', '.NET Core', 'SQL Server'] },
        { id: 5, title: 'Fitness Tracker App', category: 'mobile', desc: 'Health monitoring with wearable integration', tech: ['Flutter', 'Firebase', 'HealthKit'] },
        { id: 6, title: 'Real Estate Portal', category: 'web', desc: 'Property listing with virtual tours', tech: ['Vue.js', 'Laravel', 'Three.js'] },
        { id: 7, title: 'Logistics Management', category: 'software', desc: 'Fleet tracking and route optimization', tech: ['Python', 'Django', 'Redis'] },
        { id: 8, title: 'Food Delivery App', category: 'mobile', desc: 'On-demand delivery with live tracking', tech: ['Kotlin', 'Swift', 'Google Maps'] },
        { id: 9, title: 'Learning Management', category: 'web', desc: 'Online education platform with live classes', tech: ['React', 'WebRTC', 'GraphQL'] }
    ];

    const filters = ['all', 'software', 'mobile', 'web'];

    const testimonials = [
        { text: "e-Biz Technocrats delivered our project on time and exceeded expectations. Their team's expertise is remarkable.", author: 'John Smith', company: 'TechCorp Inc.' },
        { text: "The mobile app they built increased our customer engagement by 300%. Highly recommended!", author: 'Sarah Johnson', company: 'RetailPro' },
        { text: "Professional, responsive, and technically excellent. They've been our go-to development partner for 5 years.", author: 'Michael Chen', company: 'FinanceHub' }
    ];

    $: filteredProjects = activeFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === activeFilter);
</script>

<svelte:head>
    <title>Portfolio - e-Biz Technocrats</title>
    <meta name="description" content="Explore our portfolio of 500+ successful projects across software, mobile, and web development.">
</svelte:head>

<!-- Page Hero -->
<section class="page-hero">
    <div class="page-hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">Our Work</span>
        <h1 class="page-title" use:gsapSplitText={{ type: 'chars', stagger: 0.03, delay: 0.2, scrollTrigger: false }}>Portfolio</h1>
        <p class="page-subtitle">Showcasing our best work across industries</p>
    </div>
</section>

<!-- Portfolio Filters -->
<section class="portfolio-section">
    <div class="filters" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.3 }}>
        {#each filters as filter, i}
            <button 
                class="filter-btn" 
                class:active={activeFilter === filter}
                on:click={() => activeFilter = filter}
                use:gsapHover={{ scale: 1.1, y: -2 }}
            >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
        {/each}
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
        {#each filteredProjects as project, i (project.id)}
            <div 
                class="project-card" 
                in:fly={{ y: 20, duration: 300 }}
                use:gsapTilt={{ max: 8, scale: 1.02 }}
            >
                <div class="project-image {project.category}">
                    <i class="fas fa-{project.category === 'mobile' ? 'mobile-alt' : project.category === 'web' ? 'globe' : 'code'}"></i>
                </div>
                <div class="project-info">
                    <span class="project-category">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>
                    <div class="project-tech">
                        {#each project.tech as tech}
                            <span>{tech}</span>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</section>

<!-- Testimonials -->
<section class="testimonials-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">Client Feedback</span>
        <h2>What Our Clients Say</h2>
    </div>

    <div class="testimonials-grid">
        {#each testimonials as testimonial, i}
            <div 
                class="testimonial-card"
                use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.15, start: 'top 90%' }}
                use:gsapTilt={{ max: 6, scale: 1.01 }}
            >
                <div class="stars">
                    {#each Array(5) as _}
                        <i class="fas fa-star"></i>
                    {/each}
                </div>
                <p>"{testimonial.text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">{testimonial.author.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <strong>{testimonial.author}</strong>
                        <span>{testimonial.company}</span>
                    </div>
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

    /* Portfolio */
    .portfolio-section {
        padding: 50px 5%;
        max-width: 1400px;
        margin: 0 auto;
    }

    .filters {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 50px;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 10px 25px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 50px;
        color: var(--text);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
    }

    .filter-btn:hover,
    .filter-btn.active {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--dark);
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }

    .project-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .project-image {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: rgba(255,255,255,0.2);
    }

    .project-image.software { background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3)); }
    .project-image.mobile { background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3)); }
    .project-image.web { background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(34,211,238,0.3)); }

    .project-info {
        padding: 25px;
    }

    .project-category {
        display: inline-block;
        padding: 4px 12px;
        background: var(--glass);
        border-radius: 20px;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 10px;
    }

    .project-info h3 {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 10px;
    }

    .project-info p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 15px;
    }

    .project-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .project-tech span {
        padding: 4px 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 15px;
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    /* Testimonials */
    .testimonials-section {
        padding: 80px 5%;
        background: linear-gradient(180deg, transparent, rgba(99,102,241,0.05), transparent);
    }

    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .testimonial-card {
        padding: 35px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
    }

    .stars {
        color: var(--gold);
        margin-bottom: 20px;
    }

    .testimonial-card > p {
        font-size: 1.05rem;
        color: var(--text-muted);
        line-height: 1.7;
        font-style: italic;
        margin-bottom: 25px;
    }

    .testimonial-author {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .author-avatar {
        width: 45px;
        height: 45px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .testimonial-author strong {
        display: block;
        margin-bottom: 3px;
    }

    .testimonial-author span {
        font-size: 0.85rem;
        color: var(--text-dim);
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }

        .testimonials-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
