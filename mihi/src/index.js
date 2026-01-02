import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext'; // Add this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider> {/* Add this */}
        <App />
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();