import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import ClaimForm from './ClaimForm';
import ClaimsList from './ClaimsList';
import ClaimStatus from './ClaimStatus';
import AdminDashboard from './AdminDashboard';

import UploadProof from './UploadProof';
import UserProfile from './UserProfile';
import SimpleRequestForm from './SimpleRequestForm';
import AdminSimpleRequests from './AdminSimpleRequests';
import AllReclamationsView from './AllReclamationsView';
import ReclamationDetails from './ReclamationDetails';
import ReportForm from './components/quality/ReportForm';
import QualityAgentDashboard from './QualityAgentDashboard';
import PendingRegistrations from './PendingRegistrations';
import CommercialStats from './CommercialStats';
import NotificationCenter from './NotificationCenter';
import ReportsList from './components/quality/ReportsList';
import './App.css';
import logo from './logo.png';
import AuthPage from './components/AuthPage';

function TopRightActions() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) return;
        
        const response = await fetch('http://localhost:8000/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const unreadCount = data.filter(n => !n.is_read).length;
          setNotificationCount(unreadCount);
        } else if (response.status === 401) {
          // Token expiré, nettoyer et rediriger
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Erreur lors du chargement du nombre de notifications:', err);
      }
    };

    fetchNotificationCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  if (["/claim", "/upload-proof", "/profile", "/claims-list", "/claim-status", "/admin-dashboard", "/admin-simple-requests", "/simple-request", "/all-reclamations", "/pending-registrations", "/reclamation", "/commercial-stats", "/rapports"].includes(location.pathname) || location.pathname.startsWith('/reclamation/')) {
    return (
      <div className="d-flex flex-column gap-2 align-items-end">
        <div className="d-flex gap-2">
          {/* Afficher le bouton notifications seulement pour les clients (pas admin/commercial) */}
          {["/claim", "/upload-proof", "/claims-list", "/claim-status"].includes(location.pathname) || location.pathname.startsWith('/reclamation/') ? (
            <Button 
              className="btn-notifications position-relative"
              size="sm"
              onClick={() => setShowNotifications(true)}
              variant="outline-primary"
            >
              <i className="fas fa-bell me-1"></i>
              Notifications
              {notificationCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notificationCount}
                </span>
              )}
            </Button>
          ) : null}
          <Button 
            className="btn-profile"
            size="sm"
            onClick={() => window.location.href='/profile'}
          >
            <i className="fas fa-user me-1"></i>
            Profil
          </Button>
          <Button 
            className="btn-logout"
            size="sm"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-1"></i>
            Se déconnecter
          </Button>
        </div>
        {/* Afficher le modal notifications seulement pour les clients */}
        {["/claim", "/upload-proof", "/claims-list", "/claim-status"].includes(location.pathname) || location.pathname.startsWith('/reclamation/') ? (
          <NotificationCenter 
            show={showNotifications} 
            onHide={() => {
              setShowNotifications(false);
              // Refresh count after closing notifications
              setTimeout(() => {
                const fetchCount = async () => {
                  try {
                    const token = localStorage.getItem('access');
                    if (!token) return;
                    
                    const response = await fetch('http://localhost:8000/api/notifications/', {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      }
                    });

                    if (response.ok) {
                      const data = await response.json();
                      const unreadCount = data.filter(n => !n.is_read).length;
                      setNotificationCount(unreadCount);
                    }
                  } catch (err) {
                    console.error('Erreur lors du rafraîchissement du nombre de notifications:', err);
                  }
                };
                fetchCount();
              }, 500);
            }} 
          />
        ) : null}
      </div>
    );
  }
  return null;
}

function Navigation() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [hasApprovedCommercialRequest, setHasApprovedCommercialRequest] = useState(false);
  const [hasApprovedQualityRequest, setHasApprovedQualityRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/api/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            
            // Vérifier si l'utilisateur a une demande Commercial approuvée
            const commercialResponse = await fetch('http://localhost:8000/api/commercial-status/', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
            
            if (commercialResponse.ok) {
              const commercialData = await commercialResponse.json();
              setHasApprovedCommercialRequest(commercialData.has_approved_commercial_request);
              console.log('Statut commercial:', commercialData); // Debug
            } else {
              setHasApprovedCommercialRequest(false);
            }

            // Vérifier si l'utilisateur est un agent qualité approuvé
            if (data.user_type === 'qualite' && data.approval_status === 'approved') {
              setHasApprovedQualityRequest(true);
            } else {
              setHasApprovedQualityRequest(false);
            }
            
            // Vérification supplémentaire pour les commerciaux
            if (data.user_type === 'commercial' && data.approval_status === 'approved') {
              console.log('Utilisateur commercial détecté via profil:', data);
              setHasApprovedCommercialRequest(true);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut:', error);
        }
      }
      setLoading(false);
    };

    checkUserStatus();
  }, []);
  
  if (["/claim", "/upload-proof", "/profile", "/claims-list", "/claim-status", "/admin-dashboard", "/admin-simple-requests", "/simple-request", "/pending-registrations", "/all-reclamations", "/quality-dashboard", "/commercial-stats", "/rapports"].includes(location.pathname) || location.pathname.startsWith('/reclamation/')) {
    // Si l'utilisateur est staff, afficher seulement l'administration
    if (userData && userData.is_staff) {
      return (
        <div className="text-center mb-4">
          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            <Nav.Link 
              as={Link} 
              to="/admin-dashboard" 
              className={`nav-link-custom ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
            >
              <i className="fas fa-cogs me-2"></i>
              <span className="fw-semibold">Administration</span>
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/pending-registrations" 
              className={`nav-link-custom ${location.pathname === '/pending-registrations' ? 'active' : ''}`}
            >
              <i className="fas fa-user-clock me-2"></i>
              <span className="fw-semibold">Inscriptions en attente</span>
            </Nav.Link>
          </div>
        </div>
      );
    }
    
    // Si l'utilisateur n'est pas staff, afficher les fonctionnalités client
    return (
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
          {(location.pathname === '/all-reclamations' || location.pathname === '/profile' || location.pathname === '/commercial-stats') ? (
            // Sur les pages all-reclamations et profile, afficher le bouton approprié selon le type d'utilisateur
            hasApprovedQualityRequest ? (
              // Si l'utilisateur est un agent qualité approuvé
              <Nav.Link 
                as={Link} 
                to="/quality-dashboard" 
                className="nav-link-custom"
              >
                <i className="fas fa-clipboard-check me-2"></i>
                <span className="fw-semibold">Tableau de Bord Qualité</span>
              </Nav.Link>
            ) : hasApprovedCommercialRequest ? (
              // Si l'utilisateur est un commercial approuvé
              <>
                <Nav.Link 
                  as={Link} 
                  to="/all-reclamations" 
                  className="nav-link-custom"
                >
                  <i className="fas fa-list-alt me-2"></i>
                  <span className="fw-semibold">Toutes les réclamations</span>
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/commercial-stats" 
                  className="nav-link-custom"
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  <span className="fw-semibold">Statistiques</span>
                </Nav.Link>
              </>
            ) : (
              // Pour les clients normaux
              <>
                <Nav.Link 
                  as={Link} 
                  to="/claim" 
                  className="nav-link-custom"
                >
                  <i className="fas fa-file-alt me-2"></i>
                  <span className="fw-semibold">Réclamation</span>
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/claims-list" 
                  className={`nav-link-custom ${location.pathname === '/claims-list' ? 'active' : ''}`}
                >
                  <i className="fas fa-list-alt me-2"></i>
                  <span className="fw-semibold">Mes Réclamations</span>
                </Nav.Link>
              </>
            )
          ) : hasApprovedCommercialRequest ? (
            // Si l'utilisateur a une demande Commercial approuvée sur les autres pages
            <>
              <Nav.Link 
                as={Link} 
                to="/all-reclamations" 
                className={`nav-link-custom ${location.pathname === '/all-reclamations' ? 'active' : ''}`}
              >
                <i className="fas fa-list-alt me-2"></i>
                <span className="fw-semibold">Toutes les réclamations</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/commercial-stats" 
                className={`nav-link-custom ${location.pathname === '/commercial-stats' ? 'active' : ''}`}
              >
                <i className="fas fa-chart-bar me-2"></i>
                <span className="fw-semibold">Statistiques</span>
              </Nav.Link>
            </>
          ) : hasApprovedQualityRequest ? (
            // Si l'utilisateur est un agent qualité approuvé
            <Nav.Link 
              as={Link} 
              to="/quality-dashboard" 
              className={`nav-link-custom ${location.pathname === '/quality-dashboard' ? 'active' : ''}`}
            >
              <i className="fas fa-clipboard-check me-2"></i>
              <span className="fw-semibold">Tableau de Bord Qualité</span>
            </Nav.Link>
          ) : (
            // Sinon, afficher les fonctionnalités normales
            <>
              <Nav.Link 
                as={Link} 
                to="/claim" 
                className={`nav-link-custom ${location.pathname === '/claim' ? 'active' : ''}`}
              >
                <i className="fas fa-file-alt me-2"></i>
                <span className="fw-semibold">Réclamation</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/claims-list" 
                className={`nav-link-custom ${location.pathname === '/claims-list' ? 'active' : ''}`}
              >
                <i className="fas fa-list me-2"></i>
                <span className="fw-semibold">Liste des réclamations</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/claim-status" 
                className={`nav-link-custom ${location.pathname === '/claim-status' ? 'active' : ''}`}
              >
                <i className="fas fa-chart-line me-2"></i>
                <span className="fw-semibold">Suivi des réclamations</span>
              </Nav.Link>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-4">
          <Nav.Link 
            as={Link} 
            to="/register" 
            className={`nav-link-custom ${location.pathname === '/register' ? 'active' : ''}`}
          >
            <i className="fas fa-user-plus me-2"></i>
            <span className="fw-semibold">Inscription</span>
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/login" 
            className={`nav-link-custom ${location.pathname === '/login' ? 'active' : ''}`}
          >
            <i className="fas fa-sign-in-alt me-2"></i>
            <span className="fw-semibold">Connexion</span>
          </Nav.Link>
        </div>
      </div>
    );
  }
}

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    const user = localStorage.getItem('user');
    
    if (!token) {
      // Utilisateur non connecté, rester sur la page d'accueil
      setIsLoading(false);
      return;
    }

    // Utilisateur connecté, récupérer ses données
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        
        // Rediriger selon le rôle
        if (parsedUser.is_staff) {
          navigate('/admin-dashboard');
        } else if (parsedUser.user_type === 'qualite' && parsedUser.approval_status === 'approved') {
          // Agent qualité approuvé -> rediriger vers le tableau de bord qualité
          navigate('/quality-dashboard');
        } else if (parsedUser.user_type === 'commercial' && parsedUser.approval_status === 'approved') {
          // Commercial approuvé -> rediriger vers toutes les réclamations
          navigate('/all-reclamations');
        } else {
          // Utilisateur normal -> rediriger vers la page de réclamation
          navigate('/claim');
        }
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        setIsLoading(false);
      }
    } else {
      // Si pas de données utilisateur dans localStorage, récupérer depuis l'API
      const checkUserProfile = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            const profileData = await response.json();
            
            // Rediriger selon le rôle
            if (profileData.is_staff) {
              navigate('/admin-dashboard');
            } else if (profileData.user_type === 'qualite' && profileData.approval_status === 'approved') {
              navigate('/quality-dashboard');
            } else if (profileData.user_type === 'commercial' && profileData.approval_status === 'approved') {
              navigate('/all-reclamations');
            } else {
              navigate('/claim');
            }
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          setIsLoading(false);
        }
      };
      
      checkUserProfile();
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // Page d'accueil pour les utilisateurs non connectés
  return (
    <div className="text-center py-5">
      <h2 className="mb-3">Bienvenue sur le système de réclamations</h2>
      <p className="text-muted mb-4">Connectez-vous pour accéder aux fonctionnalités.</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Button as={Link} to="/login" variant="primary" size="lg">
          <i className="fas fa-sign-in-alt me-2"></i>
          Se connecter
        </Button>
        <Button as={Link} to="/register" variant="outline-primary" size="lg">
          <i className="fas fa-user-plus me-2"></i>
          S'inscrire
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header avec logo et actions */}
        <div className="header-section">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center py-3">
              {/* Logo centré */}
              <div className="logo-container flex-grow-1">
                <img 
                  src={logo} 
                  alt="Logo Kenz" 
                  style={{
                    height: '150px',
                    width: 'auto',
                    maxWidth: '400px'
                  }}
                />
              </div>
              
              {/* Actions à droite */}
              <div className="position-absolute" style={{ right: '20px' }}>
                <TopRightActions />
              </div>
            </div>
          </Container>
        </div>

        {/* Navigation */}
        <Container fluid>
          <Navigation />
        </Container>

        {/* Contenu principal */}
        <Container fluid className="px-0">
          <Routes>
            {/* Replace both login and register with unified AuthPage */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            <Route path="/claim" element={<ClaimForm />} />
            <Route path="/claims-list" element={<ClaimsList />} />
            <Route path="/claim-status" element={<ClaimStatus />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            <Route path="/upload-proof" element={<UploadProof />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/simple-request" element={<SimpleRequestForm />} />
            <Route path="/admin-simple-requests" element={<AdminSimpleRequests />} />
            <Route path="/pending-registrations" element={<PendingRegistrations />} />
            <Route path="/all-reclamations" element={<AllReclamationsView />} />
            <Route path="/reclamation/:id" element={<ReclamationDetails />} />
            <Route path="/reclamation/:id/creer-rapport" element={<ReportForm />} />
            <Route path="/quality-dashboard" element={<QualityAgentDashboard />} />
            <Route path="/commercial-stats" element={<CommercialStats />} />
            <Route path="/rapports" element={<ReportsList />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
