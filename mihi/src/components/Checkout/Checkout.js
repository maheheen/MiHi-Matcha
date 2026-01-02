import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cart, cartTotal, clearCart, parsePrice, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    setIsCartOpen(true);
    navigate(-1);
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all fields');
      return;
    }

    // Validate cart
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);

    // Prepare order data for backend
    const orderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      total_amount: cartTotal,
      items: cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        size: item.size || 'Medium',  // Default to Medium if no size
        quantity: item.quantity,
        price: parsePrice(item.price)
      }))
    };

    // Send order to backend
    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Order placed successfully:', data.order);
          setOrderPlaced(true);
          
          // Clear cart and redirect after 3 seconds
          setTimeout(() => {
            clearCart();
            navigate('/');
          }, 3000);
        } else {
          alert('Failed to place order. Please try again.');
          setIsSubmitting(false);
        }
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('Error placing order. Please check your connection and try again.');
        setIsSubmitting(false);
      });
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
          <p className="redirect-message">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <button className="back-btn" onClick={handleBack}>← Back to Cart</button>
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Delivery Information</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            disabled={isSubmitting}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            disabled={isSubmitting}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Delivery Address"
            rows="3"
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            disabled={isSubmitting}
          />
          <button 
            onClick={handleSubmit} 
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `Place Order - Rs ${cartTotal.toFixed(2)}`}
          </button>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map(item => {
            const itemPrice = parsePrice(item.price);
            return (
              <div key={item.cartId} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>Rs {(itemPrice * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong>Rs {cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;