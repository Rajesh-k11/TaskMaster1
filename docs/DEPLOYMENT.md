# Deployment Guide - Render

This guide covers deploying TaskMaster to Render (free tier).

---

## Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com))
- Code pushed to GitHub

---

## Step 1: Push Code to GitHub

```bash
cd primetrader
git add .
git commit -m "Initial commit - TaskMaster application"
git remote add origin https://github.com/yourusername/taskmaster.git
git push -u origin main
```

---

## Step 2: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name:** `taskmaster-db`
   - **Database:** `taskmaster`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click **"Create Database"**
5. Wait for database to provision (~2 minutes)
6. **Copy the Internal Database URL** - you'll need this for the backend

---

## Step 3: Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure backend:
   - **Name:** `taskmaster-api`
   - **Environment:** `Node`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Plan:** Free

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<paste-internal-database-url-from-step-2>
   JWT_SECRET=<generate-secure-random-string>
   CORS_ORIGIN=https://taskmaster-frontend.onrender.com
   ```

   **Important:** For `CORS_ORIGIN`, use your actual frontend URL (you'll get this in Step 4)

5. Click **"Create Web Service"**
6. Wait for deployment (~3-5 minutes)
7. **Copy the backend URL** (e.g., `https://taskmaster-api.onrender.com`)
8. Test health check: Visit `https://taskmaster-api.onrender.com/health`

---

## Step 4: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure frontend:
   - **Name:** `taskmaster-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   
   ```
   VITE_API_URL=<paste-backend-url-from-step-3>/api
   ```
   
   Example: `VITE_API_URL=https://taskmaster-api.onrender.com/api`

5. Click **"Create Static Site"**
6. Wait for deployment (~2-3 minutes)
7. **Your app is live!** Visit the provided URL

---

## Step 5: Update CORS Origin

⚠️ **Important:** After frontend is deployed, update the backend's `CORS_ORIGIN`:

1. Go to backend service in Render dashboard
2. Navigate to "Environment" tab
3. Edit `CORS_ORIGIN` to match your actual frontend URL
4. Save changes (this will trigger a redeploy)

---

## Step 6: Seed Production Database (Optional)

If you want demo data in production:

1. Go to backend service in Render
2. Click "Shell" tab
3. Run:
   ```bash
   npm run seed
   ```

---

## Verification Checklist

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without console errors
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Dashboard shows statistics
- [ ] Can create, edit, and delete tasks
- [ ] Search and filter work correctly
- [ ] Logout redirects to login page
- [ ] No CORS errors in browser console

---

## Troubleshooting

### Backend won't start

**Error:** `Port already in use`  
**Solution:** Render uses dynamic ports. Make sure your code uses `process.env.PORT`

**Error:** `Database connection failed`  
**Solution:** Verify `DATABASE_URL` is the **Internal Database URL** from Render PostgreSQL

**Error:** `JWT secret not set`  
**Solution:** Add `JWT_SECRET` environment variable

---

### Frontend shows "Network Error"

**Error:** API calls failing  
**Solution:** 
1. Check `VITE_API_URL` includes `/api` suffix
2. Verify backend is running (check health endpoint)
3. Check CORS_ORIGIN matches frontend URL

**Error:** "Token expired" immediately after login  
**Solution:** Check system clocks are synchronized (unlikely on Render)

---

### CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`  
**Solution:** Update backend's `CORS_ORIGIN` to match exact frontend URL (including https://)

---

## Custom Domain (Optional)

1. Purchase domain from Namecheap, GoDaddy, etc.
2. In Render dashboard:
   - Go to Static Site → Settings → Custom Domains
   - Add your domain
   - Follow DNS configuration instructions
3. SSL certificate is automatically provisioned

---

## Monitoring & Logs

### View Logs
- Backend: Dashboard → Web Service → Logs tab
- Frontend: Dashboard → Static Site → Logs tab

### Monitor Performance
- Dashboard → Service → Metrics tab
- Check response times, error rates, memory usage

---

## Scaling Beyond Free Tier

When ready to scale:

### Paid Plan Features
1. **Starter Plan ($7/month per service):**
   - Always-on (no cold starts)
   - More resources (512MB RAM → 2GB RAM)
   - Priority support

2. **Database Scaling:**
   - Free: 256MB storage, shared CPU
   - Starter: 1GB storage, dedicated CPU
   - Standard: 10GB storage, connection pooling

### Alternative Platforms

| Platform | Best For | Pricing |
|----------|----------|---------|
| **Render** | Full-stack apps, databases | $7/month |
| **Vercel** | Frontend only | Free for personal projects |
| **Railway** | Developer-friendly UI | $5/month |
| **AWS Amplify** | Enterprise scale | Pay-per-use |
| **Heroku** | Legacy apps | $7/month (eco dyno) |

---

## CI/CD (Continuous Deployment)

Render automatically deploys on push to main branch.

**Disable Auto-Deploy:**
- Dashboard → Service → Settings → Build & Deploy
- Uncheck "Auto-Deploy"

**Manual Deploy:**
- Dashboard → Service → Manual Deploy → "Deploy latest commit"

---

## Backup Strategy

### Database Backups
1. Dashboard → PostgreSQL → Backups tab
2. **Free tier:** Manual backups only
3. **Paid tier:** Automatic daily backups (retained 7 days)

### Manual Backup
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore Backup
```bash
psql $DATABASE_URL < backup.sql
```

---

## Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string (min 32 characters)
- [ ] Use environment-specific database URLs
- [ ] Enable HTTPS only (Render does this by default)
- [ ] Review CORS settings (whitelist only your domain)
- [ ] Don't commit `.env` files to Git
- [ ] Use strong demo passwords (or remove demo accounts)
- [ ] Add rate limiting (future enhancement)
- [ ] Enable database SSL (Render does this by default)

---

## Cost Estimation

**Free Tier (Current Setup):**
- Frontend: $0/month (static site)
- Backend: $0/month (spins down after 15min inactivity)
- Database: $0/month (256MB limit)
- **Total: $0/month** ✅

**Limitations:**
- Cold starts (backend spins down after inactivity)
- Limited database storage
- Shared CPU/RAM

**Paid Tier (Production-Ready):**
- Frontend: $0/month (static sites remain free)
- Backend: $7/month (always-on, no cold starts)
- Database: $7/month (1GB storage, better performance)
- **Total: $14/month**

---

**Deployment completed!** 🚀

Your TaskMaster application is now live and accessible worldwide.

**Next Steps:**
- Share the link with evaluators
- Monitor logs for errors
- Gather feedback
- Plan scaling strategy
