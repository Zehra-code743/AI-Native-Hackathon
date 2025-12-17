import { createAuthClient } from 'better-auth/react';

/**
 * Determines the auth server URL based on the current environment
 * - Production: Returns the production auth server URL
 * - Development: Returns localhost
 */
const getAuthServerURL = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Production domains
    if (hostname.includes('vercel.app') || hostname.includes('your-production-domain.com')) {
      // TODO: Replace with your production auth server URL
      return process.env.AUTH_SERVER_URL || 'https://your-auth-server.vercel.app/api/auth';
    }
  }

  // Development
  return 'http://localhost:3001/api/auth';
};

/**
 * Better-Auth client for authentication operations
 * Configured with cookie-based sessions and cross-origin support
 */
export const authClient = createAuthClient({
  baseURL: getAuthServerURL(),
  fetchOptions: {
    credentials: 'include', // CRITICAL: Include cookies in requests
  },
});

/**
 * Custom user type with additional fields
 */
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  softwareBackground?: any;
  hardwareBackground?: any;
  roboticsInterest?: string;
  backgroundComplete?: boolean;
}
