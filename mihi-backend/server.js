const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;
const SECRET = "mihi_matcha_secret_key";

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));  // Increased for base64 images
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Serve static files (images)
app.use('/uploads', express.static('uploads'));

// Database connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mihi_matcha'
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.log('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Database connected successfully');
    connection.release();
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register new user
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    
    pool.query(checkQuery, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Hash password synchronously (NO async/await!)
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert new user
        const insertQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        
        pool.query(insertQuery, [name, email, hashedPassword, role || 'customer'], (err, insertResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Registration failed' });
            }

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: insertResult.insertId,
                    name: name,
                    email: email,
                    role: role || 'customer'
                }
            });
        });
    });
});

// Login user
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";

    pool.query(query, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = result[0];

        // Check password synchronously (NO async/await!)
        const isMatch = bcrypt.compareSync(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

// ==========================================
// PRODUCTS ROUTES
// ==========================================

// Get all products
app.get('/api/products', (req, res) => {
    const query = "SELECT * FROM products WHERE is_active = true ORDER BY id";

    pool.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        return res.status(200).json({
            success: true,
            products: result
        });
    });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const query = "SELECT * FROM products WHERE id = ?";

    pool.query(query, [productId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        return res.status(200).json({
            success: true,
            product: result[0]
        });
    });
});

// Create new product (admin only)
app.post('/api/products', (req, res) => {
    const { name, description, base_price, image_url } = req.body;

    const query = "INSERT INTO products (name, description, base_price, image_url) VALUES (?, ?, ?, ?)";

    pool.query(query, [name, description, base_price, image_url], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to create product' });
        }

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: {
                id: result.insertId,
                name,
                description,
                base_price,
                image_url
            }
        });
    });
});

// Update product (admin only)
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, base_price, image_url, is_active } = req.body;

    const query = `UPDATE products 
                   SET name = ?, description = ?, base_price = ?, image_url = ?, is_active = ? 
                   WHERE id = ?`;

    pool.query(query, [name, description, base_price, image_url, is_active, productId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to update product' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully'
        });
    });
});

// Delete product (admin only)
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    // Soft delete - set is_active to false
    const query = "UPDATE products SET is_active = false WHERE id = ?";

    pool.query(query, [productId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to delete product' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    });
});

// ==========================================
// ORDERS ROUTES
// ==========================================

// Create new order
app.post('/api/orders', (req, res) => {
    const { customer_name, customer_email, customer_phone, delivery_address, items, total_amount } = req.body;

    // Insert order
    const orderQuery = `INSERT INTO orders 
                        (customer_name, customer_email, customer_phone, delivery_address, total_amount, status) 
                        VALUES (?, ?, ?, ?, ?, 'pending')`;

    pool.query(orderQuery, [customer_name, customer_email, customer_phone, delivery_address, total_amount], (err, orderResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to create order' });
        }

        const orderId = orderResult.insertId;

        // Insert order items
        let insertedItems = 0;
        items.forEach((item) => {
            const itemQuery = `INSERT INTO order_items 
                               (order_id, product_id, product_name, size, quantity, price) 
                               VALUES (?, ?, ?, ?, ?, ?)`;

            pool.query(itemQuery, [orderId, item.product_id, item.product_name, item.size, item.quantity, item.price], (err) => {
                if (err) {
                    console.log(err);
                }

                insertedItems++;

                // When all items are inserted, send response
                if (insertedItems === items.length) {
                    return res.status(201).json({
                        success: true,
                        message: 'Order placed successfully',
                        order: {
                            id: orderId,
                            total_amount: total_amount,
                            status: 'pending'
                        }
                    });
                }
            });
        });
    });
});

// Get all orders (for admin dashboard)
app.get('/api/orders', (req, res) => {
    const query = `SELECT o.*, COUNT(oi.id) as item_count 
                   FROM orders o 
                   LEFT JOIN order_items oi ON o.id = oi.order_id 
                   GROUP BY o.id 
                   ORDER BY o.created_at DESC`;

    pool.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        return res.status(200).json({
            success: true,
            orders: result
        });
    });
});

// Get single order with items
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;

    // Get order details
    const orderQuery = "SELECT * FROM orders WHERE id = ?";

    pool.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (orderResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Get order items
        const itemsQuery = "SELECT * FROM order_items WHERE order_id = ?";

        pool.query(itemsQuery, [orderId], (err, itemsResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            const order = orderResult[0];
            order.items = itemsResult;

            return res.status(200).json({
                success: true,
                order: order
            });
        });
    });
});

// Update order status (admin only)
app.patch('/api/orders/:id/status', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const query = "UPDATE orders SET status = ? WHERE id = ?";

    pool.query(query, [status, orderId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to update status' });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated'
        });
    });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
    return res.json({
        success: true,
        message: 'miHi Matcha API is running!',
        timestamp: new Date().toISOString()
    });
});