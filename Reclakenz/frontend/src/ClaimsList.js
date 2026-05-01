import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant de carte de réclamation professionnelle
const ProfessionalClaimCard = ({ reclamation, onViewDetails }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'en_attente':
        return { 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          border: '#fde68a', 
          icon: '⏳',
          label: 'En attente'
        };
      case 'en_traitement':
        return { 
          color: '#3b82f6', 
          bg: '#dbeafe', 
          border: '#93c5fd', 
          icon: '🔄',
          label: 'En traitement'
        };
      case 'resolu':
        return { 
          color: '#10b981', 
          bg: '#d1fae5', 
          border: '#6ee7b7', 
          icon: '✅',
          label: 'Résolu'
        };
      case 'rejete':
        return { 
          color: '#ef4444', 
          bg: '#fee2e2', 
          border: '#fca5a5', 
          icon: '❌',
          label: 'Rejeté'
        };
      default:
        return { 
          color: '#6b7280', 
          bg: '#f3f4f6', 
          border: '#d1d5db', 
          icon: '❓',
          label: status || 'Inconnu'
        };
    }
  };

  const statusConfig = getStatusConfig(reclamation.statut);
  
  // Debug pour voir les données de la réclamation
  console.log('🔍 Debug réclamation ClaimsList:', {
    id: reclamation.id,
    titre: reclamation.titre,
    statut: reclamation.statut,
    type_reclamation: reclamation.type_reclamation,
    photos: reclamation.photos?.length || 0
  });
  
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

  const { clientName, orderRef, company } = extractClaimInfo(reclamation.titre, reclamation.description);

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
    }}
    onClick={() => onViewDetails(reclamation)}
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
      
      {/* En-tête de la carte */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            📋
          </div>
          <div>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937',
              lineHeight: '1.3'
            }}>
              {reclamation.titre || 'Réclamation sans titre'}
            </h3>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {clientName} - {orderRef}
            </div>
          </div>
        </div>
        
        {/* Badge de statut */}
        <span style={{
          padding: '8px 16px',
          background: statusConfig.bg,
          color: statusConfig.color,
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          border: `2px solid ${statusConfig.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span style={{ fontSize: '14px' }}>{statusConfig.icon}</span>
          {statusConfig.label}
        </span>
      </div>
      
      {/* Description */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.6'
        }}>
          {reclamation.description || 'Aucune description fournie'}
        </div>
      </div>
      
      {/* Informations de base */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '16px' }}>🏢</span>
          <span style={{ fontWeight: '600', color: '#374151' }}>{company}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '16px' }}>👤</span>
          <span style={{ fontWeight: '600', color: '#374151' }}>
            {reclamation.user || 'Utilisateur inconnu'}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span style={{ fontSize: '16px' }}>📅</span>
          <span style={{ fontWeight: '600', color: '#374151' }}>
            {formatDate(reclamation.date_creation)}
          </span>
        </div>
      </div>
      
      {/* Bouton d'action */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
        >
          <span style={{ fontSize: '16px' }}>👁️</span>
          Voir les détails
        </button>
      </div>
    </div>
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

  const typeConfig = getTypeConfig(type);

  return (
    <span style={{
      padding: '8px 16px',
      background: typeConfig.bg,
      color: typeConfig.color,
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      border: `2px solid ${typeConfig.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      <span style={{ fontSize: '14px' }}>{typeConfig.icon}</span>
      {typeConfig.label}
    </span>
  );
};

// Composant de filtre professionnel
const ProfessionalFilter = ({ filters, onFilterChange }) => (
  <div style={{
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    marginBottom: '32px'
  }}>
    <h3 style={{
      margin: '0 0 20px 0',
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937'
    }}>
      🔍 Filtres de recherche
    </h3>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Statut
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="en_traitement">En traitement</option>
          <option value="resolu">Résolu</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>
      
      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Société
        </label>
        <select
          value={filters.company}
          onChange={(e) => onFilterChange('company', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Toutes les sociétés</option>
          <option value="vetadis">Vetadis</option>
          <option value="kenz_maroc">Kenz Maroc</option>
          <option value="kenzpat">KenzPat</option>
        </select>
      </div>
      
      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Recherche
        </label>
        <input
          type="text"
          placeholder="Rechercher par titre ou description..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  </div>
);

function ClaimsList() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    company: '',
    search: ''
  });
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [selectedReclamationArticles, setSelectedReclamationArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const navigate = useNavigate();

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
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .claims-list-container {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .claim-card {
        animation: slideInLeft 0.6s ease-out;
      }
      
      .claim-card:nth-child(1) { animation-delay: 0.1s; }
      .claim-card:nth-child(2) { animation-delay: 0.2s; }
      .claim-card:nth-child(3) { animation-delay: 0.3s; }
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
    const checkAuth = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Vous devez être connecté pour accéder à cette page');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          setIsAuthenticated(true);
        } else {
          alert('Erreur lors de la récupération du profil');
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Charger les réclamations
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadReclamations = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/api/reclamations/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setReclamations(data);
        } else {
          setError('Erreur lors du chargement des réclamations');
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    loadReclamations();
  }, [isAuthenticated]);

  // Filtrer les réclamations
  const filteredReclamations = reclamations.filter(reclamation => {
    if (filters.status && reclamation.status !== filters.status) return false;
    if (filters.company && !reclamation.societe?.includes(filters.company)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = reclamation.titre?.toLowerCase().includes(searchLower);
      const descMatch = reclamation.description?.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) return false;
    }
    return true;
  });

  // Gérer le changement de filtre
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Récupérer les articles d'une réclamation
  const fetchReclamationArticles = async (reclamationId) => {
    setLoadingArticles(true);
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/reclamations/${reclamationId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedReclamationArticles(data.articles || []);
      } else {
        console.error('Erreur lors de la récupération des articles');
        setSelectedReclamationArticles([]);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setSelectedReclamationArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Afficher les détails d'une réclamation
  const handleViewDetails = async (reclamation) => {
    setSelectedReclamation(reclamation);
    setShowModal(true);
    // Récupérer les articles de la réclamation
    await fetchReclamationArticles(reclamation.id);
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

  if (loading) {
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

  return (
    <div className="claims-list-container" style={{
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 12px 32px rgba(245, 158, 11, 0.3)'
          }}>
            📋
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
              Vos Réclamations Existantes
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Consultez et gérez toutes vos réclamations en cours
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/claim')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span style={{ fontSize: '16px' }}>➕</span>
            Nouvelle Réclamation
          </button>
          
          <div style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            📊 {filteredReclamations.length} réclamation(s)
          </div>
        </div>
      </div>

      {/* Filtres */}
      <ProfessionalFilter filters={filters} onFilterChange={handleFilterChange} />

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
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span style={{ fontWeight: '600' }}>{error}</span>
        </div>
      )}

      {/* Liste des réclamations */}
      {filteredReclamations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>📭</div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Aucune réclamation trouvée
          </h3>
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            {filters.status || filters.company || filters.search 
              ? 'Aucune réclamation ne correspond à vos critères de recherche.'
              : 'Vous n\'avez pas encore créé de réclamations.'
            }
          </p>
          <button
            onClick={() => navigate('/claim')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>➕</span>
            Créer votre première réclamation
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>
          {filteredReclamations.map((reclamation, index) => (
            <div key={reclamation.id} className="claim-card">
              <ProfessionalClaimCard
                reclamation={reclamation}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      {showModal && selectedReclamation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInUp 0.4s ease-out'
          }}>
            <div style={{
              padding: '32px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, color: '#1f2937', fontWeight: '800' }}>
                📋 Détails de la réclamation
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '32px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Titre:</div>
                <div style={{ color: '#1f2937', fontSize: '18px' }}>{selectedReclamation.titre}</div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Utilisateur:</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.user || 'N/A'}</div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Société:</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.societe || 'N/A'}</div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Date de création:</div>
                <div style={{ color: '#1f2937' }}>
                  {selectedReclamation.date_creation ? 
                    new Date(selectedReclamation.date_creation).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'
                  }
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Description:</div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#f9fafb',
                  color: '#1f2937',
                  lineHeight: '1.6'
                }}>
                  {selectedReclamation.description || 'Aucune description fournie'}
                </div>
              </div>

              {/* Section des Articles de réclamation */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '16px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📦 Articles de réclamation
                  {selectedReclamationArticles.length > 0 && (
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedReclamationArticles.length}
                    </span>
                  )}
                </div>
                
                {loadingArticles ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid #e5e7eb',
                      borderTop: '3px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '12px'
                    }} />
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>
                      Chargement des articles...
                    </span>
                  </div>
                ) : selectedReclamationArticles.length === 0 ? (
                  <div style={{
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                    <div style={{ fontWeight: '500' }}>Aucun article associé à cette réclamation</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px'
                  }}>
                    {selectedReclamationArticles.map((article, index) => (
                      <div key={article.id || index} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {/* Image de l'article */}
                        {article.article_image_url && (
                          <div style={{
                            marginBottom: '16px',
                            textAlign: 'center'
                          }}>
                            <img 
                              src={article.article_image_url} 
                              alt={article.article_name || 'Article'}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '120px',
                                borderRadius: '8px',
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
                        <div style={{ marginBottom: '12px' }}>
                          <h4 style={{
                            margin: '0 0 8px 0',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#1f2937',
                            lineHeight: '1.3'
                          }}>
                            {article.article_name || article.article?.nom || 'Article sans nom'}
                          </h4>
                          
                          <div style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '4px'
                          }}>
                            <strong>Société:</strong> {article.article_societe || article.article?.societe_display || 'N/A'}
                          </div>
                          
                          <div style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '4px'
                          }}>
                            <strong>Quantité:</strong> {article.quantite || 1}
                          </div>
                          
                          {article.variant_display && (
                            <div style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              marginBottom: '4px'
                            }}>
                              <strong>Variante:</strong> {article.variant_display}
                            </div>
                          )}
                          
                          {article.variant?.weight_display && (
                            <div style={{
                              fontSize: '14px',
                              color: '#6b7280'
                            }}>
                              <strong>Poids:</strong> {article.variant.weight_display}
                            </div>
                          )}
                        </div>
                        
                        {/* Badge de statut */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            Article #{article.id}
                          </span>
                          
                          {article.article?.image_url && (
                            <span style={{
                              fontSize: '12px',
                              color: '#3b82f6',
                              fontWeight: '500'
                            }}>
                              📷 Image disponible
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Photos/Vidéos de réclamation */}
              {selectedReclamation.photos && selectedReclamation.photos.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ 
                    fontWeight: '700', 
                    color: '#1f2937', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📷 Photos/Vidéos de réclamation
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedReclamation.photos.length}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {selectedReclamation.photos.map((photo, index) => (
                      <div key={photo.id || index} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => {
                        // Ouvrir l'image/vidéo dans une nouvelle fenêtre
                        if (photo.file_url) {
                          window.open(photo.file_url, '_blank');
                        }
                      }}
                      >
                        {/* Aperçu de l'image/vidéo */}
                        {photo.file_url && (
                          <div style={{
                            marginBottom: '8px',
                            textAlign: 'center'
                          }}>
                            {photo.type_fichier === 'image' ? (
                              <img 
                                src={photo.file_url} 
                                alt={photo.nom_fichier || 'Photo'}
                                style={{
                                  width: '100%',
                                  height: '100px',
                                  borderRadius: '8px',
                                  border: '1px solid #e5e7eb',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6b7280',
                                fontSize: '32px'
                              }}>
                                🎥
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Informations du fichier */}
                        <div style={{ marginBottom: '6px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {photo.nom_fichier || 'Fichier sans nom'}
                          </div>
                          
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            marginBottom: '2px'
                          }}>
                            <strong>Type:</strong> {photo.type_fichier === 'image' ? 'Image' : 'Vidéo'}
                          </div>
                          
                          {photo.taille_formattee && (
                            <div style={{
                              fontSize: '10px',
                              color: '#6b7280',
                              marginBottom: '2px'
                            }}>
                              <strong>Taille:</strong> {photo.taille_formattee}
                            </div>
                          )}
                          
                          {photo.client_name && (
                            <div style={{
                              fontSize: '10px',
                              color: '#6b7280'
                            }}>
                              <strong>Client:</strong> {photo.client_name}
                            </div>
                          )}
                        </div>
                        
                        {/* Badge de type */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 6px',
                          background: photo.type_fichier === 'image' ? '#dbeafe' : '#fef3c7',
                          borderRadius: '6px',
                          border: `1px solid ${photo.type_fichier === 'image' ? '#93c5fd' : '#fde68a'}`
                        }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: photo.type_fichier === 'image' ? '#1e40af' : '#92400e'
                          }}>
                            {photo.type_fichier === 'image' ? '📷' : '🎥'}
                          </span>
                          
                          <span style={{
                            fontSize: '10px',
                            color: photo.type_fichier === 'image' ? '#1e40af' : '#92400e',
                            fontWeight: '500'
                          }}>
                            {photo.type_fichier === 'image' ? 'Image' : 'Vidéo'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginTop: '8px'
                  }}>
                    Cliquez sur une image/vidéo pour l'ouvrir en plein écran
                  </div>
                </div>
              )}
            </div>
            
            <div style={{
              padding: '32px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '2px solid #6b7280',
                  color: '#6b7280',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6b7280';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                Fermer
              </button>
              
              <button
                onClick={() => navigate('/claim')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Nouvelle Réclamation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimsList;
