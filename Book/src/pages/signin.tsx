import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './signin.module.css';

export default function SignIn(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in:', { username, password });
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Google sign in');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Forgot password');
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

          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit} className={styles.signinForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
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
                    className={styles.input}
                  />
                </div>

                <div className={styles.formOptions}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={styles.forgotPasswordLink}>
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className={styles.signinButton}>
                  Sign In
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

