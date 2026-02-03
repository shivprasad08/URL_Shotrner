# URL Shortener with Analytics 🚀

A URL shortening service with analytics, built with **Node.js, Express, MongoDB, and Jest**. This project demonstrates backend engineering, modular architecture, and testing best practices with both REST API and modern React/Next.js frontends.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Architecture](#project-architecture)
5. [Setup & Installation](#setup--installation)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Testing Strategy](#testing-strategy)
9. [Logging & Debugging](#logging--debugging)
10. [Development Workflow](#development-workflow)
11. [Known Limitations](#known-limitations)

---

## 🎯 Overview

This URL Shortener service provides:
- **URL Shortening**: Convert long URLs into short, shareable codes with optional custom codes
- **User Authentication**: JWT-based signup and login with bcryptjs password hashing
- **Access Tracking**: Record every access with metadata (user agent, IP, timestamp)
- **Analytics**: View usage trends and access statistics per URL
- **Frontend**: Modern UI with Next.js and React components for URL management

---

## ✨ Features

### Core Functionality
- ✅ **POST /api/auth/signup** - User registration with email/password
- ✅ **POST /api/auth/login** - User authentication with JWT tokens
- ✅ **POST /api/shorten** - Create shortened URLs with optional custom codes (auth required)
- ✅ **GET /:shortCode** - Redirect with automatic click tracking
- ✅ **GET /api/analytics/:shortCode** - Detailed analytics per URL (auth required)
- ✅ **GET /api/analytics** - User's URL analytics dashboard (auth required)
- ✅ **GET /api/analytics/trends/:days** - Usage trends over time
- ✅ **DELETE /api/urls/:shortCode** - Deactivate URLs (auth required)
- ✅ **GET /api/urls** - List all shortened URLs
- ✅ **GET /api/urls/my-urls** - List user's shortened URLs (auth required)

### Engineering Quality
- ✅ **Modular Architecture** - Separation of concerns (routes, controllers, services, models)
- ✅ **Centralized Error Handling** - Global error handler with custom error classes
- ✅ **Structured Logging** - Winston logger with request/response tracking
- ✅ **Input Validation** - URL and parameter validation with express-validator
- ✅ **Rate Limiting** - In-memory request throttling to prevent abuse
- ✅ **Security Headers** - Helmet.js for protection against common attacks
- ✅ **Database Indexing** - Optimized queries for fast lookups
- ✅ **Atomic Operations** - Atomic click count incrementation

### Analytics Features
- 📊 **Access Tracking** - Timestamps, user agents, IP addresses, referrers recorded
- 🔄 **User Ownership** - URLs linked to authenticated users
- ⏰ **URL Expiration** - Optional TTL (Time to Live) for temporary URLs
- 📈 **Usage Trends** - Historical analytics over configurable time periods (up to 365 days)
- 🏥 **Health Checks** - System status and database connectivity monitoring

---

## 💻 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js v14+ |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Logging** | Winston v3 |
| **Testing** | Jest + Supertest |
| **Validation** | express-validator |
| **Authentication** | JWT + bcryptjs |
| **Security** | Helmet.js, CORS |
| **Environment** | dotenv |
| **Frontend (Next.js)** | React 18, Next.js, Tailwind CSS |
| **Frontend (React)** | React 18, Create React App |

---

## 🏗️ Project Architecture

### Folder Structure
```
/src
  /config
    ├── database.js        # MongoDB connection setup
    └── environment.js     # Environment variable management
  /controllers
    ├── authController.js       # Auth endpoints (signup/login)
    ├── urlController.js        # URL shortening & retrieval logic
    ├── analyticsController.js  # Analytics endpoints
    └── healthController.js     # Health check endpoints
  /routes
    ├── authRoutes.js      # POST /api/auth/signup, /login
    ├── urlRoutes.js       # POST /api/shorten, GET /api/urls, DELETE
    ├── analyticsRoutes.js # GET /api/analytics endpoints
    ├── redirectRoutes.js  # GET /:shortCode redirects
    └── healthRoutes.js    # GET /api/health
  /models
    ├── User.js            # User schema with authentication
    └── URLMapping.js      # MongoDB schema with analytics
  /services
    ├── urlService.js      # Business logic for URL shortening
    └── analyticsService.js # Analytics aggregation logic
  /middlewares
    ├── authMiddleware.js  # JWT token verification
    ├── errorHandler.js    # Global error handling
    ├── logging.js         # Request logging & security headers
    └── rateLimit.js       # Rate limiting middleware
  /utils
    ├── logger.js          # Winston logger configuration
    ├── validation.js      # Input validation utilities
    ├── shortCodeGenerator.js  # Short code generation logic
    └── errors.js          # Custom error classes
  /tests
    ├── setup.js           # Jest test configuration
    ├── testUtils.js       # Test helper functions
    ├── url.test.js        # URL controller tests
    ├── analytics.test.js  # Analytics tests
    └── health.test.js     # Health check tests
  app.js                    # Express app configuration
  server.js                 # Server entry point & startup
/client                     # React frontend (Create React App)
/client-next                # Next.js modern frontend
/package.json               # Dependencies & scripts
/jest.config.js             # Jest testing configuration
/.env                       # Environment variables (local)
/.env.example               # Environment template
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT REQUEST                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────────┐
          │   HELMET SECURITY MIDDLEWARE       │
          │  - XSS Protection                 │
          │  - HSTS Headers                   │
          └──────────────┬────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────────┐
          │    CORS & REQUEST PARSING          │
          └──────────────┬────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────────┐
          │   REQUEST LOGGING MIDDLEWARE       │
          │  (Winston Logger)                 │
          └──────────────┬────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────────┐
          │    RATE LIMITING MIDDLEWARE        │
          │  (In-memory store)                │
          └──────────────┬────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────────┐
          │   JWT AUTH MIDDLEWARE (optional)   │
          │  - Token verification             │
          └──────────────┬────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐  ┌──────────────┐  ┌──────────┐
    │ Auth    │  │ URL Routes   │  │Analytics │
    │Routes  │  │              │  │Routes   │
    └────┬────┘  └──────┬───────┘  └────┬─────┘
         │               │                │
         ▼               ▼                ▼
    ┌─────────────────────────────────────────┐
    │      CONTROLLER LAYER                   │
    │ - Business logic orchestration          │
    │ - Response formatting                   │
    └──────┬───────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────┐
    │         SERVICE LAYER                    │
    │  - Core business logic                   │
    │  - Database operations                   │
    │  - Analytics calculations                │
    └──────┬───────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────┐
    │      DATA LAYER (Mongoose)               │
    │  - User & URL schemas with validation    │
    │  - Indexes for performance               │
    └──────┬───────────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────────────┐
    │         MONGODB DATABASE                 │
    │  - Collections with compound indexes     │
  │  - URL Schema with analytics             │
  │  - Indexes for performance               │
  └──────┬───────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────┐
  │         MONGODB DATABASE                 │
  │  - Collections with compound indexes     │
  │  - Atomic operations for consistency     │
  └──────────────────────────────────────────┘
```

### Data Flow: URL Shortening
```
POST /api/shorten
    ↓
Validate URL format (express-validator)
    ↓
Check for duplicates in database
    ↓
Generate unique short code (with retry)
    ↓
Save to MongoDB
    ↓
Return short URL & metadata
```

### Data Flow: URL Redirect & Analytics
```
GET /:shortCode
    ↓
Find URL in database
    ↓
Check expiration & active status
    ↓
Atomic: Increment clickCount & lastAccessedAt
    ↓
Async: Push access metadata to analytics array
    ↓
Redirect 302 to original URL
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v14+ and npm v6+
- **MongoDB** v4.0+ (local or cloud instance like MongoDB Atlas)
- **Git** for version control

### Backend Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy example to local .env
   cp .env.example .env
   
   # Edit .env with your settings
   ```

   **Required environment variables:**
   ```
   NODE_ENV=development
   PORT=3000
   APP_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   LOG_LEVEL=debug
   SHORT_CODE_LENGTH=6
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Server will start on `http://localhost:3000`

6. **Run tests** (optional)
   ```bash
   npm test
   ```

### Frontend Installation (Optional)

**Next.js Frontend (Recommended):**
```bash
cd client-next
npm install
npm run dev
```

**React Frontend:**
```bash
cd client
npm install
npm start
```

---

## 📡 API Documentation

### Authentication
Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure-password-min-8-chars"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure-password-min-8-chars"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
}
```

---

### 3. Create Shortened URL

**Endpoint:** `POST /api/shorten`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "url": "https://www.example.com/very/long/url/path",
  "customCode": "mylink",        // Optional
  "description": "My test link",  // Optional
  "expiresAt": "2026-02-24"      // Optional (ISO 8601)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "createdAt": "2026-01-24T10:30:00Z"
  }
}
```

**Error Cases:**
- `400 Bad Request` - Invalid URL format or validation failed
- `409 Conflict` - Custom code already exists
- `401 Unauthorized` - Missing or invalid token

---

### 4. Redirect to Original URL

**Endpoint:** `GET /:shortCode`

**Response:** HTTP 302 Redirect to original URL

**Tracking:**
- Increments `clickCount` atomically
- Records access in analytics array with:
  - Timestamp
  - User Agent
  - IP Address
  - Referer

**Error Cases:**
- `404 Not Found` - Short code doesn't exist or has expired
- `410 Gone` - URL deactivated

---

### 5. Get URL-Specific Analytics

**Endpoint:** `GET /api/analytics/:shortCode`

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://www.example.com/target",
    "stats": {
      "totalClicks": 1250,
      "lastAccessedAt": "2026-01-24T15:45:00Z",
      "createdAt": "2026-01-10T10:30:00Z",
      "daysOld": 14,
      "avgClicksPerDay": 89.3
    },
    "recentAccesses": [
      {
        "timestamp": "2026-01-24T15:45:00Z",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.100"
      }
    ],
    "summary": {
      "uniqueUserAgents": 47,
      "uniqueIpAddresses": 123
    }
  }
}
```

---

### 6. Get User Analytics Dashboard

**Endpoint:** `GET /api/analytics`

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userUrls": 15,
    "totalClicks": 45230,
    "mostPopularUrls": [
      {
        "_id": "...",
        "shortCode": "viral1",
        "clickCount": 8500
      }
    ],
    "recentUrls": [
      {
        "_id": "...",
        "shortCode": "new1",
        "createdAt": "2026-01-24T15:00:00Z"
      }
    ],
    "timestamp": "2026-01-24T16:00:00Z"
  }
}
```

---

### 7. Get Usage Trends

**Endpoint:** `GET /api/analytics/trends/:days`

**Parameters:**
- `days` - Number of days to analyze (max 365)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "startDate": "2025-12-25T00:00:00Z",
    "trends": [
      {
        "_id": "2026-01-10",
        "count": 45,
        "totalClicks": 320
      }
    ]
  }
}
```

---

### 8. List All Shortened URLs

**Endpoint:** `GET /api/urls`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://www.example.com",
      "clickCount": 100,
      "createdAt": "2026-01-24T10:30:00Z"
    }
  ]
}
```

---

### 9. List User's Shortened URLs

**Endpoint:** `GET /api/urls/my-urls`

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://www.example.com",
      "clickCount": 100,
      "createdAt": "2026-01-24T10:30:00Z",
      "userId": "user_id"
    }
  ]
}
```

---

### 10. Deactivate URL

**Endpoint:** `DELETE /api/urls/:shortCode`

**Authentication:** Required (JWT token)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Short URL deactivated successfully",
  "data": {
    "shortCode": "abc123",
    "deactivatedAt": "2026-01-24T16:00:00Z"
  }
}
```

---

### 11. Health Check

**Endpoint:** `GET /api/health`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-24T16:00:00Z",
    "uptime": 3600,
    "environment": "development",
    "database": {
      "connected": true,
      "readyState": 1
    }
  }
}
```

---

## 📊 Database Schema

### User Collection

```javascript
{
  // Authentication
  email: String,               // Required, unique, indexed
  password: String,            // Required, hashed with bcryptjs
  
  // Timestamps
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-updated
}
```

### URLMapping Collection

```javascript
{
  // Core URL mapping
  originalUrl: String,         // Required, unique per user
  shortCode: String,           // Required, unique, indexed
  
  // Owner and metadata
  userId: ObjectId,            // Reference to User, indexed
  createdBy: String,           // Optional - user identifier
  description: String,         // Optional - custom description
  isActive: Boolean,           // Default: true
  expiresAt: Date,             // Optional - TTL
  
  // Analytics tracking
  clickCount: Number,          // Default: 0, atomic updates
  lastAccessedAt: Date,        // Updated on redirect
  
  // Access logs array
  analytics: [{
    timestamp: Date,
    userAgent: String,
    ipAddress: String,
    referer: String
  }],
  
  // Timestamps
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-updated
}
```

### Database Indexes

```javascript
// User lookups
{ email: 1 }                               // Unique

// Primary URL lookup
{ shortCode: 1 }                           // Unique
{ originalUrl: 1 }                         // Lookups
{ userId: 1, shortCode: 1 }               // Compound for user URLs

// Analytics queries
{ clickCount: -1 }                         // Popular URLs
{ createdAt: -1 }                          // Recent URLs
{ lastAccessedAt: -1 }                     // Recently accessed
{ analytics.timestamp: 1 }                 // Time-series
{ isActive: 1 }                            // Active URL filtering
```

---

## 🧪 Testing Strategy

### Test Coverage

The project includes **3 main test suites** covering 40+ test cases:

#### 1. **URL Controller Tests** (`url.test.js`)
- ✅ Create short URL successfully
- ✅ Handle duplicate URLs
- ✅ Accept custom short codes
- ✅ Reject invalid URLs
- ✅ Redirect and track clicks
- ✅ Handle expiration
- ✅ Deactivate URLs
- ✅ List URLs with pagination

#### 2. **Analytics Tests** (`analytics.test.js`)
- ✅ Get analytics for specific URL
- ✅ Get system-wide analytics
- ✅ Calculate usage trends
- ✅ Track most popular URLs
- ✅ Sort by click count
- ✅ Calculate average clicks per day

#### 3. **Health Check Tests** (`health.test.js`)
- ✅ Return health status
- ✅ Verify database connectivity
- ✅ Check uptime tracking

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

### Test Database Setup

- Tests use separate MongoDB database: `url-shortener-test`
- Automatic cleanup before/after each test
- Transaction isolation for parallel test execution
- 30-second timeout for slow database operations

### Test Utilities

```javascript
// Helper functions in testUtils.js
connectTestDB()      // Connect to test database
disconnectTestDB()   // Clean disconnect
clearDatabase()      // Clear all collections
createTestUrl()      // Create test URL with defaults
makeRequest()        // Create supertest request object
```

---

## 📝 Logging & Debugging

### Winston Logger Configuration

The application uses **Winston v3** for structured logging:

```javascript
// File: src/utils/logger.js
const logger = require('./utils/logger');

// Log levels: error, warn, info, debug
logger.error('Database error', { error: error.message });
logger.warn('Rate limit exceeded', { ip, count });
logger.info('Short URL created', { shortCode, originalUrl });
logger.debug('Request received', { method, path, duration });
```

### Log Output

**Console Output (Development):**
```
2026-01-24 16:30:45 [info]: ✓ MongoDB connected successfully
2026-01-24 16:30:46 [info]: 🚀 Server started successfully
2026-01-24 16:30:47 [debug]: Request completed { duration: 45ms, statusCode: 201 }
```

### Debugging Best Practices

1. **Set LOG_LEVEL in .env**
   ```
   LOG_LEVEL=debug    # Maximum verbosity
   ```

2. **Use Node.js Inspector**
   ```bash
   node --inspect src/server.js
   # Then open chrome://inspect in Chrome
   ```

3. **Request Tracking**
   - All requests logged with HTTP method, path, status code, duration, and IP address

---

## �‍💻 Development Workflow

### Running the Application

```bash
# Development mode (auto-reload with nodemon)
npm run dev

# Production mode
NODE_ENV=production npm start

# With custom port
PORT=8080 npm run dev

# With debug logging
LOG_LEVEL=debug npm run dev
```

### Common Tasks

```bash
# List all shortened URLs
curl http://localhost:3000/api/urls

# Get analytics for a URL
curl http://localhost:3000/api/analytics/abc123 \
  -H "Authorization: Bearer <your-jwt-token>"

# Create a short URL
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"url":"https://www.example.com"}'

# Check system health
curl http://localhost:3000/api/health
```

---

## ⚠️ Known Limitations

### Current Constraints

1. **Rate Limiting Storage**
   - In-memory only (not persistent across server restarts)
   - Not shared across multiple instances
   - Solution: Use Redis in production for distributed rate limiting

2. **Short Code Generation**
   - Currently 6 characters, allowing ~2.2 billion combinations
   - Collision checking adds latency with high volume
   - Solution: Pre-generate short codes asynchronously

3. **Analytics Storage**
   - All analytics stored in a single document array within URLMapping
   - Could exceed MongoDB 16MB document size limit at extreme scale
   - Solution: Implement separate analytics collection or document sharding

4. **Authentication**
   - JWT-based with no refresh token rotation
   - No password reset functionality
   - Solution: Add refresh tokens and password recovery endpoints

5. **Frontend Integration**
   - React and Next.js frontends are separate from API
   - No real-time updates (polling not implemented)
   - Solution: Implement WebSocket support for real-time analytics

### Design Trade-offs

| Feature | Current Decision | Trade-off |
|---------|---|---|
| Short Code Length | 6 characters | Balance between uniqueness & URL length |
| Analytics Storage | Embedded array | Fast access vs. document size limit |
| Rate Limiting | In-memory store | Simple implementation vs. not distributed |
| Auth | JWT only | Simple implementation vs. no refresh tokens |

---

## 📞 Troubleshooting

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
mongod --version

# Update MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/url-shortener
```

**Port Already in Use**
```bash
# Kill process on port 3000 (Unix/Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**Tests Failing**
```bash
# Clear test database
mongosh url-shortener-test --eval "db.dropDatabase()"

# Rerun tests
npm test
```

**Auth Endpoint Issues**
```
Make sure JWT_SECRET is set in .env file before starting server
JWT_SECRET=your-secret-key-here
```

---

**Built with ❤️ for learning and backend engineering**
