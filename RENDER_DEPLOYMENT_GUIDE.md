# 🚀 Quick Render Deployment Guide - TaskMaster

A visual, step-by-step guide to deploy your TaskMaster application to Render in under 15 minutes.

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [x] GitHub account
- [x] Render account (free) - [Sign up here](https://render.com)
- [x] Code pushed to GitHub
- [x] Both servers running locally and tested

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    RENDER PLATFORM                       │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐ │
│  │  Frontend   │   │   Backend    │   │  PostgreSQL  │ │
│  │ Static Site │◄─►│ Web Service  │◄─►│   Database   │ │
│  │   (Free)    │   │    (Free)    │   │    (Free)    │ │
│  └─────────────┘   └──────────────┘   └──────────────┘ │
│        ▲                   ▲                             │
│        │                   │                             │
│        │                   │                             │
└────────┼───────────────────┼─────────────────────────────┘
         │                   │
         │                   │
    Users Access         API Calls
```

---

## 🎯 Deployment Steps (3 Services)

### **STEP 1: Create PostgreSQL Database** ⏱️ 2 minutes

1. Go to: [Render Dashboard](https://dashboard.render.com/)
2. Click: **"New +"** button (top right)
3. Select: **"PostgreSQL"**

**Configuration:**
```
Name:     taskmaster-db
Database: taskmaster
Region:   Oregon (US West) or closest to you
Plan:     Free
```

4. Click: **"Create Database"**
5. ⏳ Wait 1-2 minutes for provisioning
6. 📋 **IMPORTANT:** Copy the **Internal Database URL**
   - It looks like: `postgresql://user:pass@dpg-xxxxx-a/taskmaster`
   - Save this - you'll need it in Step 2!

**✅ Status Check:** Database shows "Available" in green

---

### **STEP 2: Deploy Backend API** ⏱️ 5 minutes

1. Click: **"New +"** → **"Web Service"**
2. Click: **"Build and deploy from a Git repository"**
3. Click: **"Connect" next to your GitHub repository**
   - If not listed, click "Configure account" to grant access

**Configuration:**

| Field | Value |
|-------|-------|
| **Name** | `taskmaster-api` |
| **Region** | Same as database (e.g., Oregon) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/server.js` |
| **Plan** | `Free` |

**Environment Variables:** (Click "Advanced" → "Add Environment Variable")

Add these **5 variables**:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste-internal-database-url-from-step-1>
JWT_SECRET=super_secure_random_string_change_this_12345678
CORS_ORIGIN=https://taskmaster.onrender.com
```

⚠️ **IMPORTANT NOTES:**
- For `DATABASE_URL`: Use the **Internal URL** from Step 1
- For `JWT_SECRET`: Generate a secure random string (min 32 characters)
- For `CORS_ORIGIN`: We'll update this after frontend is deployed

4. Click: **"Create Web Service"**
5. ⏳ Wait 3-5 minutes for deployment
6. 📋 **Copy your backend URL:** `https://taskmaster-api.onrender.com`

**✅ Status Check:** 
- Service shows "Live" in green
- Visit: `https://taskmaster-api.onrender.com/health` → Should return `{"status":"ok"}`

---

### **STEP 3: Deploy Frontend** ⏱️ 3 minutes

1. Click: **"New +"** → **"Static Site"**
2. Connect your GitHub repository (same as backend)

**Configuration:**

| Field | Value |
|-------|-------|
| **Name** | `taskmaster` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

**Environment Variable:**

Add **1 variable**:

```bash
VITE_API_URL=https://taskmaster-api.onrender.com/api
```

⚠️ **IMPORTANT:** Replace `taskmaster-api.onrender.com` with YOUR actual backend URL from Step 2

3. Click: **"Create Static Site"**
4. ⏳ Wait 2-3 minutes for deployment
5. 📋 **Copy your frontend URL:** `https://taskmaster.onrender.com`

**✅ Status Check:** Frontend loads successfully

---

### **STEP 4: Update CORS Origin** ⏱️ 1 minute

⚠️ **CRITICAL FIX:** Update backend to allow frontend domain

1. Go back to: **Backend service** (taskmaster-api)
2. Click: **"Environment"** tab
3. Find: `CORS_ORIGIN` variable
4. Edit: Change to your **actual frontend URL**
   ```
   CORS_ORIGIN=https://taskmaster.onrender.com
   ```
5. Click: **"Save Changes"**
6. ⏳ Wait 30 seconds for auto-redeploy

**✅ Status Check:** Backend redeploys successfully

---

### **STEP 5: Seed Demo Data (Optional)** ⏱️ 2 minutes

If you want demo credentials in production:

1. Go to: **Backend service** → **"Shell"** tab
2. Wait for shell to connect
3. Run this command:
   ```bash
   npm run seed
   ```
4. You should see: "Database seeded successfully!"

**✅ Demo Credentials:**
- Email: `demo@taskmaster.com`
- Password: `Demo123!`

---

## 🧪 Full Application Testing

Visit your frontend URL: `https://taskmaster.onrender.com`

### Test Checklist:

- [ ] **Page Load:** Frontend loads without errors
- [ ] **Register:** Can create new account
- [ ] **Login:** Can login with credentials
- [ ] **Dashboard:** Shows stats cards (0 tasks initially)
- [ ] **Create Task:** Can add a new task
- [ ] **Edit Task:** Can modify task title/description/status
- [ ] **Delete Task:** Can remove a task
- [ ] **Search:** Can search tasks
- [ ] **Filter:** Can filter by status
- [ ] **Logout:** Successfully logs out and redirects

### ✅ Success Criteria:
- No console errors (press F12 → Console tab)
- No CORS errors
- All CRUD operations work
- Page is responsive on mobile

---

## 🔧 Common Issues & Fixes

### ❌ "Network Error" on login

**Cause:** Frontend can't reach backend  
**Fix:**
1. Check backend is "Live" (green status)
2. Visit: `https://your-backend.onrender.com/health`
3. Verify `VITE_API_URL` includes `/api` suffix
4. Check `CORS_ORIGIN` matches frontend URL exactly

---

### ❌ Backend shows "Database connection failed"

**Cause:** Wrong database URL  
**Fix:**
1. Go to PostgreSQL service
2. Copy **Internal Database URL** (not External!)
3. Update backend's `DATABASE_URL` environment variable
4. Save changes (triggers redeploy)

---

### ❌ "Access blocked by CORS policy"

**Cause:** CORS_ORIGIN doesn't match frontend URL  
**Fix:**
1. Go to backend service → Environment tab
2. Update `CORS_ORIGIN` to exact frontend URL:
   ```
   CORS_ORIGIN=https://taskmaster.onrender.com
   ```
3. Include `https://` and remove trailing slash
4. Save (auto-redeploys)

---

### ⚠️ Backend spins down (cold start)

**Behavior:** First request after 15min takes 30+ seconds  
**Cause:** Free tier spins down inactive services  
**Solutions:**
- **Free:** Use a service like [UptimeRobot](https://uptimerobot.com) to ping every 10 minutes
- **Paid ($7/month):** Upgrade to Starter plan for always-on service

---

## 📍 Quick Reference URLs

After deployment, save these URLs:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://taskmaster.onrender.com` | User-facing app |
| **Backend** | `https://taskmaster-api.onrender.com` | API endpoints |
| **Health Check** | `https://taskmaster-api.onrender.com/health` | Backend status |
| **Database** | (Internal only, not public) | Data storage |

---

## 🎉 Next Steps After Deployment

1. **Share with Evaluators:**
   ```
   🔗 Live App: https://taskmaster.onrender.com
   📧 Demo Login: demo@taskmaster.com / Demo123!
   📂 GitHub Repo: https://github.com/yourusername/taskmaster
   ```

2. **Monitor Logs:**
   - Backend logs: Dashboard → taskmaster-api → Logs
   - Frontend logs: Dashboard → taskmaster → Logs

3. **Add to Resume/Portfolio:**
   - Live demo link
   - Screenshots of dashboard
   - Tech stack description

4. **Consider Upgrading (Optional):**
   - $7/month for always-on backend (no cold starts)
   - Custom domain (e.g., `taskmaster.yourname.com`)

---

## 💰 Cost Breakdown

**Current Setup (FREE):**
- ✅ Frontend: $0/month (static sites are always free)
- ✅ Backend: $0/month (with cold starts)
- ✅ Database: $0/month (256MB limit)
- **Total: $0/month**

**Paid Upgrade (OPTIONAL):**
- Frontend: $0/month (still free!)
- Backend: $7/month (always-on, no cold starts)
- Database: $7/month (1GB storage)
- **Total: $14/month**

---

## 🎯 Summary

✅ **What You've Deployed:**

```
┌─────────────────────────────────────────┐
│  PRODUCTION ENVIRONMENT                  │
│                                          │
│  🌐 Frontend: React + Vite + Tailwind   │
│     https://taskmaster.onrender.com      │
│                                          │
│  🔧 Backend: Node.js + Express + TS     │
│     https://taskmaster-api.onrender.com  │
│                                          │
│  🗄️ Database: PostgreSQL                │
│     (Managed by Render)                  │
│                                          │
│  🔒 Security: JWT + bcrypt + CORS       │
│  📱 Responsive: Mobile + Tablet + Desktop│
└─────────────────────────────────────────┘
```

**Congratulations! Your TaskMaster application is now live and production-ready!** 🚀

For detailed troubleshooting and advanced configurations, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
