import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    email: '', 
    phone: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      navigate('/login');
      return;
    }
    
    fetch('http://localhost:8000/api/profile/', {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm({ 
          email: data.email || '', 
          phone: data.phone || ''
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement du profil:', error);
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const access = localStorage.getItem('access');
    try {
      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        setMessage('Profil mis à jour avec succès !');
        setEdit(false);
        setProfile({ ...profile, ...form });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      setMessage("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: '16px', color: '#374151', fontWeight: '500' }}>
            Chargement du profil...
          </span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center'
        }}>
          <i className="fas fa-exclamation-triangle" style={{
            fontSize: '48px',
            color: '#f59e0b',
            marginBottom: '16px'
          }}></i>
          <h3 style={{ color: '#374151', margin: '0 0 8px' }}>Erreur</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>Impossible de charger le profil</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 32px 32px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 1)';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: '12px' }}></i>
            Retour
          </button>

          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            backdropFilter: 'blur(10px)',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fas fa-user" style={{
              fontSize: '40px',
              color: 'white'
            }}></i>
          </div>
          
          <h1 style={{
            color: 'white',
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            Profil Utilisateur
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            margin: 0,
            fontWeight: '400'
          }}>
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              background: message.includes('succès') 
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: message.includes('succès') ? '#065f46' : '#dc2626',
              border: `1px solid ${message.includes('succès') ? '#6ee7b7' : '#fca5a5'}`
            }}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-info-circle" style={{ color: '#667eea' }}></i>
              Informations du profil
            </h3>

            {edit ? (
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gap: '20px' }}>
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
                    <div style={{
                      padding: '12px 16px',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      color: '#6b7280',
                      fontSize: '14px',
                      border: '2px solid #e5e7eb'
                    }}>
                      {profile.username}
                    </div>
                    <small style={{ color: '#6b7280', fontSize: '12px' }}>
                      Le nom d'utilisateur ne peut pas être modifié
                    </small>
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
                      Adresse email
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      value={form.email} 
                      onChange={handleChange} 
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
                      <i className="fas fa-phone" style={{
                        marginRight: '8px',
                        color: '#667eea'
                      }}></i>
                      Numéro de téléphone
                    </label>
                    <input 
                      name="phone" 
                      type="tel"
                      value={form.phone} 
                      onChange={handleChange} 
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

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        background: saving 
                          ? '#9ca3af' 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {saving ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i>
                          Enregistrer
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => { 
                        setEdit(false); 
                        setForm({ 
                          email: profile.email || '', 
                          phone: profile.phone || ''
                        }); 
                        setMessage('');
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        background: 'white',
                        color: '#6b7280',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.background = 'white';
                      }}
                    >
                      <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
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
                  <div style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderRadius: '12px',
                    color: '#1f2937',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb'
                  }}>
                    {profile.username}
                  </div>
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
                    Adresse email
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderRadius: '12px',
                    color: '#1f2937',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb'
                  }}>
                    {profile.email || 'Non renseigné'}
                  </div>
                </div>

                <div>
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
                  <div style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderRadius: '12px',
                    color: '#1f2937',
                    fontSize: '14px',
                    border: '2px solid #e5e7eb'
                  }}>
                    {profile.phone || 'Non renseigné'}
                  </div>
                </div>

                <button
                  onClick={() => setEdit(true)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-edit"></i>
                  Modifier le profil
                </button>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #fecaca'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#991b1b',
              margin: '0 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#dc2626' }}></i>
              Actions du compte
            </h3>
            
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Se déconnecter
            </button>
          </div>
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

export default UserProfile; 