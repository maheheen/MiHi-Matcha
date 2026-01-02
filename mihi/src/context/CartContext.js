import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Generate unique cart ID based on product ID and size
  const getCartItemId = (product) => {
    const size = product.size || 'default';
    return `${product.id}-${size}`;
  };

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const cartId = getCartItemId(product);
      const existing = prev.find(item => item.cartId === cartId);
      
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartId, quantity }];
    });
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Parse price string to number (e.g., "Rs 900.00" -> 900)
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^\d.]/g, ''));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = parsePrice(item.price);
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      parsePrice
    }}>
      {children}
    </CartContext.Provider>
  );
};