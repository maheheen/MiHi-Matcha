import { useState } from "react";
import ProductModal from "../ProductModal/ProductModal";
import "./ProductCard.css";

const ProductCard = ({ id, name, price, image }) => {
  const [showModal, setShowModal] = useState(false);

  const product = { id, name, price, image };

  return (
    <>
      <div className="product-card" role="listitem">
        <div className="image-arch">
          <div className="image-wrapper">
            <img src={image} alt={name} loading="lazy" />
          </div>
        </div>
        <h4>{name}</h4>
        <p className="card-price">{price}</p>
        <button className="order-now-btn" onClick={() => setShowModal(true)}>
          Order Now
        </button>
      </div>
      {showModal && (
        <ProductModal 
          product={product} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;