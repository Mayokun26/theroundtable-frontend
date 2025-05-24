import React from 'react';
import { useRouter } from 'next/router';

export default function About() {
  const router = useRouter();
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>About The Round Table</h1>
      <p>The Round Table is a platform that uses AI to simulate conversations with historical figures and other notable personalities.</p>
      
      <button 
        onClick={() => router.push('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#4a5568',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
} 