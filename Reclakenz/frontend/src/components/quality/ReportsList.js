import React, { useEffect, useState } from 'react';

function ReportsList() {
  const [reportsByReclamation, setReportsByReclamation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('access');
        // Fetch all reclamations first
        const recRes = await fetch('http://localhost:8000/api/all-reclamations/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!recRes.ok) throw new Error('Erreur chargement réclamations');
        const recs = await recRes.json();
        // For each reclamation, fetch reports
        const results = [];
        for (const r of recs) {
          const repRes = await fetch(`http://localhost:8000/api/reclamations/${r.id}/reports/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const reps = repRes.ok ? await repRes.json() : [];
          if (reps.length > 0) {
            results.push({ reclamation: r, reports: reps });
          }
        }
        setReportsByReclamation(results);
      } catch (e) {
        setError('Erreur lors du chargement des rapports');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="text-center py-5">Chargement des rapports...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Rapports par réclamation</h3>
      {reportsByReclamation.length === 0 ? (
        <div className="alert alert-info">Aucun rapport disponible.</div>
      ) : (
        reportsByReclamation.map(({ reclamation, reports }) => (
          <div key={reclamation.id} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Réclamation #{reclamation.id}</strong> — {reclamation.titre}
              </div>
              <span className="badge bg-secondary">{reports.length}</span>
            </div>
            <div className="card-body">
              <div className="text-muted mb-2" style={{fontSize: '0.9rem'}}>
                <strong>Client:</strong> {reclamation.user || 'N/A'}
              </div>
              {reports.map(rep => (
                <div key={rep.id} className="mb-3 border-bottom pb-2">
                  <div className="d-flex justify-content-between">
                    <div className="fw-semibold">{rep.objet || `Rapport #${rep.id}`}</div>
                    <div className="text-muted">{rep.date_rapport || '—'}</div>
                  </div>
                  <div className="text-muted" style={{fontSize: '0.9rem'}}>Responsable: {rep.responsable || 'N/A'}</div>
                  {rep.resultat && <div className="mt-2"><strong>Résultat:</strong> {rep.resultat}</div>}
                  {rep.conclusion && <div className="mt-1"><strong>Conclusion:</strong> {rep.conclusion}</div>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReportsList;


