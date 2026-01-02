import "./About.css";
import matchaImg from "../../img/ClassicMatcha.jpg";
import strawberryImg from "../../img/StrawberryMatchaLatte2.jpg";
import vanillaImg from "../../img/VanillaMatchaLatte.jpg";

const About = () => {
  return (
    <div className="about-page">
      {/* Simple Hero */}
      <section className="about-hero-simple">
        <h1>About miHi Matcha</h1>
        <p>Bringing authentic Japanese matcha culture to Pakistan</p>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <h2>What We Stand For</h2>
        <div className="values-container">
          <div className="value-box">
            <span className="value-emoji">🍵</span>
            <h3>Premium Quality</h3>
            <p>We source only the finest ceremonial-grade matcha from Japan.</p>
          </div>
          <div className="value-box">
            <span className="value-emoji">💚</span>
            <h3>Health & Wellness</h3>
            <p>Packed with antioxidants and natural energy for your lifestyle.</p>
          </div>
          <div className="value-box">
            <span className="value-emoji">🎨</span>
            <h3>Creative Innovation</h3>
            <p>From classic to creative flavors that delight your taste buds.</p>
          </div>
          <div className="value-box">
            <span className="value-emoji">🌱</span>
            <h3>Sustainability</h3>
            <p>Committed to eco-friendly practices and sustainable farming.</p>
          </div>
        </div>
      </section>

       {/* Our Story */}
      <section className="our-story">
        <div className="story-container">
          <div className="story-left">
            <h2>Journey of Mishaal and Hiba</h2>
            <p>
              At miHi Matcha, we believe that every cup tells a story. Born from a passion 
              for authentic Japanese matcha and a desire to bring its vibrant energy to 
              Karachi, we've created a space where tradition meets modern creativity.
            </p>
            <p>
              Our journey began with a simple mission: to share the incredible benefits 
              and delicious taste of premium matcha with our community. Every drink we 
              craft is a celebration of quality, flavor, and the art of mindful living.
            </p>
          </div>
          <div className="story-right">
            <img src={matchaImg} alt="Matcha Latte" />
          </div>
        </div>
      </section>

      {/* Why Matcha */}
      <section className="why-matcha-section">
        <div className="why-container">
          <div className="why-left">
            <img src={strawberryImg} alt="Strawberry Matcha" />
          </div>
          <div className="why-right">
            <h2>Why Choose Matcha?</h2>
            <div className="benefit-list">
              <div className="benefit">
                <span>⚡</span>
                <div>
                  <h4>Natural Energy</h4>
                  <p>Sustained energy without jitters or crashes</p>
                </div>
              </div>
              <div className="benefit">
                <span>🧠</span>
                <div>
                  <h4>Enhanced Focus</h4>
                  <p>L-theanine promotes calm alertness</p>
                </div>
              </div>
              <div className="benefit">
                <span>💪</span>
                <div>
                  <h4>Rich in Antioxidants</h4>
                  <p>EGCG supports overall health</p>
                </div>
              </div>
              <div className="benefit">
                <span>✨</span>
                <div>
                  <h4>Metabolism Boost</h4>
                  <p>Naturally supports weight management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="visit-us">
        <h2>Visit Us</h2>
        <div className="visit-container">
          <div className="visit-info">
            <div className="info-item">
              <h3>📍 Location</h3>
              <p>Islamabad, Pakistan</p>
            </div>
            <div className="info-item">
              <h3>⏰ Hours</h3>
              <p>Monday - Sunday</p>
              <p>9:00 AM - 10:00 PM</p>
            </div>
            <div className="info-item">
              <h3>📞 Contact</h3>
              <p>info@mihimatcha.com</p>
              <p>+92 XXX XXXXXXX</p>
            </div>
          </div>
          <div className="visit-cta-box">
            <h3>Ready to try?</h3>
            <p>Experience the magic of authentic matcha</p>
            <button onClick={() => window.location.href = '/menu'}>
              Order Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;