import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Chatbot from '../components/Chatbot';
import { AuthProvider } from '../auth/context/AuthProvider';

// This component wraps all pages in Docusaurus
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <AuthProvider>
      {children}
      <BrowserOnly fallback={<div />}>
        {() => <Chatbot />}
      </BrowserOnly>
    </AuthProvider>
  );
}

