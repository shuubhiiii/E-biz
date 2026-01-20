<script>
    import { fly } from 'svelte/transition';
    import { gsapAnimate, gsapTilt, gsapHover, gsapSplitText } from '$lib/actions/gsapAction.js';

    let formData = {
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        message: ''
    };

    let submitStatus = '';

    function handleSubmit() {
        submitStatus = 'sending';
        setTimeout(() => {
            submitStatus = 'sent';
            setTimeout(() => {
                submitStatus = '';
                formData = { name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' };
            }, 2000);
        }, 1500);
    }

    const contactInfo = [
        { icon: 'fas fa-map-marker-alt', title: 'Visit Us', lines: ['160, Sharda Vihar, City Center', 'Gwalior (M.P.), India - 474011'], color: 'primary' },
        { icon: 'fas fa-phone-alt', title: 'Call Us', lines: ['+91-8962733774', '+91-751-2345678'], color: 'purple' },
        { icon: 'fas fa-envelope', title: 'Email Us', lines: ['info@ebiztechnocrats.com', 'sales@ebiztechnocrats.com'], color: 'cyan' },
        { icon: 'fas fa-clock', title: 'Business Hours', lines: ['Mon - Fri: 9:00 AM - 6:00 PM IST', 'Sat: 10:00 AM - 2:00 PM IST'], color: 'gold' }
    ];

    const faqs = [
        { q: 'How long does a typical project take?', a: 'Project timelines vary based on complexity. A simple website might take 2-4 weeks, while enterprise software could take 3-6 months.' },
        { q: 'Do you provide ongoing support?', a: 'Yes! We offer comprehensive maintenance and support packages with 24/7 support for critical systems.' },
        { q: 'What is your development process?', a: 'We follow Agile methodology with regular sprints and client reviews for transparency and flexibility.' },
        { q: 'Can you work with our existing team?', a: 'Absolutely! We offer dedicated team augmentation where our developers integrate with your existing team.' }
    ];

    let openFaq = -1;
</script>

<svelte:head>
    <title>Contact Us - e-Biz Technocrats</title>
    <meta name="description" content="Get in touch with e-Biz Technocrats for your IT project needs. Free consultation available.">
</svelte:head>

<!-- Page Hero -->
<section class="page-hero">
    <div class="page-hero-content" use:gsapAnimate={{ type: 'fadeInUp', scrollTrigger: false }}>
        <span class="section-tag">Get in Touch</span>
        <h1 class="page-title" use:gsapSplitText={{ type: 'chars', stagger: 0.04, delay: 0.2, scrollTrigger: false }}>Contact Us</h1>
        <p class="page-subtitle">Let's discuss how we can help transform your business</p>
    </div>
</section>

<!-- Contact Section -->
<section class="contact-section">
    <div class="contact-grid">
        <!-- Form -->
        <div class="contact-form-wrapper" use:gsapAnimate={{ type: 'fadeInLeft', delay: 0.3 }}>
            <h2>Send us a Message</h2>
            <p>Fill out the form and we'll get back to you within 24 hours.</p>
            
            <form class="contact-form" on:submit|preventDefault={handleSubmit}>
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Your Name *</label>
                        <input type="text" id="name" bind:value={formData.name} required placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" bind:value={formData.email} required placeholder="john@example.com">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" bind:value={formData.phone} placeholder="+1 234 567 8900">
                    </div>
                    <div class="form-group">
                        <label for="company">Company Name</label>
                        <input type="text" id="company" bind:value={formData.company} placeholder="Your Company">
                    </div>
                </div>

                <div class="form-group">
                    <label for="service">Service Interested In *</label>
                    <select id="service" bind:value={formData.service} required>
                        <option value="">Select a Service</option>
                        <option value="software">Software Development</option>
                        <option value="mobile">Mobile App Development</option>
                        <option value="web">Web Development</option>
                        <option value="digital">Digital Marketing</option>
                        <option value="infrastructure">IT Infrastructure</option>
                        <option value="training">Education & Training</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="message">Project Details *</label>
                    <textarea id="message" bind:value={formData.message} rows="5" required placeholder="Tell us about your project..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" disabled={submitStatus !== ''}>
                    {#if submitStatus === 'sending'}
                        <i class="fas fa-spinner fa-spin"></i> Sending...
                    {:else if submitStatus === 'sent'}
                        <i class="fas fa-check"></i> Message Sent!
                    {:else}
                        <span>Send Message</span>
                        <i class="fas fa-paper-plane"></i>
                    {/if}
                </button>
            </form>
        </div>

        <!-- Contact Info -->
        <div class="contact-info" use:gsapAnimate={{ type: 'fadeInRight', delay: 0.3 }}>
            {#each contactInfo as info, i}
                <div 
                    class="contact-card"
                    use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.1, start: 'top 90%' }}
                    use:gsapTilt={{ max: 8, scale: 1.02 }}
                >
                    <div class="contact-icon {info.color}">
                        <i class={info.icon}></i>
                    </div>
                    <h3>{info.title}</h3>
                    {#each info.lines as line}
                        <p>{line}</p>
                    {/each}
                </div>
            {/each}

            <div class="social-section" use:gsapAnimate={{ type: 'fadeInUp', delay: 0.5 }}>
                <h3>Connect With Us</h3>
                <div class="social-links">
                    <a href="#" use:gsapHover={{ scale: 1.2, y: -3 }}><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" use:gsapHover={{ scale: 1.2, y: -3 }}><i class="fab fa-facebook-f"></i></a>
                    <a href="#" use:gsapHover={{ scale: 1.2, y: -3 }}><i class="fab fa-twitter"></i></a>
                    <a href="#" use:gsapHover={{ scale: 1.2, y: -3 }}><i class="fab fa-instagram"></i></a>
                    <a href="#" use:gsapHover={{ scale: 1.2, y: -3 }}><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section class="faq-section">
    <div class="section-header" use:gsapAnimate={{ type: 'fadeInUp' }}>
        <span class="section-tag">FAQ</span>
        <h2>Frequently Asked Questions</h2>
    </div>

    <div class="faq-list">
        {#each faqs as faq, i}
            <div 
                class="faq-item" 
                class:open={openFaq === i}
                use:gsapAnimate={{ type: 'fadeInUp', delay: i * 0.1, start: 'top 90%' }}
            >
                <button class="faq-question" on:click={() => openFaq = openFaq === i ? -1 : i}>
                    <span>{faq.q}</span>
                    <i class="fas fa-plus"></i>
                </button>
                {#if openFaq === i}
                    <div class="faq-answer" in:fly={{ y: -10, duration: 200 }}>
                        <p>{faq.a}</p>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</section>

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

    /* Contact Section */
    .contact-section {
        padding: 50px 5%;
        max-width: 1300px;
        margin: 0 auto;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 50px;
    }

    .contact-form-wrapper {
        padding: 45px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 25px;
    }

    .contact-form-wrapper h2 {
        font-size: 1.8rem;
        margin-bottom: 10px;
    }

    .contact-form-wrapper > p {
        color: var(--text-muted);
        margin-bottom: 30px;
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        font-weight: 500;
        font-size: 0.9rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 14px 18px;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        color: var(--text);
        font-family: inherit;
        font-size: 1rem;
        transition: border-color 0.3s, background 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255,255,255,0.08);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: var(--text-dim);
    }

    .form-group select option {
        background: var(--dark);
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: var(--text);
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: var(--glow-primary);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* Contact Info */
    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .contact-card {
        padding: 25px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        transition: border-color 0.3s;
    }

    .contact-card:hover {
        border-color: var(--accent);
    }

    .contact-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        margin-bottom: 15px;
    }

    .contact-icon.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
    .contact-icon.purple { background: linear-gradient(135deg, var(--purple), #ec4899); }
    .contact-icon.cyan { background: linear-gradient(135deg, var(--cyan), #22d3ee); }
    .contact-icon.gold { background: linear-gradient(135deg, var(--gold), #fbbf24); }

    .contact-card h3 {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }

    .contact-card p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }

    .social-section {
        padding: 25px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
    }

    .social-section h3 {
        font-size: 1.1rem;
        margin-bottom: 15px;
    }

    .social-links {
        display: flex;
        gap: 12px;
    }

    .social-links a {
        width: 45px;
        height: 45px;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }

    .social-links a:hover {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--dark);
        transform: translateY(-3px);
    }

    /* FAQ */
    .faq-section {
        padding: 80px 5%;
        max-width: 800px;
        margin: 0 auto;
    }

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .faq-item {
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        overflow: hidden;
        transition: border-color 0.3s;
    }

    .faq-item:hover,
    .faq-item.open {
        border-color: var(--accent);
    }

    .faq-question {
        width: 100%;
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: none;
        border: none;
        color: var(--text);
        font-weight: 600;
        font-size: 1rem;
        text-align: left;
        cursor: pointer;
    }

    .faq-question i {
        color: var(--accent);
        transition: transform 0.3s;
    }

    .faq-item.open .faq-question i {
        transform: rotate(45deg);
    }

    .faq-answer {
        padding: 0 25px 20px;
    }

    .faq-answer p {
        color: var(--text-muted);
        line-height: 1.7;
    }

    @media (max-width: 968px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }

        .form-row {
            grid-template-columns: 1fr;
        }
    }
</style>
