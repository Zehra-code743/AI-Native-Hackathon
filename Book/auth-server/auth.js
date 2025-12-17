import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

// Determine base URL and HTTPS mode
const baseURL = process.env.AUTH_BASE_URL || 'http://localhost:3001';
const isHTTPS = baseURL.startsWith('https://');

export const auth = betterAuth({
  database: new Database('./auth.db'),
  baseURL: baseURL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ai-native-hackathon-hbpn-git-001-00fd08-shan-e-zehras-projects.vercel.app',
    // Add your production domain here
  ],
  secret: process.env.BETTER_AUTH_SECRET || "",
  user: {
    additionalFields: {
      softwareBackground: { type: 'json', required: false },
      hardwareBackground: { type: 'json', required: false },
      roboticsInterest: { type: 'string', required: false },
      backgroundComplete: { type: 'boolean', required: false, defaultValue: false },
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  advanced: {
    // CRITICAL: Configure cookies for cross-origin authentication
    defaultCookieAttributes: {
      sameSite: isHTTPS ? 'none' : 'lax',
      secure: isHTTPS,
      httpOnly: true,
      partitioned: true, // New standard for cross-site cookies
    },
    useSecureCookies: isHTTPS,
    crossSubDomainCookies: {
      enabled: false, // Use cross-origin, not subdomain
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can be enabled later
    password: {
      minLength: 8,
    },
  },
});
