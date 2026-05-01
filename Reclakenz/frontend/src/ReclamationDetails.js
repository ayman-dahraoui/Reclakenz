import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

const ReclamationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reclamation, setReclamation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setError('Vous devez être connecté pour accéder à cette page');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        setUserProfile(profileData);
        
        if (profileData.approval_status === 'approved') {
          fetchReclamationDetails();
        } else {
          setError('Vous devez être approuvé pour accéder à cette page');
          setLoading(false);
        }
      } else {
        setError('Erreur lors de la récupération du profil');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setError('Erreur de connexion');
      setLoading(false);
    }
  };

  const fetchReclamationDetails = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/all-reclamations/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReclamation(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement des détails de la réclamation');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/all-reclamations/${id}/`, {
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
        // Recharger les détails de la réclamation
        fetchReclamationDetails();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    }
  };

  const getStatusBadge = (status) => {
            const statusConfig = {
          'en_attente': { class: 'badge bg-warning', text: 'En attente' },
          'en_traitement_qualite': { class: 'badge bg-info', text: 'En traitement par agent qualité' },
          'resolu': { class: 'badge bg-success', text: 'Résolu' },
          'rejete': { class: 'badge bg-danger', text: 'Rejeté' }
        };
    
    const config = statusConfig[status] || { class: 'badge bg-secondary', text: status };
    return <span className={config.class}>{config.text}</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'technique': { class: 'badge bg-primary', text: 'Technique' },
      'commercial': { class: 'badge bg-success', text: 'Commercial' },
      'qualite': { class: 'badge bg-info', text: 'Qualité' }
    };
    
    const config = typeConfig[type] || { class: 'badge bg-secondary', text: type };
    return <span className={config.class}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="reclamation-details-container">
        <div className="content-container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reclamation-details-container">
        <div className="content-container">
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-outline-secondary ms-3"
              onClick={() => navigate('/all-reclamations')}
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!reclamation) {
    return (
      <div className="reclamation-details-container">
        <div className="content-container">
          <div className="alert alert-warning">
            Réclamation non trouvée
            <button 
              className="btn btn-outline-secondary ms-3"
              onClick={() => navigate('/all-reclamations')}
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reclamation-details-container">
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Détails de la réclamation #{reclamation.id}</h2>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/all-reclamations')}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Retour à la liste
          </button>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">{reclamation.titre}</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Type:</strong> {getTypeBadge(reclamation.type_reclamation)}
                  </div>
                  <div className="col-md-6">
                    <strong>Statut:</strong> {getStatusBadge(reclamation.statut)}
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Utilisateur:</strong> {reclamation.user || 'N/A'}
                  </div>
                  <div className="col-md-6">
                    <strong>Date de création:</strong> {new Date(reclamation.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {reclamation.description && (
                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="mt-2">{reclamation.description}</p>
                  </div>
                )}

                {reclamation.date_modification && (
                  <div className="mb-3">
                    <strong>Dernière modification:</strong> {new Date(reclamation.date_modification).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">Actions</h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/reclamation/${id}/creer-rapport`)}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    Créer un rapport
                  </button>
                  <button
                    className="btn btn-info"
                                         onClick={() => handleStatusUpdate('en_traitement_qualite')}
                     disabled={reclamation.statut === 'en_traitement_qualite'}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Mettre en cours
                  </button>
                  
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate('resolu')}
                    disabled={reclamation.statut === 'resolu'}
                  >
                    <i className="fas fa-check me-2"></i>
                    Marquer comme résolu
                  </button>
                  
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate('rejete')}
                    disabled={reclamation.statut === 'rejete'}
                  >
                    <i className="fas fa-times me-2"></i>
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {userProfile && userProfile.user_type === 'qualite' && userProfile.approval_status === 'approved' && (
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/reclamation/${id}/creer-rapport`)}
          >
            <i className="fas fa-file-alt me-2"></i>
            Créer un rapport
          </button>
        </div>
      )}
    </div>
  );
};

export default ReclamationDetails; 