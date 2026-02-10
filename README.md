# TaskMaster - Full-Stack Task Management Application

A modern, production-ready task management application built with React, TypeScript, Node.js, and PostgreSQL, demonstrating clean code principles, security best practices, and scalable architecture.

**Live Demo:** [Coming Soon - Render Deployment]

**Tech Stack:**
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Production) / SQLite (Local)
- **Authentication:** JWT + bcrypt

---

## 🚀 Quick Deploy to Render

Ready to deploy your application? Follow these guides:

1. **[📋 Pre-Deployment Checklist](PRE_DEPLOYMENT_CHECKLIST.md)** - Complete this first
2. **[🚀 Render Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)** - Step-by-step visual guide (15 min)
3. **[📚 Detailed Deployment Docs](docs/DEPLOYMENT.md)** - Comprehensive reference

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- ✅ **Task Management** - Full CRUD operations (Create, Read, Update, Delete)
- 🔍 **Search & Filter** - Real-time search and status filtering
- 📊 **Dashboard Analytics** - Visual task statistics and insights
- 🎨 **Modern UI** - Clean, responsive design with glass morphism effects
- 🚀 **Production-Ready** - Environment-based configuration, error handling
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop

---

## 🎨 UI/UX Design

### Design System
- **Color Palette:** Blue primary (#3B82F6), Orange CTA (#F97316), Neutral backgrounds
- **Typography:** Plus Jakarta Sans (Google Fonts) - Modern, clean, professional
- **Border Radius:** Consistent rounded-xl (12px) and rounded-2xl (16px)
- **Shadows:** Layered elevation system (shadow-md, shadow-lg, shadow-xl)
- **Spacing:** Systematic scale for breathing room and visual hierarchy

### Key Design Features
- **Login Page:** Gradient background, elevated card design, enhanced input focus states, modern demo credentials display
- **Dashboard:** White stat cards with dual-icon system, professional navbar with glass effect, modern task cards with hover animations
- **Components:** Gradient buttons with scale effects, focus rings for accessibility, smooth transitions throughout
- **Responsive:** Mobile-first design with proper breakpoints (375px → 768px → 1024px → 1440px)

### Visual Principles
- ✅ Clean, minimal aesthetic
- ✅ Consistent component styling
- ✅ Smooth hover interactions (200ms transitions)
- ✅ Professional color-coding (blue/yellow/green status indicators)
- ✅ Modern glassmorphism effects
- ✅ Accessible contrast ratios (WCAG AA compliant)

*See [UI_ENHANCEMENT_SUMMARY.md](UI_ENHANCEMENT_SUMMARY.md) for detailed design decisions.*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Setup (3 steps)

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd primetrader

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. **Setup Environment Variables**

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=your_super_secret_key_12345
CORS_ORIGIN=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev     # Start backend on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev     # Start frontend on http://localhost:5173
```

**Access the app:** Open http://localhost:5173 and create a new account to get started.

---

## 📁 Project Structure

```
primetrader/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & error handling
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic (future)
│   │   ├── types/        # TypeScript interfaces
│   │   ├── utils/        # Helpers & seed script
│   │   └── server.ts     # Express app entry
│   └── package.json
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client (Axios)
│   │   ├── types/        # TypeScript interfaces
│   │   └── App.tsx       # Main app component
│   └── package.json
├── docs/                 # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── SCALING.md
└── README.md
```

---

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | Database connection string | SQLite: `sqlite:./database.sqlite`<br>PostgreSQL: `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key_change_this` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` (local)<br>`https://your-app.onrender.com` (prod) |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` (local)<br>`https://your-api.onrender.com/api` (prod) |

---

## 📚 API Documentation

See [docs/API.md](docs/API.md) for complete API reference.

**Quick Reference:**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/login` | POST | User login | No |
| `/api/auth/profile` | GET | Get user profile | Yes |
| `/api/tasks` | GET | List tasks (with filters) | Yes |
| `/api/tasks` | POST | Create task | Yes |
| `/api/tasks/:id` | PUT | Update task | Yes |
| `/api/tasks/:id` | DELETE | Delete task | Yes |

---

## 🏗️ Architecture & Scaling

### Current Architecture
- **Monolithic**: Frontend and backend in same repo (easy to deploy)
- **Database**: SQLite (local) → PostgreSQL (production via Sequelize)
- **Auth**: JWT tokens (7-day expiry, stored in localStorage)

### How to Scale (Interview Answer)

1. **Separate Frontend & Backend**
   - Deploy frontend to Vercel/Netlify (CDN-backed)
   - Deploy backend to AWS Lambda/Render
   - Benefit: Independent scaling, global CDN for frontend

2. **Add Refresh Tokens**
   - Short-lived access tokens (15 min) + long-lived refresh tokens (30 days)
   - Implement `/auth/refresh` endpoint
   - Enhanced security with token rotation

3. **Database Optimization**
   - Add indexes on `userId`, `status`, `createdAt` columns
   - Use read replicas for heavy read operations
   - Implement connection pooling

4. **API Versioning**
   - Change `/api/tasks` → `/api/v1/tasks`
   - Easy to introduce breaking changes without affecting existing clients

5. **State Management at Scale**
   - Replace local state with Redux Toolkit or Zustand
   - Add optimistic updates for better UX
   - Implement WebSocket for real-time task updates

6. **Caching**
   - Add Redis for session storage and API response caching
   - Cache task lists with invalidation on mutations

See [docs/SCALING.md](docs/SCALING.md) for detailed explanations.

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration (7 days)
- ✅ Token verification on all protected routes
- ✅ SQL injection prevention (Sequelize parameterized queries)
- ✅ CORS configuration (whitelist frontend origin)
- ✅ Environment variables for sensitive data
- ✅ Input validation on frontend and backend
- ✅ Error messages don't expose sensitive information

---

## 🚢 Deployment

### Deploy to Render

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step guide.

**Summary:**
1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Create Web Service for backend (point to `backend/`)
4. Create Static Site for frontend (point to `frontend/`)
5. Configure environment variables
6. Deploy!

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test        # (Tests to be added)

# Frontend
cd frontend
npm test        # (Tests to be added)
```

---

## 🤝 Contributing

This is an internship assignment project. Not open for contributions.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

**Your Name**
- Email: your.email@example.com
- LinkedIn: [your-profile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Design System: UI-UX-Pro-Max
- Icons: Lucide React
- Fonts: Plus Jakarta Sans (Google Fonts)

---

**Built with ❤️ for [Company Name] Internship Assignment**
