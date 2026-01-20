/**
 * GSAP Animation Utilities for Svelte
 * Provides reusable animation functions and ScrollTrigger integration
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Default animation settings
export const defaults = {
    duration: 1,
    ease: 'power3.out'
};

/**
 * Fade in from bottom animation
 */
export function fadeInUp(node, { delay = 0, duration = 0.8, y = 50 } = {}) {
    return gsap.from(node, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: 'power3.out'
    });
}

/**
 * Fade in from left animation
 */
export function fadeInLeft(node, { delay = 0, duration = 0.8, x = -50 } = {}) {
    return gsap.from(node, {
        opacity: 0,
        x,
        duration,
        delay,
        ease: 'power3.out'
    });
}

/**
 * Fade in from right animation
 */
export function fadeInRight(node, { delay = 0, duration = 0.8, x = 50 } = {}) {
    return gsap.from(node, {
        opacity: 0,
        x,
        duration,
        delay,
        ease: 'power3.out'
    });
}

/**
 * Scale in animation
 */
export function scaleIn(node, { delay = 0, duration = 0.6, scale = 0.8 } = {}) {
    return gsap.from(node, {
        opacity: 0,
        scale,
        duration,
        delay,
        ease: 'back.out(1.7)'
    });
}

/**
 * Stagger children animation
 */
export function staggerChildren(parent, childSelector, { delay = 0, stagger = 0.1, y = 30 } = {}) {
    const children = parent.querySelectorAll(childSelector);
    return gsap.from(children, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        stagger,
        ease: 'power3.out'
    });
}

/**
 * Text reveal animation (word by word)
 */
export function textReveal(node, { delay = 0, stagger = 0.05 } = {}) {
    const text = node.textContent;
    const words = text.split(' ');
    node.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    
    const wordElements = node.querySelectorAll('.word');
    return gsap.from(wordElements, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay,
        stagger,
        ease: 'power2.out'
    });
}

/**
 * Counter animation
 */
export function animateCounter(node, { target, duration = 2, suffix = '' } = {}) {
    const counter = { value: 0 };
    return gsap.to(counter, {
        value: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            node.textContent = Math.floor(counter.value) + suffix;
        }
    });
}

/**
 * Magnetic effect for buttons/elements
 */
export function magneticEffect(node, strength = 0.3) {
    const handleMouseMove = (e) => {
        const rect = node.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(node, {
            x: x * strength,
            y: y * strength,
            duration: 0.3,
            ease: 'power2.out'
        });
    };
    
    const handleMouseLeave = () => {
        gsap.to(node, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    };
    
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
 * Parallax effect
 */
export function parallax(node, { speed = 0.5 } = {}) {
    if (typeof window === 'undefined') return;
    
    gsap.to(node, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

/**
 * ScrollTrigger animation
 */
export function scrollAnimation(node, { 
    animation = 'fadeInUp',
    start = 'top 80%',
    toggleActions = 'play none none reverse',
    markers = false
} = {}) {
    if (typeof window === 'undefined') return;
    
    const animations = {
        fadeInUp: { opacity: 0, y: 50 },
        fadeInLeft: { opacity: 0, x: -50 },
        fadeInRight: { opacity: 0, x: 50 },
        scaleIn: { opacity: 0, scale: 0.8 },
        rotateIn: { opacity: 0, rotation: -10 }
    };
    
    const fromVars = animations[animation] || animations.fadeInUp;
    
    gsap.from(node, {
        ...fromVars,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: node,
            start,
            toggleActions,
            markers
        }
    });
}

/**
 * Hover scale animation
 */
export function hoverScale(node, { scale = 1.05, duration = 0.3 } = {}) {
    const handleMouseEnter = () => {
        gsap.to(node, { scale, duration, ease: 'power2.out' });
    };
    
    const handleMouseLeave = () => {
        gsap.to(node, { scale: 1, duration, ease: 'power2.out' });
    };
    
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    
    return {
        destroy() {
            node.removeEventListener('mouseenter', handleMouseEnter);
            node.removeEventListener('mouseleave', handleMouseLeave);
        }
    };
}

/**
 * 3D tilt effect
 */
export function tilt3D(node, { max = 15, perspective = 1000 } = {}) {
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
            transformPerspective: perspective,
            duration: 0.3,
            ease: 'power2.out'
        });
    };
    
    const handleMouseLeave = () => {
        gsap.to(node, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    };
    
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
 * Split text animation
 */
export function splitText(node, { type = 'chars', stagger = 0.03, delay = 0 } = {}) {
    const text = node.textContent;
    let elements;
    
    if (type === 'chars') {
        node.innerHTML = text.split('').map(char => 
            char === ' ' ? ' ' : `<span class="char">${char}</span>`
        ).join('');
        elements = node.querySelectorAll('.char');
    } else {
        node.innerHTML = text.split(' ').map(word => 
            `<span class="word"><span class="word-inner">${word}</span></span>`
        ).join(' ');
        elements = node.querySelectorAll('.word-inner');
    }
    
    return gsap.from(elements, {
        opacity: 0,
        y: 50,
        rotateX: -90,
        duration: 0.6,
        delay,
        stagger,
        ease: 'back.out(1.7)'
    });
}

/**
 * Timeline creator for complex sequences
 */
export function createTimeline(options = {}) {
    return gsap.timeline(options);
}

/**
 * Refresh ScrollTrigger (call after dynamic content loads)
 */
export function refreshScrollTrigger() {
    if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

/**
 * Kill all ScrollTriggers (call on component destroy)
 */
export function killScrollTriggers() {
    if (typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}

export { gsap, ScrollTrigger };
