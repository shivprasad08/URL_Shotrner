# Modern URL Shortener Component

A production-ready, feature-rich URL shortener built with Next.js, React, Tailwind CSS, and Framer Motion.

## 🎯 Features

### URLShortener Component
- **Split-Screen Layout**: 50/50 desktop layout with stacked mobile view
- **Dynamic Website Preview**: Live screenshot updates as users type (500ms debounce)
- **Microlink API Integration**: Real-time website screenshots
- **Skeleton Loader**: Smooth blur effect while screenshots load
- **Custom Alias Support**: Optional custom short code input (collapsible)
- **Copy to Clipboard**: One-click copying with visual feedback
- **Error Handling**: Graceful fallback to default image on invalid URLs
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### URLList Component
- **Modern Card Layout**: Individual cards for each shortened URL
- **Click Tracking**: Display click count for each link
- **Quick Actions**: Copy and delete buttons with animations
- **Pagination**: Navigate through URL pages
- **Loading States**: Animated spinners and empty states
- **Date Display**: Shows when each URL was created

### Analytics Component
- **Stats Dashboard**: Total URLs, clicks, average clicks, active URLs
- **Top URLs**: List of most-clicked shortened links
- **Trends Filter**: 7/30/90/365 day options

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd client-next
npm install
```

2. Environment setup:
```bash
# .env.local
NEXT_PUBLIC_API_BASE=http://localhost:3000
```

3. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3001` to see the app.

## 📦 Dependencies

```json
{
  "axios": "^1.6.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.563.0",
  "next": "16.1.4",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "tailwind-merge": "^3.4.0",
  "tailwindcss-animate": "^1.0.7"
}
```

## 🎨 Component Architecture

### URLShortener (`/components/URLShortener.jsx`)
Main component with split-screen layout, form handling, and screenshot management.

**Key Props**: None (uses internal state)

**Features**:
- Debounced URL input (500ms)
- Microlink API integration for screenshots
- Form submission to backend API
- Success/error message display
- Loading states with animations

### URLList (`/components/URLList.jsx`)
Display all shortened URLs with management options.

**Key Props**: None (fetches data from API)

**Features**:
- Pagination support
- Delete functionality
- Copy to clipboard
- Click count display
- Empty states

### Analytics (`/components/Analytics.jsx`)
System-wide analytics dashboard.

**Features**:
- 4-card stats grid
- Top URLs section
- Time period filters
- Loading states

## 🔧 Technical Details

### useDebounce Hook
Located in `/lib/useDebounce.js`

```javascript
const debouncedUrl = useDebounce(originalUrl, 500);
```

Delays state updates to prevent excessive API calls while typing.

### Screenshot API
Uses **Microlink** for website screenshots:
```
https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url
```

Alternative (if Microlink fails):
- apiflash.com
- screenshot-one.com

### Backend API Integration
All requests use axios instance from `/lib/api.js`:

```javascript
POST /api/shorten
- url: string (required)
- customCode: string (optional)
- expiresAt: ISO string (optional)

GET /api/urls
- page: number
- limit: number

DELETE /api/urls/:shortCode

GET /api/analytics
```

## 🎯 Key Implementation Details

### Dynamic Image Update
```javascript
useEffect(() => {
  if (!debouncedUrl || debouncedUrl.trim() === '') {
    setScreenshotUrl(defaultImage);
    return;
  }

  const fetchScreenshot = async () => {
    setIsLoadingScreenshot(true);
    try {
      new URL(debouncedUrl); // Validate URL
      const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(
        debouncedUrl
      )}&screenshot=true&meta=false&embed=screenshot.url`;
      setScreenshotUrl(microlinkUrl);
    } catch (err) {
      setError('Invalid URL format');
      setScreenshotUrl(defaultImage);
    } finally {
      setIsLoadingScreenshot(false);
    }
  };

  fetchScreenshot();
}, [debouncedUrl]);
```

### Error Handling
- Invalid URLs show error message and revert to default image
- API errors display user-friendly messages
- Network failures gracefully degrade
- Fallback images prevent blank states

## 📱 Responsive Breakpoints

| Screen Size | Behavior |
|---|---|
| Mobile (<768px) | Single column, stacked layout |
| Tablet (768px-1024px) | Split layout begins |
| Desktop (>1024px) | Full 50/50 split with optimizations |

## ⚡ Performance Optimizations

- Framer Motion with GPU acceleration
- Debounced API calls (500ms delay)
- Image lazy loading with error boundaries
- Skeleton loaders for smooth transitions
- Memoized components where beneficial
- Optimistic UI updates

## 🔒 Security Features

- URL validation before API calls
- CORS-enabled axios instance
- Input sanitization for custom codes
- XSS protection via React's JSX escaping
- No sensitive data in localStorage

## 🧪 Testing Recommendations

```javascript
// Test debounce behavior
// Test URL validation
// Test screenshot API fallback
// Test error states
// Test copy to clipboard
// Test delete confirmation
// Test pagination
```

## 📚 API Response Format

### Shorten URL
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://example.com",
    "clickCount": 0,
    "createdAt": "2026-01-26T10:00:00Z"
  }
}
```

### Get URLs
```json
{
  "success": true,
  "data": [
    {
      "shortCode": "abc123",
      "originalUrl": "https://example.com",
      "clickCount": 5,
      "createdAt": "2026-01-26T10:00:00Z"
    }
  ]
}
```

### Analytics
```json
{
  "success": true,
  "data": {
    "totalURLs": 10,
    "totalClicks": 42,
    "avgClicksPerURL": 4.2,
    "activeURLs": 8,
    "topURLs": [...]
  }
}
```

## 🎨 Tailwind Classes Used

- Gradients: `from-slate-900 via-blue-900 to-slate-800`
- Rounded: `rounded-2xl`, `rounded-xl`
- Spacing: Consistent use of `px-4`, `py-3`, etc.
- Colors: Blue, emerald, red, gray scale
- Shadows: `shadow-lg`, `shadow-2xl`
- Animations: `animate-pulse` for loading states

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_BASE`: Backend API URL

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Self-hosted (any Node.js host)

## 📞 Support

For issues or improvements:
1. Check the backend API is running on port 3000
2. Verify MongoDB connection
3. Check browser console for errors
4. Review network tab in DevTools

## 📄 License

MIT License - Feel free to use in your projects
