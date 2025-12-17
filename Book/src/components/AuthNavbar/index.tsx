import React from 'react';
import Link from '@docusaurus/Link';
import { useAuthContext } from '../../auth/context/AuthProvider';
import styles from './styles.module.css';

/**
 * Authenticated user navbar component
 * Shows user info and sign out button when authenticated
 * Shows sign in/up buttons when not authenticated
 */
export default function AuthNavbar(): JSX.Element {
  const { user, isAuthenticated, isLoading, signOut } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.authNavbar}>
        <span className={styles.userInfo}>
          Welcome, {user.name || user.email}
        </span>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authNavbar}>
      <Link to="/signin" className={styles.signInLink}>
        Sign In
      </Link>
      <Link to="/signup" className={styles.signUpLink}>
        Sign Up
      </Link>
    </div>
  );
}
