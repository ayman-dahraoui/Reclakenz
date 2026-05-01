import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant de carte professionnelle
const ProfessionalCard = ({ children, title, icon, color = '#3b82f6' }) => (
  <div style={{
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${color}20`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
  }}
  >
    {title && (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
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
    )}
    {children}
  </div>
);

// Composant de bouton professionnel
const ProfessionalButton = ({ children, variant = 'primary', size = 'md', onClick, disabled = false, icon, ...props }) => {
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
      case 'sm':
        return { padding: '8px 16px', fontSize: '12px' };
      case 'md':
        return { padding: '12px 24px', fontSize: '14px' };
      case 'lg':
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

// Composant de champ de formulaire professionnel
const ProfessionalInput = ({ label, type = 'text', value, onChange, placeholder, required = false, options = null, ...props }) => (
  <div style={{ marginBottom: '24px' }}>
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    
    {type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
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
        {...props}
      >
        <option value="">{placeholder}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '14px',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          outline: 'none',
          minHeight: '120px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
        {...props}
      />
    )}
  </div>
);

// Composant de badge professionnel
const ProfessionalBadge = ({ children, variant = 'default', icon }) => {
  const getVariantConfig = (variant) => {
    switch (variant) {
      case 'success':
        return { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' };
      case 'warning':
        return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
      case 'danger':
        return { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' };
      case 'info':
        return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
      default:
        return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
    }
  };
  
  const config = getVariantConfig(variant);
  
  return (
    <span style={{
      padding: '6px 12px',
      background: config.bg,
      color: config.color,
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      border: `1px solid ${config.border}`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      {icon && <span style={{ fontSize: '12px' }}>{icon}</span>}
      {children}
    </span>
  );
};

function ClaimForm() {
  const [form, setForm] = useState({
    orderRef: '',
    claimType: '',
    societe: '',
    description: '',
    selectedArticles: []
  });
  const [claimTypes, setClaimTypes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentReclamationId, setCurrentReclamationId] = useState(null);
  const [existingReclamations, setExistingReclamations] = useState([]);
  const [selectedReclamationId, setSelectedReclamationId] = useState('');
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({}); // {articleId: variantId}
  const [articleQuantities, setArticleQuantities] = useState({}); // {articleId: quantity}
  
  // Nouvel état unifié pour éviter les problèmes de synchronisation
  const [articleSelections, setArticleSelections] = useState({}); // {articleId: {variant: '', quantity: 1}}
  

  const navigate = useNavigate();

  // Types de réclamation prédéfinis (fallback si l'API n'est pas disponible)
  const defaultClaimTypes = [
    { value: 'qualite', label: 'Problème de qualité' },
    { value: 'livraison', label: 'Erreur de livraison' },
    { value: 'manquant', label: 'Produit manquant' },
    { value: 'quantite', label: 'Mauvaise quantité livrée' },
    { value: 'commande', label: 'Erreur de commande' },
    { value: 'retard', label: 'Retard de livraison' },
  ];

  // Sociétés disponibles
  const companies = [
    { value: 'vetadis', label: 'Vetadis' },
    { value: 'kenz_maroc', label: 'Kenz Maroc' },
    { value: 'kenzpat', label: 'KenzPat' },
  ];

  // Injecter les styles CSS globaux
  useEffect(() => {
    const globalStyles = `
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
      
      .claim-form-container {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .form-section {
        animation: slideInLeft 0.6s ease-out;
      }
      
      .form-section:nth-child(1) { animation-delay: 0.1s; }
      .form-section:nth-child(2) { animation-delay: 0.2s; }
      .form-section:nth-child(3) { animation-delay: 0.3s; }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Vérifier l'authentification et le statut d'approbation au chargement
  useEffect(() => {
    const checkAuthAndApproval = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Vous devez être connecté pour créer une réclamation');
        navigate('/login');
        return;
      }

      try {
        // Récupérer le profil utilisateur
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          
          // Empêcher les commerciaux d'accéder à cette page (vérification prioritaire)
          if (profileData.user_type === 'commercial') {
            alert('Accès non autorisé. Les commerciaux ne peuvent pas créer de réclamations.');
            navigate('/all-reclamations');
            setLoading(false);
            return;
          }
          
          // Vérifier si l'utilisateur est approuvé
          if (profileData.approval_status !== 'approved') {
            setLoading(false);
            return; // Ne pas afficher le formulaire
          }
        } else {
          alert('Erreur lors de la récupération du profil');
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        alert('Erreur de connexion au serveur');
        navigate('/login');
        return;
      }

      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuthAndApproval();
  }, [navigate]);

  // Debug: Logger les changements d'état des articles
  useEffect(() => {
    console.log('=== ÉTAT DES ARTICLES ===');
    console.log('Articles sélectionnés:', selectedArticles);
    console.log('Variantes sélectionnées:', selectedVariants);
    console.log('Quantités sélectionnées:', articleQuantities);
    console.log('Sélections unifiées:', articleSelections);
    console.log('========================');
  }, [selectedArticles, selectedVariants, articleQuantities, articleSelections]);

  // Charger les types de réclamation depuis l'API
  useEffect(() => {
    fetch('http://localhost:8000/api/types-reclamation/')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erreur réseau');
      })
      .then(data => setClaimTypes(data))
      .catch(error => {
        console.error('Erreur lors du chargement des types depuis l\'API:', error);
        // Utiliser les types par défaut si l'API n'est pas disponible
        setClaimTypes(defaultClaimTypes);
      });
  }, []);

  // Charger les réclamations existantes de l'utilisateur
  useEffect(() => {
    if (isAuthenticated && userProfile?.approval_status === 'approved') {
      const token = localStorage.getItem('access');
      fetch('http://localhost:8000/api/reclamations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erreur réseau');
      })
      .then(data => setExistingReclamations(data))
      .catch(error => {
        console.error('Erreur lors du chargement des réclamations:', error);
      });
    }
  }, [isAuthenticated, userProfile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Si la société change, charger les articles correspondants
    if (name === 'societe') {
      loadArticlesBySociete(value);
      // Réinitialiser les articles sélectionnés
      setForm(prev => ({ ...prev, selectedArticles: [] }));
    }
  };

  // Fonction pour charger les articles par société
  const loadArticlesBySociete = async (societe) => {
    if (!societe) {
      setArticles([]);
      return;
    }

    setLoadingArticles(true);
    const token = localStorage.getItem('access');
    
    try {
      const response = await fetch(`http://localhost:8000/api/articles/?societe=${societe}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const articlesData = await response.json();
        setArticles(articlesData);
      } else {
        console.error('Erreur lors du chargement des articles');
        setArticles([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      setArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Nouvelle fonction unifiée pour éviter les problèmes de synchronisation
  const handleArticleToggleUnified = (articleId) => {
    setArticleSelections(prev => {
      const isCurrentlySelected = prev[articleId];
      
      if (isCurrentlySelected) {
        // Supprimer l'article
        const newSelections = { ...prev };
        delete newSelections[articleId];
        return newSelections;
      } else {
        // Ajouter l'article avec des valeurs par défaut
        const newSelections = {
          ...prev,
          [articleId]: {
            variant: '',
            quantity: 1
          }
        };
        return newSelections;
      }
    });
    
    // Mettre à jour aussi l'état des articles sélectionnés pour la compatibilité
    setSelectedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  const handleVariantChangeUnified = (articleId, variantId) => {
    setArticleSelections(prev => {
      // S'assurer que l'article existe dans les sélections
      if (!prev[articleId]) {
        prev[articleId] = { variant: '', quantity: 1 };
      }
      
      const newSelections = {
        ...prev,
        [articleId]: {
          ...prev[articleId],
          variant: variantId
        }
      };
      return newSelections;
    });
  };

  const handleQuantityChangeUnified = (articleId, quantity) => {
    setArticleSelections(prev => {
      // S'assurer que l'article existe dans les sélections
      if (!prev[articleId]) {
        prev[articleId] = { variant: '', quantity: 1 };
      }
      
      const newSelections = {
        ...prev,
        [articleId]: {
          ...prev[articleId],
          quantity: parseInt(quantity) || 1
        }
      };
      return newSelections;
    });
  };

  // Fonction pour sélectionner des fichiers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Fonction pour charger les photos d'une réclamation
  const loadPhotosForReclamation = async (reclamationId) => {
    if (!reclamationId) {
      setUploadedFiles([]);
      return;
    }

    const token = localStorage.getItem('access');
    try {
      const response = await fetch(`http://localhost:8000/api/reclamations/${reclamationId}/photos/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const photos = await response.json();
        setUploadedFiles(photos);
      } else {
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
      setUploadedFiles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour créer une réclamation');
      navigate('/login');
      return;
    }

    console.log('Données du formulaire:', form);
    
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        alert('Token d\'authentification manquant. Veuillez vous reconnecter.');
        navigate('/login');
        return;
      }

      // Construire la liste des articles sélectionnés avec variante et quantité
      const selectedArticlesPayload = Object.entries(articleSelections).map(([articleId, sel]) => ({
        articleId: parseInt(articleId),
        variantId: sel.variant || null,
        quantite: sel.quantity || 1
      }));

      // Préparer les données pour l'API Django
      const reclamationData = {
        titre: `Réclamation - ${form.societe} - ${form.orderRef}`,
        type_reclamation: form.claimType,
        societe: form.societe,
        description: `Société: ${form.societe}\nRéférence commande: ${form.orderRef}\n\nDescription du problème:\n${form.description}`,
        status: 'en_attente',
        selected_articles: selectedArticlesPayload
      };

      // Envoyer les données à l'API Django avec le token d'authentification
      const response = await fetch('http://localhost:8000/api/reclamations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reclamationData)
      });

             if (response.ok) {
         const result = await response.json();
         console.log('Réclamation enregistrée avec succès:', result);
         alert('Réclamation enregistrée avec succès !');
         setCurrentReclamationId(result.id); // Stocker l'ID de la réclamation
         
         // Réinitialiser le formulaire
        setForm({
          orderRef: '',
          claimType: '',
          societe: '',
          description: '',
          selectedArticles: []
        });
        setArticleSelections({});
        setSelectedArticles([]);
      } else if (response.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'enregistrement:', errorData);
        alert(`Erreur lors de l'enregistrement: ${errorData.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur de connexion au serveur. Vérifiez que le serveur Django est démarré.');
    }
  };

  // Fonction pour uploader les photos avec le nouveau modèle Photo
  const handlePhotoUpload = async () => {
    const reclamationId = selectedReclamationId || currentReclamationId;
    if (!reclamationId) {
      alert('Veuillez sélectionner une réclamation avant d\'uploader des photos.');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner des photos à uploader.');
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('access');
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch(`http://localhost:8000/api/reclamations/${reclamationId}/photos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(prev => [...prev, ...data.photos]);
        setSelectedFiles([]);
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de l\'upload des photos');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur de connexion lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  // Fonction pour supprimer une photo
  const handleDeletePhoto = async (photoId) => {
    const reclamationId = selectedReclamationId || currentReclamationId;
    if (!reclamationId) return;

    const token = localStorage.getItem('access');
    
    try {
      const response = await fetch(`http://localhost:8000/api/reclamations/${reclamationId}/photos/${photoId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(photo => photo.id !== photoId));
        alert('Photo supprimée avec succès');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur de connexion lors de la suppression');
    }
  };

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

  if (!userProfile || userProfile.approval_status !== 'approved') {
    // Déterminer le message d'erreur selon le type d'utilisateur
              let errorMessage = "Votre compte n'a pas encore été approuvé par l'administrateur.";
    
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

  return (
    <div className="claim-form-container" style={{
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)'
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
              Formulaire de Réclamation
            </h1>
            <p style={{
              margin: '0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Créez votre réclamation en quelques étapes simples
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

      {/* Formulaire principal */}
      <div className="form-section" style={{ marginBottom: '32px' }}>
        <ProfessionalCard title="Informations de Base" icon="🏢" color="#3b82f6">
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <ProfessionalInput
                label="Société"
                type="select"
                name="societe"
                value={form.societe}
                onChange={handleChange}
                placeholder="Sélectionnez une société"
                options={companies}
                required
              />
              
              <ProfessionalInput
                label="Référence commande"
                type="text"
                name="orderRef"
                value={form.orderRef}
                onChange={handleChange}
                placeholder="Entrez la référence de votre commande"
                required
              />
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <ProfessionalInput
                label="Type de réclamation"
                type="select"
                name="claimType"
                value={form.claimType}
                onChange={handleChange}
                placeholder="Sélectionnez un type de réclamation"
                options={claimTypes}
                required
              />
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <ProfessionalInput
                label="Description du problème"
                type="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez en détail le problème rencontré..."
                required
              />
            </div>
          </form>
        </ProfessionalCard>
      </div>

      {/* Section des articles */}
      {form.societe && (
        <div className="form-section" style={{ marginBottom: '32px' }}>
          <ProfessionalCard title="Articles Concernés" icon="��" color="#10b981">
            

            {loadingArticles ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #10b981',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p>Chargement des articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {articles.map((article) => (
                  <div key={article.id} style={{
                    padding: '20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    background: selectedArticles.includes(article.id) ? '#f0f9ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => handleArticleToggleUnified(article.id)}
                          style={{
                            width: '20px',
                            height: '20px',
                            accentColor: '#10b981'
                          }}
                        />
                        {/* Image de l'article */}
                        {article.image_url ? (
                          <img
                            src={article.image_url}
                            alt={article.nom}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#f3f4f6',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#9ca3af',
                            fontSize: '24px'
                          }}>
                            📦
                          </div>
                        )}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <span style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '16px'
                          }}>
                            {article.nom}
                          </span>
                          {!article.image_url && (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280',
                              fontStyle: 'italic'
                            }}>
                              Aucune image
                            </span>
                          )}
                        </div>
                      </div>
                      <ProfessionalBadge variant="info" icon="🏷️">
                        {article.societe}
                      </ProfessionalBadge>
                    </div>
                    
                    {selectedArticles.includes(article.id) && (
                      <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                      }}>

                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px'
                        }}>
                          <div>
                            <label style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '8px',
                              display: 'block'
                            }}>
                              Variante
                            </label>
                            <select
                              value={articleSelections[article.id]?.variant || ''}
                              onChange={(e) => handleVariantChangeUnified(article.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Sélectionner une variante</option>
                              {article.variants?.map((variant) => (
                                <option key={variant.id} value={variant.id}>
                                  {variant.weight} {variant.price}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '8px',
                              display: 'block'
                            }}>
                              Quantité
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={articleSelections[article.id]?.quantity || 1}
                              onChange={(e) => handleQuantityChangeUnified(article.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <p>Aucun article trouvé pour cette société</p>
              </div>
            )}
          </ProfessionalCard>
        </div>
      )}
      
      {/* Section des fichiers */}
      <div className="form-section" style={{ marginBottom: '32px' }}>
        <ProfessionalCard title="Pièces Jointes" icon="📎" color="#8b5cf6">
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              display: 'block'
            }}>
              Sélectionner des fichiers
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                background: '#f9fafb',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.background = '#f3f4f6';
              }}
              onDragLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.background = '#f9fafb';
              }}
            />
          </div>
          
          {selectedFiles.length > 0 && (
            <div style={{
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                color: '#0c4a6e'
              }}>
                Fichiers sélectionnés ({selectedFiles.length})
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {selectedFiles.map((file, index) => (
                  <ProfessionalBadge key={index} variant="info" icon="📄">
                    {file.name}
                  </ProfessionalBadge>
                ))}
              </div>
            </div>
          )}
        </ProfessionalCard>
      </div>

      {/* Bouton de soumission */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <ProfessionalButton
          onClick={() => navigate('/')}
          variant="outline"
          icon="🏠"
          size="lg"
        >
          Annuler
        </ProfessionalButton>
        
        <ProfessionalButton
          onClick={handleSubmit}
          variant="primary"
          icon="📤"
          size="lg"
          disabled={!form.societe || !form.orderRef || !form.claimType || !form.description}
        >
          Soumettre la Réclamation
        </ProfessionalButton>
      </div>

      {/* Lien vers la liste des réclamations */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <button
          onClick={() => navigate('/claims-list')}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#1d4ed8';
            e.target.style.textDecoration = 'none';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#3b82f6';
            e.target.style.textDecoration = 'underline';
          }}
        >
          📋 Voir vos réclamations existantes
        </button>
      </div>
    </div>
  );
}

export default ClaimForm; 