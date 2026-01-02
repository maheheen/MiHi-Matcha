import './Navbar.css';
import logo from '../../img/logo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUserClick = () => {
    if (!user) navigate('/auth');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src={logo} alt="miHI Matcha Logo" className="logo-img" />
          <h1 className="brand">
            miHI <span className="brand-green">Matcha</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop-only">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><a href="#contact">Contact</a></li>
          {user?.role === 'admin' && <li><Link to="/admin/dashboard">Admin</Link></li>}
        </ul>
      </div>

      <div className="navbar-icons">
        {/* Cart Icon */}
        <div className="navbar-cart-icon" onClick={handleCartClick}>
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
        </div>

        {/* User Icon */}
        <i className="fas fa-user navbar-icon" onClick={handleUserClick}></i>

        {/* User Info (Desktop) */}
        {user && (
          <>
            <span className="navbar-user-name desktop-only">{user.name}</span>
            <button className="navbar-logout-btn desktop-only" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* Hamburger Menu (Mobile) */}
        <button 
          className="hamburger-btn mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="/menu" onClick={closeMobileMenu}>Menu</Link></li>
          <li><Link to="/about" onClick={closeMobileMenu}>About</Link></li>
          <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
          {user?.role === 'admin' && (
            <li><Link to="/admin/dashboard" onClick={closeMobileMenu}>Admin</Link></li>
          )}
        </ul>

        {/* User Section in Mobile Menu */}
        {user && (
          <div className="mobile-user-section">
            <div className="mobile-user-info">
              <i className="fas fa-user"></i>
              <span>{user.name}</span>
            </div>
            <button className="mobile-logout-btn" onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;