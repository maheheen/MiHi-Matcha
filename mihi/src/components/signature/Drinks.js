import { useState, useContext } from 'react';
import './Drinks.css';
import { ProductContext } from '../../context/ProductContext';
import ProductModal from '../ProductModal/ProductModal';

const Drinks = () => {
  const { products } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get the first 3 products for signature drinks showcase
  const signatureDrinks = products.slice(0, 3);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <section className="signature-drinks">
        <h2 className="drinks-title">Our Signature Drinks</h2>
        <p className="drinks-subtitle">crafted with calm, love, and pure matcha</p>

        <div className="drinks-grid">
          {signatureDrinks.map((drink) => (
            <div className="drink-card" key={drink.id}>
              <div className="drink-image">
                <img src={drink.image} alt={drink.name} />
              </div>
              <h3>{drink.name}</h3>
              <p>
                {drink.name === "Classic Matcha" && "Smooth, creamy, and perfectly balanced for sunny days."}
                {drink.name === "Vanilla Matcha Latte" && "Silky cream swirls with matcha perfection."}
                {drink.name === "Strawberry Matcha Latte" && "Earthy matcha meets sweet strawberries — a divine dessert sip."}
                {!["Classic Matcha", "Vanilla Matcha Latte", "Strawberry Matcha Latte"].includes(drink.name) && "Delicious matcha latte made with premium ingredients."}
              </p>
              <button className="drink-btn" onClick={() => handleOrderClick(drink)}>
                Order Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default Drinks;