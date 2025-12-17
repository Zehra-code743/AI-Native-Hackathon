import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { useAuthContext } from '../auth/context/AuthProvider';
import { useHistory } from '@docusaurus/router';
import styles from './signin.module.css';

export default function SignIn(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { signIn, isAuthenticated } = useAuthContext();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message || 'Sign in failed. Please check your credentials.');
      } else {
        // Redirect to home page on success
        history.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Google sign in not yet implemented
    setError('Google sign-in coming soon!');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Forgot password not yet implemented
    setError('Password reset coming soon! Please contact support.');
    setShowForgotPassword(false);
  };

  return (
    <Layout
      title={`Sign In - ${siteConfig.title}`}
      description="Sign in to your AI Robotics account">
      <div className={styles.signinContainer}>
        <div className={styles.signinCard}>
          <div className={styles.signinHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to AI Robotics</p>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit} className={styles.signinForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formOptions}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={styles.forgotPasswordLink}
                    disabled={isLoading}>
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className={styles.signinButton}
                  disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className={styles.googleButton}>
                <svg
                  className={styles.googleIcon}
                  viewBox="0 0 24 24"
                  width="20"
                  height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className={styles.signupLink}>
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className={styles.link}>
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleForgotPassword} className={styles.signinForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.signinButton}>
                Reset Password
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className={styles.backLink}>
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

