<script>
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    const progress = tweened(0, { duration: 2000, easing: cubicOut });

    onMount(() => {
        progress.set(100);
    });
</script>

<div class="loader">
    <div class="loader-ring"></div>
    <div class="loader-text">e-Biz Technocrats</div>
    <div class="loader-progress">
        <div class="loader-progress-bar" style="width: {$progress}%"></div>
    </div>
    <div class="loader-percentage">{Math.round($progress)}%</div>
</div>

<style>
    .loader {
        position: fixed;
        inset: 0;
        background: var(--dark);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 25px;
    }

    .loader-ring {
        width: 80px;
        height: 80px;
        border: 3px solid var(--glass-border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .loader-text {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--accent), var(--cyan));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .loader-progress {
        width: 200px;
        height: 4px;
        background: var(--glass);
        border-radius: 2px;
        overflow: hidden;
    }

    .loader-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--accent), var(--cyan));
        transition: width 0.1s;
    }

    .loader-percentage {
        font-family: 'Space Mono', monospace;
        color: var(--text-muted);
        font-size: 0.875rem;
    }
</style>
