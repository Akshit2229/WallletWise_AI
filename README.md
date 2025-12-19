# WalletWise AI

A modern personal finance and savings assistant powered by AI. Track expenses, get smart insights, and achieve your savings goals with an intelligent agentic finance assistant.

![WalletWise AI](https://img.shields.io/badge/Finance-AI%20Powered-10B981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3B82F6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ Features

- 🎯 **Automatic Expense Tracking** - Upload statements or manually add expenses
- 🧠 **AI-Powered Insights** - Smart analysis of spending patterns
- 📊 **Visual Dashboard** - Beautiful charts and spending breakdowns
- 🎨 **Goal-Driven Planning** - Set savings targets and track progress
- 🤖 **Agentic AI** - Intelligent budget adjustments and proactive nudges
- 🔐 **Secure Authentication** - JWT-based auth with encrypted passwords

## 🎨 Color Palette

The application uses a carefully curated color scheme for a modern, trustworthy finance experience:

- **Primary Green** (#10B981) - Finance actions & money indicators
- **Blue Navy** (#1E3A8A) - Trust & structure
- **Purple** (#6D28D9) - AI features & accents
- **Neon Mint** (#00FF8A) - Tech highlights & AI badges
- **Gold Warm** (#F59E0B) - Achievement indicators

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **API**: RESTful API

## 📁 Project Structure

```
pbl minor/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── assets/        # Static assets
│   │   └── index.css      # Global styles
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/               # Express + MongoDB backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   └── server.ts      # Express app entry
│   ├── .env.example       # Environment template
│   └── package.json
│
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "pbl minor"
```

2. **Set up the backend**
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGO_URI=mongodb://localhost:27017/walletwise
# JWT_SECRET=your_secret_key_here
# PORT=5000
```

3. **Set up the frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

2. **Start the backend server**
```bash
cd backend
npm run dev
```
The API will run on `http://localhost:5000`

3. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173`

4. **Open your browser**
Navigate to `http://localhost:5173` to see the application.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Dashboard (Protected)
- `GET /api/dashboard/summary` - Get dashboard data (requires JWT)

## 🎯 Usage

1. **Landing Page** - View features and benefits
2. **Sign Up** - Create a new account with email and password
3. **Login** - Access your personalized dashboard
4. **Dashboard** - View spending overview, AI insights, and goals
5. **Track Finances** - Monitor transactions and category breakdowns

## 🔐 Security

- Passwords are hashed using bcrypt before storage
- JWT tokens for secure authentication
- Protected API routes with middleware
- CORS enabled for frontend-backend communication

## 🌟 Key Components

### Frontend
- **Navbar** - Responsive navigation with scroll effects
- **Hero** - Eye-catching landing section with gradient backgrounds
- **FeatureSection** - 4-card feature showcase
- **StatsCards** - Performance metrics display
- **Dashboard** - Comprehensive finance overview with charts
- **AuthLayout** - Shared login/signup page layout

### Backend
- **User Model** - User data with encrypted passwords
- **Transaction Model** - Expense/income tracking
- **Auth Controller** - Signup/login logic
- **Dashboard Controller** - Aggregated financial data
- **Auth Middleware** - JWT verification

## 🎨 Design Philosophy

- **Modern & Premium** - Rich aesthetics with gradients and animations
- **Minimal Text** - Clear, concise messaging
- **AI-First** - Prominent agentic features and insights
- **Trust & Security** - Professional color scheme and secure auth
- **Responsive** - Mobile-first design approach

## 🔧 Development

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/walletwise
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by leading fintech applications
- Designed for simplicity and user experience

---

**WalletWise AI** - Take control of your money with AI 💰🤖
# WalletWise_AI
