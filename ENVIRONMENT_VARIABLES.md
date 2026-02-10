# 🔐 Environment Variables Configuration

This document contains all environment variables needed for deployment.

---

## 📋 Backend Environment Variables (Render Web Service)

When deploying the backend to Render, add these **5 environment variables**:

### 1. NODE_ENV
```
NODE_ENV=production
```
**Purpose:** Tells the app it's running in production mode

---

### 2. PORT
```
PORT=10000
```
**Purpose:** Port number (Render will override this dynamically)  
**Note:** Render uses dynamic ports, but this is a fallback

---

### 3. DATABASE_URL
```
DATABASE_URL=<YOUR_INTERNAL_DATABASE_URL_FROM_STEP_1>
```
**Purpose:** PostgreSQL connection string  
**How to get it:**
1. Go to your PostgreSQL service in Render
2. Copy the **Internal Database URL** (not External!)
3. It looks like: `postgresql://user:password@dpg-xxxxx-a/taskmaster`

**Example:**
```
DATABASE_URL=postgresql://taskmaster_db_user:Xy9ZaBc123@dpg-ch7k8l9m1n2o3p4q-a/taskmaster_db
```

---

### 4. JWT_SECRET
```
JWT_SECRET=<GENERATE_A_SECURE_RANDOM_STRING_MIN_32_CHARS>
```
**Purpose:** Secret key for signing JWT tokens  
**Security:** Use a strong, random string (minimum 32 characters)

**How to generate:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Online generator
Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

# Option 3: OpenSSL
openssl rand -hex 32
```

**Example:**
```
JWT_SECRET=a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8
```

⚠️ **IMPORTANT:** Never commit this to Git! Keep it secret!

---

### 5. CORS_ORIGIN
```
CORS_ORIGIN=https://your-frontend.onrender.com
```
**Purpose:** Allows your frontend to make API requests  
**How to get it:**
1. Deploy frontend first (or use placeholder)
2. Copy the exact frontend URL
3. Update this variable after frontend is deployed

**Example:**
```
CORS_ORIGIN=https://taskmaster.onrender.com
```

⚠️ **IMPORTANT:** 
- Include `https://`
- No trailing slash
- Must match frontend URL exactly

---

## 📋 Frontend Environment Variable (Render Static Site)

When deploying the frontend to Render, add this **1 environment variable**:

### 1. VITE_API_URL
```
VITE_API_URL=https://your-backend.onrender.com/api
```
**Purpose:** Tells frontend where to find the backend API  
**How to get it:**
1. Deploy backend first
2. Copy the backend URL
3. Add `/api` suffix

**Example:**
```
VITE_API_URL=https://taskmaster-api.onrender.com/api
```

⚠️ **IMPORTANT:** Must include `/api` at the end!

---

## 📝 Complete Configuration Summary

### Backend Service Configuration
```yaml
Name: taskmaster-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install && npm run build
Start Command: node dist/server.js
Plan: Free

Environment Variables:
  NODE_ENV: production
  PORT: 10000
  DATABASE_URL: postgresql://user:pass@dpg-xxxxx-a/taskmaster
  JWT_SECRET: <your-generated-secret>
  CORS_ORIGIN: https://taskmaster.onrender.com
```

### Frontend Static Site Configuration
```yaml
Name: taskmaster
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

Environment Variables:
  VITE_API_URL: https://taskmaster-api.onrender.com/api
```

### Database Configuration
```yaml
Name: taskmaster-db
Database: taskmaster
Region: Oregon (US West)
Plan: Free
```

---

## 🔄 Deployment Order

**IMPORTANT:** Deploy in this exact order:

```
1. PostgreSQL Database
   └─► Copy Internal Database URL
       
2. Backend API
   └─► Add all 5 environment variables
   └─► Copy backend URL
       
3. Frontend
   └─► Add VITE_API_URL
   └─► Copy frontend URL
       
4. Update Backend CORS
   └─► Edit CORS_ORIGIN with actual frontend URL
```

---

## ✅ Verification Commands

After deployment, verify with these commands:

### Check Backend Health
```bash
curl https://taskmaster-api.onrender.com/health
# Should return: {"status":"ok"}
```

### Check Frontend
```bash
curl https://taskmaster.onrender.com
# Should return HTML
```

---

## 🔧 Common Mistakes to Avoid

1. ❌ **Using External Database URL instead of Internal**
   - ✅ Use: `postgresql://...@dpg-xxxxx-a/...` (Internal)
   - ❌ Not: `postgresql://...@dpg-xxxxx-a.oregon-postgres.render.com/...` (External)

2. ❌ **Forgetting `/api` suffix in VITE_API_URL**
   - ✅ Use: `https://backend.onrender.com/api`
   - ❌ Not: `https://backend.onrender.com`

3. ❌ **CORS_ORIGIN doesn't match frontend URL**
   - ✅ Use: `https://taskmaster.onrender.com` (exact match)
   - ❌ Not: `http://taskmaster.onrender.com` (wrong protocol)
   - ❌ Not: `https://taskmaster.onrender.com/` (trailing slash)

4. ❌ **Weak JWT_SECRET**
   - ✅ Use: 32+ character random string
   - ❌ Not: "secret123" or "mypassword"

5. ❌ **Forgetting to update CORS after frontend deploy**
   - Remember: Update backend's CORS_ORIGIN after frontend is deployed!

---

## 📞 Need Help?

If you encounter errors:

1. **Check Logs:**
   - Backend: Render Dashboard → taskmaster-api → Logs
   - Frontend: Render Dashboard → taskmaster → Logs

2. **Common Errors:**
   - "Database connection failed" → Check DATABASE_URL
   - "CORS policy" → Check CORS_ORIGIN matches frontend URL
   - "Network Error" → Check VITE_API_URL has `/api` suffix
   - "JWT error" → Check JWT_SECRET is set

3. **Reference:**
   - See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for troubleshooting

---

## 🎯 Quick Copy Template

Save this template and fill in your actual values:

```bash
# BACKEND ENVIRONMENT VARIABLES (5 total)
NODE_ENV=production
PORT=10000
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=

# FRONTEND ENVIRONMENT VARIABLES (1 total)
VITE_API_URL=
```

**Fill in the blanks during deployment!**
