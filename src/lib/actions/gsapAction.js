/**
 * Svelte Action for GSAP Animations
 * Use as: use:gsapAnimate={{ type: 'fadeInUp', delay: 0.2 }}
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Animation presets
const presets = {
    fadeInUp: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    },
    fadeInDown: {
        from: { opacity: 0, y: -60 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    },
    fadeInLeft: {
        from: { opacity: 0, x: -60 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    },
    fadeInRight: {
        from: { opacity: 0, x: 60 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    },
    scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    },
    rotateIn: {
        from: { opacity: 0, rotation: -15, y: 30 },
        to: { opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: 'power3.out' }
    },
    clipReveal: {
        from: { clipPath: 'inset(0 100% 0 0)' },
        to: { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut' }
    },
    blur: {
        from: { opacity: 0, filter: 'blur(10px)' },
        to: { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
    },
    slideUp: {
        from: { y: '100%' },
        to: { y: '0%', duration: 0.8, ease: 'power3.out' }
    },
    float: {
        from: { y: 0 },
        to: { y: -15, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true }
    },
    pulse: {
        from: { scale: 1 },
        to: { scale: 1.05, duration: 1, ease: 'sine.inOut', repeat: -1, yoyo: true }
    },
    glow: {
        from: { boxShadow: '0 0 0 rgba(0, 212, 255, 0)' },
        to: { 
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)', 
            duration: 1.5, 
            ease: 'sine.inOut', 
            repeat: -1, 
            yoyo: true 
        }
    }
};

/**
 * Main GSAP animation action
 */
export function gsapAnimate(node, params = {}) {
    const {
        type = 'fadeInUp',
        delay = 0,
        duration,
        stagger = 0,
        scrollTrigger = true,
        start = 'top 85%',
        end = 'bottom 20%',
        toggleActions = 'play none none reverse',
        scrub = false,
        pin = false,
        markers = false,
        once = false,
        children = null,
        custom = null
    } = params;

    let animation;
    let scrollTriggerInstance;

    const preset = presets[type] || presets.fadeInUp;
    const fromVars = { ...preset.from };
    const toVars = { 
        ...preset.to,
        delay,
        ...(duration && { duration })
    };

    // If animating children with stagger
    if (children) {
        const childElements = node.querySelectorAll(children);
        if (childElements.length > 0) {
            gsap.set(childElements, fromVars);
            
            if (scrollTrigger && typeof window !== 'undefined') {
                scrollTriggerInstance = ScrollTrigger.create({
                    trigger: node,
                    start,
                    end,
                    toggleActions: once ? 'play none none none' : toggleActions,
                    markers,
                    scrub,
                    pin,
                    onEnter: () => {
                        animation = gsap.to(childElements, {
                            ...toVars,
                            stagger
                        });
                    },
                    onLeaveBack: once ? undefined : () => {
                        gsap.to(childElements, fromVars);
                    }
                });
            } else {
                animation = gsap.to(childElements, {
                    ...toVars,
                    stagger
                });
            }
            
            return {
                destroy() {
                    animation?.kill();
                    scrollTriggerInstance?.kill();
                }
            };
        }
    }

    // Custom animation
    if (custom) {
        gsap.set(node, custom.from || {});
        
        if (scrollTrigger && typeof window !== 'undefined') {
            scrollTriggerInstance = ScrollTrigger.create({
                trigger: node,
                start,
                end,
                toggleActions: once ? 'play none none none' : toggleActions,
                markers,
                scrub,
                pin,
                onEnter: () => {
                    animation = gsap.to(node, {
                        ...custom.to,
                        delay
                    });
                },
                onLeaveBack: once ? undefined : () => {
                    gsap.to(node, custom.from || {});
                }
            });
        } else {
            animation = gsap.to(node, {
                ...custom.to,
                delay
            });
        }
        
        return {
            destroy() {
                animation?.kill();
                scrollTriggerInstance?.kill();
            }
        };
    }

    // Standard animation
    gsap.set(node, fromVars);

    if (scrollTrigger && typeof window !== 'undefined') {
        scrollTriggerInstance = ScrollTrigger.create({
            trigger: node,
            start,
            end,
            toggleActions: once ? 'play none none none' : toggleActions,
            markers,
            scrub,
            pin,
            onEnter: () => {
                animation = gsap.to(node, toVars);
            },
            onLeaveBack: once ? undefined : () => {
                gsap.to(node, fromVars);
            }
        });
    } else {
        animation = gsap.to(node, toVars);
    }

    return {
        update(newParams) {
            // Handle param updates if needed
        },
        destroy() {
            animation?.kill();
            scrollTriggerInstance?.kill();
        }
    };
}

/**
 * Hover animation action
 */
export function gsapHover(node, params = {}) {
    const {
        scale = 1.05,
        y = -5,
        duration = 0.3,
        ease = 'power2.out',
        magnetic = false,
        magneticStrength = 0.3
    } = params;

    const originalState = {
        scale: 1,
        y: 0,
        x: 0
    };

    const handleMouseEnter = () => {
        gsap.to(node, {
            scale,
            y,
            duration,
            ease
        });
    };

    const handleMouseLeave = () => {
        gsap.to(node, {
            ...originalState,
            duration,
            ease
        });
    };

    const handleMouseMove = (e) => {
        if (!magnetic) return;
        
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(node, {
            x: x * magneticStrength,
            y: y * magneticStrength,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    
    if (magnetic) {
        node.addEventListener('mousemove', handleMouseMove);
    }

    return {
        destroy() {
            node.removeEventListener('mouseenter', handleMouseEnter);
            node.removeEventListener('mouseleave', handleMouseLeave);
            if (magnetic) {
                node.removeEventListener('mousemove', handleMouseMove);
            }
        }
    };
}

/**
 * 3D Tilt effect action
 */
export function gsapTilt(node, params = {}) {
    const {
        max = 15,
        perspective = 1000,
        scale = 1.02,
        speed = 300
    } = params;

    const handleMouseMove = (e) => {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -max;
        const rotateY = ((x - centerX) / centerX) * max;
        
        gsap.to(node, {
            rotateX,
            rotateY,
            scale,
            transformPerspective: perspective,
            duration: speed / 1000,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(node, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    node.style.transformStyle = 'preserve-3d';
    
    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);

    return {
        destroy() {
            node.removeEventListener('mousemove', handleMouseMove);
            node.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
}

/**
 * Parallax scroll action
 */
export function gsapParallax(node, params = {}) {
    const {
        speed = 0.5,
        direction = 'y'
    } = params;

    if (typeof window === 'undefined') return { destroy() {} };

    const animation = gsap.to(node, {
        [direction]: () => window.innerHeight * speed * (direction === 'y' ? -1 : 1),
        ease: 'none',
        scrollTrigger: {
            trigger: node.parentElement || node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    return {
        destroy() {
            animation.scrollTrigger?.kill();
            animation.kill();
        }
    };
}

/**
 * Text split and animate action
 */
export function gsapSplitText(node, params = {}) {
    const {
        type = 'words', // 'chars' or 'words'
        animation = 'fadeInUp',
        stagger = 0.05,
        delay = 0,
        scrollTrigger = true,
        start = 'top 85%'
    } = params;

    const originalText = node.textContent;
    let elements;

    if (type === 'chars') {
        node.innerHTML = originalText.split('').map((char, i) => 
            char === ' ' ? ' ' : `<span class="split-char" style="display:inline-block">${char}</span>`
        ).join('');
        elements = node.querySelectorAll('.split-char');
    } else {
        node.innerHTML = originalText.split(' ').map(word => 
            `<span class="split-word" style="display:inline-block">${word}</span>`
        ).join(' ');
        elements = node.querySelectorAll('.split-word');
    }

    const preset = presets[animation] || presets.fadeInUp;
    gsap.set(elements, preset.from);

    let scrollTriggerInstance;

    if (scrollTrigger && typeof window !== 'undefined') {
        scrollTriggerInstance = ScrollTrigger.create({
            trigger: node,
            start,
            onEnter: () => {
                gsap.to(elements, {
                    ...preset.to,
                    delay,
                    stagger
                });
            }
        });
    } else {
        gsap.to(elements, {
            ...preset.to,
            delay,
            stagger
        });
    }

    return {
        destroy() {
            scrollTriggerInstance?.kill();
            node.textContent = originalText;
        }
    };
}

/**
 * Counter animation action
 */
export function gsapCounter(node, params = {}) {
    const {
        target = 100,
        duration = 2,
        suffix = '',
        prefix = '',
        decimals = 0,
        scrollTrigger = true,
        start = 'top 85%'
    } = params;

    const counter = { value: 0 };
    let animation;
    let scrollTriggerInstance;

    const updateCounter = () => {
        node.textContent = prefix + counter.value.toFixed(decimals) + suffix;
    };

    const animate = () => {
        animation = gsap.to(counter, {
            value: target,
            duration,
            ease: 'power2.out',
            onUpdate: updateCounter
        });
    };

    if (scrollTrigger && typeof window !== 'undefined') {
        scrollTriggerInstance = ScrollTrigger.create({
            trigger: node,
            start,
            onEnter: animate,
            once: true
        });
    } else {
        animate();
    }

    return {
        destroy() {
            animation?.kill();
            scrollTriggerInstance?.kill();
        }
    };
}

export { gsap, ScrollTrigger };
