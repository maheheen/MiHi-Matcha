# MiHi Matcha

A full-stack matcha e-commerce platform — browse the menu, add drinks to your cart, and check out, with a complete admin dashboard behind the scenes for managing products.

## Features

- **Product catalog** — browse matcha drinks and signature items with detailed product views
- **Shopping cart** — add, update, and manage items via a persistent cart sidebar
- **Checkout flow** — dedicated checkout experience from cart to order
- **Authentication** — secure signup/login with hashed passwords (bcrypt + argon2) and JWT-based sessions
- **Admin dashboard** — protected admin routes for managing the product catalog, including image uploads
- **Responsive UI** — hero section, menu, about/story page, and footer built as a cohesive storefront

## Tech Stack

**Frontend** (`mihi/`)
- React 19 + React Router
- Axios for API calls
- Lucide React & Font Awesome for icons
- Context API for state management (`AuthContext`, `CartContext`, `ProductContext`)

**Backend** (`mihi-backend/`)
- Node.js + Express
- MySQL (via `mysql2`)
- JWT authentication, bcrypt/argon2 password hashing
- Multer for product image uploads
- express-validator for request validation

## Project Structure

```
MiHi-Matcha/
├── mihi/              # React frontend
│   └── src/
│       ├── components/  # ProductCard, CartSidebar, Checkout, AdminDashboard, LoginSignup...
│       └── context/      # AuthContext, CartContext, ProductContext
└── mihi-backend/       # Express API
    ├── server.js
    └── mihi_matcha_db.sql
```



## Getting Started

```bash
# Backend
cd mihi-backend
npm install
npm run dev

# Frontend
cd mihi
npm install
npm start