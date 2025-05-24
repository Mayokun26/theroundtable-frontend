import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>The Round Table</h1>
      <p>Welcome to The Round Table, a platform for engaging discussions with historical figures.</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/about')}
          style={{
            padding: '10px 20px',
            background: '#4a5568',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          About
        </button>
        
        <button
          onClick={() => alert('API Connection: ' + (process.env.NEXT_PUBLIC_API_URL || 'Not configured'))}
          style={{
            padding: '10px 20px',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Check API Configuration
        </button>
      </div>
    </div>
  );
} 