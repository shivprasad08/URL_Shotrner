# API Testing Examples

Use these curl commands to test all API endpoints locally.

## Prerequisites
- Server running: `npm run dev`
- MongoDB running: `mongod`
- Base URL: `http://localhost:3000`

---

## 1. Health Check

### Check Server Status
```bash
curl http://localhost:3000/api/health | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 1234.56,
    "environment": "development",
    "database": {
      "connected": true
    }
  }
}
```

---

## 2. Create Short URL

### Basic Request
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.example.com/very/long/url/path?param=value"
  }' | jq .
```

### With Custom Short Code
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/username/project",
    "customCode": "github-project"
  }' | jq .
```

### With Description and Expiration
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.example.com/temporary",
    "description": "Temporary link for testing",
    "expiresAt": "2026-02-24T23:59:59Z"
  }' | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "createdAt": "2026-01-24T12:30:00Z"
  }
}
```

### Error Case: Invalid URL
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "not-a-valid-url"
  }' | jq .
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "url",
      "message": "Invalid URL format"
    }
  ]
}
```

---

## 3. Redirect to Original URL

### Redirect with Click Tracking
```bash
curl -L http://localhost:3000/abc123 -v
```

This will redirect to the original URL and increment the click count.

**Expected Response:**
- HTTP 302 Redirect
- Location header contains original URL
- Click count incremented in database

### Test Without Following Redirect
```bash
curl -L http://localhost:3000/abc123 \
  -H "User-Agent: Mozilla/5.0 Custom" \
  -v
```

### Error Case: Non-existent Short Code
```bash
curl http://localhost:3000/nonexistent | jq .
```

**Expected Response (404):**
```json
{
  "success": false,
  "error": "Short URL not found or has expired"
}
```

---

## 4. Get URL-Specific Analytics

### Basic Analytics Request
```bash
curl http://localhost:3000/api/analytics/abc123 | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://www.example.com/target",
    "stats": {
      "totalClicks": 42,
      "lastAccessedAt": "2026-01-24T12:45:00Z",
      "createdAt": "2026-01-10T10:30:00Z",
      "daysOld": 14,
      "avgClicksPerDay": 3.0
    },
    "recentAccesses": [
      {
        "timestamp": "2026-01-24T12:45:00Z",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "ipAddress": "127.0.0.1"
      }
    ],
    "summary": {
      "uniqueUserAgents": 3,
      "uniqueIpAddresses": 2
    }
  }
}
```

### Pretty Print Analytics with jq
```bash
curl http://localhost:3000/api/analytics/abc123 | jq '.data.stats'
```

---

## 5. Get System-Wide Analytics

### All System Analytics
```bash
curl http://localhost:3000/api/analytics | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalActiveUrls": 25,
    "totalClicks": 5420,
    "mostPopularUrls": [
      {
        "shortCode": "viral1",
        "clickCount": 850
      },
      {
        "shortCode": "viral2",
        "clickCount": 620
      }
    ],
    "recentUrls": [
      {
        "shortCode": "new1",
        "createdAt": "2026-01-24T12:00:00Z"
      }
    ],
    "timestamp": "2026-01-24T12:50:00Z"
  }
}
```

### Get Only Popular URLs
```bash
curl http://localhost:3000/api/analytics | jq '.data.mostPopularUrls[]' | head -20
```

---

## 6. Get Usage Trends

### Last 30 Days
```bash
curl http://localhost:3000/api/analytics/trends/30 | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "startDate": "2025-12-25T00:00:00Z",
    "trends": [
      {
        "_id": "2025-12-25",
        "count": 15,
        "totalClicks": 120
      },
      {
        "_id": "2025-12-26",
        "count": 18,
        "totalClicks": 145
      }
    ]
  }
}
```

### Last 7 Days
```bash
curl http://localhost:3000/api/analytics/trends/7 | jq '.data.trends'
```

---

## 7. List All URLs

### Get First Page
```bash
curl http://localhost:3000/api/urls | jq .
```

### Pagination
```bash
# Page 2 with 10 items per page
curl http://localhost:3000/api/urls?page=2&limit=10 | jq .

# Page 3 with 25 items per page
curl http://localhost:3000/api/urls?page=3&limit=25 | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://www.example.com/target",
      "clickCount": 42,
      "createdAt": "2026-01-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

## 8. Deactivate URL

### Delete a Short URL
```bash
curl -X DELETE http://localhost:3000/api/urls/abc123 | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Short URL deactivated successfully",
  "data": {
    "shortCode": "abc123",
    "deactivatedAt": "2026-01-24T13:00:00Z"
  }
}
```

### Verify Deactivation (should return 404)
```bash
curl http://localhost:3000/abc123 | jq .
```

---

## Batch Testing Script

Save as `test-api.sh` and run with `bash test-api.sh`:

```bash
#!/bin/bash

API="http://localhost:3000"

echo "=== URL Shortener API Test Suite ==="
echo ""

# 1. Health Check
echo "1. Checking server health..."
curl -s $API/api/health | jq '.data.status'
echo ""

# 2. Create Short URL
echo "2. Creating short URL..."
RESPONSE=$(curl -s -X POST $API/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com/test"}')

SHORT_CODE=$(echo $RESPONSE | jq -r '.data.shortCode')
echo "Created: $SHORT_CODE"
echo ""

# 3. Test Redirect (with count tracking)
echo "3. Testing redirect..."
curl -s -L $API/$SHORT_CODE -w "\nStatus: %{http_code}\n"
echo ""

# 4. Get Analytics
echo "4. Fetching analytics..."
curl -s $API/api/analytics/$SHORT_CODE | jq '.data.stats'
echo ""

# 5. Get System Analytics
echo "5. Fetching system analytics..."
curl -s $API/api/analytics | jq '.data | {totalUrls: .totalActiveUrls, totalClicks}'
echo ""

# 6. List URLs
echo "6. Listing URLs..."
curl -s $API/api/urls | jq '.pagination'
echo ""

echo "=== All tests completed ==="
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. File → Import → Paste JSON:

```json
{
  "info": {
    "name": "URL Shortener API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Short URL",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"url\":\"https://www.example.com\"}"
        },
        "url": {"raw": "{{base_url}}/api/shorten"}
      }
    },
    {
      "name": "Redirect",
      "request": {
        "method": "GET",
        "url": {"raw": "{{base_url}}/{{shortCode}}"}
      }
    },
    {
      "name": "Get Analytics",
      "request": {
        "method": "GET",
        "url": {"raw": "{{base_url}}/api/analytics/{{shortCode}}"}
      }
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost:3000"},
    {"key": "shortCode", "value": "abc123"}
  ]
}
```

---

## Performance Testing

### Load Test with Apache Bench

```bash
# 100 requests with 10 concurrent
ab -n 100 -c 10 http://localhost:3000/api/health

# GET request
ab -n 1000 -c 50 http://localhost:3000/api/analytics

# POST request
ab -n 100 -c 10 -p data.json -T application/json \
  http://localhost:3000/api/shorten
```

### Where data.json contains:
```json
{"url":"https://www.example.com"}
```

### Using wrk for Benchmarking

```bash
# Install wrk
brew install wrk  # macOS
# or apt-get install wrk  # Ubuntu

# 4 threads, 100 connections, 30 second duration
wrk -t4 -c100 -d30s http://localhost:3000/api/health
```

---

## Common Issues & Solutions

### "Connection Refused"
- Ensure server is running: `npm run dev`
- Check PORT in .env (default 3000)

### "Invalid URL Format"
- Include protocol: `https://example.com` not `example.com`
- Use valid URL: include domain name

### "MongoDB Connection Failed"
- Start MongoDB: `mongod`
- Check MONGODB_URI in .env

### "Rate Limit Exceeded"
- Default: 100 requests per 15 minutes
- Wait or change RATE_LIMIT_MAX_REQUESTS in .env

---

**Last Updated:** January 2026
