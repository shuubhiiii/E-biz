<script>
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import CTASection from '$lib/components/CTASection.svelte';
    import { gsapAnimate, gsapTilt, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';

    let activeCategory = 'all';
    let activeType = 'web';

    const projectTypes = [
        { id: 'web', label: 'Web Design & Development' },
        { id: 'mobile', label: 'Mobile App Development' },
        { id: 'webapp', label: 'Web Application' }
    ];

    const categories = [
        'All', 'Education', 'IT', 'Hospital', 'Fintech', 'Food', 
        'Mining', 'NGO', 'Skill', 'Real Estate', 'Health', 
        'Agriculture', 'Media', 'Startup', 'SME'
    ];

    // Tech-themed gradient placeholder images
    const techImages = [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', // Code on screen
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', // Laptop code
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop', // Monitor code
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', // MacBook code
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop', // Code reflection
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop', // Syntax highlight
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop', // Matrix data
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', // Server room
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', // Circuit board
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', // Earth tech
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop', // Cybersecurity
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop', // Tech dashboard
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop', // Blockchain
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop', // AI brain
        'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&h=300&fit=crop', // Tech lines
    ];

    const projects = [
        // Web Design & Development
        { id: 1, title: 'ElevateTrust.Ai', url: 'https://elevatetrust.ai/', category: 'IT', type: 'web', image: techImages[13] },
        { id: 2, title: 'Advance Solar Batteries', url: 'https://advancedsolarandbatteries.com.au/', category: 'Startup', type: 'web', image: techImages[9] },
        { id: 3, title: 'Ayushmaan Pharmaceuticals', url: 'https://www.ayushmaanpharma.com/', category: 'Health', type: 'web', image: techImages[10] },
        { id: 4, title: 'Parvati Vidyapeeth School', url: 'https://parvatividyapeeth.in/', category: 'Education', type: 'web', image: techImages[0] },
        { id: 5, title: 'Laxmibai Smarak H.S. School', url: 'https://lakshmibaismarak.com/', category: 'Education', type: 'web', image: techImages[1] },
        { id: 6, title: 'H&T Mediclaim', url: 'https://htmediclaimconsultancy.in/', category: 'Fintech', type: 'web', image: techImages[12] },
        { id: 7, title: 'Mahatma Gandhi College of Law', url: 'https://mgcl.edu.in/', category: 'Education', type: 'web', image: techImages[2] },
        { id: 8, title: 'AIMA', url: 'https://nmc.aima.in/', category: 'Education', type: 'web', image: techImages[3] },
        { id: 9, title: 'Whiz Tech Services', url: 'https://whiztechservices.com/', category: 'IT', type: 'web', image: techImages[4] },
        { id: 10, title: 'Techstudio Services', url: 'https://techstudio.services/', category: 'IT', type: 'web', image: techImages[5] },
        { id: 11, title: 'Sarvajanik School', url: 'https://sarvajanikschool.org.in/', category: 'Education', type: 'web', image: techImages[6] },
        { id: 12, title: 'PGV College', url: 'https://pgvcollege.edu.in/', category: 'Education', type: 'web', image: techImages[7] },
        { id: 13, title: 'Madhav College', url: 'https://madhavcollege.edu.in/', category: 'Education', type: 'web', image: techImages[8] },
        { id: 14, title: 'GS Hospital', url: 'https://gshospital.co.in/', category: 'Hospital', type: 'web', image: techImages[10] },
        { id: 15, title: 'Willysia Lifescience', url: 'https://willysia.com/', category: 'Health', type: 'web', image: techImages[11] },
        { id: 16, title: 'Tax Signup', url: 'https://www.taxsignup.com/', category: 'Fintech', type: 'web', image: techImages[12] },
        { id: 17, title: 'Manomay Eateries', url: 'https://manomayfood.com/', category: 'Food', type: 'web', image: techImages[14] },
        { id: 18, title: 'Alfanzo Restaurant', url: 'https://alfanzo.in/', category: 'Food', type: 'web', image: techImages[0] },
        { id: 19, title: 'WMPSC', url: 'https://wmpsc.in/', category: 'Skill', type: 'web', image: techImages[1] },
        { id: 20, title: 'Deshraag Foundation', url: 'http://deshraag.in/', category: 'NGO', type: 'web', image: techImages[9] },
        { id: 21, title: 'Keshar Infrastructures', url: 'http://kesharinfra.com/', category: 'Real Estate', type: 'web', image: techImages[7] },
        { id: 22, title: 'Kratins Agrotech', url: 'http://kratinsagro.com/', category: 'Agriculture', type: 'web', image: techImages[9] },
        { id: 23, title: 'LYF Gym', url: 'http://lyfindia.in/', category: 'Health', type: 'web', image: techImages[14] },
        { id: 24, title: 'Prestige Institute', url: 'https://prestigegwl.org/', category: 'Education', type: 'web', image: techImages[2] },
        { id: 25, title: 'Yardstikk', url: 'https://yardstikk.com/', category: 'Startup', type: 'web', image: techImages[13] },
        { id: 26, title: 'LP Wala Laundry', url: 'https://lpwala.com/', category: 'Startup', type: 'web', image: techImages[3] },
        { id: 27, title: 'e-Biz Skill', url: 'https://ebizskill.com/', category: 'Skill', type: 'web', image: techImages[4] },
        { id: 28, title: 'Bauxite India', url: 'http://bauxiteindia.com/', category: 'Mining', type: 'web', image: techImages[8] },
        
        // Mobile Apps
        { id: 29, title: 'HealthCare Pro', url: '#', category: 'Hospital', type: 'mobile', image: techImages[10] },
        { id: 30, title: 'EduLearn App', url: '#', category: 'Education', type: 'mobile', image: techImages[5] },
        { id: 31, title: 'FoodExpress', url: '#', category: 'Food', type: 'mobile', image: techImages[6] },
        { id: 32, title: 'FinTrack', url: '#', category: 'Fintech', type: 'mobile', image: techImages[12] },
        { id: 33, title: 'PropertyFinder', url: '#', category: 'Real Estate', type: 'mobile', image: techImages[7] },
        { id: 34, title: 'FitLife Tracker', url: '#', category: 'Health', type: 'mobile', image: techImages[14] },
        
        // Web Applications
        { id: 35, title: 'Enterprise ERP', url: '#', category: 'IT', type: 'webapp', image: techImages[11] },
        { id: 36, title: 'Hospital Management', url: '#', category: 'Hospital', type: 'webapp', image: techImages[10] },
        { id: 37, title: 'School ERP', url: '#', category: 'Education', type: 'webapp', image: techImages[0] },
        { id: 38, title: 'CRM System', url: '#', category: 'IT', type: 'webapp', image: techImages[4] },
        { id: 39, title: 'Inventory Manager', url: '#', category: 'SME', type: 'webapp', image: techImages[8] },
        { id: 40, title: 'HR Portal', url: '#', category: 'IT', type: 'webapp', image: techImages[13] }
    ];

    const testimonials = [
        { text: "e-Biz Technocrats delivered our project on time and exceeded expectations. Their team's expertise is remarkable.", author: 'Rajesh Kumar', company: 'Prestige Institute' },
        { text: "The mobile app they built increased our customer engagement by 300%. Highly recommended!", author: 'Priya Sharma', company: 'Manomay Foods' },
        { text: "Professional, responsive, and technically excellent. They've been our go-to development partner for 5 years.", author: 'Dr. Amit Jain', company: 'GS Hospital' }
    ];

    $: filteredProjects = projects.filter(p => {
        const typeMatch = p.type === activeType;
        const categoryMatch = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
        return typeMatch && categoryMatch;
    });
</script>

<svelte:head>
    <title>Portfolio - e-Biz Technocrats</title>
    <meta name="description" content="Explore our portfolio of 500+ successful projects across software, mobile, and web development.">
</svelte:head>

<!-- Page Hero -->
<section class="page-hero">
    <div class="page-hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">Latest Work</span>
        <h1 class="page-title" use:gsapSplitText={{ type: 'chars', stagger: 0.03, delay: 0.2, scrollTrigger: false }}>Portfolio</h1>
        <p class="page-subtitle">WE WORK TO INNOVATE & ARE PROUD OF WHAT WE'VE CREATED</p>
    </div>
</section>

<!-- Portfolio Section -->
<section class="portfolio-section">
    <!-- Project Type Tabs -->
    <div class="type-tabs" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.2 }}>
        {#each projectTypes as ptype}
            <button 
                class="type-tab" 
                class:active={activeType === ptype.id}
                on:click={() => activeType = ptype.id}
                use:gsapHover={{ scale: 1.02, y: -2 }}
            >
                {ptype.label}
            </button>
        {/each}
    </div>

    <!-- Category Filters -->
    <div class="category-filters" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.3 }}>
        {#each categories as category}
            <button 
                class="filter-pill" 
                class:active={activeCategory === category.toLowerCase()}
                on:click={() => activeCategory = category.toLowerCase()}
            >
                {category}
            </button>
        {/each}
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
        {#each filteredProjects as project, i (project.id)}
            <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="project-card"
                style="--delay: {i * 0.1}s; --index: {i}"
                in:fly={{ y: 80, duration: 600, delay: i * 100 }}
                use:gsapTilt={{ max: 10, scale: 1.03 }}
            >
                <div class="card-glow"></div>
                <div class="project-image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <div class="project-overlay">
                        <span class="view-btn">
                            <i class="fas fa-external-link-alt"></i>
                            View Project
                        </span>
                    </div>
                    <div class="shimmer"></div>
                </div>
                <div class="project-info">
                    <span class="project-category">{project.category}</span>
                    <h3>{project.title}</h3>
                </div>
            </a>
        {/each}
    </div>

    {#if filteredProjects.length === 0}
        <div class="no-results">
            <i class="fas fa-folder-open"></i>
            <p>No projects found in this category</p>
        </div>
    {/if}
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
        font-size: 1.1rem;
        color: var(--text-muted);
        letter-spacing: 2px;
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
        padding: 30px 5% 80px;
        max-width: 1400px;
        margin: 0 auto;
    }

    /* Type Tabs */
    .type-tabs {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }

    .type-tab {
        padding: 14px 30px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        color: var(--text);
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }

    .type-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--accent);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .type-tab:hover {
        border-color: var(--accent);
        transform: translateY(-3px);
    }

    .type-tab:hover::after {
        transform: scaleX(1);
    }

    .type-tab.active {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-color: transparent;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    }

    .type-tab.active::after {
        display: none;
    }
    /* Category Filters */
    .category-filters {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }

    .filter-pill {
        padding: 8px 18px;
        background: transparent;
        border: 1px solid var(--glass-border);
        border-radius: 50px;
        color: var(--text-muted);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }

    .filter-pill::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: var(--accent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.4s ease, height 0.4s ease;
        z-index: -1;
    }

    .filter-pill:hover {
        color: var(--text);
        border-color: var(--accent);
        transform: scale(1.05);
    }

    .filter-pill:hover::before {
        width: 150%;
        height: 150%;
    }

    .filter-pill.active {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--dark);
        font-weight: 600;
        transform: scale(1.08);
        box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3);
    }

    /* Projects Grid */
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        perspective: 1000px;
    }

    .project-card {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        text-decoration: none;
        color: inherit;
        position: relative;
        
        /* Entrance animation */
        opacity: 0;
        transform: translateY(60px) rotateX(10deg) scale(0.9);
        animation: cardAppear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: var(--delay, 0s);
    }

    @keyframes cardAppear {
        0% {
            opacity: 0;
            transform: translateY(60px) rotateX(10deg) scale(0.9);
            filter: blur(5px);
        }
        50% {
            opacity: 0.8;
            filter: blur(2px);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotateX(0) scale(1);
            filter: blur(0);
        }
    }

    .project-card:hover {
        transform: translateY(-12px) scale(1.02);
        box-shadow: 0 25px 60px rgba(99,102,241,0.3);
        border-color: var(--accent);
    }

    /* Glowing border effect */
    .card-glow {
        position: absolute;
        inset: -2px;
        background: linear-gradient(135deg, var(--accent), var(--primary), var(--cyan), var(--accent));
        background-size: 300% 300%;
        border-radius: 18px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.4s ease;
        animation: glowRotate 4s linear infinite;
    }

    @keyframes glowRotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .project-card:hover .card-glow {
        opacity: 1;
    }

    .project-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .project-card:hover .project-image img {
        transform: scale(1.15);
    }

    /* Shimmer effect */
    .shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transform: skewX(-20deg);
        transition: left 0.6s ease;
    }

    .project-card:hover .shimmer {
        left: 150%;
    }

    .project-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9));
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .project-card:hover .project-overlay {
        opacity: 1;
    }

    .view-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background: white;
        color: var(--primary);
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.9rem;
        transform: translateY(20px) scale(0.9);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .project-card:hover .view-btn {
        transform: translateY(0) scale(1);
    }

    .view-btn:hover {
        background: var(--accent);
        color: var(--dark);
    }

    .project-info {
        padding: 20px;
        position: relative;
        background: var(--glass);
        transition: all 0.3s ease;
    }

    .project-card:hover .project-info {
        background: rgba(99, 102, 241, 0.1);
    }

    .project-category {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(99,102,241,0.2);
        border-radius: 20px;
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 10px;
        font-weight: 600;
        letter-spacing: 1px;
        transition: all 0.3s ease;
    }

    .project-card:hover .project-category {
        background: var(--accent);
        color: var(--dark);
        transform: translateX(5px);
    }

    .project-info h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
        line-height: 1.4;
        transition: all 0.3s ease;
    }

    .project-card:hover .project-info h3 {
        color: var(--accent);
    }

    .no-results {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-muted);
    }

    .no-results i {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.3;
    }

    .no-results p {
        font-size: 1.1rem;
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
        .type-tabs {
            flex-direction: column;
            align-items: stretch;
        }

        .type-tab {
            text-align: center;
        }

        .projects-grid {
            grid-template-columns: 1fr;
        }

        .testimonials-grid {
            grid-template-columns: 1fr;
        }

        .category-filters {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
        }

        .filter-pill {
            flex-shrink: 0;
        }
    }
</style>
