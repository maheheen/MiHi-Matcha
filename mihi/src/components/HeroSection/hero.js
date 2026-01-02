import './hero.css';
import matcha from '../../img/img2.jpg';

const Hero = () => {
    return(
        <section className="hero"> 
        <div className="hero-content">  
            <h1 className="hero-title">  
            Sip the <span className="highlight">Calm</span>,<br /> 
            Taste the <span className="highlight">Green</span>.
            </h1>
            <p className="hero-text"> 
            Indulge in our signature Matcha creations — rich, creamy, and perfectly balanced.
            </p>
            <button className="buy-btn">Order Now</button> 

        <div className="hero-stats">
            <div>
                <h3>4.9★</h3>
                <p>Customer Rating</p>
            </div>
            <div>
                <h3>100%</h3>
                <p>Organic Matcha</p>
            </div>
            <div>
                <h3>15min</h3>
                <p>Fast Delivery</p>
            </div>
            </div>
        </div>

        <div className="hero-image"> 
            <img src={matcha} alt="Matcha Latte" />
        </div>
        </section>
    );
};
export default Hero;