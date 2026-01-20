<script>
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';

    let visible = true;
    
    const cursorPos = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.5 });
    const dotPos = spring({ x: 0, y: 0 }, { stiffness: 0.3, damping: 0.6 });
    
    let isHovering = false;

    onMount(() => {
        const handleMouseMove = (e) => {
            cursorPos.set({ x: e.clientX, y: e.clientY });
            dotPos.set({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e) => {
            if (e.target.matches('a, button, .card, input, textarea, select, .interactive')) {
                isHovering = true;
            }
        };

        const handleMouseLeave = (e) => {
            if (e.target.matches('a, button, .card, input, textarea, select, .interactive')) {
                isHovering = false;
            }
        };

        const handleWindowLeave = () => visible = false;
        const handleWindowEnter = () => visible = true;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);
        document.addEventListener('mouseleave', handleWindowLeave);
        document.addEventListener('mouseenter', handleWindowEnter);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mouseleave', handleWindowLeave);
            document.removeEventListener('mouseenter', handleWindowEnter);
        };
    });
</script>

<div class="cursor-wrapper" class:hidden={!visible}>
    <div 
        class="cursor" 
        class:hover={isHovering}
        style="left: {$cursorPos.x}px; top: {$cursorPos.y}px"
    ></div>
    <div 
        class="cursor-dot"
        style="left: {$dotPos.x}px; top: {$dotPos.y}px"
    ></div>
</div>

<style>
    .cursor-wrapper {
        pointer-events: none;
        z-index: 10000;
    }

    .cursor-wrapper.hidden .cursor,
    .cursor-wrapper.hidden .cursor-dot {
        opacity: 0;
    }

    .cursor {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background 0.3s, opacity 0.3s;
        mix-blend-mode: difference;
    }

    .cursor.hover {
        width: 60px;
        height: 60px;
        background: rgba(0, 255, 136, 0.1);
    }

    .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--accent);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
    }

    @media (max-width: 768px) {
        .cursor-wrapper {
            display: none;
        }
    }
</style>
