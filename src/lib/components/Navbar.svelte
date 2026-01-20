<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { gsap } from 'gsap';

    let scrolled = false;
    let mobileMenuOpen = false;
    let navElement;
    let logoElement;

    $: currentPath = $page.url.pathname;

    onMount(() => {
        // Initial animation
        gsap.from(logoElement, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            delay: 0.5,
            ease: 'power3.out'
        });

        // Animate nav links
        const links = navElement.querySelectorAll('.nav-links a');
        gsap.from(links, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.7,
            ease: 'power2.out'
        });

        const handleScroll = () => {
            scrolled = window.scrollY > 100;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        { href: '/about', label: 'About' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/contact', label: 'Contact' }
    ];
</script>

<nav class="nav" class:scrolled bind:this={navElement}>
    <a href="/" class="nav-logo" bind:this={logoElement}>
        e-Biz<span>Technocrats</span>
    </a>

    <ul class="nav-links">
        {#each navLinks as link}
            <li>
                <a href={link.href} class:active={currentPath === link.href}>
                    {link.label}
                </a>
            </li>
        {/each}
    </ul>

    <button class="nav-menu-btn" class:active={mobileMenuOpen} on:click={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
    </button>
</nav>

<!-- Mobile Menu -->
{#if mobileMenuOpen}
    <div class="mobile-menu">
        <ul>
            {#each navLinks as link}
                <li>
                    <a href={link.href} on:click={() => mobileMenuOpen = false}>
                        {link.label}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.5rem 5%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        background: linear-gradient(to bottom, rgba(10,10,15,0.9), transparent);
        transition: background 0.3s, backdrop-filter 0.3s;
    }

    .nav.scrolled {
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(20px);
    }

    .nav-logo {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text);
    }

    .nav-logo span {
        background: linear-gradient(135deg, var(--accent), var(--cyan));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .nav-links {
        display: flex;
        list-style: none;
        gap: 2rem;
    }

    .nav-links a {
        font-weight: 500;
        transition: color 0.3s;
        position: relative;
    }

    .nav-links a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--accent);
        transition: width 0.3s;
    }

    .nav-links a:hover::after,
    .nav-links a.active::after {
        width: 100%;
    }

    .nav-links a.active {
        color: var(--accent);
    }

    .nav-menu-btn {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .nav-menu-btn span {
        width: 25px;
        height: 2px;
        background: var(--text);
        transition: transform 0.3s, opacity 0.3s;
    }

    .nav-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .nav-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }

    .mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10,10,15,0.98);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mobile-menu ul {
        list-style: none;
        text-align: center;
    }

    .mobile-menu li {
        margin: 1.5rem 0;
    }

    .mobile-menu a {
        font-size: 2rem;
        font-weight: 600;
        transition: color 0.3s;
    }

    .mobile-menu a:hover {
        color: var(--accent);
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }

        .nav-menu-btn {
            display: flex;
        }
    }
</style>
