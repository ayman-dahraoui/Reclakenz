import React, { useState } from 'react';
import './App.css';

const SimpleRequestForm = () => {
  const [formData, setFormData] = useState({
    type_demande: '',
    est_membre: '',
    preuve_justification: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const token = localStorage.getItem('access');
    if (!token) {
      setMessage('Vous devez être connecté pour soumettre une demande');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/simple-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Demande envoyée avec succès !');
        setFormData({
          type_demande: '',
          est_membre: '',
          preuve_justification: ''
        });
      } else {
        setMessage(data.error || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="simple-request-container">
      <div className="simple-request-form">
        <h2 className="form-title">Demande pour devenir Commercial ou Agent Qualité</h2>
        
        {message && (
          <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type_demande" className="form-label">
              Type de demande *
            </label>
            <select
              id="type_demande"
              name="type_demande"
              value={formData.type_demande}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="commercial">Commercial</option>
              <option value="qualite">Agent Qualité</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="est_membre" className="form-label">
              Êtes-vous membre de cette société ? *
            </label>
            <select
              id="est_membre"
              name="est_membre"
              value={formData.est_membre}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Sélectionnez une option</option>
              <option value="yes">Oui, je suis membre</option>
              <option value="no">Non, je ne suis pas membre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="preuve_justification" className="form-label">
              Preuve ou justification *
            </label>
            <textarea
              id="preuve_justification"
              name="preuve_justification"
              value={formData.preuve_justification}
              onChange={handleChange}
              className="form-textarea"
              required
              placeholder="Veuillez fournir une preuve ou justification de votre statut"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                                 setFormData({
                   type_demande: '',
                   est_membre: '',
                   preuve_justification: ''
                 });
                setMessage('');
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleRequestForm; 