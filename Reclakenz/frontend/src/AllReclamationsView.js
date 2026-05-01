import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionToggleButton from './ActionToggleButton';
import './App.css';

// Styles CSS globaux pour les animations
const globalStyles = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
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
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
`;

// Composant de carte de statistique professionnelle
const ProfessionalStatCard = ({ icon, title, value, color, gradient = false }) => (
  <div style={{
    background: gradient ? `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` : 'white',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${color}20`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px)';
    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
  }}
  >
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '16px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
      marginBottom: '16px',
      boxShadow: `0 8px 24px ${color}40`
    }}>
      {icon}
    </div>
    
    <h3 style={{
      margin: '0 0 8px 0',
      fontSize: '28px',
      fontWeight: '800',
      color: '#1f2937',
      lineHeight: '1.1'
    }}>
      {value}
    </h3>
    
    <p style={{
      margin: '0',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280'
    }}>
      {title}
    </p>
  </div>
);

// Composant de badge de statut professionnel
const ProfessionalStatusBadge = ({ status, text }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'en_attente':
        return { color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' };
      case 'en_traitement_qualite':
        return { color: '#3b82f6', bg: '#dbeafe', border: '#93c5fd' };
      case 'resolu':
        return { color: '#10b981', bg: '#d1fae5', border: '#6ee7b7' };
      case 'rejete':
        return { color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span style={{
      padding: '8px 16px',
      background: config.bg,
      color: config.color,
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      border: `2px solid ${config.border}`,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
      lineHeight: 1
    }}>
      {text}
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
      case 'facturation':
        return { icon: '💰', color: '#059669', bg: '#d1fae5', border: '#6ee7b7', label: 'Problème de facturation' };
      case 'technique':
        return { icon: '🔧', color: '#7c3aed', bg: '#ede9fe', border: '#a78bfa', label: 'Problème technique' };
      case 'client':
        return { icon: '👤', color: '#0891b2', bg: '#cffafe', border: '#67e8f9', label: 'Service client' };
      case 'produit':
        return { icon: '🏷️', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Défaut produit' };
      case 'emballage':
        return { icon: '📦', color: '#ea580c', bg: '#fed7aa', border: '#fdba74', label: 'Problème d\'emballage' };
      case 'stock':
        return { icon: '🏪', color: '#16a34a', bg: '#dcfce7', border: '#86efac', label: 'Problème de stock' };
      case 'transport':
        return { icon: '🚛', color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', label: 'Problème de transport' };
      case 'douane':
        return { icon: '🏛️', color: '#7c2d12', bg: '#fed7aa', border: '#fdba74', label: 'Problème douanier' };
      case 'assurance':
        return { icon: '🛡️', color: '#059669', bg: '#d1fae5', border: '#6ee7b7', label: 'Problème d\'assurance' };
      case 'garantie':
        return { icon: '📜', color: '#7c3aed', bg: '#ede9fe', border: '#a78bfa', label: 'Problème de garantie' };
      case 'remboursement':
        return { icon: '💸', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Demande de remboursement' };
      case 'echange':
        return { icon: '🔄', color: '#0891b2', bg: '#cffafe', border: '#67e8f9', label: 'Demande d\'échange' };
      case 'reclamation':
        return { icon: '⚠️', color: '#f59e0b', bg: '#fef3c7', border: '#fde68a', label: 'Réclamation générale' };
      case 'suggestion':
        return { icon: '💡', color: '#8b5cf6', bg: '#ede9fe', border: '#a78bfa', label: 'Suggestion d\'amélioration' };
      case 'information':
        return { icon: 'ℹ️', color: '#3b82f6', bg: '#dbeafe', border: '#93c5fd', label: 'Demande d\'information' };
      case 'urgence':
        return { icon: '🚨', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Urgence' };
      case 'maintenance':
        return { icon: '🔧', color: '#7c3aed', bg: '#ede9fe', border: '#a78bfa', label: 'Maintenance' };
      case 'formation':
        return { icon: '🎓', color: '#059669', bg: '#d1fae5', border: '#6ee7b7', label: 'Demande de formation' };
      case 'partenariat':
        return { icon: '🤝', color: '#0891b2', bg: '#cffafe', border: '#67e8f9', label: 'Demande de partenariat' };
      case 'autre':
        return { icon: '❓', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: 'Autre' };
      default:
        return { icon: '❓', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db', label: type || 'Inconnu' };
    }
  };

  const config = getTypeConfig(type);
  
  return (
    <span style={{
      padding: '8px 16px',
      background: config.bg,
      color: config.color,
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      border: `2px solid ${config.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = `0 4px 16px ${config.color}30`;
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
    }}
    title={config.label}
    >
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

// Composant de tableau professionnel
const ProfessionalTable = ({ children, title }) => (
  <div style={{
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '28px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
      }}>
        📊
      </div>
      <h3 style={{
        margin: '0',
        fontSize: '24px',
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h3>
    </div>
    
    <div style={{
      overflow: 'auto',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {children}
    </div>
  </div>
);

// Composant de bouton professionnel
const ProfessionalButton = ({ onClick, children, variant = 'primary', icon, size = 'medium' }) => {
  const getVariantConfig = (variant) => {
    switch (variant) {
      case 'primary':
        return { bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' };
      case 'success':
        return { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' };
      case 'warning':
        return { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' };
      case 'danger':
        return { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' };
      case 'details':
        return { 
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', 
          color: '#1d4ed8', 
          border: '1px solid #bfdbfe',
          borderRadius: '9999px'
        };
      default:
        return { bg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', color: 'white' };
    }
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case 'small':
        return { padding: '8px 16px', fontSize: '12px' };
      case 'medium':
        return { padding: '12px 24px', fontSize: '14px' };
      case 'large':
        return { padding: '16px 32px', fontSize: '16px' };
      default:
        return { padding: '12px 24px', fontSize: '14px' };
    }
  };

  const config = getVariantConfig(variant);
  const sizeConfig = getSizeConfig(size);
  
  return (
    <button
      onClick={onClick}
      style={{
        background: config.bg,
        color: config.color,
        border: config.border || 'none',
        borderRadius: config.borderRadius || '16px',
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-4px)';
        e.target.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
      }}
    >
      {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      {children}
    </button>
  );
};

const AllReclamationsView = () => {
  const navigate = useNavigate();
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedReclamationArticles, setSelectedReclamationArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  useEffect(() => {
    checkUserProfile();
  }, []);

  // Ajouter les styles CSS au head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setMessage('Vous devez être connecté pour accéder à cette page');
        setProfileLoading(false);
        return;
      }

      // Récupérer le profil utilisateur
      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('Profil utilisateur récupéré:', profileData); // Debug log
        setUserProfile(profileData);
        
        // Vérifier si l'utilisateur est approuvé
        console.log('Statut d\'approbation:', profileData.approval_status); // Debug log
        console.log('Type d\'utilisateur:', profileData.user_type); // Debug log
        
        if (profileData.approval_status === 'approved') {
          console.log('Utilisateur approuvé, chargement des réclamations...'); // Debug log
          fetchReclamations();
        } else {
          console.log('Utilisateur non approuvé, statut:', profileData.approval_status); // Debug log
          setProfileLoading(false);
          setLoading(false);
        }
      } else {
        console.error('Erreur lors de la récupération du profil:', response.status); // Debug log
        setMessage('Erreur lors de la récupération du profil');
        setProfileLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setMessage('Erreur de connexion');
      setProfileLoading(false);
    }
  };

  const fetchReclamations = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/all-reclamations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReclamations(data);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Erreur lors du chargement des réclamations');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
      setProfileLoading(false);
    }
  };

  const handleStatusUpdate = async (reclamationId, newStatus) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/all-reclamations/${reclamationId}/`, {
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
         if (newStatus === 'rejete') {
           setMessage('Réclamation rejetée et supprimée avec succès');
         } else {
           setMessage(`Statut mis à jour vers ${newStatus}`);
         }
         fetchReclamations(); // Recharger la liste
       } else {
        const data = await response.json();
        setMessage(data.error || 'Erreur lors de la mise à jour');
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

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <span style={{ fontSize: '12px', opacity: 0.5 }}>↕️</span>;
    }
    return sortDirection === 'asc' ? 
      <span style={{ fontSize: '12px', color: '#3b82f6' }}>↗️</span> : 
      <span style={{ fontSize: '12px', color: '#3b82f6' }}>↘️</span>;
  };

  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (reclamation) => {
    const statusConfig = {
      'en_attente': { text: 'En attente', color: '#f59e0b' },
      'en_traitement_qualite': { text: 'En traitement', color: '#3b82f6' },
      'resolu': { text: 'Résolu', color: '#10b981' },
      'rejete': { text: 'Rejeté', color: '#ef4444' }
    };
    
    const config = statusConfig[reclamation.statut] || { text: 'Inconnu', color: '#6b7280' };
    return <ProfessionalStatusBadge status={reclamation.statut} text={config.text} />;
  };

  // Fonction pour obtenir le badge de type
  const getTypeBadge = (type) => {
    return <ProfessionalTypeBadge type={type} />;
  };

  // Fonction pour obtenir la société
  const getSociete = (reclamation) => {
    console.log('🔍 Debug société pour réclamation:', reclamation.id, {
      societe_display: reclamation.societe_display,
      societe: reclamation.societe,
      articles: reclamation.articles?.length || 0
    });
    
    // Utiliser societe_display qui contient le nom lisible de la société
    if (reclamation.societe_display) {
      console.log('✅ Utilisation de societe_display:', reclamation.societe_display);
      return reclamation.societe_display;
    }
    // Fallback vers les articles si disponible
    if (reclamation.articles && reclamation.articles.length > 0) {
      const articleSociete = reclamation.articles[0].article_societe || 'N/A';
      console.log('📦 Utilisation de article_societe:', articleSociete);
      return articleSociete;
    }
    // Fallback vers le champ societe brut
    const societeBrut = reclamation.societe || 'N/A';
    console.log('⚠️ Utilisation de societe brut:', societeBrut);
    return societeBrut;
  };

  // Fonction pour filtrer et trier les réclamations
  const getSortedReclamations = () => {
    // Filtrer les réclamations
    let filtered = reclamations.filter(reclamation => {
      // Filtre par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = reclamation.titre?.toLowerCase().includes(searchLower);
        const userMatch = reclamation.user?.toLowerCase().includes(searchLower);
        const societeMatch = getSociete(reclamation).toLowerCase().includes(searchLower);
        
        if (!titleMatch && !userMatch && !societeMatch) {
          return false;
        }
      }
      
      // Filtre par statut
      if (statusFilter && reclamation.statut !== statusFilter) {
        return false;
      }
      
      // Filtre par société
      if (companyFilter) {
        // Mapper les valeurs du select vers les noms d'affichage
        const societeMapping = {
          'vetadis': 'Vetadis',
          'kenz_maroc': 'Kenz Maroc',
          'kenzpat': 'KenzPat'
        };
        
        const expectedSociete = societeMapping[companyFilter];
        const actualSociete = getSociete(reclamation);
        
        console.log('🔍 Filtrage société:', {
          reclamationId: reclamation.id,
          expectedSociete: expectedSociete,
          actualSociete: actualSociete,
          companyFilter: companyFilter,
          match: actualSociete === expectedSociete
        });
        
        if (actualSociete !== expectedSociete) {
          return false;
        }
      }
      
      // Filtre par réclamations terminées
      if (!showCompleted) {
        // Masquer les réclamations résolues et rejetées
        if (reclamation.statut === 'resolu' || reclamation.statut === 'rejete') {
          return false;
        }
      }
      
      return true;
    });

    // Trier les réclamations filtrées
    const sorted = filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'id') {
        aValue = a.id;
        bValue = b.id;
      } else if (sortField === 'date_creation') {
        aValue = new Date(a.date_creation);
        bValue = new Date(b.date_creation);
      } else {
        return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  };

  // Fonction pour changer le tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openDetails = async (reclamation) => {
    setSelectedReclamation(reclamation);
    setShowDetailsModal(true);
    // Charger les messages
    const token = localStorage.getItem('access');
    fetch(`http://localhost:8000/api/reclamations/${reclamation.id}/messages/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(setChatMessages)
      .catch(() => setChatMessages([]));
    
    // Charger les articles de la réclamation
    await fetchReclamationArticles(reclamation.id);
  };

  const closeDetails = () => {
    setShowDetailsModal(false);
    setSelectedReclamation(null);
  };

  if (profileLoading) {
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
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: '32px' }}>⏳</span>
          </div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Vérification des permissions...
          </h3>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Chargement de votre profil utilisateur
          </p>
        </div>
      </div>
    );
  }

  // Afficher le message d'erreur si l'utilisateur n'est pas approuvé
  if (!userProfile || userProfile.approval_status !== 'approved') {
              let errorMessage = "Vous devez avoir une demande approuvée pour accéder à cette page.";
    
    if (userProfile) {
                    switch (userProfile.user_type) {
                case 'client':
                  errorMessage = "Vous devez avoir une demande approuvée pour créer des réclamations.";
                  break;
                case 'commercial':
                  errorMessage = "Vous devez avoir une demande approuvée pour devenir Commercial.";
                  break;
                case 'qualite':
                  errorMessage = "Vous devez avoir une demande approuvée pour devenir Agent Qualité.";
                  break;
                default:
                  errorMessage = "Votre compte n'a pas encore été approuvé par l'administrateur.";
              }
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '32px 24px',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            padding: '48px 32px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px',
              color: 'white'
            }}>
              ⏳
            </div>
            <h2 style={{
              margin: '0 0 16px 0',
              fontSize: '24px',
              fontWeight: '800',
              color: '#1f2937'
            }}>
              En attente
            </h2>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              {errorMessage}
            </p>
            <ProfessionalButton
              onClick={() => navigate('/')}
              variant="primary"
              icon="🏠"
            >
              Retour à l'accueil
            </ProfessionalButton>
          </div>
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
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: '32px' }}>📊</span>
          </div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Chargement des réclamations...
          </h3>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Récupération des données en cours
          </p>
        </div>
      </div>
    );
  }

  // Calculer les statistiques (basées sur les réclamations filtrées)
  const filteredReclamations = getSortedReclamations();
  const totalReclamations = filteredReclamations.length;
  const enAttente = filteredReclamations.filter(r => r.statut === 'en_attente').length;
  const enTraitement = filteredReclamations.filter(r => r.statut === 'en_traitement_qualite').length;
  const resolues = filteredReclamations.filter(r => r.statut === 'resolu').length;
  const rejetees = filteredReclamations.filter(r => r.statut === 'rejete').length;

  return (
    <div style={{
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
              Tableau de Bord - Agent Commercial
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Gestion complète de toutes les réclamations
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
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
            📅 {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <ProfessionalButton
            onClick={() => setShowCompleted(!showCompleted)}
            variant={showCompleted ? 'success' : 'outline'}
            icon={showCompleted ? '📋' : '👁️'}
            size="medium"
          >
            {showCompleted ? 'Masquer terminées' : 'Afficher toutes'}
          </ProfessionalButton>
        </div>
      </div>

      {/* Boutons d'accès rapides */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '40px'
      }}>
        <ProfessionalButton
          onClick={() => navigate('/all-reclamations')}
          variant="details"
          icon="📋"
          size="large"
        >
          Toutes les réclamations
        </ProfessionalButton>
        <ProfessionalButton
          onClick={() => navigate('/commercial-stats')}
          variant="success"
          icon="📊"
          size="large"
        >
          Statistiques
        </ProfessionalButton>
        <ProfessionalButton
          onClick={() => navigate('/rapports')}
          variant="primary"
          icon="📝"
          size="large"
        >
          Rapports
        </ProfessionalButton>
      </div>

      {/* Message de notification */}
      {message && (
        <div style={{
          padding: '16px 24px',
          background: message.includes('mis à jour') ? 
            'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 
            'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: message.includes('mis à jour') ? '#166534' : '#dc2626',
          borderRadius: '16px',
          marginBottom: '32px',
          border: `1px solid ${message.includes('mis à jour') ? '#bbf7d0' : '#fecaca'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontWeight: '600' }}>{message}</span>
          <button
            onClick={() => setMessage('')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'inherit',
              padding: '4px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Cartes de statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <ProfessionalStatCard
          icon="📋"
          title="Total Réclamations"
          value={totalReclamations}
          color="#3b82f6"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="⏳"
          title="En Attente"
          value={enAttente}
          color="#f59e0b"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="🔄"
          title="En Traitement"
          value={enTraitement}
          color="#8b5cf6"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="✅"
          title="Résolues"
          value={resolues}
          color="#10b981"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="❌"
          title="Rejetées"
          value={rejetees}
          color="#ef4444"
          gradient={true}
        />
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
              ? 'Affichage de toutes les réclamations (actives et terminées).'
              : 'Affichage des réclamations en cours uniquement. Les réclamations résolues et rejetées sont masquées pour une meilleure organisation.'
            }
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9',
        marginBottom: '32px'
      }}>
        <h3 style={{
          margin: '0 0 24px 0',
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🔍 Recherche et Filtres
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Barre de recherche */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Rechercher par titre, utilisateur, société..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          
          {/* Filtre par statut */}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
          
          {/* Filtre par société */}
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
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
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
        </div>
        
        {/* Bouton de réinitialisation */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCompanyFilter('');
            }}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
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
              e.target.style.boxShadow = '0 8px 24px rgba(107, 114, 128, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '16px' }}>🔄</span>
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Tableau des réclamations */}
      {filteredReclamations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 32px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
            color: '#6b7280'
          }}>
            📭
          </div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#374151'
          }}>
            {showCompleted ? 'Aucune réclamation trouvée' : 'Aucune réclamation active'}
          </h3>
          <p style={{
            margin: '0',
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            {searchTerm || statusFilter || companyFilter 
              ? 'Aucune réclamation ne correspond à vos critères de recherche.'
              : showCompleted 
                ? 'Il n\'y a actuellement aucune réclamation dans le système'
                : 'Toutes les réclamations sont terminées (résolues ou rejetées).'
            }
          </p>
        </div>
      ) : (
        <ProfessionalTable title={`${showCompleted ? 'Toutes les Réclamations' : 'Réclamations Actives'} (${filteredReclamations.length} résultat${filteredReclamations.length > 1 ? 's' : ''})`}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                borderBottom: '2px solid #cbd5e1'
              }}>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('id')}
                >
                  ID {getSortIcon('id')}
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Titre
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Type
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Utilisateur
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Société
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Statut
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer'
                }}
                onClick={() => handleSort('date_creation')}
                >
                  Date de création {getSortIcon('date_creation')}
                </th>
                <th style={{
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getSortedReclamations().map((reclamation) => (
                <tr key={reclamation.id} style={{
                  borderBottom: '1px solid #e2e8f0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'white',
                  opacity: (reclamation.statut === 'resolu' || reclamation.statut === 'rejete') && !showCompleted ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    #{reclamation.id}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px'
                  }}>
                    <span
                      style={{
                        color: '#1f2937',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onClick={() => openDetails(reclamation)}
                      title="Voir les détails"
                    >
                      {reclamation.titre}
                    </span>
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    {getTypeBadge(reclamation.type_reclamation)}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {reclamation.user || 'N/A'}
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      color: '#475569',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {getSociete(reclamation)}
                    </span>
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    {getStatusBadge(reclamation)}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {new Date(reclamation.date_creation).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap' }}>
                      <ProfessionalButton
                        variant="details"
                        size="small"
                        onClick={() => openDetails(reclamation)}
                      >
                        👁️ Détails
                      </ProfessionalButton>
                      {reclamation.statut === 'en_attente' ? (
                        <>
                          <button
                            style={{
                              padding: '10px 14px',
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            onClick={() => handleStatusUpdate(reclamation.id, 'en_traitement_qualite')}
                            title="Mettre en cours"
                          >
                            ⏳ En cours
                          </button>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', whiteSpace: 'nowrap' }}>
                            <ActionToggleButton
                              size="small"
                              approveText="Résolu"
                              rejectText="Rejeter"
                              onApprove={() => handleStatusUpdate(reclamation.id, 'resolu')}
                              onReject={() => handleStatusUpdate(reclamation.id, 'rejete')}
                            />
                          </div>
                        </>
                      ) : (
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          fontStyle: 'italic'
                        }}>
                          {reclamation.statut === 'en_traitement_qualite' && 'En traitement par agent qualité'}
                          {reclamation.statut === 'resolu' && 'Finalisée'}
                          {reclamation.statut === 'rejete' && 'Rejetée'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ProfessionalTable>
      )}
      {showDetailsModal && selectedReclamation && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '92%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)'
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
                onClick={closeDetails}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  width: '36px', height: '36px', borderRadius: '10px',
                  fontSize: '18px', cursor: 'pointer', color: '#64748b'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Titre</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.titre}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Utilisateur</div>
                <div style={{ color: '#1f2937' }}>{selectedReclamation.user || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Type</div>
                <div>
                  {ProfessionalTypeBadge && (
                    <ProfessionalTypeBadge type={selectedReclamation.type_reclamation} />
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Statut</div>
                <div>
                  {getStatusBadge && getStatusBadge(selectedReclamation)}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Société</div>
                <div style={{ color: '#1f2937' }}>{getSociete(selectedReclamation)}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Date de création</div>
                <div style={{ color: '#1f2937' }}>{new Date(selectedReclamation.date_creation).toLocaleDateString('fr-FR')}</div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Description</div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                  background: '#f9fafb',
                  color: '#1f2937'
                }}>
                  {selectedReclamation.description || 'Aucune description fournie'}
                </div>
              </div>

              {/* Section des Articles de réclamation */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '12px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📦 Articles de réclamation
                  {selectedReclamationArticles.length > 0 && (
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '8px',
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
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
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
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>📭</div>
                    <div>Aucun article associé à cette réclamation</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px'
                  }}>
                    {selectedReclamationArticles.map((article, index) => (
                      <div key={article.id || index} style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {/* Image de l'article */}
                        {article.article_image_url && (
                          <div style={{
                            marginBottom: '8px',
                            textAlign: 'center'
                          }}>
                            <img 
                              src={article.article_image_url} 
                              alt={article.article_name || 'Article'}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '80px',
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
                        <div style={{ marginBottom: '8px' }}>
                          <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#1f2937',
                            lineHeight: '1.2'
                          }}>
                            {article.article_name || article.article?.nom || 'Article sans nom'}
                          </h4>
                          
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            marginBottom: '2px'
                          }}>
                            <strong>Société:</strong> {article.article_societe || article.article?.societe_display || 'N/A'}
                          </div>
                          
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            marginBottom: '2px'
                          }}>
                            <strong>Quantité:</strong> {article.quantite || 1}
                          </div>
                          
                          {article.variant_display && (
                            <div style={{
                              fontSize: '10px',
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
                          padding: '4px 6px',
                          background: '#f8fafc',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            Article #{article.id}
                          </span>
                          
                          {article.article?.image_url && (
                            <span style={{
                              fontSize: '9px',
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
              <div style={{ marginTop: '24px' }}>
                <div style={{ fontWeight: '800', color: '#1f2937', marginBottom: '10px' }}>Conversation</div>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                  background: 'white',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Aucun message.</div>
                  ) : (
                    chatMessages.map(msg => (
                      <div key={msg.id} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{msg.sender_username} · {new Date(msg.created_at).toLocaleString('fr-FR')}</div>
                        <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', color: '#111827' }}>{msg.content}</div>
                      </div>
                    ))
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Écrire un message..."
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '10px' }}
                  />
                  <button
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
                    style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeDetails}
                style={{
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReclamationsView; 