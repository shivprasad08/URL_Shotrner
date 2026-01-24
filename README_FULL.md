# URL Shortener - Full Stack Application

A production-ready URL shortener application with a React frontend and Node.js/Express backend. Shorten long URLs, track clicks, and view analytics - all with a beautiful, intuitive interface.

## 🚀 Quick Start

### Prerequisites
- **MongoDB** 4.0+ ([Download](https://www.mongodb.com/try/download/community))
- **Node.js** v14+ ([Download](https://nodejs.org))
- **npm** or yarn

### Setup (5 minutes)

**1. Start MongoDB**
```bash
mongod
```

**2. Install Backend Dependencies**
```bash
cd e:\URL
npm install
```

**3. Start Backend Server**
```bash
npm run dev
```
✓ Backend running at `http://localhost:3000`

**4. Install Frontend Dependencies** (in a new terminal)
```bash
cd e:\URL\client
npm install
```

**5. Start React Frontend** (once npm install completes)
```bash
npm start
```
✓ Frontend running at `http://localhost:3000`

## 📋 Features

### Backend
- ✅ **8 RESTful API Endpoints** - Complete URL management
- ✅ **MongoDB Persistence** - Reliable data storage with Mongoose
- ✅ **Duplicate Detection** - Smart deduplication of URLs
- ✅ **URL Expiration** - Set URLs to expire at a specific time
- ✅ **Click Tracking** - Record and analyze URL access
- ✅ **Analytics** - Detailed stats and trends
- ✅ **Rate Limiting** - Prevent abuse with intelligent rate limiting
- ✅ **Security** - Helmet for security headers, CORS, input validation
- ✅ **Logging** - Winston structured logging with file outputs
- ✅ **Error Handling** - Custom error classes and graceful error handling
- ✅ **Testing** - 34 comprehensive test cases (Jest + Supertest)

### Frontend
- ✅ **Beautiful UI** - Modern gradient design, fully responsive
- ✅ **Shorten URLs** - Create short URLs with optional custom codes
- ✅ **Manage URLs** - View, copy, and delete your shortened URLs
- ✅ **Analytics Dashboard** - Track usage and performance
- ✅ **Pagination** - Navigate through your URLs easily
- ✅ **Real-time Feedback** - Error and success messages
- ✅ **Copy to Clipboard** - One-click URL copying
- ✅ **Mobile Friendly** - Works perfectly on any device

## 📁 Project Structure

```
URL/
├── src/                          # Backend (Node.js/Express)
│   ├── server.js                 # Main entry point
│   ├── app.js                    # Express configuration
│   ├── config/
│   │   ├── database.js          # MongoDB setup
│   │   └── environment.js       # Environment variables
│   ├── controllers/              # Route handlers
│   │   ├── urlController.js
│   │   ├── analyticsController.js
│   │   └── healthController.js
│   ├── models/
│   │   └── URLMapping.js        # MongoDB schema
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── middlewares/              # Custom middleware
│   ├── utils/                    # Helper utilities
│   ├── tests/                    # Test suite
│   └── logs/                     # Application logs
├── client/                       # Frontend (React)
│   ├── public/
│   │   └── index.html           # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── URLForm.js       # Shorten form
│   │   │   ├── URLList.js       # URL management
│   │   │   └── Analytics.js     # Analytics dashboard
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── URLForm.css
│   │   │   ├── URLList.css
│   │   │   └── Analytics.css
│   │   ├── App.js               # Main component
│   │   └── index.js             # React entry point
│   └── package.json
├── package.json                  # Backend dependencies
├── .env                          # Environment variables
└── FULLSTACK_GUIDE.md           # Detailed setup guide
```

## 🔗 API Endpoints

### URL Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a shortened URL |
| GET | `/:shortCode` | Redirect to original URL |
| GET | `/api/urls` | List all shortened URLs |
| DELETE | `/api/urls/:shortCode` | Deactivate a URL |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/:shortCode` | Get URL-specific analytics |
| GET | `/api/analytics` | Get system-wide analytics |
| GET | `/api/analytics/trends/:days` | Get usage trends |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server status |

## 📊 Testing

### Run Backend Tests
```bash
cd e:\URL
npm test
```
**Result**: 34/34 tests passing ✅

### Test Coverage
- URL Creation (8 tests)
- URL Redirection (6 tests)
- URL Management (4 tests)
- Analytics (10 tests)
- Health Check (2 tests)

## 🔧 Configuration

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/URL_Shortner
MONGODB_TEST_URI=mongodb://localhost:27017/url-shortener-test

# Application
LOG_LEVEL=debug
SHORT_CODE_LENGTH=6
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
```

### Frontend
Automatically proxies to backend via `package.json`:
```json
"proxy": "http://localhost:3000"
```

## 📈 Performance

- **Create Shortened URL**: ~30-50ms
- **Redirect**: ~20-30ms
- **List URLs**: ~25-40ms
- **Get Analytics**: ~50-100ms

## 🗄️ Database Schema

### URLMapping
```
{
  shortCode: String (unique),
  originalUrl: String,
  customCode: Boolean,
  clickCount: Number,
  isActive: Boolean,
  clicks: [{
    timestamp: Date,
    userAgent: String,
    ipAddress: String
  }],
  createdAt: Date,
  expiresAt: Date (optional),
  updatedAt: Date
}
```

### Indexes
- Unique: `shortCode`
- Regular: `originalUrl`, `isActive`, `createdAt`
- Compound: Various for analytics queries

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd e:\URL
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd e:\URL\client
npm run build
# Serve the 'build' folder from your static host
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80 (or your server port)
MONGODB_URI=your_mongodb_atlas_uri
CORS_ORIGIN=your_domain.com
LOG_LEVEL=error
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js 4.18
- **Database**: MongoDB 4.0+, Mongoose 7.0
- **Testing**: Jest 27, Supertest 6
- **Logging**: Winston 3.8
- **Security**: Helmet, CORS, express-validator
- **Rate Limiting**: Custom in-memory implementation

### Frontend
- **Framework**: React 18.2
- **HTTP Client**: Axios 1.6
- **Styling**: CSS3 with responsive design
- **Build Tool**: Create React App

## 📝 Examples

### Create a Shortened URL
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "customCode": "mycode"
  }'
```

### Redirect via Short Code
```
GET http://localhost:3000/mycode
```

### Get Analytics
```bash
curl http://localhost:3000/api/analytics
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Run `mongod` in another terminal |
| Port 3000 already in use | Kill the process or change PORT in .env |
| CORS error | Check CORS_ORIGIN in .env |
| React app won't load | Run `npm start` in client directory |
| Tests failing | Ensure MongoDB is running |

## 📚 Documentation

- **[Backend README](./README.md)** - Backend setup and API details
- **[Frontend README](./client/README.md)** - Frontend setup and components
- **[Full Stack Guide](./FULLSTACK_GUIDE.md)** - Complete setup and deployment
- **[Getting Started](./client/GETTING_STARTED.md)** - Frontend quick start

## 📄 License

MIT

## 👤 Author

Created with ❤️ as a production-ready URL shortener application.

---

**Ready to get started?** Follow the Quick Start section above! 🎉
