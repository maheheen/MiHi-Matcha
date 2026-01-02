import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../../context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { products, addProduct, deleteProduct } = useContext(ProductContext);

  // Real orders from backend
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Add product form state
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch orders from backend when component loads
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders from backend
  const fetchOrders = () => {
    setLoading(true);
    
    fetch('http://localhost:5000/api/orders')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  };

  // View order details
  const viewOrderDetails = (orderId) => {
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSelectedOrder(data.order);
        }
      })
      .catch(error => {
        console.error('Error fetching order details:', error);
      });
  };

  // Handle image file selection with compression
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image before saving
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          let width = img.width;
          let height = img.height;
          
          // Resize if too large
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedImage);
          setNewProduct({...newProduct, image: compressedImage});
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    // Validate price is a number
    const priceNum = parseFloat(newProduct.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price (numbers only)!");
      return;
    }

    console.log('Adding product:', {
      name: newProduct.name,
      price: newProduct.price,
      hasImage: !!newProduct.image
    });

    addProduct(newProduct);
    setNewProduct({ name: "", price: "", image: "" });
    setImagePreview(null);
    alert("Product added successfully! Check the Menu page to see it.");
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  // Accept order - update status to 'accepted'
  const handleAcceptOrder = (id) => {
    fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'accepted' })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Order accepted!');
          fetchOrders(); // Refresh orders list
          setSelectedOrder(null); // Close details modal
        }
      })
      .catch(error => {
        console.error('Error accepting order:', error);
        alert('Failed to accept order');
      });
  };

  // Reject order - update status to 'rejected'
  const handleRejectOrder = (id) => {
    fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Order rejected!');
          fetchOrders(); // Refresh orders list
          setSelectedOrder(null); // Close details modal
        }
      })
      .catch(error => {
        console.error('Error rejecting order:', error);
        alert('Failed to reject order');
      });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f39c12';
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c';
      case 'completed': return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Orders Section */}
      <section className="admin-section">
        <h2>Orders Management</h2>
        
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>{order.customer_phone}</td>
                  <td>Rs {parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ 
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => viewOrderDetails(order.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      View Details
                    </button>
                    {order.status === "pending" && (
                      <>
                        <button 
                          onClick={() => handleAcceptOrder(order.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '5px'
                          }}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectOrder(order.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="close-modal">✕</button>
            </div>
            
            <div className="modal-content">
              <div className="order-info">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                <p><strong>Status:</strong> <span style={{color: getStatusColor(selectedOrder.status), textTransform: 'capitalize', fontWeight: 'bold', fontSize: '16px'}}>{selectedOrder.status}</span></p>
              </div>

              <div className="order-items">
                <h4>Order Items</h4>
                {selectedOrder.items && selectedOrder.items.map(item => (
                  <div key={item.id} className="order-item-row">
                    <span>{item.product_name} ({item.size})</span>
                    <span>x {item.quantity}</span>
                    <span>Rs {parseFloat(item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: Rs {parseFloat(selectedOrder.total_amount).toFixed(2)}</strong>
                </div>
              </div>

              {selectedOrder.status === 'pending' && (
                <div className="modal-actions">
                  <button 
                    onClick={() => handleAcceptOrder(selectedOrder.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    Accept Order
                  </button>
                  <button 
                    onClick={() => handleRejectOrder(selectedOrder.id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Reject Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Section */}
      <section className="admin-section">
        <h2>Add New Product</h2>
        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          />
          <input
            type="number"
            placeholder="Price (numbers only, e.g. 1050)"
            value={newProduct.price}
            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
            min="0"
            step="50"
          />
          
          <div className="image-upload-section">
            <label htmlFor="image-upload" className="upload-label">
              📷 Choose Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button onClick={handleAddProduct}>Add Product</button>
        </div>

        <h3 style={{marginTop: '30px', color: '#174f2c'}}>Current Products ({products.length})</h3>
        <div className="product-preview">
          {products.map(product => (
            <div key={product.id} className="product-wrapper">
              <ProductCard {...product} />
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteProduct(product.id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;