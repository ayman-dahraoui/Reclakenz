import React, { useState, useEffect } from 'react';
import BackButton from './components/BackButton';
import { useNavigate } from 'react-router-dom';

// Composant de carte de statistique professionnelle
const ProfessionalStatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color, 
  trend, 
  trendValue,
  gradient = false 
}) => (
  <div style={{
    background: gradient ? `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` : 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${color}20`,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
    e.currentTarget.style.boxShadow = '0 24px 60px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
  }}
  >
    {/* Icône avec fond coloré et effet glassmorphism */}
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '20px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      color: 'white',
      marginBottom: '24px',
      boxShadow: `0 12px 32px ${color}40`,
      position: 'relative',
      zIndex: 2
    }}>
      {icon}
    </div>

    {/* Valeur principale avec typographie moderne */}
    <h3 style={{
      margin: '0 0 12px 0',
      fontSize: '42px',
      fontWeight: '900',
      color: '#0f172a',
      lineHeight: '1.1',
      letterSpacing: '-0.03em',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {value}
    </h3>

    {/* Titre avec style professionnel */}
    <p style={{
      margin: '0 0 8px 0',
      fontSize: '18px',
      fontWeight: '700',
      color: '#334155',
      lineHeight: '1.4',
      letterSpacing: '-0.01em'
    }}>
      {title}
    </p>

    {/* Sous-titre élégant */}
    {subtitle && (
      <p style={{
        margin: '0',
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.5',
        fontWeight: '500'
      }}>
        {subtitle}
      </p>
    )}

    {/* Indicateur de tendance avec badge moderne */}
    {trend && (
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '24px',
        background: trend === 'up' ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        color: trend === 'up' ? '#166534' : '#dc2626',
        fontSize: '14px',
        fontWeight: '700',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${trend === 'up' ? '#bbf7d0' : '#fecaca'}`
      }}>
        <span style={{ fontSize: '16px' }}>
          {trend === 'up' ? '↗' : '↘'}
        </span>
        {trendValue}
      </div>
    )}

    {/* Éléments décoratifs avec effets modernes */}
    <div style={{
      position: 'absolute',
      top: '-40px',
      right: '-40px',
      width: '120px',
      height: '120px',
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(2px)'
    }} />
    
    <div style={{
      position: 'absolute',
      bottom: '-20px',
      left: '-20px',
      width: '80px',
      height: '80px',
      background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(1px)'
    }} />
  </div>
);

// Composant de graphique en barres professionnel
const ProfessionalBarChart = ({ data, title, height = 320, colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }) => (
  <div style={{
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête avec icône et titre */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '32px'
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
    
    {/* Graphique avec animations et interactions */}
    <div style={{ 
      height: `${height}px`, 
      display: 'flex', 
      alignItems: 'end', 
      gap: '16px', 
      padding: '24px 0',
      position: 'relative'
    }}>
      {/* Grille de fond */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: `
          linear-gradient(90deg, #f1f5f9 1px, transparent 1px),
          linear-gradient(0deg, #f1f5f9 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.3
      }} />
      
      {data.map((item, index) => (
        <div key={index} style={{ 
          flex: 1, 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Barre avec gradient et ombre */}
          <div style={{
            height: `${(item.value / Math.max(...data.map(d => d.value))) * (height - 100)}px`,
            background: `linear-gradient(180deg, ${colors[index % colors.length]} 0%, ${colors[index % colors.length]}dd 100%)`,
            borderRadius: '12px 12px 0 0',
            marginBottom: '16px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${colors[index % colors.length]}30`,
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = `0 16px 40px ${colors[index % colors.length]}50`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = `0 8px 24px ${colors[index % colors.length]}30`;
          }}
          >
            {/* Effet de brillance */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shine 2s infinite'
            }} />
          </div>
          
          {/* Label avec rotation élégante */}
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#475569',
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
            whiteSpace: 'nowrap',
            marginBottom: '8px'
          }}>
            {item.label}
          </div>
          
          {/* Valeur avec style moderne */}
          <div style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#0f172a',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Composant de tableau professionnel avec design moderne
const ProfessionalDataTable = ({ data, columns, title }) => (
  <div style={{
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden'
  }}>
    {/* En-tête avec icône et titre */}
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
        📋
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
    
    {/* Tableau avec design moderne */}
    <div style={{
      overflow: 'auto',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
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
            {columns.map((column, index) => (
              <th key={index} style={{
                padding: '20px 24px',
                textAlign: column.align || 'left',
                fontWeight: '700',
                color: '#334155',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '2px solid #cbd5e1'
              }}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{
              borderBottom: '1px solid #e2e8f0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: rowIndex % 2 === 0 ? 'white' : '#f8fafc'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = rowIndex % 2 === 0 ? 'white' : '#f8fafc';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} style={{
                  padding: '20px 24px',
                  textAlign: column.align || 'left',
                  fontSize: '14px',
                  color: '#334155',
                  fontWeight: '500'
                }}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Composant de filtre professionnel avec design moderne
const ProfessionalFilterSection = ({ searchTerm, setSearchTerm, selectedPeriod, setSelectedPeriod }) => (
  <div style={{
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
    marginBottom: '32px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Éléments décoratifs de fond */}
    <div style={{
      position: 'absolute',
      top: '-60px',
      right: '-60px',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, #3b82f615 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(3px)'
    }} />
    
    <div style={{
      position: 'absolute',
      bottom: '-40px',
      left: '-40px',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, #10b98115 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(2px)'
    }} />

    {/* En-tête de la section */}
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
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
      }}>
        🔍
      </div>
      <h3 style={{
        margin: '0',
        fontSize: '24px',
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: '-0.02em'
      }}>
        Filtres et Recherche
      </h3>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '28px',
      alignItems: 'end'
    }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontWeight: '700',
          color: '#334155',
          fontSize: '15px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          🔍 Rechercher un client
        </label>
        <input
          type="text"
          placeholder="Nom, email ou société..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '18px 24px',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            fontSize: '15px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            outline: 'none',
            fontWeight: '500'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.background = 'white';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15)';
            e.target.style.transform = 'scale(1.02)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'scale(1)';
          }}
        />
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontWeight: '700',
          color: '#334155',
          fontSize: '15px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          📅 Période d'analyse
        </label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          style={{
            width: '100%',
            padding: '18px 24px',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            fontSize: '15px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.background = 'white';
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.15)';
            e.target.style.transform = 'scale(1.02)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <option value="all">📊 Toutes les périodes</option>
          <option value="week">📅 Cette semaine</option>
          <option value="month">🗓️ Ce mois</option>
          <option value="quarter">📈 Ce trimestre</option>
          <option value="year">📅 Cette année</option>
        </select>
      </div>
    </div>
  </div>
);

// Styles CSS globaux pour les animations
const globalStyles = `
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
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

// Composant principal avec design professionnel
function CommercialStats() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification et le statut d'approbation au chargement
  useEffect(() => {
    const checkAuthAndApproval = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Vous devez être connecté pour accéder aux statistiques');
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
          
          if (profileData.user_type !== 'commercial' || profileData.approval_status !== 'approved') {
            alert('Accès non autorisé. Seuls les commerciaux approuvés peuvent accéder aux statistiques.');
            navigate('/');
            return;
          }
        } else {
          console.error('Erreur lors de la récupération du profil');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      }

      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuthAndApproval();
  }, [navigate]);

  // Charger les statistiques
  useEffect(() => {
    if (isAuthenticated && userProfile?.user_type === 'commercial') {
      loadStats();
    }
  }, [isAuthenticated, userProfile, selectedPeriod]);

  const loadStats = async () => {
    setLoading(true);
    const token = localStorage.getItem('access');
    
    try {
      const response = await fetch('http://localhost:8000/api/all-reclamations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const reclamations = await response.json();
        // Stocker les réclamations brutes pour les statistiques par société
        window.rawReclamations = reclamations;
        const statsData = processReclamationsData(reclamations);
        setStats(statsData);
      } else {
        console.error('Erreur lors du chargement des réclamations');
        setStats(getDemoStats());
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      setStats(getDemoStats());
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si une réclamation est en attente depuis plus de 10 jours
  const isReclamationOverdue = (dateCreation) => {
    const now = new Date();
    const creationDate = new Date(dateCreation);
    const diffTime = now.getTime() - creationDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 10;
  };



  // Fonction pour traiter les données des réclamations et créer les statistiques
  const processReclamationsData = (reclamations) => {
    const clientStats = {};
    const articleStats = {};
    const now = new Date();
    
    // Filtrer les réclamations selon la période sélectionnée
    const filteredReclamations = reclamations.filter(reclamation => {
      const reclamationDate = new Date(reclamation.date_creation);
      
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return reclamationDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return reclamationDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return reclamationDate >= quarterAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return reclamationDate >= yearAgo;
        default:
          return true;
      }
    });
    
    filteredReclamations.forEach(reclamation => {
      const clientName = reclamation.user || 'Utilisateur inconnu';
      const societe = reclamation.societe_display || reclamation.societe_preferee || reclamation.user_societe || reclamation.societe || 'N/A';
      
      // Traitement des statistiques clients
      if (!clientStats[clientName]) {
        clientStats[clientName] = {
          client_id: clientName,
          client_name: clientName,
          client_email: `${clientName}@email.com`,
          total_reclamations: 0,
          reclamations_en_attente: 0,
          reclamations_en_traitement_qualite: 0,
          reclamations_resolues: 0,
          reclamations_rejetees: 0,
          taux_resolution: 0,
          derniere_reclamation: '',
          societe_preferee: societe,
          type_reclamation: reclamation.type_reclamation || 'qualite',
          statut: reclamation.statut || 'en_attente'
        };
      }
      
      clientStats[clientName].total_reclamations++;
      
      switch (reclamation.statut) {
        case 'en_attente':
          clientStats[clientName].reclamations_en_attente++;
          break;
        case 'en_traitement_qualite':
          clientStats[clientName].reclamations_en_traitement_qualite++;
          break;
        case 'resolu':
          clientStats[clientName].reclamations_resolues++;
          break;
        case 'rejete':
          clientStats[clientName].reclamations_rejetees++;
          break;
      }
      
      const reclamationDate = new Date(reclamation.date_creation);
      if (!clientStats[clientName].derniere_reclamation || 
          reclamationDate > new Date(clientStats[clientName].derniere_reclamation)) {
        clientStats[clientName].derniere_reclamation = reclamation.date_creation;
      }

      // Traitement des statistiques par article
      if (reclamation.articles && reclamation.articles.length > 0) {
        reclamation.articles.forEach(articleData => {
          const articleName = articleData.article_name || articleData.article?.nom || 'Article inconnu';
          const articleId = articleData.article?.id || articleData.article_id;
          const articleSociete = articleData.article_societe || articleData.article?.societe_display || 'N/A';
          const variant = articleData.variant_display || articleData.variant?.weight_display || 'Standard';
          const quantite = articleData.quantite || 1;
          
          const articleKey = `${articleName}_${variant}`;
          
          if (!articleStats[articleKey]) {
            articleStats[articleKey] = {
              article_id: articleId,
              article_name: articleName,
              article_societe: articleSociete,
              variant: variant,
              total_reclamations: 0,
              total_quantite: 0,
              reclamations_en_attente: 0,
              reclamations_en_traitement_qualite: 0,
              reclamations_resolues: 0,
              reclamations_rejetees: 0,
              taux_resolution: 0,
              derniere_reclamation: '',
              clients_uniques: new Set(),
              type_reclamation: reclamation.type_reclamation || 'qualite'
            };
          }
          
          articleStats[articleKey].total_reclamations++;
          articleStats[articleKey].total_quantite += quantite;
          articleStats[articleKey].clients_uniques.add(clientName);
          
          switch (reclamation.statut) {
            case 'en_attente':
              articleStats[articleKey].reclamations_en_attente++;
              break;
            case 'en_traitement_qualite':
              articleStats[articleKey].reclamations_en_traitement_qualite++;
              break;
            case 'resolu':
              articleStats[articleKey].reclamations_resolues++;
              break;
            case 'rejete':
              articleStats[articleKey].reclamations_rejetees++;
              break;
          }
          
          if (!articleStats[articleKey].derniere_reclamation || 
              reclamationDate > new Date(articleStats[articleKey].derniere_reclamation)) {
            articleStats[articleKey].derniere_reclamation = reclamation.date_creation;
          }
        });
      }
    });
    
    // Calculer les taux de résolution pour les clients
    Object.values(clientStats).forEach(client => {
      if (client.total_reclamations > 0) {
        client.taux_resolution = ((client.reclamations_resolues / client.total_reclamations) * 100).toFixed(1);
      }
    });

    // Calculer les taux de résolution pour les articles
    Object.values(articleStats).forEach(article => {
      if (article.total_reclamations > 0) {
        article.taux_resolution = ((article.reclamations_resolues / article.total_reclamations) * 100).toFixed(1);
      }
      article.nombre_clients_uniques = article.clients_uniques.size;
      delete article.clients_uniques; // Nettoyer pour le rendu
    });
    
    return {
      clients: Object.values(clientStats),
      articles: Object.values(articleStats)
    };
  };

  // Données de démonstration
  const getDemoStats = () => {
    return {
      clients: [
        {
          client_id: 1,
          client_name: "Mohammed Alami",
          client_email: "mohammed.alami@email.com",
          total_reclamations: 15,
          reclamations_en_attente: 3,
          reclamations_en_traitement_qualite: 8,
          reclamations_resolues: 4,
          reclamations_rejetees: 1,
          taux_resolution: 26.7,
          derniere_reclamation: "2024-01-15",
          societe_preferee: "Kenz Maroc"
        },
        {
          client_id: 2,
          client_name: "Fatima Zahra",
          client_email: "fatima.zahra@email.com",
          total_reclamations: 8,
          reclamations_en_attente: 1,
          reclamations_en_traitement_qualite: 4,
          reclamations_resolues: 3,
          reclamations_rejetees: 1,
          taux_resolution: 37.5,
          derniere_reclamation: "2024-01-12",
          societe_preferee: "Vetadis"
        },
        {
          client_id: 3,
          client_name: "Ahmed Benjelloun",
          client_email: "ahmed.benjelloun@email.com",
          total_reclamations: 22,
          reclamations_en_attente: 5,
          reclamations_en_traitement_qualite: 12,
          reclamations_resolues: 5,
          reclamations_rejetees: 0,
          taux_resolution: 22.7,
          derniere_reclamation: "2024-01-18",
          societe_preferee: "KenzPat"
        },
        {
          client_id: 4,
          client_name: "Amina Tazi",
          client_email: "amina.tazi@email.com",
          total_reclamations: 12,
          reclamations_en_attente: 2,
          reclamations_en_traitement_qualite: 6,
          reclamations_resolues: 4,
          reclamations_rejetees: 0,
          taux_resolution: 33.3,
          derniere_reclamation: "2024-01-10",
          societe_preferee: "Kenz Maroc"
        },
        {
          client_id: 5,
          client_name: "Hassan El Fassi",
          client_email: "hassan.elfassi@email.com",
          total_reclamations: 6,
          reclamations_en_attente: 0,
          reclamations_en_traitement_qualite: 2,
          reclamations_resolues: 4,
          reclamations_rejetees: 0,
          taux_resolution: 66.7,
          derniere_reclamation: "2024-01-05",
          societe_preferee: "Vetadis"
        }
      ],
      articles: [
        {
          article_id: 1,
          article_name: "Aliment Premium Chat",
          article_societe: "Vetadis",
          variant: "5kg",
          total_reclamations: 8,
          total_quantite: 12,
          reclamations_en_attente: 2,
          reclamations_en_traitement_qualite: 4,
          reclamations_resolues: 2,
          reclamations_rejetees: 0,
          taux_resolution: 25.0,
          derniere_reclamation: "2024-01-15",
          nombre_clients_uniques: 5
        },
        {
          article_id: 2,
          article_name: "Croquettes Chien Adulte",
          article_societe: "Kenz Maroc",
          variant: "10kg",
          total_reclamations: 12,
          total_quantite: 18,
          reclamations_en_attente: 3,
          reclamations_en_traitement_qualite: 6,
          reclamations_resolues: 3,
          reclamations_rejetees: 0,
          taux_resolution: 25.0,
          derniere_reclamation: "2024-01-18",
          nombre_clients_uniques: 7
        },
        {
          article_id: 3,
          article_name: "Litière Chat",
          article_societe: "KenzPat",
          variant: "25kg",
          total_reclamations: 6,
          total_quantite: 8,
          reclamations_en_attente: 1,
          reclamations_en_traitement_qualite: 3,
          reclamations_resolues: 2,
          reclamations_rejetees: 0,
          taux_resolution: 33.3,
          derniere_reclamation: "2024-01-12",
          nombre_clients_uniques: 4
        }
      ]
    };
  };

  // Filtrer les statistiques selon le terme de recherche
  const filteredClientStats = stats.clients ? stats.clients.filter(client => 
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.societe_preferee.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredArticleStats = stats.articles ? stats.articles.filter(article => 
    article.article_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.article_societe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.variant.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculer les statistiques globales
  const globalStats = {
    totalClients: filteredClientStats.length,
    totalReclamations: filteredClientStats.reduce((sum, client) => sum + client.total_reclamations, 0),
    totalEnAttente: filteredClientStats.reduce((sum, client) => sum + client.reclamations_en_attente, 0),
    totalEnTraitementQualite: filteredClientStats.reduce((sum, client) => sum + client.reclamations_en_traitement_qualite, 0),
    totalResolues: filteredClientStats.reduce((sum, client) => sum + client.reclamations_resolues, 0),
    totalRejetees: filteredClientStats.reduce((sum, client) => sum + client.reclamations_rejetees, 0),
    tauxResolutionGlobal: filteredClientStats.length > 0 
      ? (filteredClientStats.reduce((sum, client) => sum + client.reclamations_resolues, 0) / 
         filteredClientStats.reduce((sum, client) => sum + client.total_reclamations, 0) * 100).toFixed(1)
      : 0
  };



  // Calculer les statistiques par société directement à partir des réclamations brutes
  const societeStats = {};
  
  // Utiliser les réclamations brutes pour avoir les bonnes données de société
  if (window.rawReclamations && window.rawReclamations.length > 0) {
    window.rawReclamations.forEach(reclamation => {
      const societe = reclamation.societe_display || reclamation.societe;
      
      // Ignorer les sociétés vides, null, undefined ou "N/A"
      if (!societe || societe === 'N/A' || societe === '' || societe === 'null' || societe === 'undefined') {
        return; // Passer au client suivant
      }
      
      if (!societeStats[societe]) {
        societeStats[societe] = {
          nom: societe,
          total_reclamations: 0,
          reclamations_en_attente: 0,
          reclamations_en_traitement_qualite: 0,
          reclamations_resolues: 0,
          reclamations_rejetees: 0,
          clients_uniques: new Set(),
          taux_resolution: 0,
          derniere_reclamation: ''
        };
      }
      
      societeStats[societe].total_reclamations++;
      societeStats[societe].clients_uniques.add(reclamation.user);
      
      switch (reclamation.statut) {
        case 'en_attente':
          societeStats[societe].reclamations_en_attente++;
          break;
        case 'en_traitement_qualite':
          societeStats[societe].reclamations_en_traitement_qualite++;
          break;
        case 'resolu':
          societeStats[societe].reclamations_resolues++;
          break;
        case 'rejete':
          societeStats[societe].reclamations_rejetees++;
          break;
      }
      
      if (!societeStats[societe].derniere_reclamation || 
          new Date(reclamation.date_creation) > new Date(societeStats[societe].derniere_reclamation)) {
        societeStats[societe].derniere_reclamation = reclamation.date_creation;
      }
    });
  }

  // Calculer le taux de résolution et convertir les Sets en nombres
  Object.values(societeStats).forEach(societe => {
    if (societe.total_reclamations > 0) {
      societe.taux_resolution = ((societe.reclamations_resolues / societe.total_reclamations) * 100).toFixed(1);
    }
    societe.nombre_clients_uniques = societe.clients_uniques.size;
    delete societe.clients_uniques; // Nettoyer pour le rendu
  });

  // Trier les sociétés par nombre de réclamations (décroissant)
  // Filtrer pour ne garder que les sociétés avec des réclamations valides
  const societesTriees = Object.values(societeStats)
    .filter(societe => societe.total_reclamations > 0 && societe.nom && societe.nom !== 'N/A')
    .sort((a, b) => b.total_reclamations - a.total_reclamations);





  // Colonnes pour le tableau des clients
  const clientColumns = [
    { key: 'client_name', header: 'Client', render: (value, row) => (
      <div>
        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.client_email}</div>
      </div>
    )},
    { key: 'total_reclamations', header: 'Total', align: 'center', render: (value) => (
      <span style={{ fontWeight: '600', color: '#1f2937' }}>{value}</span>
    )},
    { key: 'reclamations_en_attente', header: 'En attente', align: 'center', render: (value, row) => {
      // Vérifier si la réclamation est en retard (plus de 10 jours)
      const isOverdue = row.derniere_reclamation && isReclamationOverdue(row.derniere_reclamation);
      
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{
            backgroundColor: isOverdue ? '#fee2e2' : '#fef3c7',
            color: isOverdue ? '#dc2626' : '#92400e',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            animation: 'none',
            border: isOverdue ? '2px solid #dc2626' : 'none',
            display: 'inline-block',
            marginBottom: '4px'
          }}>
            {value}

          </span>

        </div>
      );
    }},
    { key: 'reclamations_en_traitement_qualite', header: 'En traitement', align: 'center', render: (value) => (
      <span style={{
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {value}
      </span>
    )},
    { key: 'reclamations_resolues', header: 'Résolues', align: 'center', render: (value) => (
      <span style={{
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {value}
      </span>
    )},
    { key: 'reclamations_rejetees', header: 'Rejetées', align: 'center', render: (value) => (
      <span style={{
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {value}
      </span>
    )},
    { key: 'taux_resolution', header: 'Taux', align: 'center', render: (value) => (
      <span style={{
        backgroundColor: value >= 50 ? '#d1fae5' : value >= 25 ? '#fef3c7' : '#fee2e2',
        color: value >= 50 ? '#065f46' : value >= 25 ? '#92400e' : '#991b1b',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {value}%
      </span>
    )},
    { key: 'derniere_reclamation', header: 'Dernière', align: 'center', render: (value) => (
      <span style={{ fontSize: '12px', color: '#6b7280' }}>
        {new Date(value).toLocaleDateString('fr-FR')}
      </span>
    )},
    { key: 'societe_preferee', header: 'Société', align: 'center', render: (value) => (
      <span style={{
        backgroundColor: '#f3f4f6',
        color: '#374151',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {value}
      </span>
    )}
  ];

  // Ajouter les styles CSS au head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: '4rem',
            color: '#3b82f6',
            marginBottom: '20px'
          }}>
            📊
          </div>
          <h3 style={{ color: '#1f2937', marginBottom: '10px', fontSize: '20px' }}>
            Chargement des statistiques...
          </h3>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userProfile) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Vérification de l'authentification...</div>;
  }

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
        padding: '24px 32px',
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
          <BackButton />
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
              📊 Tableau de Bord Commercial
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Analyse complète des performances et des réclamations
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
        </div>
      </div>

      {/* Filtres professionnels */}
      <ProfessionalFilterSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      {/* Statistiques globales avec design moderne */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <ProfessionalStatCard
          icon="👥"
          title="Clients actifs"
          value={globalStats.totalClients}
          subtitle="Total des clients enregistrés"
          color="#3b82f6"
          trend="up"
          trendValue="+12%"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="📋"
          title="Total réclamations"
          value={globalStats.totalReclamations}
          subtitle="Réclamations traitées"
          color="#10b981"
          trend="up"
          trendValue="+8%"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="⏳"
          title="En attente"
          value={globalStats.totalEnAttente}
          subtitle="Réclamations en attente"
          color="#f59e0b"
          trend="down"
          trendValue="-5%"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="🔄"
          title="En traitement"
          value={globalStats.totalEnTraitementQualite}
          subtitle="Réclamations en cours"
          color="#8b5cf6"
          trend="up"
          trendValue="+15%"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="✅"
          title="Résolues"
          value={globalStats.totalResolues}
          subtitle="Réclamations résolues"
          color="#10b981"
          trend="up"
          trendValue="+22%"
          gradient={true}
        />
        <ProfessionalStatCard
          icon="❌"
          title="Rejetées"
          value={globalStats.totalRejetees}
          subtitle="Réclamations rejetées"
          color="#ef4444"
          trend="down"
          trendValue="-3%"
          gradient={true}
        />
      </div>



      {/* Graphique des sociétés avec design moderne */}
      <div style={{
        marginBottom: '40px'
      }}>
        <ProfessionalBarChart 
          data={societesTriees.slice(0, 8).map((societe, index) => ({
            label: societe.nom.length > 12 ? societe.nom.substring(0, 12) + '...' : societe.nom,
            value: societe.total_reclamations,
            color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][index % 8]
          }))}
          title="Classement des Sociétés par Volume de Réclamations"
          height={320}
        />
      </div>

      {/* Tableau des clients avec design professionnel */}
      <ProfessionalDataTable
        data={filteredClientStats}
        columns={clientColumns}
        title="Analyse Détaillée des Clients"
      />

      {/* Analyse par article avec design moderne */}
      {filteredArticleStats.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            padding: '24px 32px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)'
            }}>
              📦
            </div>
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}>
                Analyse par Article
              </h2>
              <p style={{
                margin: '0',
                fontSize: '16px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Performance détaillée de chaque article réclamé
              </p>
            </div>
          </div>

          {/* Graphique des articles les plus réclamés */}
          <div style={{ marginBottom: '40px' }}>
            <ProfessionalBarChart 
              data={filteredArticleStats.slice(0, 8).map((article, index) => ({
                label: article.article_name.length > 15 ? article.article_name.substring(0, 15) + '...' : article.article_name,
                value: article.total_reclamations,
                color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][index % 8]
              }))}
              title="Articles les Plus Réclamés"
              height={320}
            />
          </div>

          {/* Top 3 des articles avec design moderne */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '28px',
            marginBottom: '40px'
          }}>
            {filteredArticleStats.slice(0, 3).map((article, index) => (
              <div key={`${article.article_name}_${article.variant}`} style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
              }}
              >
                {/* Badge de position avec design moderne */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                             index === 1 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 
                             'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '800',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: index === 0 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 
                               index === 1 ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : 
                               'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                  }}>
                    📦
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#0f172a',
                      letterSpacing: '-0.01em'
                    }}>
                      {article.article_name}
                    </h3>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '15px',
                      color: '#64748b',
                      fontWeight: '600'
                    }}>
                      {article.variant} - {article.article_societe}
                    </p>
                    <p style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {article.total_reclamations} réclamations total
                    </p>
                  </div>
                </div>

                {/* Statistiques détaillées avec design moderne */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    backgroundColor: article.reclamations_en_attente > 0 ? '#fee2e2' : '#fef3c7',
                    color: article.reclamations_en_attente > 0 ? '#dc2626' : '#92400e',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    animation: 'none',
                    border: article.reclamations_en_attente > 0 ? '2px solid #dc2626' : 'none'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {article.reclamations_en_attente}
                    </div>
                    En attente
                    {article.reclamations_en_attente > 0 && (
                      <div style={{ fontSize: '10px', marginTop: '4px' }}>
                        Attention
                      </div>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {article.reclamations_en_traitement_qualite}
                    </div>
                    En traitement
                  </div>
                  <div style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {article.reclamations_resolues}
                    </div>
                    Résolues
                  </div>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {article.reclamations_rejetees}
                    </div>
                    Rejetées
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {article.total_quantite}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                      Quantité totale
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {article.nombre_clients_uniques}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                      Clients uniques
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {article.taux_resolution}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                      Taux résolution
                    </div>
                  </div>
                </div>

                {/* Barre de progression avec design moderne */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: `${filteredArticleStats.length > 0 ? (article.total_reclamations / Math.max(...filteredArticleStats.map(a => a.total_reclamations))) * 100 : 0}%`,
                    height: '100%',
                    background: index === 0 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 
                               index === 1 ? 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' : 
                               'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tableau complet des articles avec design professionnel */}
          <ProfessionalDataTable
            data={filteredArticleStats}
            columns={[
              {
                header: '📦 Article',
                key: 'article_name',
                render: (value, row) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      📦
                    </div>
                    <div>
                      <div style={{ color: '#1f2937', marginBottom: '2px' }}>{value}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{row.variant} - {row.article_societe}</div>
                    </div>
                  </div>
                )
              },
              {
                header: '📊 Total',
                key: 'total_reclamations',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    color: '#0c4a6e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '📦 Quantité',
                key: 'total_quantite',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    color: '#166534',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '👥 Clients',
                key: 'nombre_clients_uniques',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    color: '#92400e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '⏳ En attente',
                key: 'reclamations_en_attente',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    color: '#92400e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '🔄 En traitement',
                key: 'reclamations_en_traitement_qualite',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    color: '#0c4a6e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '✅ Résolues',
                key: 'reclamations_resolues',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    color: '#166534',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '❌ Rejetées',
                key: 'reclamations_rejetees',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#991b1b',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '📈 Taux',
                key: 'taux_resolution',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: value >= 50 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 
                               value >= 25 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
                               'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: value >= 50 ? '#166534' : value >= 25 ? '#92400e' : '#991b1b',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}%
                  </span>
                )
              },
              {
                header: '📅 Dernière',
                key: 'derniere_reclamation',
                align: 'center',
                render: (value) => (
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(value).toLocaleDateString('fr-FR')}
                  </span>
                )
              }
            ]}
            title="Tableau Complet des Articles"
          />
        </div>
      )}

      {/* Statistiques par société avec design moderne */}
      {societesTriees.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            padding: '24px 32px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              boxShadow: '0 12px 32px rgba(139, 92, 246, 0.3)'
            }}>
              🏢
            </div>
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}>
                Analyse par Société
              </h2>
              <p style={{
                margin: '0',
                fontSize: '16px',
                color: '#64748b',
                fontWeight: '500'
              }}>
                Performance détaillée de chaque société partenaire
              </p>
            </div>
          </div>

          {/* Top 3 des sociétés avec design moderne */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '28px',
            marginBottom: '40px'
          }}>
            {societesTriees.slice(0, 3).map((societe, index) => (
              <div key={societe.nom} style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
              }}
              >
                {/* Badge de position avec design moderne */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index === 0 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                             index === 1 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 
                             'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '800',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: index === 0 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
                               index === 1 ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' : 
                               'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                  }}>
                    🏢
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#0f172a',
                      letterSpacing: '-0.01em'
                    }}>
                      {societe.nom}
                    </h3>
                    <p style={{
                      margin: '0',
                      fontSize: '15px',
                      color: '#64748b',
                      fontWeight: '600'
                    }}>
                      {societe.total_reclamations} réclamations total
                    </p>
                  </div>
                </div>

                {/* Statistiques détaillées avec design moderne */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    backgroundColor: societe.reclamations_en_attente > 0 ? '#fee2e2' : '#fef3c7',
                    color: societe.reclamations_en_attente > 0 ? '#dc2626' : '#92400e',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    animation: 'none',
                    border: societe.reclamations_en_attente > 0 ? '2px solid #dc2626' : 'none'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {societe.reclamations_en_attente}
                    </div>
                    En attente
                    {societe.reclamations_en_attente > 0 && (
                      <div style={{ fontSize: '10px', marginTop: '4px' }}>
                        Attention
                      </div>
                    )}
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {societe.reclamations_en_traitement_qualite}
                    </div>
                    En traitement
                  </div>
                  <div style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {societe.reclamations_resolues}
                    </div>
                    Résolues
                  </div>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                      {societe.reclamations_rejetees}
                    </div>
                    Rejetées
                  </div>
                </div>

                {/* Barre de progression avec design moderne */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: `${societe.total_reclamations > 0 ? (societe.total_reclamations / Math.max(...societesTriees.map(s => s.total_reclamations))) * 100 : 0}%`,
                    height: '100%',
                    background: index === 0 ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' : 
                               index === 1 ? 'linear-gradient(90deg, #9ca3af 0%, #6b7280 100%)' : 
                               'linear-gradient(90deg, #d97706 0%, #b45309 100%)',
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tableau complet des sociétés avec design professionnel */}
          <ProfessionalDataTable
            data={societesTriees}
            columns={[
              {
                header: '🏢 Société',
                key: 'nom',
                render: (value) => (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '600'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      🏢
                    </div>
                    {value}
                  </div>
                )
              },
              {
                header: '📊 Total',
                key: 'total_reclamations',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    color: '#0c4a6e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '⏳ En attente',
                key: 'en_attente',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    color: '#92400e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '🔄 En traitement',
                key: 'en_traitement',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    color: '#0c4a6e',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '✅ Résolues',
                key: 'resolu',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    color: '#166534',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              },
              {
                header: '❌ Rejetées',
                key: 'rejete',
                align: 'center',
                render: (value) => (
                  <span style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#991b1b',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {value}
                  </span>
                )
              }
            ]}
            title="Tableau Complet des Sociétés"
          />
        </div>
      )}
    </div>
  );
}

export default CommercialStats; 