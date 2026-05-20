import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Lock, Trash2, Copy, Check, ExternalLink } from 'lucide-react';

function Login({ setAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        localStorage.setItem('admin_password', password);
        setAuthenticated(true);
      } else {
        setError('Invalid Email or Password');
      }
    } catch (err) {
      setError('Server Unreachable');
    }
  };

  return (
    <div style={{ padding: '100px', textAlign: 'center', background: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-color)' }}>
      <div style={{ background: 'var(--card-bg)', padding: '50px', borderRadius: '16px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <Lock size={40} color="#60a5fa" style={{ marginBottom: '20px' }} />
        <h2>Expert Login</h2>
        {error && <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '0.9rem' }}>{error}</div>}
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Admin Email"
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', color: 'white', marginTop: '20px', outline: 'none' }}
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Admin Password"
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', color: 'white', marginTop: '15px', marginBottom: '20px', outline: 'none' }}
        />
        <button 
          onClick={handleLogin}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Login
        </button>
        <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: 'none', color: '#94a3b8', marginTop: '20px', cursor: 'pointer' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('admin_password'));
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchDocuments = async () => {
    try {
      const password = localStorage.getItem('admin_password');
      const res = await fetch(`${API_URL}/api/documents`, {
        headers: { 
          'Authorization': `Bearer ${password}`,
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchDocuments();
    }
  }, [authenticated]);

  const deleteDocument = async (docId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document permanently? This cannot be undone.')) return;
    try {
      const password = localStorage.getItem('admin_password');
      const res = await fetch(`${API_URL}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${password}`,
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      if (res.ok) {
        fetchDocuments();
      } else {
        alert('Failed to delete document');
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const copyDocId = (docId, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(docId);
    setCopiedId(docId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!authenticated) {
    return <Login setAuthenticated={setAuthenticated} />;
  }

  const createDocument = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const password = localStorage.getItem('admin_password');
      const res = await fetch(`${API_URL}/api/documents`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/editor/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '10px', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SecureDocs Admin
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Create secure, un-recordable documents.</p>
      </div>

      <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Enter document title..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createDocument()}
          style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.5)', color: 'white', fontSize: '1rem', outline: 'none' }}
        />
        <button 
          onClick={createDocument}
          disabled={loading || !title}
          style={{ padding: '0 25px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: (loading || !title) ? 0.5 : 1 }}
        >
          <Plus size={20} />
          Create
        </button>
      </div>

      <div style={{ marginTop: '45px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={26} color="#60a5fa" /> Saved Documents
        </h2>

        {documents.length === 0 ? (
          <div style={{ padding: '40px 20px', background: 'var(--card-bg)', border: '1px dashed var(--border-color)', borderRadius: '16px', color: '#94a3b8', textAlign: 'center', fontSize: '1.05rem' }}>
            No saved documents yet. Enter a title above to create your first protected document!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/editor/${doc.id}`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 25px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#60a5fa';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(96, 165, 250, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '60%' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#f8fafc' }}>
                    {doc.title || 'Untitled Document'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>Doc ID:</span>
                    <code style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 'bold', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                      {doc.id}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => copyDocId(doc.id, e)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(15, 23, 42, 0.4)',
                      color: copiedId === doc.id ? '#10b981' : '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (copiedId !== doc.id) {
                        e.currentTarget.style.borderColor = '#60a5fa';
                        e.currentTarget.style.color = '#60a5fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedId !== doc.id) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    {copiedId === doc.id ? <Check size={15} /> : <Copy size={15} />}
                    {copiedId === doc.id ? 'Copied' : 'Copy ID'}
                  </button>

                  <button
                    onClick={(e) => navigate(`/editor/${doc.id}`)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(15, 23, 42, 0.4)',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#60a5fa';
                      e.currentTarget.style.background = 'rgba(96, 165, 250, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)';
                    }}
                    title="Open in Editor"
                  >
                    <ExternalLink size={16} />
                  </button>

                  <button
                    onClick={(e) => deleteDocument(doc.id, e)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.05)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ef4444';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    }}
                    title="Delete Document"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('admin_password');
            window.location.reload();
          }}
          style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout / Lock System
        </button>
      </div>
    </div>
  );
}
