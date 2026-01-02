import './Footer.css';
import logo from '../../img/logo.jpeg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            miHI Matcha brings you the finest organic matcha experiences. 
            Crafted with love and tradition, every cup is a journey to wellness.
          </p>
          <div className="social-icons">
            <a href="#facebook" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#twitter" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#pinterest" aria-label="Pinterest">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#shop">Shop</a></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="footer-section">
          <h3>Customer Care</h3>
          <ul className="footer-links">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Stay Connected</h3>
          <p>Subscribe to get special offers and matcha tips!</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
          <img src={logo} alt="miHI Matcha Logo" className="footer-logo-img" />
          <h2 className="footer-brand">
            miHI <span className="footer-brand-green">Matcha</span>
          </h2>
        </div>
        
        <p>&copy; 2025 miHI Matcha. All rights reserved.</p>
        
        <div className="payment-icons">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-paypal"></i>
          <i className="fab fa-cc-amex"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;