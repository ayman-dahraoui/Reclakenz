import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    responsable: '',
    date_rapport: '',
    objet: '',
    description_probleme: '',
    actions: '',
    resultat: '',
    conclusion: '',
    recommandation: ''
  });
  useEffect(() => {
    // Prefill responsable with connected user's username
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) return;
        const res = await fetch('http://localhost:8000/api/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const profile = await res.json();
          setForm(prev => ({ ...prev, responsable: profile.username || '' }));
        }
      } catch (_) {}
    };
    fetchProfile();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const resp = await fetch(`http://localhost:8000/api/reclamations/${id}/reports/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (resp.ok) {
        setSuccess('Rapport enregistré avec succès.');
        // Optionnel: réinitialiser quelques champs mais conserver responsable/date/objet
        setForm(prev => ({ ...prev }));
      } else {
        const data = await resp.json();
        setError(data.error || 'Erreur lors de la création du rapport');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header moderne */}
      <div className="mb-4 p-4 rounded-4" style={{background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', border: '1px solid #bfdbfe'}}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{width: 48, height: 48, background: '#1d4ed8', color: 'white', boxShadow: '0 10px 25px rgba(29,78,216,0.25)'}}>📝</div>
            <div>
              <h3 className="m-0" style={{color: '#0f172a', fontWeight: 800}}>Créer un rapport</h3>
              <div className="text-muted" style={{fontSize: 13}}>Réclamation #{id}</div>
            </div>
          </div>
          <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}
      {success && <div className="alert alert-success shadow-sm">{success}</div>}

      {/* Carte formulaire */}
      <form onSubmit={handleSubmit} className="card shadow-lg border-0 rounded-4">
        <div className="card-header py-3 rounded-top-4" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderBottom: '1px solid #e5e7eb'}}>
          <h5 className="m-0" style={{fontWeight: 700, color: '#111827'}}>Informations du rapport</h5>
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Responsable</label>
              <input name="responsable" className="form-control form-control-lg" value={form.responsable} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Date du rapport</label>
              <input type="date" name="date_rapport" className="form-control form-control-lg" value={form.date_rapport} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Objet</label>
              <input name="objet" className="form-control form-control-lg" value={form.objet} onChange={handleChange} required />
            </div>

            <div className="col-12 pt-2">
              <div className="fw-bold mb-2" style={{color: '#1f2937'}}>Contenu du rapport</div>
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label">Description du problème</label>
                  <textarea name="description_probleme" className="form-control" rows="4" value={form.description_probleme} onChange={handleChange} placeholder="Décrivez brièvement le problème constaté" />
                </div>
                <div className="col-12">
                  <label className="form-label">Actions entreprises</label>
                  <textarea name="actions" className="form-control" rows="4" value={form.actions} onChange={handleChange} placeholder="Détaillez les actions réalisées" />
                </div>
                <div className="col-12">
                  <label className="form-label">Résultat</label>
                  <textarea name="resultat" className="form-control" rows="3" value={form.resultat} onChange={handleChange} required placeholder="Résultat obtenu" />
                </div>
                <div className="col-12">
                  <label className="form-label">Conclusion</label>
                  <textarea name="conclusion" className="form-control" rows="3" value={form.conclusion} onChange={handleChange} placeholder="Synthèse et conclusion" />
                </div>
                <div className="col-12">
                  <label className="form-label">Recommandation</label>
                  <textarea name="recommandation" className="form-control" rows="3" value={form.recommandation} onChange={handleChange} placeholder="Recommandations pour la suite" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end gap-2 p-3 rounded-bottom-4" style={{background: '#f8fafc'}}>
          <button type="submit" className="btn btn-primary btn-lg px-4" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer le rapport'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg px-4" onClick={() => navigate(`/quality-dashboard`)}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;


