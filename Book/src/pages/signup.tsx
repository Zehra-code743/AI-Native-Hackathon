import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import styles from './signup.module.css';

export default function SignUp(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle sign up logic here
    console.log('Sign up:', { username, email, password });
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log('Google sign up');
  };

  return (
    <Layout
      title={`Sign Up - ${siteConfig.title}`}
      description="Create a new AI Robotics account">
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <h1>Create Account</h1>
            <p>Sign up to get started with AI Robotics</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </button>

          <div className={styles.signinLink}>
            <p>
              Already have an account?{' '}
              <Link to="/signin" className={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
