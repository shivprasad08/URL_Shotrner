# DEPLOYMENT & SETUP GUIDE

## Quick Start (Local Development)

### Prerequisites
- Node.js v14+ 
- MongoDB v4.0+
- npm v6+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB
mongod

# 3. Create .env file
cp .env.example .env
# Edit .env if needed (defaults work for local development)

# 4. Start server
npm run dev

# 5. Verify server is running
curl http://localhost:3000/api/health
```

Server will be available at: **http://localhost:3000**

---

## API Quick Reference

### Create Short URL
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com/very/long/url"}'
```

### Access Short URL
```bash
curl -L http://localhost:3000/abc123
```

### Get Analytics
```bash
curl http://localhost:3000/api/analytics/abc123
```

### System Analytics
```bash
curl http://localhost:3000/api/analytics
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Note:** Requires MongoDB running and accessible

---

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
# Server
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/url-shortener
MONGODB_TEST_URI=mongodb://localhost:27017/url-shortener-test

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log
LOG_ERROR_FILE=./logs/error.log

# URL Shortener
SHORT_CODE_LENGTH=6
SHORT_CODE_CHARSET=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=*
```

---

## Production Deployment

### Using MongoDB Atlas

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t url-shortener .
docker run -p 3000:3000 -e MONGODB_URI=mongodb://... url-shortener
```

### Heroku Deployment

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create url-shortener-app

# 4. Add MongoDB Atlas
heroku addons:create mongolab

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name "url-shortener"

# Monitor
pm2 monit

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

---

## Performance Monitoring

### Check Logs

```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# With jq for JSON parsing
tail -f logs/app.log | jq '.level, .message'
```

### Database Monitoring

```javascript
// Count total URLs
db.url_mappings.countDocuments({})

// Top 10 most popular
db.url_mappings.find({}, { shortCode: 1, clickCount: 1 }).sort({ clickCount: -1 }).limit(10)

// Check indexes
db.url_mappings.getIndexes()

// Performance stats
db.url_mappings.stats()
```

---

## Troubleshooting

### Server won't start

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Try different port
PORT=3001 npm run dev
```

### MongoDB connection failed

```bash
# Verify MongoDB is running
mongosh

# Check MONGODB_URI in .env
echo $MONGODB_URI

# Test connection
mongosh "mongodb://localhost:27017/url-shortener"
```

### Tests failing

```bash
# Clear test database
mongosh url-shortener-test --eval "db.dropDatabase()"

# Run tests with verbose output
npm test -- --verbose
```

### High memory usage

```bash
# Check Node.js memory
ps aux | grep node

# Restart with memory limit
NODE_OPTIONS="--max-old-space-size=512" npm start
```

---

## Scaling Guide

### Single Server (Current Setup)
- Throughput: ~1,000 req/sec
- Good for: < 10K daily URLs

### Add Redis Cache
```bash
npm install redis

# Update .env
REDIS_URL=redis://localhost:6379

# Restart
npm run dev
```

Expected improvement: 5-10x faster for popular URLs

### Multiple Instances + Load Balancer
```
nginx (reverse proxy)
  ├── Instance 1 (Port 3001)
  ├── Instance 2 (Port 3002)
  └── Instance 3 (Port 3003)
       ↓
  Shared MongoDB + Redis
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener
  template:
    metadata:
      labels:
        app: url-shortener
    spec:
      containers:
      - name: url-shortener
        image: url-shortener:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
```

---

## Security Checklist

- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (via reverse proxy or CDN)
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use strong database credentials
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules
- [ ] Use helmet.js middleware ✓
- [ ] Enable CORS properly
- [ ] Rotate API keys regularly
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## API Rate Limits

Default: **100 requests per 15 minutes** per IP address

Customize in `.env`:
```
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests
```

Response when rate limited:
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review README.md
3. Check logs in `logs/` directory
4. Verify MongoDB is running
5. Ensure .env is properly configured

---

**Version:** 1.0.0  
**Last Updated:** January 2026
