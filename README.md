# TheRoundTable Frontend

The frontend application for TheRoundTable, built with Next.js and TypeScript. This application provides an interactive interface for conversing with AI-powered historical figures.

## 🚀 Technology Stack

- Next.js
- TypeScript
- React
- AWS Amplify
- Material-UI/ChakraUI

## 📋 Prerequisites

- Node.js 14+
- npm or yarn
- AWS Account (for authentication)

## 🔧 Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_API_URL=your-backend-api-url
NEXT_PUBLIC_AWS_REGION=your-aws-region
NEXT_PUBLIC_USER_POOL_ID=your-cognito-user-pool-id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-cognito-client-id
```

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

- Default backend API port: 5000
- WebSocket connections for real-time chat
- AWS Cognito integration for authentication
- Environment variables for sensitive configuration

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
- Use Node.js version 14 or higher
- Keep dependencies updated regularly