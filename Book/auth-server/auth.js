import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

const baseURL = process.env.AUTH_BASE_URL || 'http://localhost:3001';
const isHTTPS = baseURL.startsWith('https://');

export const auth = betterAuth({
  database: new Database(process.env.DATABASE_PATH || './auth.db'),
  secret: process.env.BETTER_AUTH_SECRET || "RkZTBVOSA2HTCh+9Q4JGm5ObsVFe1ESOUImCfmHU9/g=",
  baseURL: baseURL,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ai-native-hackathon-hbpn-git-001-00fd08-shan-e-zehras-projects.vercel.app',
  ],
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        unique: true
      },
      softwareBackground: {
        type: 'json',
        required: false
      },
      hardwareBackground: {
        type: 'json',
        required: false
      },
      backgroundComplete: {
        type: 'boolean',
        required: false,
        defaultValue: false
      },
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
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
