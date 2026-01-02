import { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import CartSidebar from "../CartSidebar/CartSidebar";
import "./MenuPage.css";
import ProductCard from '../ProductCard/ProductCard';

import StrawberryMatchaLatte2 from '../../img/StrawberryMatchaLatte2.jpg';

const MenuPage = () => {
  const { products } = useContext(ProductContext);
  const { cartCount } = useContext(CartContext);
  const [showAll, setShowAll] = useState(false);

  // Show only first 4 or all products
  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <>
      <div className="menu-page">
        <section className="hero" aria-hidden="false">
          <h1>miHi Matcha Style</h1>
          <p>Life is better with a Matcha in hand</p>
          <button className="menu-btn">Explore menu</button>
        </section>

        <section className="menu-section" id="menu">
          <h2>Menu</h2>
          <div className="menu-grid" role="list">
            {displayedProducts.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
          {products.length > 4 && (
            <div style={{ marginTop: 18 }}>
              <button 
                className="view-more"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `View More (${products.length - 4} more)`}
              </button>
            </div>
          )}
        </section>

        <section className="promo" aria-label="Promo">
          <img
            src={StrawberryMatchaLatte2}
            alt="Strawberry Matcha Promo"
            loading="lazy"
          />
          <div className="promo-text">
            <h3>Tuesday 2-for-1</h3>
            <p>With the purchase of 1 Strawberry Matcha Lattes enjoy 2</p>
            <span className="price">Rs 950.00</span>
            <div>
              <button className="order-btn">Order Now</button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Cart Sidebar - rendered outside menu-page div */}
      <CartSidebar />
    </>
  );
};

export default MenuPage;