import './Story.css';
import matcha_whisk from '../../img/img5.jpg';

const Story = () => {
    return(
        <section className="our-story">  
            <div className="story-image">  
                <img src={matcha_whisk} alt="Matcha" />
            </div>

            <div className="story-content"> 
                <h2 className="story-title">Our Story</h2>  
                <p className="story-text">  
                Born from a love for quiet mornings and creamy greens — we craft each cup 
                to slow time down. From the fields of Uji to your hands, every sip tells 
                a story of calm and care.
                </p>
                <button className="story-btn" onClick={() => window.location.href='#about'}>  
                Learn More
                </button>
            </div>
        </section>
    );
};
export default Story;
