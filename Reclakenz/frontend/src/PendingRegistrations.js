import React, { useState, useEffect } from 'react';
import ActionToggleButton from './ActionToggleButton';

function PendingRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/pending-registrations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        setMessage('Erreur lors du chargement des inscriptions');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (profileId, action, comment = '') => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/pending-registrations/${profileId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, comment })
      });

      if (response.ok) {
        setMessage(action === 'approve' ? 'Inscription approuvée avec succès' : 'Inscription rejetée');
        fetchPendingRegistrations(); // Recharger la liste
      } else {
        const data = await response.json();
        setMessage(data.error || 'Erreur lors de l\'action');
      }
    } catch (error) {
      setMessage('Erreur de connexion');
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'client': return 'Client';
      case 'commercial': return 'Commercial';
      case 'qualite': return 'Agent Qualité';
      default: return userType;
    }
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Inscriptions en attente d'approbation
      </h2>

      {message && (
        <div style={{ 
          padding: '10px', 
          borderRadius: '6px', 
          textAlign: 'center',
          backgroundColor: message.includes('succès') ? '#d4edda' : '#f8d7da',
          color: message.includes('succès') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('succès') ? '#c3e6cb' : '#f5c6cb'}`,
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      {registrations.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>
          Aucune inscription en attente d'approbation
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {registrations.map((registration) => (
            <div 
              key={registration.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <strong>Nom d'utilisateur:</strong> {registration.username}
                </div>
                <div>
                  <strong>Email:</strong> {registration.email}
                </div>
                <div>
                  <strong>Téléphone:</strong> {registration.phone}
                </div>
                <div>
                  <strong>Type d'utilisateur:</strong> {getUserTypeLabel(registration.user_type)}
                </div>
                <div>
                  <strong>Date d'inscription:</strong> {new Date(registration.date_joined).toLocaleDateString('fr-FR')}
                </div>
                {registration.est_membre && (
                  <div>
                    <strong>Membre de la société:</strong> {registration.est_membre === 'yes' ? 'Oui' : 'Non'}
                  </div>
                )}
              </div>

              {registration.preuve_justification && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Preuve ou justification:</strong>
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    marginTop: '5px',
                    border: '1px solid #ddd'
                  }}>
                    {registration.preuve_justification}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <ActionToggleButton
                  onApprove={() => handleAction(registration.id, 'approve')}
                  onReject={() => handleAction(registration.id, 'reject')}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingRegistrations; 