<script>
    import { onMount } from 'svelte';
    import { gsapAnimate, gsapCounter, gsapTilt } from '$lib/actions/gsapAction.js';

    const stats = [
        { number: 20, suffix: '+', label: 'Years Experience' },
        { number: 500, suffix: '+', label: 'Projects Delivered' },
        { number: 50, suffix: '+', label: 'Team Members' },
        { number: 15, suffix: '+', label: 'Countries Served' }
    ];
</script>

<section class="stats-section" use:gsapAnimate={{ type: 'fadeInUp', start: 'top 90%' }}>
    <div class="stats-grid">
        {#each stats as stat, i}
            <div 
                class="stat-card" 
                use:gsapAnimate={{ type: 'scaleIn', delay: i * 0.1, start: 'top 85%' }}
                use:gsapTilt={{ max: 10, scale: 1.02 }}
            >
                <div 
                    class="stat-number"
                    use:gsapCounter={{ target: stat.number, suffix: stat.suffix, duration: 2.5 }}
                >
                    0{stat.suffix}
                </div>
                <div class="stat-label">{stat.label}</div>
            </div>
        {/each}
    </div>
</section>

<style>
    .stats-section {
        padding: 80px 5%;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .stat-card {
        text-align: center;
        padding: 40px 30px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        transition: transform 0.3s, border-color 0.3s;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent);
    }

    .stat-number {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(135deg, var(--accent), var(--cyan));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 10px;
        font-family: 'Space Mono', monospace;
    }

    .stat-label {
        font-size: 1rem;
        color: var(--text-muted);
    }
</style>
