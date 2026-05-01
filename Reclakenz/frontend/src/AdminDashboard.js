import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Composant de carte de statistiques professionnelle
const ProfessionalStatCard = ({ title, value, icon, color, trend }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
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
const ProfessionalStatusBadge = ({ status, text }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#10b981', bg: '#d1fae5', border: '#6ee7b7' };
      case 'pending':
        return { color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' };
      case 'rejected':
        return { color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' };
      case 'active':
        return { color: '#3b82f6', bg: '#dbeafe', border: '#93c5fd' };
      case 'inactive':
        return { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' };
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
      letterSpacing: '0.5px'
    }}>
      {text}
    </span>
  );
};

// Composant de tableau professionnel
const ProfessionalTable = ({ children, title, icon, color = '#3b82f6' }) => (
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
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        boxShadow: `0 8px 24px ${color}40`
      }}>
        {icon}
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
const ProfessionalButton = ({ onClick, children, variant = 'primary', icon, size = 'medium', disabled = false, ...props }) => {
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
      case 'outline':
        return { bg: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6' };
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
      disabled={disabled}
      style={{
        background: config.bg,
        color: config.color,
        border: 'none',
        borderRadius: '16px',
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        fontWeight: '700',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.25)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        }
      }}
      {...props}
    >
      {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
      {children}
    </button>
  );
};

// Composant de navigation par onglets professionnel
const ProfessionalTabs = ({ activeTab, onTabChange, tabs }) => (
  <div style={{
    display: 'flex',
    background: 'white',
    borderRadius: '16px',
    padding: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    marginBottom: '32px'
  }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        style={{
          flex: 1,
          padding: '16px 24px',
          border: 'none',
          background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
          color: activeTab === tab.id ? 'white' : '#6b7280',
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
          if (activeTab !== tab.id) {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#374151';
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== tab.id) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }
        }}
      >
        <span style={{ fontSize: '16px' }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </div>
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isVariantsLoading, setIsVariantsLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
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
      
      .admin-dashboard-container {
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

  // Fonction pour charger les variantes d'un article
  const loadVariants = async (articleId = null) => {
    const articleToLoad = articleId || selectedArticle?.id;
    if (!articleToLoad) return;
    
    const token = localStorage.getItem('access');
    setIsVariantsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleToLoad}/variants/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setVariants(data);
      } else {
        console.error('Erreur lors du chargement des variantes');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des variantes:', error);
    } finally {
      setIsVariantsLoading(false);
    }
  };

  // Fonction pour gérer la soumission du formulaire d'article
  const handleArticleSubmit = async (articleData) => {
    if (selectedArticle?.id) {
      // Modification d'article
      await handleArticleAction('update', selectedArticle.id, articleData);
    } else {
      // Création d'article
      await handleArticleAction('create', null, articleData);
    }
    setShowArticleModal(false);
    setSelectedArticle(null);
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem('access');
      
      // Charger les utilisateurs
      const usersResponse = await fetch('http://localhost:8000/api/admin/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Charger les sociétés
      const companiesResponse = await fetch('http://localhost:8000/api/admin/companies/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Charger les articles
      const articlesResponse = await fetch('http://localhost:8000/api/articles/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.ok && companiesResponse.ok && articlesResponse.ok) {
        const usersData = await usersResponse.json();
        const companiesData = await companiesResponse.json();
        const articlesData = await articlesResponse.json();
        
        setUsers(usersData);
        setCompanies(companiesData);
        setArticles(articlesData);
      } else if (usersResponse.status === 401 || companiesResponse.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier l'authentification et le statut staff
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        alert('Vous devez être connecté pour accéder au tableau de bord administrateur');
        navigate('/login');
        return;
      }

          // Vérifier le statut staff
    try {
      const user = JSON.parse(userData);
      console.log('Données utilisateur trouvées:', user);
      console.log('is_staff:', user.is_staff);
      
      if (!user.is_staff) {
        alert('Accès refusé. Vous devez avoir les droits administrateur pour accéder à cette section.');
        navigate('/');
        return;
      }
      setIsStaff(true);
    } catch (error) {
        console.error('Erreur parsing user data:', error);
        // Essayer de récupérer les informations utilisateur depuis l'API
        try {
          const userResponse = await fetch('http://localhost:8000/api/user/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (!userData.is_staff) {
              alert('Accès refusé. Vous devez avoir les droits administrateur pour accéder à cette section.');
              navigate('/');
              return;
            }
            setIsStaff(true);
          } else {
            alert('Erreur de vérification des droits. Veuillez vous reconnecter.');
            navigate('/login');
            return;
          }
        } catch (apiError) {
          console.error('Erreur API:', apiError);
          alert('Erreur de vérification des droits. Veuillez vous reconnecter.');
          navigate('/login');
          return;
        }
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [navigate]);

  // Charger les données
  useEffect(() => {
    if (isAuthenticated && isStaff) {
      loadData();
    }
  }, [isAuthenticated, isStaff]);

  // Gestion des utilisateurs
  const handleUserAction = async (action, userId, userData = null) => {
    try {
      const token = localStorage.getItem('access');
      console.log(`Action utilisateur: ${action}`, { userId, userData, token: token ? 'présent' : 'absent' });
      
      let response;

      switch (action) {
        case 'create':
          console.log('Création utilisateur:', userData);
          response = await fetch('http://localhost:8000/api/admin/users/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
          });
          break;
        case 'update':
          console.log('Mise à jour utilisateur:', userId, userData);
          response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
          });
          break;
        case 'delete':
          console.log('Suppression utilisateur:', userId);
          response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          break;
        default:
          return;
      }

      console.log('Réponse API:', response.status, response.statusText);
      
      if (response.ok) {
        await loadData(); // Recharger toutes les données
        alert(`Utilisateur ${action === 'create' ? 'créé' : action === 'update' ? 'modifié' : 'supprimé'} avec succès !`);
      } else {
        const errorText = await response.text();
        console.error('Erreur API:', response.status, errorText);
        alert(`Erreur lors de l'${action} de l'utilisateur: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  // Gestion des articles
  const handleArticleAction = async (action, articleId, articleData = null) => {
    try {
      const token = localStorage.getItem('access');
      console.log(`Action article: ${action}`, { articleId, articleData, token: token ? 'présent' : 'absent' });
      
      let response;

      switch (action) {
        case 'create':
          console.log('Création article:', articleData);
          const createHeaders = {
            'Authorization': `Bearer ${token}`
          };
          // Si c'est FormData (avec image), ne pas définir Content-Type
          if (!(articleData instanceof FormData)) {
            createHeaders['Content-Type'] = 'application/json';
            articleData = JSON.stringify(articleData);
          }
          response = await fetch('http://localhost:8000/api/articles/', {
            method: 'POST',
            headers: createHeaders,
            body: articleData
          });
          break;
        case 'update':
          console.log('Mise à jour article:', articleId, articleData);
          const updateHeaders = {
            'Authorization': `Bearer ${token}`
          };
          // Si c'est FormData (avec image), ne pas définir Content-Type
          if (!(articleData instanceof FormData)) {
            updateHeaders['Content-Type'] = 'application/json';
            articleData = JSON.stringify(articleData);
          }
          response = await fetch(`http://localhost:8000/api/articles/${articleId}/`, {
            method: 'PUT',
            headers: updateHeaders,
            body: articleData
          });
          break;
        case 'delete':
          console.log('Suppression article:', articleId);
          response = await fetch(`http://localhost:8000/api/articles/${articleId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          break;
        default:
          return;
      }

      console.log('Réponse API article:', response.status, response.statusText);
      
      if (response.ok) {
        await loadData(); // Recharger toutes les données
        alert(`Article ${action === 'create' ? 'créé' : action === 'update' ? 'modifié' : 'supprimé'} avec succès !`);
      } else {
        const errorText = await response.text();
        console.error('Erreur API article:', response.status, errorText);
        alert(`Erreur lors de l'${action} de l'article: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  // Fonction pour gérer la soumission du formulaire de société
  const handleCompanySubmit = async (companyData) => {
    if (selectedCompany?.id) {
      // Modification de société
      await handleCompanyAction('update', selectedCompany.id, companyData);
    } else {
      // Création de société
      await handleCompanyAction('create', null, companyData);
    }
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };

  // Gestion des sociétés
  const handleCompanyAction = async (action, companyId, companyData = null) => {
    try {
      const token = localStorage.getItem('access');
      console.log(`Action société: ${action}`, { companyId, companyData, token: token ? 'présent' : 'absent' });
      
      let response;

      switch (action) {
        case 'create':
          console.log('Création société:', companyData);
          response = await fetch('http://localhost:8000/api/admin/companies/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(companyData)
          });
          break;
        case 'update':
          console.log('Mise à jour société:', companyId, companyData);
          response = await fetch(`http://localhost:8000/api/admin/companies/${companyId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(companyData)
          });
          break;
        case 'delete':
          console.log('Suppression société:', companyId);
          response = await fetch(`http://localhost:8000/api/admin/companies/${companyId}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          break;
        default:
          return;
      }

      console.log('Réponse API société:', response.status, response.statusText);
      
      if (response.ok) {
        await loadData(); // Recharger toutes les données
        alert(`Société ${action === 'create' ? 'créée' : action === 'update' ? 'modifiée' : 'supprimée'} avec succès !`);
      } else {
        const errorText = await response.text();
        console.error('Erreur API société:', response.status, errorText);
        alert(`Erreur lors de l'${action} de la société: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  if (!isAuthenticated || !isStaff) {
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: '32px' }}>🚫</span>
          </div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Accès Refusé
          </h3>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            Vous devez être administrateur pour accéder à cette page.
          </p>
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
            Chargement des données...
          </h3>
          <p style={{
            margin: '0',
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Préparation du tableau de bord administrateur
          </p>
        </div>
      </div>
    );
  }

  // Configuration des onglets
  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: '👥' },
    { id: 'companies', label: 'Sociétés', icon: '🏢' },
    { id: 'articles', label: 'Articles', icon: '📦' }
  ];

  // Calculer les statistiques
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.is_active).length,
    totalArticles: articles.length
  };

  return (
    <div className="admin-dashboard-container" style={{
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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 12px 32px rgba(239, 68, 68, 0.3)'
          }}>
            ⚙️
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
              Tableau de Bord Administrateur
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Gérez votre plateforme de réclamations en toute simplicité
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}>
            📅 {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
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
            title="Total Utilisateurs"
            value={stats.totalUsers}
            icon="👥"
            color="#3b82f6"
            trend={8}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="Utilisateurs Actifs"
            value={stats.activeUsers}
            icon="✅"
            color="#10b981"
            trend={12}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="Sociétés"
            value={stats.totalCompanies}
            icon="🏢"
            color="#f59e0b"
            trend={5}
          />
        </div>
        <div className="stat-card">
          <ProfessionalStatCard
            title="Articles"
            value={stats.totalArticles}
            icon="📦"
            color="#8b5cf6"
            trend={15}
          />
        </div>
      </div>

      {/* Navigation par onglets */}
      <ProfessionalTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

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

      {/* Contenu des onglets */}
      {activeTab === 'users' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <ProfessionalTable title="Gestion des Utilisateurs" icon="👥" color="#3b82f6">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Liste des Utilisateurs ({users.length})
              </h4>
              <ProfessionalButton
                onClick={() => {
                  setSelectedUser({});
                  setShowUserModal(true);
                }}
                variant="success"
                icon="➕"
                size="medium"
              >
                Ajouter un utilisateur
              </ProfessionalButton>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nom d'utilisateur</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rôle</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Staff</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s ease',
                    animation: `slideInLeft 0.6s ease-out ${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  >
                    <td style={{ padding: '16px', fontWeight: '700', color: '#3b82f6' }}>
                      #{user.id}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {user.username}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <ProfessionalStatusBadge 
                        status={user.role || 'client'} 
                        text={user.role || 'client'} 
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <ProfessionalStatusBadge 
                        status={user.is_staff ? 'active' : 'inactive'} 
                        text={user.is_staff ? 'Oui' : 'Non'} 
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <ProfessionalStatusBadge 
                        status={user.is_active ? 'active' : 'inactive'} 
                        text={user.is_active ? 'Actif' : 'Inactif'} 
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ProfessionalButton
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          variant="primary"
                          icon="✏️"
                          size="small"
                        >
                          Modifier
                        </ProfessionalButton>
                        
                        <ProfessionalButton
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                              handleUserAction('delete', user.id);
                            }
                          }}
                          variant="danger"
                          icon="🗑️"
                          size="small"
                        >
                          Supprimer
                        </ProfessionalButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProfessionalTable>
        </div>
      )}

      {activeTab === 'companies' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <ProfessionalTable title="Gestion des Sociétés" icon="🏢" color="#f59e0b">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Liste des Sociétés ({companies.length})
              </h4>
              <ProfessionalButton
                onClick={() => {
                  setSelectedCompany({});
                  setShowCompanyModal(true);
                }}
                variant="success"
                icon="➕"
                size="medium"
              >
                Ajouter une société
              </ProfessionalButton>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nom</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Code</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Statut</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={company.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s ease',
                    animation: `slideInLeft 0.6s ease-out ${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  >
                    <td style={{ padding: '16px', fontWeight: '700', color: '#f59e0b' }}>
                      #{company.id}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {company.name}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {company.code}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {company.description || 'Aucune description'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <ProfessionalStatusBadge 
                        status={company.is_active ? 'active' : 'inactive'} 
                        text={company.is_active ? 'Active' : 'Inactive'} 
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ProfessionalButton
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowCompanyModal(true);
                          }}
                          variant="primary"
                          icon="✏️"
                          size="small"
                        >
                          Modifier
                        </ProfessionalButton>
                        
                        <ProfessionalButton
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cette société ?')) {
                              handleCompanyAction('delete', company.id);
                            }
                          }}
                          variant="danger"
                          icon="🗑️"
                          size="small"
                        >
                          Supprimer
                        </ProfessionalButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProfessionalTable>
        </div>
      )}

      {activeTab === 'articles' && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <ProfessionalTable title="Gestion des Articles" icon="📦" color="#8b5cf6">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h4 style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Liste des Articles ({articles.length})
              </h4>
              <ProfessionalButton
                onClick={() => {
                  setSelectedArticle({});
                  setShowArticleModal(true);
                }}
                variant="success"
                icon="➕"
                size="medium"
              >
                Ajouter un article
              </ProfessionalButton>
            </div>
            
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nom</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Société</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Variantes</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <tr key={article.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.2s ease',
                    animation: `slideInLeft 0.6s ease-out ${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  >
                    <td style={{ padding: '16px', fontWeight: '700', color: '#8b5cf6' }}>
                      #{article.id}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>
                      {article.nom}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {article.societe}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>
                      {article.variants?.length || 0} variante(s)
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ProfessionalButton
                          onClick={() => {
                            setSelectedArticle(article);
                            setShowArticleModal(true);
                          }}
                          variant="primary"
                          icon="✏️"
                          size="small"
                        >
                          Modifier
                        </ProfessionalButton>
                        
                        <ProfessionalButton
                          onClick={async () => {
                            setSelectedArticle(article);
                            // Charger les variantes avant d'ouvrir la modale
                            await loadVariants(article.id);
                            setShowVariantModal(true);
                          }}
                          variant="warning"
                          icon="⚙️"
                          size="small"
                        >
                          Variantes
                        </ProfessionalButton>
                        
                        <ProfessionalButton
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                              handleArticleAction('delete', article.id);
                            }
                          }}
                          variant="danger"
                          icon="🗑️"
                          size="small"
                        >
                          Supprimer
                        </ProfessionalButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProfessionalTable>
        </div>
      )}

      {/* Modals */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          borderBottom: 'none'
        }}>
          <Modal.Title>
            {selectedUser?.id ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          <UserForm
            user={selectedUser}
            onSubmit={handleUserAction}
            onCancel={() => setShowUserModal(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showCompanyModal} onHide={() => setShowCompanyModal(false)} size="lg">
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          borderBottom: 'none'
        }}>
          <Modal.Title>
            {selectedCompany?.id ? 'Modifier la société' : 'Ajouter une société'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          <CompanyForm
            company={selectedCompany}
            onSubmit={handleCompanySubmit}
            onCancel={() => setShowCompanyModal(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showArticleModal} onHide={() => setShowArticleModal(false)} size="lg">
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          borderBottom: 'none'
        }}>
          <Modal.Title>
            {selectedArticle?.id ? 'Modifier l\'article' : 'Ajouter un article'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          <ArticleForm
            article={selectedArticle}
            onSubmit={handleArticleSubmit}
            onCancel={() => setShowArticleModal(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showVariantModal} onHide={() => setShowVariantModal(false)} size="lg">
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderBottom: 'none'
        }}>
          <Modal.Title>
            Gérer les variantes de {selectedArticle?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          {isVariantsLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Chargement des variantes...</span>
              </Spinner>
            </div>
          ) : (
            <VariantForm
              article={selectedArticle}
              variants={variants}
              onVariantsUpdate={loadVariants}
              onClose={() => setShowVariantModal(false)}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Composant formulaire utilisateur
function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'client',
    is_staff: user?.is_staff || false,
    is_active: user?.is_active !== false
  });

  // Mettre à jour le formulaire quand l'utilisateur change
  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'client',
      is_staff: user?.is_staff || false,
      is_active: user?.is_active !== false
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {!user?.id && (
        <Form.Group className="mb-3">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user?.id}
          />
        </Form.Group>
      )}

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Rôle</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="client">Client</option>
              <option value="commercial">Commercial</option>
              <option value="qualite">Qualité</option>
              <option value="admin">Administrateur</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="is_staff"
              checked={formData.is_staff}
              onChange={handleChange}
              label="Staff"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              label="Actif"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          {user?.id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </Form>
  );
}

// Composant formulaire société
function CompanyForm({ company, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    code: company?.code || '',
    description: company?.description || '',
    is_active: company?.is_active !== false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la société</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          label="Actif"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          {company?.id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </Form>
  );
}

// Composant formulaire article
function ArticleForm({ article, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nom: article?.nom || '',
                    societe: article?.societe || 'vetadis',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si c'est un fichier image, on utilise FormData
    if (formData.image) {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('societe', formData.societe);
      formDataToSend.append('image', formData.image);
      onSubmit(formDataToSend);
    } else {
      onSubmit({
        nom: formData.nom,
        societe: formData.societe
      });
    }
  };



  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nom de l'article</Form.Label>
        <Form.Control
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Société</Form.Label>
        <Form.Select name="societe" value={formData.societe} onChange={handleChange}>
                                  <option value="vetadis">Vetadis</option>
          <option value="kenz_maroc">Kenz Maroc</option>
          <option value="kenzpat">KenzPat</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Image de l'article</Form.Label>
        <Form.Control
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        {article?.image_url && (
          <div className="mt-2">
            <small className="text-muted">Image actuelle:</small>
            <img 
              src={article.image_url} 
              alt={article.nom}
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', marginLeft: '10px' }}
            />
          </div>
        )}
      </Form.Group>


      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" type="submit">
          {article?.id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </Form>
  );
}

// Composant de gestion des variantes
function VariantForm({ article, variants, onVariantsUpdate, onClose }) {
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [newVariant, setNewVariant] = useState({
    weight: '1kg',
    price: '',
    is_available: true
  });

  const handleVariantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    
    try {
      // Validation des données
      if (!newVariant.weight || !newVariant.price) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Préparation des données
      const variantData = {
        ...newVariant,
        price: parseFloat(newVariant.price) // Assurez-vous que le prix est un nombre
      };

      let response;
      if (editingVariant) {
        // Modification de variante
        response = await fetch(`http://localhost:8000/api/variants/${editingVariant.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variantData)
        });
      } else {
        // Création de variante
        response = await fetch(`http://localhost:8000/api/articles/${article.id}/variants/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...variantData,
            article: article.id
          })
        });
      }

      if (response.ok) {
        // Réinitialisation du formulaire
        setShowVariantForm(false);
        setEditingVariant(null);
        setNewVariant({ weight: '1kg', price: '', is_available: true });
        
        // Recharger les variantes
        onVariantsUpdate(article.id);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la sauvegarde de la variante:', errorData);
        alert(`Erreur lors de la sauvegarde: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setNewVariant({
      weight: variant.weight,
      price: variant.price || '',
      is_available: variant.is_available
    });
    setShowVariantForm(true);
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette variante ?')) {
      return;
    }

    const token = localStorage.getItem('access');
    try {
      const response = await fetch(`http://localhost:8000/api/variants/${variantId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        // Recharger les variantes après suppression
        onVariantsUpdate(article.id);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur lors de la suppression de la variante:', errorData);
        alert(`Erreur lors de la suppression: ${errorData.detail || 'Une erreur est survenue'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {/* En-tête avec bouton d'ajout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1 fw-bold text-primary">
            <i className="fas fa-boxes me-2"></i>
            Variantes disponibles
          </h5>
          <p className="text-muted mb-0">Gérez les différents poids et prix pour cet article</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            setEditingVariant(null);
            setNewVariant({ weight: '1kg', price: '', is_available: true });
            setShowVariantForm(true);
          }}
        >
          <i className="fas fa-plus me-1"></i>
          Nouvelle Variante
        </Button>
      </div>

      {/* Liste des variantes existantes */}
      {variants.length > 0 ? (
        <div className="mb-4">
          <div className="row g-3">
            {variants.map((variant) => (
              <div key={variant.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                          <i className="fas fa-weight-hanging text-primary"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{variant.weight_display || variant.weight}</h6>
                          <small className="text-muted">Poids</small>
                        </div>
                      </div>
                      <Badge 
                        bg={variant.is_available ? 'success' : 'danger'}
                        className="px-2 py-1"
                      >
                        {variant.is_available ? 'Disponible' : 'Indisponible'}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-coins text-warning me-2"></i>
                        {variant.price ? (
                          <span className="fw-bold text-success">{variant.price}</span>
                        ) : (
                          <span className="text-muted">Prix non défini</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="flex-fill"
                        onClick={() => handleEditVariant(variant)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Modifier
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteVariant(variant.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-boxes fa-3x text-muted opacity-50"></i>
          </div>
          <h6 className="text-muted">Aucune variante définie</h6>
          <p className="text-muted small mb-0">Cliquez sur "Variantes" pour commencer</p>
        </div>
      )}

      {/* Formulaire d'ajout/modification de variante */}
      {showVariantForm && (
        <div className="card border-0 shadow-lg mb-3" style={{ borderLeft: '4px solid #0d6efd' }}>
          <div className="card-header border-0" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)', color: 'white' }}>
            <div className="d-flex align-items-center">
              <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                <i className={`fas ${editingVariant ? 'fa-edit' : 'fa-plus'} text-white`}></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">
                  {editingVariant ? 'Modifier la variante' : 'Créer une nouvelle variante'}
                </h6>
                <small className="opacity-75">
                  {editingVariant ? 'Modifiez les informations ci-dessous' : 'Définissez les caractéristiques de la variante'}
                </small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <Form onSubmit={handleVariantFormSubmit}>
              <Row className="g-4">
                <Col md={4}>
                  <div className="form-floating">
                    <Form.Select 
                      name="weight" 
                      value={newVariant.weight} 
                      onChange={handleVariantChange}
                      required
                      className="form-select-lg"
                      style={{ paddingTop: '1.625rem', paddingBottom: '1.625rem' }}
                    >
                      <option value="500g">500 grammes</option>
                      <option value="1kg">1 kilogramme</option>
                      <option value="2kg">2 kilogrammes</option>
                      <option value="5kg">5 kilogrammes</option>
                      <option value="10kg">10 kilogrammes</option>
                      <option value="25kg">25 kilogrammes</option>
                      <option value="50kg">50 kilogrammes</option>
                    </Form.Select>
                    <label>
                      <i className="fas fa-weight-hanging text-primary me-2"></i>
                      Poids de la variante
                    </label>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-floating">
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      value={newVariant.price}
                      onChange={handleVariantChange}
                      placeholder="0.00"
                      className="form-control-lg"
                    />
                    <label>
                      <i className="fas fa-coins text-warning me-2"></i>
                      Prix
                    </label>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column h-100 justify-content-center">
                    <label className="form-label fw-bold mb-3">
                      <i className="fas fa-toggle-on text-success me-2"></i>
                      Statut de disponibilité
                    </label>
                    <div className="form-check form-switch d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        name="is_available"
                        checked={newVariant.is_available}
                        onChange={handleVariantChange}
                        className="form-check-input-lg me-3"
                        style={{ transform: 'scale(1.5)' }}
                      />
                      <span className={`fw-bold ${newVariant.is_available ? 'text-success' : 'text-danger'}`}>
                        {newVariant.is_available ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <hr className="my-4" />
              
              <div className="d-flex justify-content-end gap-3">
                <Button 
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => {
                    setShowVariantForm(false);
                    setEditingVariant(null);
                    setNewVariant({ weight: '1kg', price: '', is_available: true });
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Annuler
                </Button>
                <Button variant="primary" type="submit" size="lg" className="px-4">
                  <i className={`fas ${editingVariant ? 'fa-save' : 'fa-plus'} me-2`}></i>
                  {editingVariant ? 'Sauvegarder les modifications' : 'Créer la variante'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 