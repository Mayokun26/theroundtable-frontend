# TheRoundTable Frontend

The frontend application for TheRoundTable, built with Next.js and TypeScript. This application provides an interactive interface for conversing with AI-powered historical figures.

## 🚀 Technology Stack

- Next.js
- TypeScript
- React
- AWS Amplify
- Material-UI/ChakraUI

## 📋 Prerequisites

- Node.js 22+ (`@capacitor/cli` 8 requires it)
- npm

## 🔧 Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Optional: to use your own backend, create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```
Without it, the app talks to the hosted dev API set in `next.config.js`.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features

- User Authentication
  - Sign up
  - Login
  - Password reset
  - Protected routes
- Character Management
  - Browse historical figures
  - Character information cards
  - Favorite characters
- Conversations
  - Real-time chat interface
  - Historical context awareness
  - Message history
- Responsive Design
  - Mobile-friendly interface
  - Adaptive layouts
  - Touch-optimized interactions

## 📁 Project Structure

- `/src`
  - `/components` - Reusable React components
    - Character cards
    - Conversation panels
    - Message bubbles
  - `/pages` - Next.js pages and routing
  - `/providers` - Context providers (Auth, Theme)
  - `/styles` - Theme configuration and global styles
- `/public` - Static assets and images

## ⚙️ Configuration

- `NEXT_PUBLIC_API_URL` is the only setting you need; unset, it falls back to the hosted dev API
- A local backend listens on port 3001 and serves its routes under `/api`
- `npm run build` writes a static export to `out/`, which Capacitor packages for iOS

## 🔒 Security Features

- AWS Cognito authentication
- Protected routes
- HTTPS enforcement
- Input sanitization
- Rate limiting

## 📦 Deployment

The application can be deployed to:
- AWS Amplify (recommended)
- Vercel
- Netlify
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## ⚠️ Important Notes

- Ensure the backend API is running before starting the frontend
- Configure all environment variables before building
- Use Node.js 22 or higher
- Keep dependencies updated regularly