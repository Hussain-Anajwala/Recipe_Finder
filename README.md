# 🍳 Recipe Finder - MERN Stack Application

A full-stack web application for discovering, sharing, and managing recipes with ingredient-based search, admin approval workflow, and user profile management.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 📱 Responsive Design

This application is **fully responsive** and optimized for all devices:
- 📱 **Mobile Phones** (< 768px) - Hamburger menu, single-column layouts, touch-friendly controls
- 📱 **Tablets** (768px - 1024px) - 2-column grids, optimized spacing
- 💻 **Desktop** (> 1024px) - Full multi-column layouts with hover effects

### Responsive Features
- ✨ **Mobile Navigation** - Hamburger menu on small screens
- ✨ **Adaptive Grids** - Layouts automatically adjust to screen size
- ✨ **Touch-Optimized** - All buttons and forms are mobile-friendly
- ✨ **Readable Text** - Font sizes scale appropriately
- ✨ **No Horizontal Scrolling** - Everything fits perfectly on all devices

**See `QUICK_START_RESPONSIVE.md` for testing instructions.**

## ✨ Features

### Core Features
- 🔐 **User Authentication** - JWT-based authentication with role-based access control (User/Admin)
- 📝 **Recipe Management** - Submit, edit, and delete recipes
- 🔍 **Ingredient-Based Search** - Find recipes by ingredients you have
- 🎯 **Smart Match Percentage** - Shows how many ingredients you have for each recipe
- 🏷️ **Category Filters** - Filter by meal type (Breakfast, Lunch, Dinner, etc.)
- 📊 **Difficulty Levels** - Easy, Medium, Hard recipe filtering
- 🖼️ **Image Support** - Add images to recipes via URL
- 🥗 **Nutrition Information** - Auto-calculated using Spoonacular API
- 📱 **Fully Responsive** - Mobile-friendly design works on all devices (Desktop, Tablet, Mobile)

### User Features
- ✏️ **Edit Recipes** - Modify your submitted recipes
- 👤 **Profile Management** - Update name, email, and password
- 📋 **My Recipes Dashboard** - Track submission status (Pending/Approved/Rejected)
- 🔔 **Status Notifications** - See admin notes on rejected recipes

### Admin Features
- 👨‍💼 **Admin Dashboard** - Manage all recipe submissions
- ✅ **Approve/Reject Recipes** - Review and moderate content
- 📝 **Admin Notes** - Provide feedback to users
- 👥 **User Management** - View and manage registered users
- 🗑️ **Delete Users** - Remove users and all their recipes
- 📊 **Statistics** - View total users, recipes, and submission stats

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-fetch** - API calls

### External APIs
- **Spoonacular API** - Nutrition calculation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager
- **Git** - Version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/recipe-finder.git
cd recipe-finder
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 🔐 Environment Variables

### Backend Environment Setup

1. Navigate to the `server` folder
2. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Fill in your environment variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/RecipeDB

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Spoonacular API Key (Get from https://spoonacular.com/food-api)
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# Server Port
PORT=5000
```

### Getting API Keys

#### Spoonacular API Key:
1. Go to [Spoonacular API](https://spoonacular.com/food-api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 150 requests/day

## 🏃 Running the Application

### 1. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2. Seed Admin Account (First Time Only)

```bash
cd server
node seedAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@recipe.com`
- Password: `admin123`

### 3. Start Backend Server

```bash
cd server
node index.js
```

Server will run on `http://localhost:5000`

### 4. Start Frontend (New Terminal)

```bash
cd client
npm start
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Recipe_Finder/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context API (Auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── index.js          # Server entry point
│   ├── seedAdmin.js      # Admin seeding script
│   └── package.json
│
├── .gitignore
├── README.md
└── Documentation files
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/profile         - Get user profile (Protected)
PUT    /api/auth/profile         - Update profile (Protected)
PUT    /api/auth/change-password - Change password (Protected)
```

### Recipes
```
GET    /api/recipes              - Get all approved recipes
GET    /api/recipes/:id          - Get single recipe
GET    /api/recipes/search       - Search recipes by ingredients
POST   /api/recipes/submit       - Submit new recipe (Protected)
GET    /api/recipes/my-submissions - Get user's recipes (Protected)
PUT    /api/recipes/:id          - Edit recipe (Protected)
DELETE /api/recipes/:id          - Delete recipe (Protected)
```

### Admin
```
GET    /api/admin/stats          - Get dashboard statistics (Admin)
GET    /api/admin/submissions    - Get all submissions (Admin)
GET    /api/admin/submissions/:id - Get single submission (Admin)
PUT    /api/admin/submissions/:id/approve - Approve recipe (Admin)
PUT    /api/admin/submissions/:id/reject  - Reject recipe (Admin)
GET    /api/admin/users          - Get all users (Admin)
DELETE /api/admin/users/:id      - Delete user (Admin)
DELETE /api/admin/recipes/:id    - Delete recipe (Admin)
```

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Recipe Gallery with Search
![Recipe Gallery](screenshots/recipes.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

### User Profile
![User Profile](screenshots/profile.png)

## 🧪 Testing

### Test User Flow:
1. Register a new user account
2. Submit a recipe
3. View "My Recipes" to see submission status
4. Edit your recipe
5. Search recipes by ingredients
6. Use category filters

### Test Admin Flow:
1. Login as admin (`admin@recipe.com` / `admin123`)
2. View admin dashboard
3. Approve/reject recipes
4. Manage users
5. View statistics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Hussain_Anajwala](https://github.com/Hussain-Anajwala)
- LinkedIn: [Hussain_Anajwala](https://www.linkedin.com/in/hussain-anajwala-99435434a/)

## 🙏 Acknowledgments

- [Spoonacular API](https://spoonacular.com/) for nutrition data
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://reactjs.org/) for frontend framework
- [Express.js](https://expressjs.com/) for backend framework

## 📞 Support

For support, husainanajwala786@gmail.com or open an issue in the repository.

---

**⭐ If you like this project, please give it a star on GitHub! ⭐**
