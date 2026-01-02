import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { CartProvider } from './context/CartContext';
import MenuTab from "./pages/MenuTab";
import Homepage from "./pages/Homepage";
import AboutPg from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AdminRoute from "./components/AdminDashboard/PrivAdminRoute";
import Navbar from "./components/Navbar/Navbar";
import CartSidebar from "./components/CartSidebar/CartSidebar";

function App() {
  return (
    <div className='App-header'>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />      
            <Route path="/menu" element={<MenuTab />} /> 
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<LoginSignup />} />
            <Route path="/about" element={<AboutPg />} /> 
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
          {/* Global Cart Sidebar */}
          <CartSidebar />
        </Router>
      </CartProvider>
    </div>
  );
}

export default App;