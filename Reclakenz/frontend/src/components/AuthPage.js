import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterModeFromQuery = new URLSearchParams(location.search).get('mode') === 'register';
  const [isRegister, setIsRegister] = useState(isRegisterModeFromQuery);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    user_type: '',
    est_membre: '',
    preuve_justification: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!isRegister) {
        // Login
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password })
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          // fetch profile to route
          let userData = null;
          try {
            const userResponse = await fetch('http://localhost:8000/api/profile/', {
              headers: { 'Authorization': `Bearer ${data.access}` }
            });
            if (userResponse.ok) {
              userData = await userResponse.json();
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (_) {}
          setMessage('Connexion réussie !');
          if (userData && userData.is_staff) {
            navigate('/admin-dashboard');
          } else if (userData && userData.user_type === 'qualite' && userData.approval_status === 'approved') {
            navigate('/quality-dashboard');
          } else {
            navigate('/claim');
          }
        } else {
          setMessage("Nom d'utilisateur ou mot de passe incorrect.");
        }
      } else {
        // Register
        const response = await fetch('http://localhost:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (response.ok) {
          setMessage('Inscription réussie !');
          setTimeout(() => {
            setIsRegister(false);
            setForm({ username: '', email: '', password: '', phone: '', user_type: '', est_membre: '', preuve_justification: '' });
            navigate('/login');
          }, 1200);
        } else {
          const data = await response.json();
          setMessage(data.error || "Erreur lors de l'inscription.");
        }
      }
    } catch (err) {
      setMessage('Erreur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const showAdditionalFields = isRegister && (form.user_type === 'commercial' || form.user_type === 'qualite');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fb',
      padding: '20px'
    }}>
      <div className={`auth-split ${isRegister ? 'mode-register' : 'mode-login'}`} style={{
        width: '100%',
        maxWidth: '980px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Left panel (form) */}
        <div className="panel-form" style={{ padding: '48px 40px', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '40px', margin: 0, marginBottom: '16px', fontWeight: 800 }}> {isRegister ? "S'inscrire" : 'Se connecter'} </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{isRegister ? "Créez votre compte" : "Accédez à votre compte"}</p>

          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              background: message.includes('réussie') ? '#ecfdf5' : '#fef2f2',
              color: message.includes('réussie') ? '#065f46' : '#991b1b',
              border: `1px solid ${message.includes('réussie') ? '#a7f3d0' : '#fecaca'}`
            }}>{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} required style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                  <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <input name="phone" type="tel" placeholder="Téléphone" value={form.phone} onChange={handleChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <select name="user_type" value={form.user_type} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                    <option value="">Type d'utilisateur</option>
                    <option value="client">Client</option>
                    <option value="commercial">Commercial</option>
                    <option value="qualite">Agent Qualité</option>
                  </select>
                </div>
                {showAdditionalFields && (
                  <>
                    <div style={{ marginTop: 12 }}>
                      <select name="est_membre" value={form.est_membre} onChange={handleChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                        <option value="">Êtes-vous membre de cette société ?</option>
                        <option value="yes">Oui</option>
                        <option value="no">Non</option>
                      </select>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <textarea name="preuve_justification" value={form.preuve_justification} onChange={handleChange} required rows={3} placeholder="Preuve ou justification" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb', resize: 'vertical' }} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e5e7eb', marginBottom: 12 }} />
              </div>
            )}

            <div style={{ position: 'relative', marginTop: 12 }}>
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: '12px 48px 12px 14px', borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: 20, width: '100%', padding: '14px', border: 'none', borderRadius: 9999, color: '#fff', fontWeight: 700, background: loading ? '#9ca3af' : 'linear-gradient(90deg,#ff512f,#dd2476)', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? (isRegister ? 'Inscription...' : 'Connexion...') : (isRegister ? "S'INSCRIRE" : 'SE CONNECTER')}
            </button>
          </form>
        </div>

        {/* Right panel (cta) */}
        <div className="panel-gradient" style={{
          background: 'linear-gradient(135deg,#ff416c,#ff4b2b)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{ fontSize: '40px', margin: 0, marginBottom: 12, fontWeight: 800 }}>{isRegister ? 'Bon retour !' : 'Bonjour'}</h2>
          <p style={{ opacity: 0.95, textAlign: 'center', maxWidth: 360, marginBottom: 24 }}>
            {isRegister ? 'Pour rester connecté, connectez-vous avec vos informations' : 'Entrez vos informations personnelles et commencez votre parcours avec nous'}
          </p>
          <button onClick={() => {
            const next = !isRegister;
            setIsRegister(next);
            navigate(next ? '/register' : '/login');
          }} style={{
            border: '2px solid rgba(255,255,255,0.8)',
            background: 'transparent',
            color: 'white',
            padding: '12px 32px',
            borderRadius: 9999,
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            {isRegister ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </div>

        {/* Animated overlay stretching across both columns to mimic slide */}
        <div className="overlay-slide" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Transition CSS */}
      <style>{`
        .auth-split { transition: transform 0.6s ease-in-out; }
        .auth-split .panel-form { transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out; }
        .auth-split .panel-gradient { transition: transform 0.6s ease-in-out; }
        .auth-split.mode-login .panel-form { transform: translateX(0); opacity: 1; }
        .auth-split.mode-login .panel-gradient { transform: translateX(0); }
        .auth-split.mode-register .panel-form { transform: translateX(-20px); }
        .auth-split.mode-register .panel-gradient { transform: translateX(-20px); }
        @media (prefers-reduced-motion: reduce) {
          .auth-split .panel-form, .auth-split .panel-gradient { transition: none; }
        }
      `}</style>
    </div>
  );
}

export default AuthPage;
