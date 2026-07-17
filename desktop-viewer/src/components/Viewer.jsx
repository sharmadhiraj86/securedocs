import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function preprocessHtml(html) {
  if (!html) return '';
  // Replace non-breaking spaces with normal spaces
  let cleaned = html.replace(/&nbsp;/g, ' ');
  // Strip size attribute from font tags
  cleaned = cleaned.replace(/<font\s+[^>]*size="[^"]*"[^>]*>/gi, '<font>');
  return cleaned;
}

export default function Viewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  
  // Permanent Render Cloud URL
  const serverUrl = 'https://securedocs-94jd.onrender.com';

  useEffect(() => {
    // Fetch initial document. Added Bypass-Tunnel-Reminder header to bypass localtunnel warning page!
    fetch(`${serverUrl}/api/documents/${id}`, {
      headers: {
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text.substring(0, 50)}`);
        }
        return res.json();
      })
      .then(data => setDocument(data))
      .catch(err => setError(`Failed: ${err.message}. (Server: ${serverUrl}, ID: ${id})`));

    // Connect socket with bypass header
    const socket = io(serverUrl, {
      extraHeaders: {
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    socket.on('connect', () => {
      socket.emit('join-document', id);
    });

    socket.on('document-updated', (data) => {
      setDocument(prev => ({
        ...prev,
        content: data.content !== undefined ? data.content : prev.content,
        title: data.title !== undefined ? data.title : prev.title,
        fontSize: data.fontSize !== undefined ? data.fontSize : prev.fontSize
      }));
    });

    return () => socket.close();
  }, [id]);



  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: '#ef4444' }}>{error}</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--card-bg)', color: 'white', cursor: 'pointer' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!document) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading document...</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      padding: '15px', 
      overflow: 'hidden', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px',
        flexShrink: 0
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          ← Leave
        </button>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {document.title || 'Untitled'}
        </h2>
        <div style={{ padding: '4px 8px', background: '#10b981', color: 'white', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          Live
        </div>
      </div>

      <div 
        id="document-content-box"
        className="document-content" 
        style={{ 
          flex: 1,
          overflowY: 'auto', 
          padding: '20px', 
          minHeight: 0, 
          boxSizing: 'border-box',
          lineHeight: '1.6',
          fontSize: `${document?.fontSize || 18}px`
        }}
        dangerouslySetInnerHTML={{ __html: preprocessHtml(document.content) }}
      />
    </div>
  );
}
