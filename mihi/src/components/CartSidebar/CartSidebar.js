import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import "./CartSidebar.css";

const CartSidebar = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen, parsePrice } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false); // Close cart
    navigate('/checkout'); // Navigate to checkout page
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`} 
        onClick={() => setIsCartOpen(false)} 
      />
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => {
              const itemPrice = parsePrice(item.price);
              return (
                <div key={item.cartId} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Rs {itemPrice.toFixed(2)}</p>
                    <div className="cart-quantity-controls">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.cartId)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>Rs {cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;