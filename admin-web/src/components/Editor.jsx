import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { ArrowLeft, Share2, Save, Check } from 'lucide-react';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [socket, setSocket] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Fetch document
    fetch(`${API_URL}/api/documents/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setTitle(data.title);
          setContent(data.content);
        }
      });

    // Connect socket
    const newSocket = io(API_URL);
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      newSocket.emit('join-document', id);
    });

    return () => newSocket.close();
  }, [id]);

  const handleChange = (value) => {
    setContent(value);
    setSaving(true);
    // Send via socket for instant update
    if (socket) {
      const password = localStorage.getItem('admin_password');
      socket.emit('edit-document', { documentId: id, content: value, password });
    }
    setTimeout(() => setSaving(false), 500);
  };

  const copyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{title || 'Untitled'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '0.85rem' }}>
              {saving ? <><Save size={14} /> Saving...</> : <><Check size={14} /> Saved</>}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--card-bg)', padding: '8px 15px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Doc ID:</span>
            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px' }}>{id}</span>
          </div>
          <button 
            onClick={copyId}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: copied ? '#10b981' : 'var(--primary-color)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            {copied ? 'Copied ID' : 'Share ID'}
          </button>
        </div>
      </div>

      <div style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.3)', borderRadius: '8px' }}>
        <ReactQuill 
          ref={quillRef}
          theme="snow" 
          value={content} 
          onChange={handleChange} 
          modules={modules}
        />
      </div>
    </div>
  );
}
