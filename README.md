# WalletWise AI

A modern personal finance and savings assistant powered by AI. Track expenses, get smart insights, and achieve your savings goals with an intelligent agentic finance assistant.

![WalletWise AI](https://img.shields.io/badge/Finance-AI%20Powered-10B981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3B82F6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## ✨ Features

- 📊 **Real-Time Dashboard** - Direct access to your financial overview
- 💼 **Transaction Management** - Track income and expenses with detailed categorization
- 📤 **CSV Upload** - Import transactions from bank statements
- 🎯 **Financial Goals** - Set and track savings targets with progress visualization
- 🧠 **AI-Powered Insights** - Smart analysis of spending patterns and personalized recommendations
- 📈 **Visual Analytics** - Beautiful charts and spending breakdowns with Recharts
- 💡 **Smart Categorization** - Automatic transaction categorization (Food, Transport, Bills, Shopping, etc.)
- 🤖 **Agentic AI** - Intelligent budget adjustments and proactive financial advice

## 🎨 Color Palette

The application uses a carefully curated color scheme for a modern, trustworthy finance experience:

- **Primary Green** (#10B981) - Finance actions & money indicators
- **Blue Navy** (#1E3A8A) - Trust & structure
- **Purple** (#6D28D9) - AI features & accents
- **Neon Mint** (#00FF8A) - Tech highlights & AI badges
- **Gold Warm** (#F59E0B) - Achievement indicators

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 5
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v7
- **Charts**: Recharts 3.5
- **Icons**: Lucide React
- **Database Client**: Supabase JS 2.87

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript 5.3
- **Database**: Supabase (PostgreSQL)
- **File Upload**: Multer
- **CSV Parsing**: PapaParse
- **Authentication**: Removed (Demo mode with fixed user)

### Database
- **Platform**: Supabase
- **Type**: PostgreSQL with RLS (Row Level Security disabled for demo)
- **Tables**: 
  - `transactions` - Transaction records
  - `goals` - Financial goals

## 📁 Project Structure

```
pbl minor/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ChartCard.tsx   # Chart display component
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   ├── Sidebar.tsx     # Dashboard sidebar
│   │   │   └── ...
│   │   ├── routes/             # Page components
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── Transactions.tsx # Transaction management
│   │   │   ├── Goals.tsx       # Financial goals
│   │   │   └── Insights.tsx    # AI insights
│   │   ├── lib/                # Supabase client configuration
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── index.css           # Global styles
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # Express + Supabase backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── routes/             # API routes
│   │   │   ├── transactions.ts # Transaction endpoints
│   │   │   ├── goals.ts        # Goals endpoints
│   │   │   └── aiInsights.ts   # AI insights endpoints
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   │   ├── aiInsightsService.ts
│   │   │   └── aiAnalysisEngine.ts
│   │   ├── middleware/         # Custom middleware
│   │   └── server.ts           # Express app entry
│   ├── .env.example            # Environment template
│   └── package.json
│
├── supabase-schema.sql         # Database schema
├── disable-rls.sql             # RLS disable script for demo
├── sample_transactions.csv     # Sample transaction data
├── QUICKSTART.md               # Quick start guide
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- Supabase account ([supabase.com](https://supabase.com))
- npm or yarn

### Installation

1. **Set up Supabase**
   - Create a new project at [app.supabase.com](https://app.supabase.com)
   - Go to SQL Editor and run `supabase-schema.sql` to create tables
   - Run `disable-rls.sql` to disable RLS for demo mode
   - Get your project URL and service role key from Settings > API

2. **Set up the backend**
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# PORT=5001
```

3. **Set up the frontend**
```bash
cd ../frontend
npm install

# Create .env file (optional, or hardcode in src/lib/supabaseClient.ts)
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm run dev
```
The API will run on `http://localhost:5001`

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173`

3. **Open your browser**
Navigate to `http://localhost:5173` to see the application

### Quick Test with Sample Data

Upload the included `sample_transactions.csv` through the Transactions page to quickly populate your dashboard with demo data.

## 📡 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `POST /api/transactions/upload-csv` - Upload CSV file
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### AI Insights
- `GET /api/ai-insights` - Get AI-powered financial insights and recommendations

## 🎯 Usage

1. **Dashboard** - View your financial overview with charts and statistics
2. **Add Transactions** - Manually add income/expenses with category, description, and payment method
3. **Upload CSV** - Import multiple transactions from bank statements
4. **Set Goals** - Create savings goals with target amounts and deadlines
5. **AI Insights** - Get personalized financial advice and spending pattern analysis

## 💾 Database Schema

### Transactions Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- type (TEXT: 'income' | 'expense')
- amount (DECIMAL)
- category (TEXT)
- description (TEXT)
- date (DATE)
- note (TEXT, Optional)
- payment_method (TEXT: 'cash' | 'card' | 'upi' | 'netbanking' | 'other')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Goals Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- goal_name (TEXT)
- target_amount (DECIMAL)
- current_amount (DECIMAL)
- deadline (DATE)
- goal_type (TEXT: 'saving' | 'emergency' | 'investment')
- status (TEXT: 'active' | 'completed' | 'cancelled')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## 🧠 AI Features

The AI Insights service analyzes your financial data to provide:

- **Spending Pattern Analysis** - Identifies trends and anomalies
- **Budget Recommendations** - Suggests optimal category budgets
- **Savings Opportunities** - Highlights areas to cut spending
- **Goal Progress Tracking** - Monitors and predicts goal achievement
- **Personalized Advice** - Context-aware financial tips

## 🌟 Key Components

### Frontend
- **Dashboard** - Main overview with statistics and charts
- **Transactions** - Transaction list with add/edit/delete and CSV upload
- **Goals** - Financial goals management with progress bars
- **Insights** - AI-powered recommendations and analysis
- **ChartCard** - Reusable chart component with Recharts
- **Sidebar** - Navigation sidebar with route highlighting

### Backend
- **AI Insights Service** - Generates personalized financial advice
- **AI Analysis Engine** - Core logic for spending pattern analysis
- **Transaction Controller** - CRUD operations for transactions
- **Goals Controller** - CRUD operations for goals
- **CSV Parser** - Handles CSV file uploads and parsing

## 🎨 Design Philosophy

- **Modern & Premium** - Rich aesthetics with gradients and animations
- **Minimal Text** - Clear, concise messaging
- **AI-First** - Prominent agentic features and insights
- **Data-Driven** - Real charts and analytics from actual data
- **Responsive** - Mobile-first design approach
- **Accessible** - Direct access without authentication barriers

## 🔧 Development

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/ folder
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

### CSV Upload Format

Your CSV file should have these columns:
```csv
type,amount,category,description,date,payment_method,note
expense,450.50,Food & Dining,Groceries at Walmart,2024-01-15,card,Weekly shopping
income,5000,Salary,Monthly salary,2024-01-01,netbanking,
```

Supported payment methods: `cash`, `card`, `upi`, `netbanking`, `other`

## 📝 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5001
```

### Frontend (Optional .env or hardcoded)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚨 Important Notes

- **Demo Mode**: Authentication has been removed for easy demonstration. All data uses a fixed demo user ID.
- **RLS Disabled**: Row Level Security is disabled to allow public access to demo data.
- **Production Deployment**: For production, re-enable authentication and RLS policies.

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
- Powered by Supabase for real-time database operations
- AI insights using custom analysis engine
- Inspired by leading fintech applications
- Designed for simplicity and user experience

---

**WalletWise AI** - Take control of your money with AI 💰🤖
# WallletWise_AI
