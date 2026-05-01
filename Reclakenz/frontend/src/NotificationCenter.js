import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, ListGroup, Alert, Spinner } from 'react-bootstrap';

const NotificationCenter = ({ show, onHide }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      fetchNotifications();
    }
  }, [show]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        setError('Erreur lors du chargement des notifications');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        );
      }
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`http://localhost:8000/api/notifications/${notificationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notif => notif.id !== notificationId)
        );
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'status_change':
        return <i className="fas fa-exchange-alt text-primary"></i>;
      case 'info':
        return <i className="fas fa-info-circle text-info"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle text-warning"></i>;
      default:
        return <i className="fas fa-bell text-secondary"></i>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="fas fa-bell me-2"></i>
          Centre de Notifications
          {unreadCount > 0 && (
            <Badge bg="danger" className="ms-2">
              {unreadCount}
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto', padding: '20px' }}>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Chargement des notifications...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="fas fa-bell-slash fa-4x mb-3 text-secondary"></i>
            <h5>Aucune notification</h5>
            <p className="mb-0">Vous n'avez aucune notification pour le moment.</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="notifications-container">
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`notification-item border-0 mb-2 rounded ${!notification.is_read ? 'bg-light border-start border-primary border-3' : ''}`}
                  style={{ padding: '15px' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        {getTypeIcon(notification.type)}
                        <strong className="ms-2 text-dark">{notification.title}</strong>
                        {!notification.is_read && (
                          <Badge bg="primary" className="ms-2">Nouveau</Badge>
                        )}
                      </div>
                      <p className="mb-2 text-muted" style={{ fontSize: '0.95rem' }}>
                        {notification.message}
                      </p>
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        {formatDate(notification.created_at)}
                        {notification.reclamation && (
                          <>
                            <span className="mx-2">•</span>
                            <i className="fas fa-file-alt me-1"></i>
                            Réclamation #{notification.reclamation}
                          </>
                        )}
                      </small>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Marquer comme lu"
                        >
                          <i className="fas fa-check"></i>
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="primary"
            onClick={() => {
              notifications
                .filter(n => !n.is_read)
                .forEach(n => markAsRead(n.id));
            }}
          >
            <i className="fas fa-check-double me-2"></i>
            Tout marquer comme lu
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationCenter;
