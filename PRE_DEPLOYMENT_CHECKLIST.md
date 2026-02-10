# 📋 Pre-Deployment Checklist - TaskMaster

Complete this checklist before deploying to Render.

---

## ✅ Code Quality

- [ ] All TypeScript errors resolved (`npm run build` succeeds)
- [ ] No console errors in browser
- [ ] All lint warnings addressed
- [ ] Code is well-commented
- [ ] No hardcoded credentials in code

---

## ✅ Local Testing

- [ ] Backend starts successfully (`cd backend && npm run dev`)
- [ ] Frontend starts successfully (`cd frontend && npm run dev`)
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Dashboard loads and shows stats
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] Logout works correctly

---

## ✅ Environment Variables

### Backend (.env)
- [ ] `NODE_ENV` is set
- [ ] `PORT` is set (but Render will override)
- [ ] `DATABASE_URL` is configured
- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `CORS_ORIGIN` is set (will update after frontend deploy)

### Frontend (.env)
- [ ] `VITE_API_URL` points to backend

---

## ✅ Git Ready

- [ ] `.gitignore` excludes:
  - [ ] `node_modules/`
  - [ ] `.env` files
  - [ ] `dist/` and `build/`
  - [ ] `*.log` files
- [ ] All files committed
- [ ] Pushed to GitHub
- [ ] Repository is public (or accessible to Render)

---

## ✅ Documentation

- [ ] `README.md` has:
  - [ ] Project description
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Demo credentials
- [ ] API documentation exists
- [ ] Deployment guide exists

---

## ✅ Security

- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens have expiration
- [ ] Input validation on frontend
- [ ] SQL injection protection (using Sequelize)
- [ ] XSS protection in place
- [ ] CORS configured properly
- [ ] No sensitive data in Git history

---

## ✅ Performance

- [ ] Images optimized
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] API responses are fast (<500ms)

---

## ✅ UI/UX

- [ ] Responsive on mobile (375px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] Loading states implemented
- [ ] Error messages are clear
- [ ] Success feedback provided
- [ ] Forms have validation

---

## ✅ Render Preparation

- [ ] `package.json` has correct scripts:
  ```json
  {
    "scripts": {
      "build": "tsc",
      "start": "node dist/server.js",
      "dev": "nodemon --exec ts-node src/server.ts"
    }
  }
  ```
- [ ] Build command works: `npm run build`
- [ ] Start command works: `npm start` (after build)

---

## 📝 Deployment Information to Gather

Before deploying, have these ready:

### Database (Step 1)
- [ ] Database Internal URL: `_______________________`

### Backend (Step 2)
- [ ] Backend URL: `_______________________`
- [ ] Health check URL: `_______________________/health`
- [ ] JWT Secret (generated): `_______________________`

### Frontend (Step 3)
- [ ] Frontend URL: `_______________________`

### Demo Credentials
- [ ] Email: `demo@taskmaster.com`
- [ ] Password: `Demo123!`

---

## 🚀 Deployment Steps (Summary)

1. **Create PostgreSQL Database** → Copy Internal URL
2. **Deploy Backend** → Add 5 env variables → Copy backend URL
3. **Deploy Frontend** → Add 1 env variable (VITE_API_URL)
4. **Update CORS** → Edit backend CORS_ORIGIN with frontend URL
5. **Seed Data** → Run `npm run seed` in backend shell
6. **Test** → Login, create task, verify all features

---

## ✅ Post-Deployment Verification

After deploying, verify:

- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] No CORS errors in console
- [ ] Can register new user
- [ ] Can login with demo credentials
- [ ] Dashboard shows 0 tasks (or demo tasks if seeded)
- [ ] Can create task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Search works
- [ ] Filter works
- [ ] No console errors

---

## 🎯 Final Submission

Share with evaluators:

```
🔗 Live Application: https://your-app.onrender.com
📂 GitHub Repository: https://github.com/yourusername/taskmaster
📧 Demo Credentials:
   Email: demo@taskmaster.com
   Password: Demo123!

✨ Features:
- User authentication (JWT)
- Task CRUD operations
- Search & filter
- Real-time statistics
- Responsive design
```

---

**Status:** Ready to deploy? If all checkboxes are ✅, proceed to [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)!
