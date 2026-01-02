import { useState, useContext } from "react";
import { X, Plus, Minus } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import "./ProductModal.css";

const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [showNotification, setShowNotification] = useState(false);
  const { addToCart, setIsCartOpen, parsePrice } = useContext(CartContext);

  // Size options with price multipliers
  const sizes = [
    { name: "Small", label: "12 oz", multiplier: 0.8 },
    { name: "Medium", label: "16 oz", multiplier: 1.0 },
    { name: "Large", label: "20 oz", multiplier: 1.3 }
  ];

  const handleAddToCart = () => {
    // Create product with selected size
    const productWithSize = {
      ...product,
      size: selectedSize,
      name: `${product.name} (${selectedSize})`,
      price: `Rs ${calculatePrice().toFixed(2)}`
    };
    
    addToCart(productWithSize, quantity);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const calculatePrice = () => {
    const basePrice = parsePrice(product.price);
    const sizeMultiplier = sizes.find(s => s.name === selectedSize)?.multiplier || 1.0;
    return basePrice * sizeMultiplier;
  };

  const totalPrice = calculatePrice() * quantity;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
          
          <img src={product.image} alt={product.name} className="modal-image" />
          
          <h2>{product.name}</h2>
          
          <p className="modal-description">
            {product.description || "Delicious matcha latte made with premium ingredients"}
          </p>
          
          <p className="modal-base-price">Base Price: {product.price}</p>

          {/* Size Selection */}
          <div className="size-selection">
            <h3 className="size-title">Choose Your Size</h3>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size.name}
                  className={`size-btn ${selectedSize === size.name ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size.name)}
                >
                  <div className="size-name">{size.name}</div>
                  <div className="size-label">{size.label}</div>
                  <div className="size-price">
                    Rs {(parsePrice(product.price) * size.multiplier).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="quantity-section">
            <h3 className="quantity-title">Quantity</h3>
            <div className="quantity-controls">
              <button onClick={decrement} className="qty-btn">
                <Minus size={18} />
              </button>
              <span className="quantity">{quantity}</span>
              <button onClick={increment} className="qty-btn">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="price-summary">
            <div className="price-row">
              <span>Size:</span>
              <span className="price-highlight">{selectedSize} ({sizes.find(s => s.name === selectedSize)?.label})</span>
            </div>
            <div className="price-row">
              <span>Quantity:</span>
              <span className="price-highlight">×{quantity}</span>
            </div>
            <div className="price-row total-row">
              <span>Total:</span>
              <span className="total-price">Rs {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart - Rs {totalPrice.toFixed(2)}
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="notification">
          <span>✓ Item Added to Cart</span>
          <button 
            className="view-cart-btn"
            onClick={() => {
              setIsCartOpen(true);
              onClose();
            }}
          >
            View Cart
          </button>
        </div>
      )}
    </>
  );
};

export default ProductModal;