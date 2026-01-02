-- ============================================
-- miHi Matcha - Database Setup
-- ============================================
-- Run this file to create your complete database
-- Usage: mysql -u root -p < database_setup.sql

-- Drop database if exists (BE CAREFUL - this deletes everything!)
DROP DATABASE IF EXISTS mihi_matcha;

SELECT * FROM orders;
SELECT * FROM orders ORDER BY id DESC LIMIT 1;
SELECT * FROM order_items WHERE order_id = (SELECT MAX(id) FROM orders);



-- Create database
CREATE DATABASE mihi_matcha;

-- Use the database
USE mihi_matcha;

-- ============================================
-- Table 1: users
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 2: products
-- ============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE products MODIFY COLUMN image_url LONGTEXT;
SELECT * FROM products;
-- ============================================
-- Table 3: orders
-- ============================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 4: order_items
-- ============================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(100) NOT NULL,
    size ENUM('Small', 'Medium', 'Large') NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Sample Data
-- ============================================

-- Insert Admin User (password: admin123)
-- Note: This is a bcrypt hash of "admin123"
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@mihimatcha.com', '$2b$10$rHZTKGXwMxVDPKvXq5O5qeMpLZ3qQ4YvCvGZ7UNqWM6DqF3lLqHQG', 'admin');

-- Insert Sample Customer (password: customer123)
INSERT INTO users (name, email, password, role) VALUES
('Abdullah Khan', 'abdullah@email.com', '$2b$10$rHZTKGXwMxVDPKvXq5O5qeMpLZ3qQ4YvCvGZ7UNqWM6DqF3lLqHQG', 'customer');

-- Insert Products (with correct image URLs from your frontend)
INSERT INTO products (name, description, base_price, image_url, is_active) VALUES
('Classic Matcha', 'Smooth, creamy, and perfectly balanced for sunny days.', 900.00, 'ClassicMatcha.jpg', true),
('Vanilla Matcha Latte', 'Silky cream swirls with matcha perfection.', 950.00, 'VanillaMatchaLatte.jpg', true),
('Strawberry Matcha Latte', 'Earthy matcha meets sweet strawberries — a divine dessert sip.', 950.00, 'StrawberryMatchaLatte2.jpg', true),
('Banana Top Matcha', 'Creamy banana blended with premium matcha.', 1000.00, 'BananaCreamTopMatcha.jpg', true);


UPDATE products SET image_url = '/uploads/products/ClassicMatcha.jpg' WHERE id = 1;
UPDATE products SET image_url = '/uploads/products/VanillaMatchaLatte.jpg' WHERE id = 2;
UPDATE products SET image_url = '/uploads/products/StrawberryMatchaLatte2.jpg' WHERE id = 3;
UPDATE products SET image_url = '/uploads/products/BananaCreamTopMatcha.jpg' WHERE id = 4;

-- Insert Sample Orders
INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, delivery_address, total_amount, status) VALUES
(2, 'Abdullah Khan', 'abdullah@email.com', '03001234567', 'House 123, DHA Phase 5, Karachi', 2700.00, 'pending'),
(2, 'Asma Sheraz', 'asma@email.com', '03001234877', 'House 123, North Nazimabad, Karachi', 1900.00, 'accepted');

-- Insert Order Items for Order 1
INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price) VALUES
(1, 1, 'Classic Matcha', 'Large', 2, 1170.00),
(1, 2, 'Vanilla Matcha Latte', 'Small', 1, 760.00);

-- Insert Order Items for Order 2
INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price) VALUES
(2, 3, 'Strawberry Matcha Latte', 'Medium', 2, 950.00);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify everything is set up correctly

-- Check users
SELECT id, name, email, role, created_at FROM users;

-- Check products
SELECT id, name, base_price, is_active FROM products;

-- Check orders with customer details
SELECT 
    o.id as order_id,
    o.customer_name,
    o.total_amount,
    o.status,
    o.created_at
FROM orders o
ORDER BY o.created_at DESC;

-- Check order items with product details
SELECT 
    o.id as order_id,
    o.customer_name,
    oi.product_name,
    oi.size,
    oi.quantity,
    oi.price,
    o.status
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;

-- Summary stats
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT SUM(total_amount) FROM orders WHERE status = 'accepted') as total_revenue;

-- ============================================
-- Useful Helper Queries
-- ============================================

-- Get all orders for a specific user
-- SELECT * FROM orders WHERE user_id = 2 ORDER BY created_at DESC;

-- Get order details with all items
-- SELECT 
--     o.id,
--     o.customer_name,
--     o.total_amount,
--     o.status,
--     oi.product_name,
--     oi.size,
--     oi.quantity,
--     oi.price
-- FROM orders o
-- LEFT JOIN order_items oi ON o.id = oi.order_id
-- WHERE o.id = 1;

-- Get pending orders for admin
-- SELECT 
--     id,
--     customer_name,
--     customer_email,
--     total_amount,
--     created_at
-- FROM orders 
-- WHERE status = 'pending'
-- ORDER BY created_at DESC;

-- ============================================
-- Database Setup Complete!
-- ============================================
-- Database: mihi_matcha
-- Tables: 4 (users, products, orders, order_items)
-- Sample Data: ✓
-- Indexes: ✓
-- Foreign Keys: ✓
-- 
-- Default Credentials:
-- Admin: admin@mihimatcha.com / admin123
-- Customer: abdullah@email.com / customer123
-- ============================================