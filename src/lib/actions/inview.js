export function inview(node) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    node.dispatchEvent(new CustomEvent('enter'));
                } else {
                    node.dispatchEvent(new CustomEvent('leave'));
                }
            });
        },
        { threshold: 0.3 }
    );

    observer.observe(node);

    return {
        destroy() {
            observer.unobserve(node);
        }
    };
}
