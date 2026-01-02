# miHi Matcha Backend API

Backend API for miHi Matcha e-commerce application built with Node.js, Express, and MySQL.

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   └── orders.js          # Order routes
├── uploads/
│   └── products/          # Product images
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
└── server.js             # Main server file
```

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Edit the `.env` file and update with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # ← Change this!
DB_NAME=mihi_matcha

# JWT Secret
JWT_SECRET=your_super_secret_key  # ← Change this to a random string!
```

### Step 3: Create Database

Make sure you've already run the `database_setup.sql` file to create the database and tables.

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | Public/Private |
| GET | `/api/orders` | Get orders | Private |
| GET | `/api/orders/:id` | Get single order | Private |
| PATCH | `/api/orders/:id/status` | Update status | Admin |

## 🧪 Testing the API

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mihimatcha.com",
    "password": "admin123"
  }'
```

### Test Get Products
```bash
curl http://localhost:5000/api/products
```

## 🔐 Default Accounts

**Admin Account:**
- Email: `admin@mihimatcha.com`
- Password: `admin123`

**Customer Account:**
- Email: `abdullah@email.com`
- Password: `customer123`

## 🔑 Authentication

Protected routes require a JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
}
```

## 📝 Sample API Requests

### Register New User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "password123",
  "role": "customer"
}
```

### Create Order
```json
POST /api/orders
{
  "customer_name": "Abdullah",
  "customer_email": "abdullah@email.com",
  "customer_phone": "03001234567",
  "delivery_address": "House 123, Karachi",
  "items": [
    {
      "product_id": 1,
      "product_name": "Classic Matcha (Large)",
      "size": "Large",
      "quantity": 2,
      "price": 1170.00
    }
  ],
  "total_amount": 2340.00
}
```

### Update Order Status (Admin only)
```json
PATCH /api/orders/1/status
Headers: { "Authorization": "Bearer YOUR_ADMIN_TOKEN" }
{
  "status": "accepted"
}
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🔧 Development Tools

- **nodemon** - Auto-restart on file changes (dev mode)

## 🚨 Important Security Notes

1. **Change JWT Secret:** Update `JWT_SECRET` in `.env` to a random string
2. **Change Default Passwords:** Update admin and test user passwords
3. **Use HTTPS:** In production, always use HTTPS
4. **Rate Limiting:** Add rate limiting for production
5. **Input Validation:** All inputs are validated with express-validator

## 📊 Database Schema

See `database_setup.sql` for complete schema details.

**Tables:**
- `users` - User accounts
- `products` - Matcha products
- `orders` - Customer orders
- `order_items` - Items in each order

## 🐛 Troubleshooting

**Database Connection Error:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `mihi_matcha` exists

**Port Already in Use:**
- Change `PORT` in `.env`
- Or kill process using port 5000

**JWT Error:**
- Ensure `JWT_SECRET` is set in `.env`
- Check token format in Authorization header

## 📚 Next Steps

1. ✅ Backend is complete and running
2. ⏭️ Copy product images to `uploads/products/` folder
3. ⏭️ Update frontend to use this API
4. ⏭️ Test all features end-to-end
5. ⏭️ Deploy to production server

## 🤝 Support

For issues or questions, contact the development team.

---

Made with ☕ and 🍵 for miHi Matcha
