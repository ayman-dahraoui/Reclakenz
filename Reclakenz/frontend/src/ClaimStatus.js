import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant de badge de statut professionnel
const ProfessionalStatusBadge = ({ status, config }) => {
  return (
    <span style={{
      padding: '8px 16px',
      background: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.bgColor}dd 100%)`,
      color: 'white',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      border: `2px solid ${config.borderColor || config.bgColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      cursor: 'default',
      boxShadow: `0 2px 8px ${config.bgColor}40`
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = `0 4px 16px ${config.bgColor}60`;
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = `0 2px 8px ${config.bgColor}40`;
    }}
    >
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

// Composant de badge de type professionnel
const ProfessionalTypeBadge = ({ type }) => {
  const getTypeConfig = (type) => {
    switch (type) {
      case 'qualite':
        return { icon: '🔍', color: '#3b82f6', bg: '#dbeafe', border: '#93c5fd', label: 'Problème de qualité' };
      case 'livraison':
        return { icon: '🚚', color: '#10b981', bg: '#d1fae5', border: '#6ee7b7', label: 'Erreur de livraison' };
      case 'manquant':
        return { icon: '📦', color: '#f59e0b', bg: '#fef3c7', border: '#fde68a', label: 'Produit manquant' };
      case 'quantite':
        return { icon: '⚖️', color: '#8b5cf6', bg: '#ede9fe', border: '#a78bfa', label: 'Mauvaise quantité' };
      case 'commande':
        return { icon: '📋', color: '#ec4899', bg: '#fce7f3', border: '#f9a8d4', label: 'Erreur de commande' };
      case 'retard':
        return { icon: '⏰', color: '#ef4444', bg: '#fee2e2', border: '#fca5a5', label: 'Retard de livraison' };
      default:
        return { icon: '❓', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: type || 'Autre problème' };
    }
  };

  const config = getTypeConfig(type);
  return (
    <span style={{
      padding: '6px 12px',
      background: config.bg,
      color: config.color,
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      border: `1px solid ${config.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = `0 2px 8px ${config.color}30`;
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
    }}
    >
      <span style={{ fontSize: '12px' }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

// Composant de tableau professionnel
const ProfessionalTable = ({ children, ...props }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      {children}
    </div>
  );
};

// Composant de bouton professionnel
const ProfessionalButton = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, icon, ...props }) => {
  const getButtonStyle = (variant) => {
    switch (variant) {
      case 'primary':
        return { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', border: 'none', color: 'white' };
      case 'success':
        return { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: 'white' };
      case 'danger':
        return { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', color: 'white' };
      case 'warning':
        return { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: 'white' };
      case 'outline':
        return { background: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6' };
      case 'outline-secondary':
        return { background: 'transparent', border: '2px solid #6b7280', color: '#6b7280' };
      default:
        return { background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', border: 'none', color: 'white' };
    }
  };

  const buttonStyle = getButtonStyle(variant);
  const sizeStyle = size === 'sm' ? { padding: '6px 12px', fontSize: '12px' } : size === 'lg' ? { padding: '12px 24px', fontSize: '16px' } : { padding: '8px 16px', fontSize: '14px' };

  return (
    <button 
      style={{
        ...buttonStyle,
        ...sizeStyle,
        borderRadius: '8px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
        width: '100%'
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {icon && <span style={{ fontSize: '14px' }}>{icon}</span>}
      {children}
    </button>
  );
};

// Composant de carte de statistiques professionnelle
const ProfessionalStatCard = ({ title, value, icon, color, trend }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-8px)';
      e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    }}
    >
      {/* Effet de brillance */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
        transform: 'rotate(45deg)',
        animation: 'shine 3s infinite'
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '500',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {value}
          </div>
          {trend && (
            <div style={{
              fontSize: '12px',
              color: trend > 0 ? '#10b981' : '#ef4444',
              fontWeight: '500'
            }}>
              {trend > 0 ? '+' : ''}{trend}% vs mois dernier
            </div>
          )}
        </div>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

function ClaimStatus() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();

  // Statuts disponibles avec leurs couleurs
  const statusConfig = {
    'en_attente': { 
      label: 'En attente', 
      color: 'warning', 
      bgColor: '#f59e0b',
      borderColor: '#d97706',
      icon: '⏳'
    },
    'en_traitement_qualite': { 
      label: 'En traitement qualité', 
      color: 'info', 
      bgColor: '#3b82f6',
      borderColor: '#1d4ed8',
      icon: '🔄'
    },
    'resolu': { 
      label: 'Résolu', 
      color: 'success', 
      bgColor: '#10b981',
      borderColor: '#059669',
      icon: '✅'
    },
    'rejete': { 
      label: 'Rejeté', 
      color: 'danger', 
      bgColor: '#ef4444',
      borderColor: '#dc2626',
      icon: '❌'
    }
  };

  // Injecter les styles CSS globaux
  useEffect(() => {
    const globalStyles = `
      @keyframes shine {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .claim-status-container {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .stat-card {
        animation: slideInLeft 0.6s ease-out;
      }
      
      .stat-card:nth-child(1) { animation-delay: 0.1s; }
      .stat-card:nth-child(2) { animation-delay: 0.2s; }
      .stat-card:nth-child(3) { animation-delay: 0.3s; }
      .stat-card:nth-child(4) { animation-delay: 0.4s; }
      
      .table-row {
        animation: slideInLeft 0.6s ease-out;
      }
      
      .table-row:nth-child(1) { animation-delay: 0.1s; }
      .table-row:nth-child(2) { animation-delay: 0.2s; }
      .table-row:nth-child(3) { animation-delay: 0.3s; }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Vous devez être connecté pour voir les réclamations');
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  // Charger les réclamations
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/api/reclamations/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Utiliser le statut de la base de données ou 'en_attente' par défaut
          const claimsWithStatus = data.map(claim => ({
            ...claim,
            status: claim.statut || 'en_attente',
            date_creation: formatDate(claim.date_creation)
          }));
          setClaims(claimsWithStatus);
        } else if (response.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          navigate('/login');
        } else {
          setError('Erreur lors du chargement des réclamations');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setError('Erreur de connexion au serveur');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();

    // Rafraîchir les données toutes les 30 secondes pour voir les changements de statut
    const interval = setInterval(fetchClaims, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) {
      return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
  };

  // Extraire les informations du titre
  const extractClaimInfo = (titre, description) => {
    let clientName = 'N/A';
    let orderRef = 'N/A';

    if (titre) {
      const parts = titre.split(' - ');
      if (parts.length >= 3) {
        clientName = parts[1] || 'N/A';
        orderRef = parts[2] || 'N/A';
      }
    }

    return { clientName, orderRef };
  };

  // Filtrer les réclamations selon le statut
  const getFilteredClaims = () => {
    if (showCompleted) {
      // Afficher toutes les réclamations
      return claims;
    } else {
      // Masquer les réclamations résolues et rejetées
      return claims.filter(claim => 
        claim.status !== 'resolu' && claim.status !== 'rejete'
      );
    }
  };

  // Calculer les statistiques
  const getStats = () => {
    const total = claims.length;
    const enAttente = claims.filter(c => c.status === 'en_attente').length;
    const enTraitement = claims.filter(c => c.status === 'en_traitement_qualite').length;
    const resolues = claims.filter(c => c.status === 'resolu').length;
    const rejetees = claims.filter(c => c.status === 'rejete').length;

    return { total, enAttente, enTraitement, resolues, rejetees };
  };

  // Annuler une réclamation
  const cancelClaim = async (claimId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réclamation ? Cette action est irréversible.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/reclamations/${claimId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Supprimer la réclamation de la liste locale
        setClaims(prevClaims => prevClaims.filter(claim => claim.id !== claimId));
        alert('✅ Réclamation annulée avec succès !');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur lors de l\'annulation';
        alert(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion au serveur');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Vérification de l'authentification...
          </h3>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Chargement des réclamations...
          </h3>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const filteredClaims = getFilteredClaims();

  return (
    <div className="claim-status-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '32px 24px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* En-tête avec design moderne */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
        padding: '32px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)'
          }}>
            📊
          </div>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '32px',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Suivi des Réclamations
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Suivez l'évolution de vos réclamations en temps réel
            </p>
          </div>
        </div>
        
                 <div style={{
           display: 'flex',
           gap: '12px',
           alignItems: 'center'
         }}>
           <div style={{
             padding: '12px 20px',
             background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
             color: 'white',
             borderRadius: '16px',
             fontSize: '14px',
             fontWeight: '700',
             boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
           }}>
             🔄 Mise à jour automatique
           </div>
           <ProfessionalButton
             variant={showCompleted ? 'success' : 'outline'}
             size="sm"
             onClick={() => setShowCompleted(!showCompleted)}
             icon={showCompleted ? '📋' : '👁️'}
           >
             {showCompleted ? 'Masquer terminées' : 'Afficher toutes'}
           </ProfessionalButton>
         </div>
      </div>

      {/* Cartes de statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
                 <div className="stat-card">
           <ProfessionalStatCard 
             title={showCompleted ? "Total Réclamations" : "Réclamations Actives"} 
             value={showCompleted ? stats.total : filteredClaims.length} 
             icon="📋" 
             color="#3b82f6" 
             trend={5} 
           />
         </div>
        <div className="stat-card">
          <ProfessionalStatCard 
            title="En Attente" 
            value={stats.enAttente} 
            icon="⏳" 
            color="#f59e0b" 
            trend={-2} 
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard 
            title="En Traitement" 
            value={stats.enTraitement} 
            icon="🔄" 
            color="#3b82f6" 
            trend={8} 
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard 
            title="Résolues" 
            value={stats.resolues} 
            icon="✅" 
            color="#10b981" 
            trend={12} 
          />
        </div>
      </div>

             {/* Message d'information */}
       <div style={{
         background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
         border: '1px solid #93c5fd',
         borderRadius: '16px',
         padding: '24px',
         marginBottom: '32px',
         color: '#1e40af',
         display: 'flex',
         alignItems: 'center',
         gap: '16px',
         animation: 'slideInLeft 0.6s ease-out'
       }}>
         <span style={{ fontSize: '24px' }}>ℹ️</span>
         <div>
           <div style={{ fontWeight: '700', marginBottom: '4px' }}>
             {showCompleted ? 'Affichage complet' : 'Réclamations actives'}
           </div>
           <div style={{ fontSize: '14px', opacity: 0.9 }}>
             {showCompleted 
               ? 'Affichage de toutes vos réclamations (actives et terminées).'
               : 'Affichage des réclamations en cours uniquement. Les réclamations résolues et rejetées sont masquées pour une meilleure organisation.'
             }
           </div>
         </div>
       </div>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '32px',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInLeft 0.6s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span style={{ fontWeight: '600' }}>{error}</span>
        </div>
      )}

      {/* Tableau des réclamations */}
      <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <ProfessionalTable>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '24px',
            color: 'white'
          }}>
                         <h2 style={{
               margin: 0,
               fontSize: '24px',
               fontWeight: '700',
               display: 'flex',
               alignItems: 'center',
               gap: '12px'
             }}>
               {showCompleted ? '📋 Toutes les Réclamations' : '📋 Réclamations Actives'}
             </h2>
          </div>
          
                     <div style={{ padding: '24px' }}>
             {getFilteredClaims().length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                                 <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                   {showCompleted ? 'Aucune réclamation trouvée' : 'Aucune réclamation active'}
                 </div>
                 <div style={{ fontSize: '14px' }}>
                   {showCompleted 
                     ? 'Vous n\'avez pas encore créé de réclamations.'
                     : 'Toutes vos réclamations sont terminées (résolues ou rejetées).'
                   }
                 </div>
                <ProfessionalButton
                  onClick={() => navigate('/claim')}
                  variant="primary"
                  icon="➕"
                  style={{ marginTop: '20px' }}
                >
                  Créer une réclamation
                </ProfessionalButton>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{
                      background: '#f8f9fa',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>ID</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Client - Référence</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Société</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Type</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Statut</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Date création</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Actions</th>
                    </tr>
                  </thead>
                                     <tbody>
                     {getFilteredClaims().map((claim, index) => {
                      const { clientName, orderRef } = extractClaimInfo(claim.titre, claim.description);
                      return (
                                                 <tr key={claim.id} className="table-row" style={{
                           borderBottom: '1px solid #f3f4f6',
                           transition: 'all 0.2s ease',
                           animation: `slideInLeft 0.6s ease-out ${index * 0.1}s`,
                           opacity: (claim.status === 'resolu' || claim.status === 'rejete') && !showCompleted ? 0.6 : 1
                         }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        >
                          <td style={{
                            padding: '16px',
                            fontWeight: '700',
                            color: '#3b82f6'
                          }}>
                            #{claim.id}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{
                              fontWeight: '600',
                              color: '#1f2937',
                              marginBottom: '4px'
                            }}>
                              {clientName} - {orderRef}
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              background: '#6b7280',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {claim.societe_display || 'N/A'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <ProfessionalTypeBadge type={claim.type_reclamation} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <ProfessionalStatusBadge 
                              status={claim.status} 
                              config={statusConfig[claim.status]} 
                            />
                          </td>
                          <td style={{
                            padding: '16px',
                            color: '#6b7280'
                          }}>
                            {claim.date_creation}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <ProfessionalButton
                              variant={claim.status === 'resolu' || claim.status === 'rejete' ? 'outline-secondary' : 'warning'}
                              size="sm"
                              onClick={() => cancelClaim(claim.id)}
                              disabled={claim.status === 'resolu' || claim.status === 'rejete'}
                              icon={claim.status === 'resolu' || claim.status === 'rejete' ? '🚫' : '❌'}
                            >
                              {claim.status === 'resolu' || claim.status === 'rejete' ? 'Non annulable' : 'Annuler'}
                            </ProfessionalButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ProfessionalTable>
      </div>

      {/* Bouton de navigation */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <ProfessionalButton
          onClick={() => navigate('/claim')}
          variant="primary"
          icon="➕"
          size="lg"
        >
          Créer une nouvelle réclamation
        </ProfessionalButton>
      </div>
    </div>
  );
}

export default ClaimStatus; 