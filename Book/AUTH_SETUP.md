# Better-Auth Integration - Setup Guide

This document explains the Better-Auth authentication integration in the AI Robotics Book project.

## Overview

The project uses **Better-Auth**, a TypeScript-first authentication framework, with a dual-server architecture:

1. **Auth Server** (Port 3001) - Handles authentication operations
2. **Docusaurus Frontend** (Port 3000) - Displays content and auth UI
3. **Python Backend** (Port 5000) - Existing backend services

## Architecture

### Components

```
Book/
├── auth-server/              # Authentication server
│   ├── auth.js              # Better-Auth configuration
│   ├── server.js            # Express server
│   ├── auth.db              # SQLite database (dev)
│   └── .env                 # Auth server environment variables
├── src/
│   ├── lib/better-auth/
│   │   └── client.ts        # Better-Auth React client
│   ├── auth/
│   │   ├── hooks/
│   │   │   └── useAuth.ts   # Authentication hook
│   │   └── context/
│   │       └── AuthProvider.tsx  # Auth context provider
│   ├── components/
│   │   └── AuthNavbar/      # Authentication navbar
│   ├── pages/
│   │   ├── signin.tsx       # Sign-in page
│   │   └── signup.tsx       # Sign-up page
│   └── theme/
│       └── Root.tsx         # App root with AuthProvider
└── .env                     # Root environment variables
```

## Quick Start

### 1. Install Dependencies

Already done! Dependencies are installed in both root and auth-server.

### 2. Start Development Servers

Run all three servers (Frontend, Auth, Backend) simultaneously:

```bash
cd Book
npm start
```

Or run individually:

```bash
# Terminal 1 - Auth Server
cd Book/auth-server
node server.js

# Terminal 2 - Docusaurus Frontend
cd Book
npm run start:frontend

# Terminal 3 - Python Backend (if needed)
cd Book/backend
python start_server.py
```

### 3. Test Authentication

1. Open http://localhost:3000
2. Click "Sign Up" in the navbar
3. Create an account with:
   - Name: Your Name
   - Email: test@example.com
   - Password: testpass123 (min 8 characters)
4. You'll be automatically signed in
5. Navbar will show "Welcome, Your Name" with Sign Out button

### 4. Verify Auth Server

Check the auth server health:
```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","service":"Auth Server","timestamp":"..."}
```

## Features

### User Management
- ✅ Email/password authentication
- ✅ Secure password hashing
- ✅ Session management (7-day expiry)
- ✅ Custom user fields (softwareBackground, hardwareBackground, roboticsInterest)
- ⏳ Email verification (coming soon)
- ⏳ Password reset (coming soon)
- ⏳ Social login (Google - coming soon)

### Security
- ✅ HTTPS-ready cookie configuration
- ✅ Cross-origin authentication (CORS)
- ✅ Environment-based secret management
- ✅ HTTPOnly, Secure, Partitioned cookies
- ✅ 8-character minimum password requirement

### User Experience
- ✅ Automatic redirect after login/signup
- ✅ Loading states during auth operations
- ✅ Error messages for validation failures
- ✅ Persistent sessions across page refreshes
- ✅ Dynamic navbar based on auth state

## Database

### Development (SQLite)
- Database file: `auth-server/auth.db`
- Automatically created on first migration
- Perfect for local development

### Tables
- **user** - User profiles with custom fields
- **session** - Active user sessions
- **account** - OAuth accounts (for future social login)
- **verification** - Email verification tokens

### Run Migrations
```bash
cd auth-server
npx @better-auth/cli migrate
```

## Environment Variables

### Root .env (Book/.env)
```env
BETTER_AUTH_SECRET=<your-secret-here>
AUTH_SERVER_URL=http://localhost:3001/api/auth
```

### Auth Server .env (Book/auth-server/.env)
```env
AUTH_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
BETTER_AUTH_SECRET=<same-secret-as-root>
PORT=3001
HOST=0.0.0.0
```

### Generate Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

⚠️ **IMPORTANT**: Use the SAME secret in both .env files!

## API Endpoints

### Auth Server (http://localhost:3001)

- `GET /health` - Health check
- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

## Usage in Components

### Using Auth Context

```tsx
import { useAuthContext } from '@/auth/context/AuthProvider';

function MyComponent() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <div>Please sign in</div>;
}
```

### Protected Routes

```tsx
import { useAuthContext } from '@/auth/context/AuthProvider';
import { Redirect } from '@docusaurus/router';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Redirect to="/signin" />;

  return <div>Protected content</div>;
}
```

## Production Deployment

### Auth Server (Deploy to Vercel/Hugging Face)

1. **Prepare for Production**:
   - Update `auth-server/auth.js` to use PostgreSQL instead of SQLite
   - Set up a PostgreSQL database (e.g., Neon, Supabase)

2. **Deploy to Vercel**:
   ```bash
   cd auth-server
   vercel
   ```

3. **Set Environment Variables** in Vercel:
   - `BETTER_AUTH_SECRET` - Your generated secret
   - `NEON_DATABASE_URL` - PostgreSQL connection string
   - `AUTH_BASE_URL` - Your Vercel auth server URL
   - `FRONTEND_URL` - Your Docusaurus production URL

4. **Update trusted origins** in `auth-server/auth.js`:
   ```javascript
   trustedOrigins: [
     'https://your-docusaurus-site.vercel.app',
     'http://localhost:3000', // Keep for dev
   ]
   ```

### Docusaurus Frontend

1. **Update** `src/lib/better-auth/client.ts`:
   ```typescript
   if (hostname === 'your-production-domain.com') {
     return 'https://your-auth-server.vercel.app/api/auth';
   }
   ```

2. **Deploy** to Vercel/GitHub Pages:
   ```bash
   npm run build
   vercel deploy --prod
   ```

## Troubleshooting

### Issue: "Invalid Origin" Error
**Solution**: Add your domain to `trustedOrigins` in `auth-server/auth.js`

### Issue: Session Not Persisting
**Solution**: Check that `credentials: 'include'` is set in the client

### Issue: Auth Server Not Responding
**Solution**:
- Verify server is running on port 3001
- Check `curl http://localhost:3001/health`
- Review auth-server logs

### Issue: Database Errors
**Solution**: Run migrations again:
```bash
cd auth-server
npx @better-auth/cli migrate
```

## Custom User Fields

The integration includes custom user fields for personalization:

- `softwareBackground` (JSON) - User's software experience
- `hardwareBackground` (JSON) - User's hardware experience
- `roboticsInterest` (String) - User's interest in robotics
- `backgroundComplete` (Boolean) - Profile completion status

These can be used to personalize content based on user expertise.

## Next Steps

- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add Google OAuth
- [ ] Create user profile page
- [ ] Add background questionnaire
- [ ] Implement content personalization
- [ ] Add admin dashboard

## Support

For issues or questions:
- Check Better-Auth docs: https://www.better-auth.com/docs
- Review the skill: `.claude/skills/better-auth-integration/SKILL.md`
- Report issues on GitHub

## References

- Better-Auth Documentation: https://www.better-auth.com/docs
- Docusaurus Documentation: https://docusaurus.io
- Skill Location: `.claude/skills/better-auth-integration/SKILL.md`
