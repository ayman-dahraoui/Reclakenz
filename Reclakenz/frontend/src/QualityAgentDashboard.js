import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Table, Alert, Spinner, Button } from 'react-bootstrap';
import ActionToggleButton from './ActionToggleButton';

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

// Composant de badge de statut professionnel
const ProfessionalStatusBadge = ({ status, config }) => {
  return (
    <span style={{
      padding: '8px 16px',
      background: `linear-gradient(135deg, ${config.bgColor} 0%, ${config.bgColor}dd 100%)`,
      color: 'white',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
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
        return { icon: '❓', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: type || 'Autre' };
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
const ProfessionalButton = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const getButtonStyle = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: 'none',
          color: 'white'
        };
      case 'details':
        return {
          background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          color: '#1d4ed8',
          borderRadius: '9999px'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          color: 'white'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          color: 'white'
        };
      case 'outline':
        return {
          background: 'transparent',
          border: '2px solid #3b82f6',
          color: '#3b82f6'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          border: 'none',
          color: 'white'
        };
    }
  };

  const buttonStyle = getButtonStyle(variant);
  const sizeStyle = size === 'sm' ? { padding: '8px 16px', fontSize: '12px' } : 
                   size === 'lg' ? { padding: '16px 32px', fontSize: '16px' } : 
                   { padding: '12px 24px', fontSize: '14px' };

  return (
    <button
      style={{
        ...buttonStyle,
        ...sizeStyle,
        borderRadius: buttonStyle.borderRadius || '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

function QualityAgentDashboard() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedReclamationArticles, setSelectedReclamationArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const navigate = useNavigate();

  // Statuts disponibles avec leurs couleurs
  const statusConfig = {
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

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  // Fonction de navigation vers le profil
  const handleProfile = () => {
    navigate('/profile');
  };

  // Fonction pour afficher le tableau de bord
  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Vous devez être connecté pour accéder à cette page');
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  // Charger les réclamations en cours
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchReclamations = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/api/quality-dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setReclamations(data);
        } else if (response.status === 401) {
          // Token expiré, nettoyer et rediriger
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        } else if (response.status === 403) {
          setMessage('Vous devez avoir une demande approuvée pour devenir Agent Qualité.');
        } else {
          setMessage('Erreur lors du chargement des réclamations');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setMessage('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();

    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(fetchReclamations, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'N/A';
    }
  };

  // Extraire les informations du titre
  const extractClaimInfo = (titre, description) => {
    let clientName = 'N/A';
    let orderRef = 'N/A';
    let company = 'N/A';

    if (titre) {
      const parts = titre.split(' - ');
      if (parts.length >= 3) {
        clientName = parts[1] || 'N/A';
        orderRef = parts[2] || 'N/A';
      }
    }

    // Extraire la société du titre ou de la description
    if (titre) {
      if (titre.includes('vetadis')) company = 'Vetadis';
      else if (titre.includes('kenz_maroc')) company = 'Kenz Maroc';
      else if (titre.includes('kenzpat')) company = 'KenzPat';
    }

    if (description && company === 'N/A') {
      if (description.includes('Vetadis')) company = 'Vetadis';
      else if (description.includes('Kenz Maroc')) company = 'Kenz Maroc';
      else if (description.includes('KenzPat')) company = 'KenzPat';
    }

    return { clientName, orderRef, company };
  };


  // Mettre à jour le statut d'une réclamation
  const handleStatusUpdate = async (reclamationId, newStatus) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/quality-dashboard/${reclamationId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: newStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || `Statut mis à jour vers ${newStatus}`);
        setShowModal(false);
        setSelectedReclamation(null);
        
        // Si le statut est "resolu", rediriger vers la création de rapport
        if (newStatus === 'resolu') {
          navigate(`/reclamation/${reclamationId}/creer-rapport`);
          return;
        }
        
        // Recharger les réclamations seulement si pas de redirection
        const refreshResponse = await fetch('http://localhost:8000/api/quality-dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setReclamations(refreshData);
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    }
  };

  // Fonction pour récupérer les articles d'une réclamation
  const fetchReclamationArticles = async (reclamationId) => {
    setLoadingArticles(true);
    console.log('🔍 Récupération des articles pour la réclamation:', reclamationId);
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/reclamations-details/${reclamationId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Réponse API:', response.status, response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        console.log('📦 Articles trouvés:', data.articles?.length || 0);
        setSelectedReclamationArticles(data.articles || []);
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        setSelectedReclamationArticles([]);
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      setSelectedReclamationArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Calculer les statistiques
  const getStats = () => {
    const total = reclamations.length;
    const enTraitement = reclamations.filter(r => r.statut === 'en_traitement_qualite').length;
    const resolues = reclamations.filter(r => r.statut === 'resolu').length;
    const rejetees = reclamations.filter(r => r.statut === 'rejete').length;
    
    return { total, enTraitement, resolues, rejetees };
  };

  // Injecter les styles globaux
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
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
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
      
      .quality-dashboard-container {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .stat-card {
        animation: slideInLeft 0.6s ease-out;
      }
      
      .stat-card:nth-child(1) { animation-delay: 0.1s; }
      .stat-card:nth-child(2) { animation-delay: 0.2s; }
      .stat-card:nth-child(3) { animation-delay: 0.3s; }
      .stat-card:nth-child(4) { animation-delay: 0.4s; }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #3b82f6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ color: '#6b7280', fontSize: '16px' }}>
            Vérification de l'authentification...
          </div>
        </div>
      </Container>
    );
  }

  // Page d'accueil pour l'agent qualité
  if (!showDashboard) {
    return (
      <Container fluid className="quality-dashboard-container" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        {/* Header avec boutons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            🎯 Dashboard Qualité
          </div>
          
          {/* Boutons Profil et Déconnexion à droite */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <ProfessionalButton
              variant="outline"
              onClick={handleProfile}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white'
              }}
            >
              👤 Profil
            </ProfessionalButton>
            <ProfessionalButton
              variant="danger"
              onClick={handleLogout}
            >
              🚪 Déconnexion
            </ProfessionalButton>
          </div>
        </div>

        {/* Contenu principal centré */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          {/* Titre principal */}
          <div style={{
            marginBottom: '40px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '20px',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              🎯 Tableau de Bord Qualité
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '20px',
              fontWeight: '400',
              maxWidth: '600px',
              lineHeight: '1.6'
            }}>
              Gérez efficacement toutes les réclamations qualité avec notre interface moderne et intuitive
            </p>
          </div>

          {/* Bouton Tableau de Bord Qualité */}
          <div style={{ animation: 'fadeInUp 1s ease-out' }}>
            <ProfessionalButton
              size="lg"
              onClick={handleShowDashboard}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                color: '#1f2937',
                fontSize: '18px',
                padding: '20px 48px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
              }}
            >
              🚀 Accéder au Dashboard
            </ProfessionalButton>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #3b82f6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ color: '#6b7280', fontSize: '16px' }}>
            Chargement des réclamations...
          </div>
        </div>
      </Container>
    );
  }

  const stats = getStats();
  const displayedReclamations = reclamations;

  return (
    <Container fluid className="quality-dashboard-container" style={{
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header avec boutons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          color: '#1f2937',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          🎯 Dashboard Qualité
        </div>
        
        {/* Boutons Profil et Déconnexion à droite */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <ProfessionalButton
            variant="outline"
            onClick={handleProfile}
          >
            👤 Profil
          </ProfessionalButton>
          <ProfessionalButton
            variant="danger"
            onClick={handleLogout}
          >
            🚪 Déconnexion
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
            title="Total Réclamations"
            value={stats.total}
            icon="📊"
            color="#3b82f6"
            trend={5}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="En Traitement"
            value={stats.enTraitement}
            icon="🔄"
            color="#f59e0b"
            trend={-2}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="Résolues"
            value={stats.resolues}
            icon="✅"
            color="#10b981"
            trend={8}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="Rejetées"
            value={stats.rejetees}
            icon="❌"
            color="#ef4444"
            trend={-1}
          />
        </div>
      </div>

      {/* Message d'alerte */}
      {message && (
        <div style={{
          background: message.includes('mis à jour') ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${message.includes('mis à jour') ? '#10b981' : '#ef4444'}`,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
          color: message.includes('mis à jour') ? '#065f46' : '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInLeft 0.6s ease-out'
        }}>
          <span style={{ fontSize: '18px' }}>
            {message.includes('mis à jour') ? '✅' : '⚠️'}
          </span>
          {message}
          <button
            onClick={() => setMessage('')}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ✕
          </button>
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
              📋 Réclamations en Cours
            </h2>
          </div>
          
          <div style={{ padding: '24px' }}>

            {displayedReclamations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Aucune réclamation
                </div>
                <div style={{ fontSize: '14px' }}>
                  Aucun élément pour ce type.
                </div>
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
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Client - Référence</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Utilisateur</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Société</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date création</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedReclamations.map((reclamation, index) => {
                      const { clientName, orderRef, company } = extractClaimInfo(reclamation.titre, reclamation.description);
                      return (
                        <tr key={reclamation.id} style={{
                          borderBottom: '1px solid #f3f4f6',
                          transition: 'all 0.2s ease',
                          animation: `slideInLeft 0.6s ease-out ${index * 0.1}s`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        >
                          <td style={{ padding: '16px', fontWeight: '700', color: '#3b82f6' }}>
                            #{reclamation.id}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                              {clientName} - {orderRef}
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                              {reclamation.user || 'N/A'}
                            </span>
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
                              {company}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <ProfessionalTypeBadge type={reclamation.type_reclamation} />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <ProfessionalStatusBadge 
                              status={reclamation.statut} 
                              config={statusConfig[reclamation.statut]} 
                            />
                          </td>
                          <td style={{ padding: '16px', color: '#6b7280' }}>
                            {formatDate(reclamation.date_creation)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap' }}>
                              <ProfessionalButton
                                variant="details"
                                size="sm"
                                onClick={async () => {
                                  setSelectedReclamation(reclamation);
                                  setShowModal(true);
                                  const token = localStorage.getItem('access');
                                  fetch(`http://localhost:8000/api/reclamations/${reclamation.id}/messages/`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  })
                                    .then(r => r.ok ? r.json() : [])
                                    .then(setChatMessages)
                                    .catch(() => setChatMessages([]));
                                  
                                  // Charger les articles de la réclamation
                                  await fetchReclamationArticles(reclamation.id);
                                }}
                              >
                                👁️ Détails
                              </ProfessionalButton>
                              
                              <ActionToggleButton
                                size="small"
                                approveText="Résolu"
                                rejectText="Rejeter"
                                onApprove={() => handleStatusUpdate(reclamation.id, 'resolu')}
                                onReject={() => handleStatusUpdate(reclamation.id, 'rejete')}
                              />
                            </div>
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

      {/* Modal pour les détails */}
      {showModal && selectedReclamation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '92%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            animation: 'fadeInUp 0.4s ease-out'
          }}>
            <div style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  boxShadow: '0 8px 22px rgba(59,130,246,0.35)'
                }}>📋</div>
                <div>
                  <div style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '20px' }}>
                    Détails de la réclamation
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                    Informations et conversation liées à cette réclamation
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  width: '36px', height: '36px', borderRadius: '10px',
                  fontSize: '18px', cursor: 'pointer', color: '#64748b'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.target.style.background = 'white'; }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Titre:</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.titre}</div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Utilisateur:</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.user || 'N/A'}</div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Type:</div>
                <ProfessionalTypeBadge type={selectedReclamation.type_reclamation} />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Statut:</div>
                <ProfessionalStatusBadge 
                  status={selectedReclamation.statut} 
                  config={statusConfig[selectedReclamation.statut]} 
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Date de création:</div>
                <div style={{ color: '#1f2937' }}>{formatDate(selectedReclamation.date_creation)}</div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Description:</div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#f9fafb',
                  color: '#1f2937',
                  lineHeight: '1.6'
                }}>
                  {selectedReclamation.description || 'Aucune description fournie'}
                </div>
              </div>

              {/* Section des Articles de réclamation */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📦 Articles de réclamation
                  {selectedReclamationArticles.length > 0 && (
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {selectedReclamationArticles.length}
                    </span>
                  )}
                </div>
                
                {console.log('🔄 État loadingArticles:', loadingArticles)}
                {console.log('📦 État selectedReclamationArticles:', selectedReclamationArticles)}
                {loadingArticles ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }} />
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      Chargement des articles...
                    </span>
                  </div>
                ) : selectedReclamationArticles.length === 0 ? (
                  <div style={{
                    padding: '12px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>📭</div>
                    <div>Aucun article associé à cette réclamation</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px'
                  }}>
                    {selectedReclamationArticles.map((article, index) => (
                      <div key={article.id || index} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '10px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {/* Image de l'article */}
                        {article.article_image_url && (
                          <div style={{
                            marginBottom: '6px',
                            textAlign: 'center'
                          }}>
                            <img 
                              src={article.article_image_url} 
                              alt={article.article_name || 'Article'}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '60px',
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Informations de l'article */}
                        <div style={{ marginBottom: '6px' }}>
                          <h4 style={{
                            margin: '0 0 3px 0',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#1f2937',
                            lineHeight: '1.2'
                          }}>
                            {article.article_name || article.article?.nom || 'Article sans nom'}
                          </h4>
                          
                          <div style={{
                            fontSize: '9px',
                            color: '#6b7280',
                            marginBottom: '1px'
                          }}>
                            <strong>Société:</strong> {article.article_societe || article.article?.societe_display || 'N/A'}
                          </div>
                          
                          <div style={{
                            fontSize: '9px',
                            color: '#6b7280',
                            marginBottom: '1px'
                          }}>
                            <strong>Quantité:</strong> {article.quantite || 1}
                          </div>
                          
                          {article.variant_display && (
                            <div style={{
                              fontSize: '9px',
                              color: '#6b7280'
                            }}>
                              <strong>Variante:</strong> {article.variant_display}
                            </div>
                          )}
                        </div>
                        
                        {/* Badge de statut */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '3px 5px',
                          background: '#f8fafc',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{
                            fontSize: '8px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            Article #{article.id}
                          </span>
                          
                          {article.article?.image_url && (
                            <span style={{
                              fontSize: '8px',
                              color: '#3b82f6',
                              fontWeight: '500'
                            }}>
                              📷
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>Conversation</div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  background: 'white'
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Aucun message.</div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{msg.sender_username} · {new Date(msg.created_at).toLocaleString('fr-FR')}</div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', color: '#111827' }}>{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Écrire un message..."
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <ProfessionalButton
                    size="sm"
                    onClick={async () => {
                      const content = chatInput.trim();
                      if (!content) return;
                      try {
                        const token = localStorage.getItem('access');
                        const res = await fetch(`http://localhost:8000/api/reclamations/${selectedReclamation.id}/messages/`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ content })
                        });
                        if (res.ok) {
                          const newMsg = await res.json();
                          setChatMessages(prev => [...prev, newMsg]);
                          setChatInput('');
                        }
                      } catch (e) {}
                    }}
                  >
                    ➤ Envoyer
                  </ProfessionalButton>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <ProfessionalButton
                onClick={() => navigate(`/reclamation/${selectedReclamation.id}/creer-rapport`)}
              >
                📝 Créer un rapport
              </ProfessionalButton>
              <ProfessionalButton
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </ProfessionalButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default QualityAgentDashboard; 