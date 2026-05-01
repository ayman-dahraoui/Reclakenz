import React, { useState, useEffect } from 'react';
import './App.css';
import ActionToggleButton from './ActionToggleButton';

const AdminSimpleRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/simple-requests/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setMessage('Erreur lors du chargement des demandes');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/simple-requests/${requestId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          admin_comment: adminComment
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user_upgraded) {
          setMessage(`Demande approuvée avec succès ! ${data.confirmation_message}`);
        } else {
          setMessage(`Demande ${newStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`);
        }
        setShowModal(false);
        setAdminComment('');
        setSelectedRequest(null);
        fetchRequests(); // Recharger la liste
      } else {
        const data = await response.json();
        setMessage(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/simple-requests/${requestId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setMessage('Demande supprimée avec succès');
        fetchRequests(); // Recharger la liste
      } else {
        setMessage('Erreur lors de la suppression');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'badge-warning', text: 'En attente' },
      'approved': { class: 'badge-success', text: 'Approuvée' },
      'rejected': { class: 'badge-danger', text: 'Rejetée' }
    };
    
    const config = statusConfig[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'commercial': { class: 'badge-primary', text: 'Commercial' },
      'qualite': { class: 'badge-info', text: 'Agent Qualité' }
    };
    
    const config = typeConfig[type] || { class: 'badge-secondary', text: type };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getMemberBadge = (isMember) => {
    return isMember === 'yes' 
      ? <span className="badge badge-success">Membre</span>
      : <span className="badge badge-secondary">Non membre</span>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-simple-requests-container">
      <div className="content-container">
        <h2 className="mb-4">Gestion des Demandes Simples</h2>
        
        {message && (
          <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">Aucune demande simple trouvée.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Utilisateur</th>
                  <th>Type de demande</th>
                  <th>Statut membre</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.user_username}</td>
                    <td>{getTypeBadge(request.type_demande)}</td>
                    <td>{getMemberBadge(request.est_membre)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{new Date(request.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          title="Voir les détails"
                        >
                          <i className="fas fa-eye me-1"></i>
                          Détails
                        </button>
                        
                        {request.status === 'pending' && (
                          <ActionToggleButton
                            size="small"
                            onApprove={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                            onReject={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                          />
                        )}
                        
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(request.id)}
                          title="Supprimer"
                        >
                          <i className="fas fa-trash me-1"></i>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal pour les détails et actions */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Détails de la demande #{selectedRequest.id}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminComment('');
                }}
              ></button>
            </div>
            
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>ID de la demande :</strong> {selectedRequest.id}
                </div>
                <div className="col-md-6">
                  <strong>Utilisateur :</strong> {selectedRequest.user_username}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Type de demande :</strong> {getTypeBadge(selectedRequest.type_demande)}
                </div>
                <div className="col-md-6">
                  <strong>Statut membre :</strong> {getMemberBadge(selectedRequest.est_membre)}
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Statut :</strong> {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="col-md-6">
                  <strong>Date de création :</strong> {new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Preuve ou justification :</strong>
                <div className="mt-2 p-3 bg-light rounded">
                  {selectedRequest.preuve_justification}
                </div>
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="mb-3">
                  <label htmlFor="adminComment" className="form-label">
                    Commentaire administrateur (optionnel) :
                  </label>
                  <textarea
                    id="adminComment"
                    className="form-control"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    rows="3"
                    placeholder="Ajoutez un commentaire..."
                  />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              {selectedRequest.status === 'pending' && (
                <ActionToggleButton
                  size="modal"
                  onApprove={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                  onReject={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                />
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setAdminComment('');
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

export default AdminSimpleRequests; 