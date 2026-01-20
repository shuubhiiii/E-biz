<script>
    import { onMount } from 'svelte';
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import CustomCursor from '$lib/components/CustomCursor.svelte';
    import WebGLCanvas from '$lib/components/WebGLCanvas.svelte';
    import WhatsAppFloat from '$lib/components/WhatsAppFloat.svelte';

    let loading = true;

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 1500); // Slightly faster load
    });
</script>

<svelte:head>
    <title>e-Biz Technocrats | IT Solutions & Services</title>
    <meta name="description" content="Leading IT company providing software development, mobile apps, web development, and digital marketing services since 2003.">
</svelte:head>

{#if loading}
    <Loader />
{/if}

<CustomCursor />
<WebGLCanvas />
<Navbar />

<main class:visible={!loading}>
    <slot />
</main>

<WhatsAppFloat />
<Footer />

<style>
    main {
        position: relative;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    main.visible {
        opacity: 1;
    }
</style>
