# URL Shortener Client

React frontend for the URL Shortener application.

## Features

- ✂️ **Shorten URLs** - Create short, memorable URLs with optional custom codes
- 📋 **Manage URLs** - View all your shortened URLs with click counts
- 📊 **Analytics** - Track usage patterns and view top performing URLs
- 📱 **Responsive Design** - Works great on desktop and mobile devices

## Setup

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000` and automatically proxy API calls to `http://localhost:3000` (the backend server).

## Configuration

The React app is configured to proxy requests to the backend server. Update `package.json` if your backend runs on a different port:

```json
"proxy": "http://localhost:3000"
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Project Structure

```
client/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── URLForm.js   # Form to create shortened URLs
│   │   ├── URLList.js   # List and manage URLs
│   │   └── Analytics.js # Analytics dashboard
│   ├── styles/          # CSS stylesheets
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

## How to Use

1. **Shorten a URL**: 
   - Enter your long URL in the form
   - Optionally add a custom short code and expiration date
   - Click "Shorten URL"

2. **View Your URLs**:
   - Click on "My URLs" tab
   - See all your shortened URLs with click counts
   - Copy short URLs or delete them

3. **Check Analytics**:
   - Click on "Analytics" tab
   - View system-wide statistics
   - See top performing URLs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
