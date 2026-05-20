import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [docId, setDocId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (docId.trim()) {
      navigate(`/view/${docId.trim()}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '10px', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SecureDocs Viewer
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
          Enter a Document ID to view it securely. This window is invisible to screen capture.
        </p>
      </div>

      <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '500px' }}>
        <input 
          type="text" 
          placeholder="Enter Document ID..." 
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', color: 'white', fontSize: '1.2rem', outline: 'none', marginBottom: '20px', textAlign: 'center', letterSpacing: '2px' }}
        />
        <button 
          onClick={handleJoin}
          disabled={!docId}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', opacity: !docId ? 0.5 : 1, transition: 'all 0.2s' }}
        >
          View Document
        </button>
      </div>
    </div>
  );
}
