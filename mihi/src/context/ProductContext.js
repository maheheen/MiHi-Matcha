import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = () => {
    setLoading(true);
    
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Transform backend data to match frontend format
          const formattedProducts = data.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: `Rs ${parseFloat(product.base_price).toFixed(2)}`,
            // Handle both base64 images and file paths
            image: product.image_url.startsWith('data:') 
              ? product.image_url  // Already base64, use as-is
              : `http://localhost:5000${product.image_url}`,  // File path, add URL
            base_price: parseFloat(product.base_price)
          }));
          
          setProducts(formattedProducts);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  // Add new product (admin only)
  const addProduct = (product) => {
    console.log('🎯 addProduct called with:', {
      name: product.name,
      price: product.price,
      imageLength: product.image ? product.image.length : 0
    });
    
    const payload = {
      name: product.name,
      description: product.description || '',
      base_price: parseFloat(product.price),
      image_url: product.image || ''
    };
    
    console.log('📤 Sending to backend:', {
      ...payload,
      image_url: payload.image_url ? `${payload.image_url.substring(0, 50)}...` : 'none'
    });
    
    // Send to backend
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        console.log('📥 Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📥 Response data:', data);
        if (data.success) {
          console.log('✅ Product added successfully!');
          // Refresh products list
          fetchProducts();
        } else {
          console.error('❌ Failed to add product:', data.message);
          alert('Failed to add product: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('❌ Error adding product:', error);
        alert('Error adding product. Check console for details.');
      });
  };

  // Delete product (admin only)
  const deleteProduct = (id) => {
    // Send to backend
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh products list
          fetchProducts();
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};