# Scaling Strategy - Architecture Decisions

This document explains how to scale TaskMaster from a demo project to a production-grade application.

---

## Current Architecture (MVP)

### Tech Stack
- **Frontend:** React + Vite (Static)
- **Backend:** Node.js + Express (Monolithic)
- **Database:** PostgreSQL (Single instance)
- **Auth:** JWT (7-day access tokens)
- **Deployment:** Render (Frontend + Backend same platform)

### Current Limitations
1. **Monolithic Backend** - All logic in one service
2. **No Caching** - Every request hits the database
3. **Single Database** - No read replicas
4. **Long-lived Tokens** - 7-day expiry is risky
5. **Same-origin Deployment** - Frontend and backend coupled

---

## Scaling Path 1: Separate Frontend & Backend

### Architecture
```
[CDN: Vercel/Netlify] → Frontend
         ↓
[AWS Lambda/Render] → Backend API
         ↓
[PostgreSQL Database]
```

### Benefits
- **Independent Scaling:** Frontend can scale infinitely via CDN
- **Global Distribution:** Users worldwide get fast page loads
- **Cost Efficiency:** Pay only for backend compute time
- **Simplified Deployment:** Frontend and backend deployed separately

### Implementation
1. Deploy frontend to Vercel:
   ```bash
   cd frontend
   vercel --prod
   ```

2. Update environment variables:
   ```env
   # Vercel Frontend
   VITE_API_URL=https://taskmaster-api.onrender.com/api
   
   # Render Backend
   CORS_ORIGIN=https://taskmaster.vercel.app
   ```

3. Benefits achieved:
   - Frontend: Hosted on global CDN (100+ edge locations)
   - Backend: Scales independently based on load
   - Database: Remains centralized

---

## Scaling Path 2: Add Refresh Tokens

### Current Problem
- 7-day JWT tokens stored in localStorage
- If token is stolen, attacker has access for 7 days
- No way to revoke tokens

### Solution: Short Access + Long Refresh Tokens

```
Access Token: 15 minutes (stored in memory)
Refresh Token: 30 days (stored in httpOnly cookie)
```

### Implementation

**Backend Changes:**

1. Add refresh token model:
```typescript
// models/RefreshToken.ts
class RefreshToken {
  id: UUID
  userId: UUID
  token: string
  expiresAt: Date
  createdAt: Date
}
```

2. Update login endpoint:
```typescript
// POST /auth/login
{
  success: true,
  data: {
    user: {...},
    accessToken: "short-lived-15min",
    refreshToken: "long-lived-30days"
  }
}
```

3. Add refresh endpoint:
```typescript
// POST /auth/refresh
Request: { refreshToken: "..." }
Response: { accessToken: "new-15min-token" }
```

4. Add revoke endpoint:
```typescript
// POST /auth/revoke
Request: { refreshToken: "..." }
Response: { success: true }
```

**Frontend Changes:**

1. Store access token in memory (React state/context)
2. Store refresh token in httpOnly cookie
3. Axios interceptor to auto-refresh:
```typescript
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    const newToken = await refreshAccessToken();
    error.config.headers.Authorization = `Bearer ${newToken}`;
    return api.request(error.config);
  }
});
```

### Benefits
- Enhanced security (short-lived tokens)
- Token revocation capability
- Better user experience (seamless refresh)

---

## Scaling Path 3: Database Optimization

### Current Performance Issues
- All queries hit primary database
- No indexes on frequently queried columns
- No connection pooling

### Solution A: Add Database Indexes

```sql
-- Index for user's tasks lookup
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Index for status filtering
CREATE INDEX idx_tasks_status ON tasks(status);

-- Index for date sorting
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

**Impact:** 10x faster queries on large datasets

### Solution B: Read Replicas

```
[Write: Primary DB] ← Write operations (create, update, delete)
        ↓ Replication
[Read: Replica 1] ← Read operations (GET /tasks)
[Read: Replica 2] ← Read operations (GET /tasks)
```

**Implementation:**
```typescript
// config/database.ts
const sequelize = new Sequelize({
  replication: {
    read: [
      { host: 'read-replica-1.com', ...},
      { host: 'read-replica-2.com', ...},
    ],
    write: { host: 'primary-db.com', ...},
  },
});
```

**Benefits:**
- Distribute read load across multiple databases
- Primary database handles only writes
- Better response times during peak traffic

### Solution C: Connection Pooling

```typescript
const sequelize = new Sequelize(DATABASE_URL, {
  pool: {
    max: 20,        // Maximum connections
    min: 5,         // Minimum idle connections
    acquire: 30000, // Max time to get connection
    idle: 10000,    // Max idle time before release
  },
});
```

**Benefits:**
- Reuse database connections
- Reduce connection overhead
- Handle concurrent requests efficiently

---

## Scaling Path 4: Add Caching Layer

### Problem
- Every request queries database
- Task lists rarely change between requests
- Wasting database resources

### Solution: Redis Cache

```
[Frontend] → [Backend] → [Redis Cache] → [PostgreSQL]
                              ↓
                         (Cache Hit: Fast)
                              ↓
                         (Cache Miss: Query DB)
```

**Implementation:**

1. Add Redis:
```bash
npm install ioredis
```

2. Cache strategy:
```typescript
// GET /tasks
async getTasks(userId) {
  const cacheKey = `tasks:${userId}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Cache miss: query database
  const tasks = await Task.findAll({ where: { userId } });
  
  // Store in cache (expire in 5 minutes)
  await redis.setex(cacheKey, 300, JSON.stringify(tasks));
  
  return tasks;
}

// POST /tasks (invalidate cache)
async createTask(userId, data) {
  const task = await Task.create({ userId, ...data });
  
  // Invalidate cache
  await redis.del(`tasks:${userId}`);
  
  return task;
}
```

**Benefits:**
- 10-100x faster response times for cached data
- Reduced database load
- Better scalability

**Cache Invalidation Rules:**
- Invalidate on create, update, delete
- Expire after 5 minutes as fallback
- Use cache tags for complex invalidation

---

## Scaling Path 5: API Versioning

### Problem
- Breaking changes affect existing clients
- No way to deprecate old endpoints gracefully

### Solution: Versioned APIs

```
/api/v1/tasks  (Current version)
/api/v2/tasks  (Future version with breaking changes)
```

**Implementation:**

1. Version in URL:
```typescript
// routes/v1/taskRoutes.ts
app.use('/api/v1/tasks', taskRoutesV1);

// routes/v2/taskRoutes.ts  
app.use('/api/v2/tasks', taskRoutesV2);
```

2. Version in header (alternative):
```typescript
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  if (version === 'v2') {
    // Route to v2 handlers
  }
});
```

**Migration Strategy:**
1. Launch v2 while keeping v1 active
2. Notify clients to migrate
3. Deprecate v1 after 6 months
4. Remove v1 after 12 months

---

## Scaling Path 6: Frontend State Management

### Current Limitations
- Local state in components (useState)
- Props drilling for user data
- Refetching data unnecessarily

### Solution: Redux Toolkit or Zustand

**Example with Zustand:**

```typescript
// store/taskStore.ts
const useTaskStore = create((set) => ({
  tasks: [],
  isLoading: false,
  fetchTasks: async () => {
    set({ isLoading: true });
    const data = await api.getTasks();
    set({ tasks: data, isLoading: false });
  },
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
}));

// Usage in components
const Dashboard = () => {
  const { tasks, fetchTasks } = useTaskStore();
  
  useEffect(() => {
    fetchTasks();
  }, []);
};
```

**Benefits:**
- Centralized state management
- Optimistic updates
- Better debugging with DevTools
- Easier testing

---

## Scaling Path 7: Microservices Architecture

### When to Consider
- Team size > 10 developers
- Multiple product domains (tasks, projects, teams, billing)
- Need independent scaling per feature

### Architecture

```
[Frontend] → [API Gateway]
                ↓
    ┌───────────┼───────────┐
    ↓           ↓           ↓
[Auth Service] [Task Service] [Notification Service]
    ↓           ↓           ↓
[User DB]    [Task DB]    [Queue]
```

**Services:**
1. **Auth Service:** User management, JWT issuing
2. **Task Service:** Task CRUD operations
3. **Notification Service:** Email, push notifications

**Benefits:**
- Independent deployment
- Technology diversity (e.g., Go for auth, Node for tasks)
- Fault isolation (auth down ≠ tasks down)

**Challenges:**
- Increased complexity
- Network latency between services
- Distributed transactions

---

## Scaling Path 8: Real-Time Updates

### Problem
- Users must refresh to see new tasks
- No collaboration features

### Solution: WebSockets

```
[Frontend] ←→ [WebSocket Server] ←→ [PostgreSQL]
                   ↓
              [Redis Pub/Sub]
```

**Implementation:**

```typescript
// Backend: Socket.IO
io.on('connection', (socket) => {
  socket.on('join:tasks', (userId) => {
    socket.join(`tasks:${userId}`);
  });
  
  // On task creation
  io.to(`tasks:${userId}`).emit('task:created', newTask);
});

// Frontend
socket.on('task:created', (task) => {
  setTasks([task, ...tasks]);
});
```

**Benefits:**
- Real-time collaboration
- Live updates without polling
- Better user experience

---

## Performance Benchmarks

| Metric | Current (MVP) | Optimized | With Cache |
|--------|--------------|-----------|------------|
| GET /tasks | 200ms | 50ms | 10ms |
| POST /tasks | 150ms | 80ms | 80ms |
| Concurrent Users | 100 | 1,000 | 10,000 |
| Database Queries/sec | 50 | 500 | 100 |

---

## Budget Estimation (At Scale)

| Component | Free Tier | Small Team | Medium Team | Enterprise |
|-----------|-----------|------------|-------------|------------|
| **Users** | <100 | 1,000 | 10,000 | 100,000+ |
| **Frontend** | Vercel Free | $20/mo | $20/mo | $300/mo |
| **Backend** | Render Free | $35/mo (2 instances) | $140/mo (8 instances) | Custom |
| **Database** | $7/mo | $25/mo | $200/mo | $1,000/mo |
| **Redis** | Upstash Free | $10/mo | $50/mo | $200/mo |
| **Total** | $7/mo | $90/mo | $410/mo | $1,500+/mo |

---

## Interview Answer Template

**Q: "How would you scale this application?"**

**A:** "I'd approach scaling in phases based on actual metrics:

**Phase 1 (Weeks 1-4):** Monitor production metrics. Add database indexes and connection pooling. Expected 5x improvement for <$10/month.

**Phase 2 (Months 2-3):** Implement Redis caching for read-heavy endpoints. Add refresh tokens for better security. Separate frontend (Vercel CDN) from backend (AWS Lambda). Cost: ~$50/month for 1,000 users.

**Phase 3 (Months 4-6):** Database read replicas, API versioning, real-time WebSocket updates. Cost: ~$200/month for 10,000 users.

**Phase 4 (Year 2+):** Microservices (auth, tasks, notifications), event-driven architecture with Kafka, horizontal scaling with Kubernetes. Cost: $1,000+/month for 100,000+ users.

The key is to scale incrementally based on data, not assumptions."

---

**Last Updated:** January 23, 2026
