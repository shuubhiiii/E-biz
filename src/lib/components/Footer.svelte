<script>
</script>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-brand">
            <h3>e-Biz Technocrats</h3>
            <p>Delivering excellence in IT since 2003. ISO 9001:2015 certified with global presence across 15+ countries.</p>
            <div class="footer-social">
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
        
        <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="/services">Services</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </div>
        
        <div class="footer-contact">
            <h4>Contact Us</h4>
            <p><i class="fas fa-map-marker-alt"></i> 160, Sharda Vihar, Gwalior, India</p>
            <p><i class="fas fa-phone"></i> +91-8962733774</p>
            <p><i class="fas fa-envelope"></i> info@ebiztechnocrats.com</p>
        </div>
    </div>
    
    <div class="footer-bottom">
        <p>© 2026 e-Biz Technocrats Pvt. Ltd. All Rights Reserved.</p>
    </div>
</footer>

<style>
    .footer {
        background: var(--dark-light);
        border-top: 1px solid var(--glass-border);
        padding-top: 80px;
        position: relative;
        z-index: 1;
    }

    .footer-content {
        display: grid;
        grid-template-columns: 2fr 1fr 1.5fr;
        gap: 60px;
        padding: 0 5% 60px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .footer-brand h3 {
        font-size: 1.75rem;
        font-weight: 800;
        margin-bottom: 20px;
    }

    .footer-brand p {
        color: var(--text-muted);
        line-height: 1.8;
        margin-bottom: 25px;
    }

    .footer-social {
        display: flex;
        gap: 12px;
    }

    .footer-social a {
        width: 40px;
        height: 40px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }

    .footer-social a:hover {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--dark);
    }

    .footer-links h4,
    .footer-contact h4 {
        font-size: 1.125rem;
        font-weight: 700;
        margin-bottom: 25px;
    }

    .footer-links ul {
        list-style: none;
    }

    .footer-links li {
        margin-bottom: 12px;
    }

    .footer-links a {
        color: var(--text-muted);
        transition: color 0.3s, padding-left 0.3s;
    }

    .footer-links a:hover {
        color: var(--accent);
        padding-left: 10px;
    }

    .footer-contact p {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-muted);
        margin-bottom: 15px;
    }

    .footer-contact i {
        color: var(--accent);
        width: 20px;
    }

    .footer-bottom {
        padding: 25px 5%;
        border-top: 1px solid var(--glass-border);
        text-align: center;
        color: var(--text-dim);
        font-size: 0.9rem;
    }

    @media (max-width: 1024px) {
        .footer-content {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .footer-social {
            justify-content: center;
        }

        .footer-contact p {
            justify-content: center;
        }
    }
</style>
