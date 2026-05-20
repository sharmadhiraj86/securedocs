import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MonitorOff, Lock, Download, ChevronRight, X, HelpCircle, Terminal } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showMacHelp, setShowMacHelp] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #1e1b4b, #0f172a, #000000)', color: 'white', fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '30px 50px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield color="#60a5fa" />
          SecureDocs
        </div>
        <div>
          <button 
            onClick={() => navigate('/admin')}
            style={{ padding: '10px 25px', borderRadius: '30px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Expert Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', borderRadius: '30px', border: '1px solid rgba(96, 165, 250, 0.2)', marginBottom: '30px', fontWeight: '600', letterSpacing: '1px' }}>
          THE ULTIMATE ANTI-CAPTURE PLATFORM
        </div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '30px', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Share Sensitive Docs.<br/>Zero Screen Leaks.
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>
          A military-grade document viewer that physically hides itself from screen recording software like OBS, Zoom, and MS Teams. If they try to screen-share it, it becomes a ghost.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/sharmadhiraj86/securedocs/releases/download/v1.0.0/SecureDocsViewer_Setup.exe" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '15px 40px', borderRadius: '30px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }}>
                <Download size={22} />
                Download for Windows (.exe)
              </button>
            </a>
            <a href="https://github.com/sharmadhiraj86/securedocs/releases/download/v1.0.0/SecureDocsViewer_Mac_AppleSilicon.zip" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button 
                style={{ padding: '15px 40px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = '#60a5fa';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                <Download size={22} color="#60a5fa" />
                Download for Mac (Apple Silicon .zip)
              </button>
            </a>
          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Need help opening on Mac? 
            <span 
              onClick={() => setShowMacHelp(true)} 
              style={{ color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              View Simple 2-Click Guide <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '50px auto', padding: '0 20px' }}>
        {[
          { icon: <MonitorOff size={40} color="#60a5fa" />, title: 'Invisible to Screen Share', desc: 'Our proprietary Electron renderer bypasses OS-level capture APIs. Viewers cannot record or stream your documents over any meeting software.' },
          { icon: <Lock size={40} color="#c084fc" />, title: 'Live Admin Control', desc: 'As the Expert, you maintain real-time socket connections to the document. Edits you make are pushed to viewers instantly across the globe.' },
          { icon: <Shield size={40} color="#34d399" />, title: 'Stealth Hotkeys', desc: 'Viewers can seamlessly toggle document visibility with global shortcuts (Ctrl+B) without stealing system focus, evading proctoring software.' }
        ].map((feat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(20px)', transition: 'transform 0.3s', cursor: 'default' }}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ marginBottom: '20px' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{feat.title}</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Mac Guide Modal */}
      {showMacHelp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowMacHelp(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0b0f19 100%)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '24px',
            maxWidth: '550px',
            width: '100%',
            padding: '35px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(96, 165, 250, 0.15)',
            color: 'white'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button onClick={() => setShowMacHelp(false)} style={{
              position: 'absolute',
              top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
            }} onMouseOver={(e) => e.currentTarget.style.color = 'white'}
               onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}>
              <X size={18} />
            </button>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
              <HelpCircle size={26} />
              Mac Installation Guide
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.5' }}>
              Apple macOS protects you from downloaded applications that are not registered with the official App Store. Follow this simple <strong>2-click right-click method</strong> to open the viewer instantly:
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 'bold', flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', fontWeight: '600' }}>Extract the File</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Double-click the downloaded `.zip` file to extract <strong>SecureDocs Viewer.app</strong>.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 'bold', flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', fontWeight: '600' }}>Right-Click / Control-Click to Open</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Hold the <strong>Control</strong> key on your keyboard and click (or right-click) the app icon, then select <strong>Open</strong> from the menu.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 'bold', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', fontWeight: '600' }}>Confirm Launch</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Click <strong>Open</strong> on the pop-up warning dialog. macOS will instantly remember this choice, and you can now open the app normally by double-clicking it!
                  </p>
                </div>
              </div>
            </div>

            {/* Terminal fallback option */}
            <div style={{ marginTop: '30px', padding: '20px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h5 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                <Terminal size={16} />
                Alternative: High-Speed Terminal Fix
              </h5>
              <p style={{ margin: '0 0 12px 0', color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4' }}>
                If macOS flags the file as "damaged" due to strict local download policies, paste this line in your Mac Terminal:
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <code style={{ flex: 1, padding: '8px 12px', background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  xattr -cr ~/Downloads/SecureDocs\ Viewer.app
                </code>
                <button 
                  onClick={(e) => {
                    navigator.clipboard.writeText('xattr -cr ~/Downloads/SecureDocs\\ Viewer.app');
                    const btn = e.currentTarget;
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = 'Copy', 2000);
                  }}
                  style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
