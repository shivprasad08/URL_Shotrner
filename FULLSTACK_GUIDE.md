# URL Shortener - Full Stack Setup Guide

This is a complete full-stack URL shortener application with a React frontend and Node.js/Express backend.

## Project Structure

```
URL/
├── src/                 # Backend (Node.js/Express)
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── tests/
├── client/              # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json         # Backend dependencies
└── .env                 # Environment configuration
```

## Quick Start (All in One)

### Option 1: Using Two Terminals (Recommended for Development)

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend Server:**
```bash
cd e:\URL
npm run dev
```

**Terminal 3 - Start React Frontend:**
```bash
cd e:\URL\client
npm start
```

The app will automatically open at `http://localhost:3000` and the React app will proxy API calls to the backend on the same port.

### Option 2: Start Everything from One Terminal (Production)

```bash
# Build React for production
cd e:\URL\client
npm run build

# Copy build files to backend
# (Currently served from backend as separate client)

# Start MongoDB
mongod

# Start backend (will be ready)
cd e:\URL
npm run dev
```

## Prerequisites

- MongoDB 4.0+ (download from https://www.mongodb.com/try/download/community)
- Node.js v14 or higher
- npm or yarn

## Installation

### Backend Setup
```bash
cd e:\URL
npm install
```

### Frontend Setup
```bash
cd e:\URL\client
npm install
```

## Configuration

### Backend Environment Variables (.env)

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/URL_Shortner
MONGODB_TEST_URI=mongodb://localhost:27017/url-shortener-test

# Application Settings
LOG_LEVEL=debug
SHORT_CODE_LENGTH=6
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
```

### Frontend Configuration

The React app is configured to proxy API requests to `http://localhost:3000` via the `proxy` field in `package.json`.

## Running Tests

### Backend Tests
```bash
cd e:\URL
npm test
```

Current test status: **34/34 tests passing** ✅

### Frontend Tests
```bash
cd e:\URL\client
npm test
```

## API Endpoints

### URL Shortening
- `POST /api/shorten` - Create a shortened URL
  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "customCode": "mycode",        // optional
    "expiresAt": "2026-01-31T..."  // optional
  }
  ```

- `GET /:shortCode` - Redirect to original URL
- `GET /api/urls` - List all shortened URLs (paginated)
- `DELETE /api/urls/:shortCode` - Deactivate a shortened URL

### Analytics
- `GET /api/analytics/:shortCode` - Get analytics for specific URL
- `GET /api/analytics` - Get system-wide analytics
- `GET /api/analytics/trends/:days` - Get usage trends

### Health Check
- `GET /api/health` - Check server status

## Features

### Backend
- ✅ RESTful API with 8 endpoints
- ✅ MongoDB persistence with Mongoose
- ✅ Duplicate URL detection (returns existing short code)
- ✅ URL expiration support
- ✅ Click tracking and analytics
- ✅ Rate limiting middleware
- ✅ Security headers (Helmet, CORS)
- ✅ Input validation (express-validator)
- ✅ Structured logging (Winston)
- ✅ Error handling with custom error classes
- ✅ 34 comprehensive test cases

### Frontend
- ✅ Create shortened URLs with optional custom codes
- ✅ View all shortened URLs with pagination
- ✅ Copy short URLs to clipboard
- ✅ Delete/deactivate URLs
- ✅ View system analytics dashboard
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time error handling
- ✅ Loading states and user feedback

## Troubleshooting

### MongoDB Connection Error
**Problem**: "Failed to connect to server"
**Solution**: 
1. Make sure MongoDB is running: `mongod`
2. Verify MongoDB connection string in `.env`

### Port Already in Use
**Problem**: "EADDRINUSE: address already in use :::3000"
**Solution**:
1. Kill the process on port 3000
2. Or change PORT in `.env` and update React proxy in `client/package.json`

### CORS Error in Frontend
**Problem**: "Access to XMLHttpRequest blocked by CORS"
**Solution**:
1. Make sure backend is running
2. Check CORS_ORIGIN in `.env` (set to `*` for development)
3. Verify React proxy is set correctly in `client/package.json`

### React App Won't Load
**Problem**: "Cannot GET /"
**Solution**:
1. Make sure you ran `npm start` in the `client` directory
2. Check that port 3000 is not blocked
3. Clear browser cache and refresh

## Performance

- **Shorten URL**: ~30-50ms
- **Redirect**: ~20-30ms
- **List URLs**: ~25-40ms (paginated)
- **Analytics**: ~50-100ms

## Database Schema

### URLMapping Collection
```
{
  shortCode: String (unique, indexed),
  originalUrl: String (indexed),
  customCode: Boolean,
  clickCount: Number,
  isActive: Boolean (indexed),
  clicks: [{
    timestamp: Date,
    userAgent: String,
    ipAddress: String
  }],
  createdAt: Date (indexed),
  expiresAt: Date (indexed),
  updatedAt: Date
}
```

## Indexes
- `shortCode` (unique)
- `originalUrl`
- `createdAt` (descending)
- `isActive`
- Compound indexes for analytics queries

## Deployment

### Production Build

**Backend:**
```bash
cd e:\URL
npm install --production
NODE_ENV=production npm run dev
```

**Frontend:**
```bash
cd e:\URL\client
npm install --production
npm run build
```

Serve the built files from the backend:
```javascript
// In server.js
app.use(express.static(path.join(__dirname, '../client/build')));
```

## Development Tips

- Use `npm run dev` in backend to auto-reload on file changes
- Frontend hot-reloads automatically during development
- Check `src/logs/` for backend logs
- Open browser DevTools for frontend debugging
- Use `npm test` to run backend tests while developing

## Support

For issues or questions:
1. Check the test output: `npm test`
2. Review backend logs in `src/logs/`
3. Check browser console for frontend errors
4. Verify MongoDB is running and accessible

## License

MIT
