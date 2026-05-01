import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClaimList() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Vous devez être connecté pour voir vos réclamations');
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
    fetchReclamations();
  }, [navigate]);

  const fetchReclamations = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      const response = await fetch('http://localhost:8000/api/reclamations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReclamations(data);
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des réclamations');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getTypeLabel = (typeValue) => {
    const typeMap = {
      'qualite': 'Problème de qualité',
      'livraison': 'Erreur de livraison',
      'manquant': 'Produit manquant',
      'quantite': 'Mauvaise quantité livrée',
      'commande': 'Erreur de commande',
      'retard': 'Retard de livraison'
    };
    return typeMap[typeValue] || typeValue;
  };

  const getStatusLabel = (statusValue) => {
            const statusMap = {
          'en_attente': 'En attente',
          'en_traitement_qualite': 'En traitement par agent qualité',
          'resolu': 'Résolu',
          'rejete': 'Rejeté'
        };
    return statusMap[statusValue] || statusValue;
  };

  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Vérification de l'authentification...</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Chargement de vos réclamations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Mes Réclamations ({reclamations.length})
      </h2>
      
      {reclamations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Vous n'avez pas encore créé de réclamation.
          <br />
          <button 
            onClick={() => navigate('/claim')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Créer une réclamation
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reclamations.map((reclamation) => (
            <div 
              key={reclamation.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {reclamation.titre}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <strong>Société:</strong> {reclamation.societe_display || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Type:</strong> {getTypeLabel(reclamation.type_reclamation)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Statut:</strong> 
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: 
                    reclamation.statut === 'resolu' ? '#28a745' :
                                          reclamation.statut === 'en_traitement_qualite' ? '#ffc107' :
                    reclamation.statut === 'rejete' ? '#dc3545' : '#6c757d',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  {getStatusLabel(reclamation.statut)}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Date:</strong> {formatDate(reclamation.date_creation)}
              </div>
              <div>
                <strong>Description:</strong>
                <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-line' }}>
                  {reclamation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={fetchReclamations}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Actualiser la liste
        </button>
       
      </div>
    </div>
  );
}

export default ClaimList; 