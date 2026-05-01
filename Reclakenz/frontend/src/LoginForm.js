import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  
  // Détecter le paramètre mode=register dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('mode') === 'register') {
      setIsLogin(false);
    }
  }, [location.search]);
  
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    phone: '',
    user_type: '',
    est_membre: '',
    preuve_justification: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isLogin) {
        // Logique de connexion
        const response = await fetch('http://localhost:8000/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          
          // Récupérer les informations de l'utilisateur
          let userData = null;
          try {
            const userResponse = await fetch('http://localhost:8000/api/profile/', {
              headers: {
                'Authorization': `Bearer ${data.access}`
              }
            });
            
            if (userResponse.ok) {
              userData = await userResponse.json();
              localStorage.setItem('user', JSON.stringify(userData));
              console.log('Données utilisateur récupérées:', userData);
            } else {
              console.error('Erreur API profil:', userResponse.status, userResponse.statusText);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du profil utilisateur:', error);
          }
          
          setMessage('Connexion réussie !');
          
          // Rediriger selon le rôle de l'utilisateur
          if (userData && userData.is_staff) {
            navigate('/admin-dashboard');
          } else if (userData && userData.user_type === 'qualite' && userData.approval_status === 'approved') {
            navigate('/quality-dashboard');
          } else {
            navigate('/claim');
          }
        } else {
          setMessage('Nom d\'utilisateur ou mot de passe incorrect.');
        }
      } else {
        // Logique d'inscription
        const response = await fetch('http://localhost:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        
        if (response.ok) {
          setMessage('Inscription réussie ! Redirection vers la page de connexion...');
          setTimeout(() => {
            setIsLogin(true);
            setForm({ username: '', email: '', password: '', phone: '', user_type: '', est_membre: '', preuve_justification: '' });
            setMessage('');
          }, 2000);
        } else {
          const data = await response.json();
          setMessage(data.error || 'Erreur lors de l\'inscription.');
        }
      }
    } catch (error) {
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Détermine si les champs supplémentaires doivent être affichés
  const showAdditionalFields = !isLogin && (form.user_type === 'commercial' || form.user_type === 'qualite');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }} />
      
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: isLogin ? '420px' : '600px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 32px 32px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className={`fas ${isLogin ? 'fa-user-circle' : 'fa-user-plus'}`} style={{
              fontSize: '32px',
              color: 'white'
            }}></i>
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            margin: 0,
            fontWeight: '400'
          }}>
            {isLogin ? 'Accédez à votre espace personnel' : 'Créez votre compte personnel'}
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '32px' }}>
          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              background: message.includes('réussie') 
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: message.includes('réussie') ? '#065f46' : '#dc2626',
              border: `1px solid ${message.includes('réussie') ? '#6ee7b7' : '#fca5a5'}`
            }}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                {/* Section Informations personnelles */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-user" style={{ color: '#667eea' }}></i>
                    Informations personnelles
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        <i className="fas fa-user" style={{
                          marginRight: '8px',
                          color: '#667eea'
                        }}></i>
                        Nom d'utilisateur
                      </label>
                      <input 
                        name="username" 
                        type="text"
                        placeholder="Entrez votre nom d'utilisateur" 
                        onChange={handleChange}
                        value={form.username}
                        required 
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        <i className="fas fa-envelope" style={{
                          marginRight: '8px',
                          color: '#667eea'
                        }}></i>
                        Email
                      </label>
                      <input 
                        name="email" 
                        type="email"
                        placeholder="Entrez votre email" 
                        onChange={handleChange}
                        value={form.email}
                        required 
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <i className="fas fa-phone" style={{
                        marginRight: '8px',
                        color: '#667eea'
                      }}></i>
                      Numéro de téléphone
                    </label>
                    <input 
                      name="phone" 
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone" 
                      onChange={handleChange}
                      value={form.phone}
                      required 
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Section Type d'utilisateur */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-briefcase" style={{ color: '#667eea' }}></i>
                    Type d'utilisateur
                  </h4>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <i className="fas fa-users" style={{
                        marginRight: '8px',
                        color: '#667eea'
                      }}></i>
                      Type d'utilisateur
                    </label>
                    <select 
                      name="user_type" 
                      onChange={handleChange}
                      value={form.user_type}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        background: 'white',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="client">Client</option>
                      <option value="commercial">Commercial</option>
                      <option value="qualite">Agent Qualité</option>
                    </select>
                  </div>
                  
                  {showAdditionalFields && (
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          <i className="fas fa-building" style={{
                            marginRight: '8px',
                            color: '#667eea'
                          }}></i>
                          Êtes-vous membre de cette société ?
                        </label>
                        <select 
                          name="est_membre" 
                          onChange={handleChange}
                          value={form.est_membre}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            background: 'white',
                            boxSizing: 'border-box',
                            cursor: 'pointer'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="yes">Oui, je suis membre</option>
                          <option value="no">Non, je ne suis pas membre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          <i className="fas fa-file-alt" style={{
                            marginRight: '8px',
                            color: '#667eea'
                          }}></i>
                          Preuve ou justification
                        </label>
                        <textarea 
                          name="preuve_justification" 
                          placeholder="Veuillez fournir une preuve ou justification de votre statut" 
                          onChange={handleChange}
                          value={form.preuve_justification}
                          required
                          rows="4"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            background: 'white',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Section Connexion ou Sécurité */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-lock'}`} style={{ color: '#667eea' }}></i>
                {isLogin ? 'Connexion' : 'Sécurité'}
              </h4>
              
              {isLogin && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    <i className="fas fa-user" style={{
                      marginRight: '8px',
                      color: '#667eea'
                    }}></i>
                    Nom d'utilisateur
                  </label>
                  <input 
                    name="username" 
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur" 
                    onChange={handleChange}
                    value={form.username}
                    required 
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              )}
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  <i className="fas fa-key" style={{
                    marginRight: '8px',
                    color: '#667eea'
                  }}></i>
                  Mot de passe
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe" 
                    onChange={handleChange}
                    value={form.password}
                    required 
                    style={{
                      width: '100%',
                      padding: isLogin ? '14px 16px' : '12px 16px',
                      paddingRight: '48px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: isLogin ? '16px' : '14px',
                      transition: 'all 0.3s ease',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#667eea'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>
            
                         <button
               type="submit"
               disabled={loading}
               style={{
                 width: '100%',
                 padding: '16px',
                 background: loading 
                   ? '#9ca3af' 
                   : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 color: 'white',
                 border: 'none',
                 borderRadius: '12px',
                 fontSize: '16px',
                 fontWeight: '600',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px',
                 boxShadow: loading 
                   ? 'none' 
                   : '0 4px 14px 0 rgba(102, 126, 234, 0.4)'
               }}
               onMouseEnter={(e) => {
                 if (!loading) {
                   e.target.style.transform = 'translateY(-2px)';
                   e.target.style.boxShadow = '0 8px 25px 0 rgba(102, 126, 234, 0.5)';
                 }
               }}
               onMouseLeave={(e) => {
                 if (!loading) {
                   e.target.style.transform = 'translateY(0)';
                   e.target.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.4)';
                 }
               }}
             >
               {loading ? (
                 <>
                   <div style={{
                     width: '20px',
                     height: '20px',
                     border: '2px solid rgba(255, 255, 255, 0.3)',
                     borderTop: '2px solid white',
                     borderRadius: '50%',
                     animation: 'spin 1s linear infinite'
                   }}></div>
                   {isLogin ? 'Connexion...' : 'Inscription...'}
                 </>
               ) : (
                 <>
                   <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                   {isLogin ? 'Se connecter' : 'S\'inscrire'}
                 </>
               )}
             </button>
           </form>
           
           {isLogin && (
             <div style={{
               textAlign: 'center',
               marginTop: '24px',
               paddingTop: '24px',
               borderTop: '1px solid #e5e7eb'
             }}>
               <p style={{
                 color: '#6b7280',
                 fontSize: '14px',
                 margin: 0
               }}>
                 Vous avez un compte ?{' '}
                 <a 
                   href="/register" 
                   style={{
                     color: '#667eea',
                     textDecoration: 'none',
                     fontWeight: '600',
                     transition: 'color 0.3s ease'
                   }}
                   onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
                   onMouseLeave={(e) => e.target.style.color = '#667eea'}
                 >
                   Créer un compte
                 </a>
               </p>
             </div>
           )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoginForm; 