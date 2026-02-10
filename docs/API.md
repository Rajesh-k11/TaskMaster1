# API Documentation

## Base URL

- **Local:** `http://localhost:5000/api`
- **Production:** `https://your-backend.onrender.com/api`

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or weak password
- `409 Conflict` - Email already exists

---

### 2. Login User

**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials

---

### 3. Get Profile

**GET** `/auth/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-23T15:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

---

## Task Endpoints

All task endpoints require authentication via JWT token in the `Authorization` header.

### 4. List Tasks

**GET** `/tasks`

Get all tasks for the authenticated user with optional filters.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `search` (optional): Search in title and description

**Examples:**
```
GET /tasks
GET /tasks?status=completed
GET /tasks?search=documentation
GET /tasks?status=pending&search=review
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid-1",
      "userId": "user-uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API docs",
      "status": "completed",
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-22T14:30:00.000Z"
    },
    {
      "id": "task-uuid-2",
      "userId": "user-uuid",
      "title": "Review code",
      "description": "Code review for PR #123",
      "status": "in-progress",
      "createdAt": "2026-01-21T09:00:00.000Z",
      "updatedAt": "2026-01-21T09:00:00.000Z"
    }
  ]
}
```

---

### 5. Create Task

**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Task description (optional)",
  "status": "pending"
}
```

**Fields:**
- `title` (required): Task title
- `description` (optional): Task description
- `status` (optional): Task status (default: `pending`)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "new-task-uuid",
    "userId": "user-uuid",
    "title": "New task title",
    "description": "Task description",
    "status": "pending",
    "createdAt": "2026-01-23T16:00:00.000Z",
    "updatedAt": "2026-01-23T16:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing title
- `401 Unauthorized` - Missing or invalid token

---

### 6. Update Task

**PUT** `/tasks/:id`

Update an existing task.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}
```

**Fields (all optional):**
- `title`: New task title
- `description`: New task description
- `status`: New task status

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "userId": "user-uuid",
    "title": "Updated title",
    "description": "Updated description",
    "status": "in-progress",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-23T16:30:00.000Z"
  },
  "message": "Task updated successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or doesn't belong to user

---

### 7. Delete Task

**DELETE** `/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Task not found or doesn't belong to user

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required or failed
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Authentication Flow

1. **Register/Login** → Receive JWT token
2. **Store token** in `localStorage` (frontend)
3. **Include token** in all subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
4. **Token expires** after 7 days → User must login again

---

## Rate Limiting

Currently not implemented. Future considerations:
- 100 requests per 15 minutes per IP
- 10 failed login attempts per hour

---

## Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "TaskMaster API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

**Last Updated:** January 23, 2026
