import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { ArrowLeft, Share2, Save, Check } from 'lucide-react';

// Register custom sizes with inline styles
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
Quill.register(Size, true);

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [socket, setSocket] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewerFontSize, setViewerFontSize] = useState(18);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    // Fetch document
    fetch(`${API_URL}/api/documents/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setTitle(data.title);
          setContent(data.content);
          setViewerFontSize(data.fontSize || 18);
        }
      });

    // Connect socket - use current origin in production
    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      newSocket.emit('join-document', id);
    });

    return () => newSocket.close();
  }, [id]);

  const handleFontSizeChange = (size) => {
    setViewerFontSize(size);
    if (socket) {
      const password = localStorage.getItem('admin_password');
      socket.emit('edit-document', { documentId: id, fontSize: size, password });
    }
  };

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
      [{ 'size': ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'] }],
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
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Viewer Font Size:</span>
            <select 
              value={viewerFontSize} 
              onChange={e => handleFontSizeChange(parseInt(e.target.value))}
              style={{ background: 'rgba(15, 23, 42, 0.5)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 5px', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
            >
              {[12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
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
