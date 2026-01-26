# Quick Start Guide

## Running the Complete Application

### 1. Start Backend (Terminal 1)
```bash
cd e:\URL
npm start
# Runs on http://localhost:3000
# Serves API endpoints and MongoDB connection
```

### 2. Start Frontend (Terminal 2)
```bash
cd e:\URL\client-next
npm run dev
# Runs on http://localhost:3001
# Hot reload enabled
```

### 3. Open in Browser
```
http://localhost:3001
```

## What You'll See

### Home Page
- **Tab Navigation** at the top with 3 sections:
  - ✂️ Shorten URL (default)
  - 📋 My URLs
  - 📊 Analytics

### Shorten URL Tab
- **Left Panel** (desktop): Dynamic website preview
  - Displays a live screenshot of the URL you type
  - Updates every 500ms as you type (debounced)
  - Default futuristic image when empty
  - Skeleton loader while fetching
  
- **Right Panel**: Form to shorten URLs
  - Enter long URL
  - Optional custom short code
  - "Shorten Link" button
  - Displays result with copy button

### My URLs Tab
- View all shortened URLs
- Click count for each link
- Quick copy/delete buttons
- Pagination for multiple pages

### Analytics Tab
- Total URLs count
- Total clicks across all URLs
- Average clicks per URL
- Active URLs count
- Top clicked URLs list

## Common Tasks

### Shorten a URL
1. Go to "Shorten URL" tab
2. Paste a long URL (e.g., `https://www.github.com/shivprasad08`)
3. Watch the preview update on the left
4. Optionally enter a custom code (e.g., `github`)
5. Click "Shorten Link"
6. Copy the result and share!

### View My Links
1. Click "My URLs" tab
2. See all shortened links with click counts
3. Click copy icon to copy short URL
4. Click trash icon to delete

### Check Statistics
1. Click "Analytics" tab
2. View dashboard with overall stats
3. See top URLs by clicks

## Troubleshooting

### Screenshot not loading?
- Check internet connection
- Verify URL is valid (starts with http:// or https://)
- Screenshot API has rate limits on free tier

### Backend not connecting?
```bash
# Ensure backend is running
cd e:\URL
npm start

# Check MongoDB is running
mongod
```

### Port already in use?
```bash
# Find process on port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3002
```

## File Structure

```
client-next/
├── app/
│   ├── page.js              # Main page with tabs
│   ├── layout.js            # Root layout
│   ├── globals.css          # Global styles
│   └── styles/              # Component-specific CSS
├── components/
│   ├── URLShortener.jsx     # Main shortener component ⭐
│   ├── URLList.jsx          # URLs list component
│   └── Analytics.jsx        # Analytics dashboard
├── lib/
│   ├── api.js               # Axios instance
│   ├── useDebounce.js       # Debounce hook
│   └── utils.js             # Utility functions
├── .env.local               # Environment variables
├── next.config.mjs          # Next.js config
├── tailwind.config.js       # Tailwind config
└── package.json             # Dependencies
```

## Key Features Explained

### 🖼️ Dynamic Preview
- Uses **Microlink API** for live screenshots
- Updates when you stop typing (500ms delay)
- Shows actual website before shortening
- Fallback to default image on errors

### ⚡ Debouncing
- Prevents too many API calls while typing
- Uses custom `useDebounce` hook
- 500ms delay configured

### 🎨 Animations
- Framer Motion powers all transitions
- Smooth page changes
- Loading spinners
- Copy confirmation feedback

### 📱 Responsive
- Desktop: Full split layout
- Mobile: Stacked layout
- Tablet: Optimized split view

## Development Tips

### Adding New Features
1. Create component in `/components`
2. Import in main page
3. Use `motion.div` for animations
4. Use `lucide-react` for icons
5. Style with Tailwind classes

### Debugging
```javascript
// Enable logging
console.log('URL changed:', originalUrl);
console.log('Screenshot URL:', screenshotUrl);
console.log('API Response:', response);
```

### Performance Check
- Open DevTools (F12)
- Go to Network tab
- Monitor API calls
- Check screenshot loading time

## API Endpoints Reference

```bash
# Shorten URL
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","customCode":"ex"}'

# Get all URLs
curl http://localhost:3000/api/urls?page=1&limit=10

# Get analytics
curl http://localhost:3000/api/analytics

# Delete URL
curl -X DELETE http://localhost:3000/api/urls/abc123

# Visit shortened link
curl -L http://localhost:3001/abc123
```

## Next Steps

1. **Customize** the colors and styling
2. **Deploy** to Vercel or Netlify
3. **Add authentication** for user accounts
4. **Implement** link expiration
5. **Add QR codes** for shortened URLs
6. **Create admin dashboard** for analytics

## Support

For issues:
1. Check backend is running
2. Verify `.env.local` has correct API URL
3. Clear cache: `npm run build` then restart
4. Check browser console for errors

Enjoy your new URL shortener! 🚀
