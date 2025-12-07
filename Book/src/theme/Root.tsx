import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Chatbot from '../components/Chatbot';

// This component wraps all pages in Docusaurus
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      {children}
      <BrowserOnly fallback={<div />}>
        {() => <Chatbot />}
      </BrowserOnly>
    </>
  );
}

