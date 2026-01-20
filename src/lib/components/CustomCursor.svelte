<script>
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';

    let visible = true;
    let isClicking = false;
    let trails = Array(12).fill(null).map((_, i) => ({ x: 0, y: 0, opacity: 1 - (i / 12) }));
    
    const cursorPos = spring({ x: 0, y: 0 }, { stiffness: 0.08, damping: 0.4 });
    const dotPos = spring({ x: 0, y: 0 }, { stiffness: 0.5, damping: 0.7 });
    
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;

    onMount(() => {
        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorPos.set({ x: e.clientX, y: e.clientY });
            dotPos.set({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e) => {
            if (e.target.matches('a, button, .card, input, textarea, select, .interactive, .project-card, .nav-link, .type-tab, .filter-pill')) {
                isHovering = true;
            }
        };

        const handleMouseLeave = (e) => {
            if (e.target.matches('a, button, .card, input, textarea, select, .interactive, .project-card, .nav-link, .type-tab, .filter-pill')) {
                isHovering = false;
            }
        };
        
        const handleMouseDown = () => isClicking = true;
        const handleMouseUp = () => isClicking = false;

        const handleWindowLeave = () => visible = false;
        const handleWindowEnter = () => visible = true;
        
        // Animate trails
        let animationId;
        const animateTrails = () => {
            let prevX = mouseX;
            let prevY = mouseY;
            
            for (let i = 0; i < trails.length; i++) {
                const ease = 0.25 - (i * 0.015);
                trails[i].x += (prevX - trails[i].x) * ease;
                trails[i].y += (prevY - trails[i].y) * ease;
                prevX = trails[i].x;
                prevY = trails[i].y;
            }
            trails = trails; // Trigger reactivity
            
            animationId = requestAnimationFrame(animateTrails);
        };
        animateTrails();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleWindowLeave);
        document.addEventListener('mouseenter', handleWindowEnter);

        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleWindowLeave);
            document.removeEventListener('mouseenter', handleWindowEnter);
        };
    });
</script>

<div class="cursor-wrapper" class:hidden={!visible}>
    <!-- Trailing particles -->
    {#each trails as trail, i}
        <div 
            class="cursor-trail"
            style="
                left: {trail.x}px; 
                top: {trail.y}px;
                width: {14 - i}px;
                height: {14 - i}px;
                opacity: {trail.opacity * 0.6};
            "
        ></div>
    {/each}
    
    <!-- Main cursor ring -->
    <div 
        class="cursor" 
        class:hover={isHovering}
        class:clicking={isClicking}
        style="left: {$cursorPos.x}px; top: {$cursorPos.y}px"
    >
        <div class="cursor-glow"></div>
    </div>
    
    <!-- Center dot -->
    <div 
        class="cursor-dot"
        class:hover={isHovering}
        class:clicking={isClicking}
        style="left: {$dotPos.x}px; top: {$dotPos.y}px"
    ></div>
</div>

<style>
    .cursor-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
        overflow: hidden;
    }

    .cursor-wrapper.hidden .cursor,
    .cursor-wrapper.hidden .cursor-dot,
    .cursor-wrapper.hidden .cursor-trail {
        opacity: 0 !important;
    }
    
    /* Trailing particles */
    .cursor-trail {
        position: fixed;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(34, 211, 238, 0.3) 50%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .cursor {
        position: fixed;
        width: 44px;
        height: 44px;
        border: 2px solid rgba(99, 102, 241, 0.9);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                    background 0.3s ease, 
                    border-color 0.3s ease;
        pointer-events: none;
        background: transparent;
    }
    
    .cursor-glow {
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1px solid rgba(34, 211, 238, 0.4);
        animation: cursorPulse 2s ease-in-out infinite;
    }

    .cursor.hover {
        width: 70px;
        height: 70px;
        background: rgba(99, 102, 241, 0.15);
        border-color: rgba(34, 211, 238, 1);
    }
    
    .cursor.clicking {
        width: 35px;
        height: 35px;
        border-color: rgba(16, 185, 129, 1);
    }

    .cursor-dot {
        position: fixed;
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #6366f1, #22d3ee);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease, width 0.2s ease, height 0.2s ease;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.9),
                    0 0 30px rgba(34, 211, 238, 0.5),
                    0 0 45px rgba(99, 102, 241, 0.3);
        pointer-events: none;
    }
    
    .cursor-dot.hover {
        width: 14px;
        height: 14px;
        box-shadow: 0 0 20px rgba(34, 211, 238, 1),
                    0 0 40px rgba(99, 102, 241, 0.7),
                    0 0 60px rgba(34, 211, 238, 0.4);
    }
    
    .cursor-dot.clicking {
        transform: translate(-50%, -50%) scale(0.7);
    }
    
    @keyframes cursorPulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.3);
            opacity: 0.2;
        }
    }

    @media (max-width: 768px), (hover: none) {
        .cursor-wrapper {
            display: none;
        }
    }
</style>
