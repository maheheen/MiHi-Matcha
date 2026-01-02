import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/HeroSection/hero';
import Drinks from '../components/signature/Drinks';
import Footer from '../components/Footer/Footer';
import Story from '../components/OurStory/Story';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Homepage = () => {
  return (
     <div className="home-page"> 
      <Hero />
      <Drinks />
      <Story />
      <Footer />
    </div>
  );
}

export default Homepage;