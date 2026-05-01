import React from 'react';
import ClaimTypeBadge from './ClaimTypeBadge';

// Composant pour afficher une vue d'ensemble des types de réclamations
const ClaimTypesOverview = ({ title = "Vue d'ensemble des Types de Réclamations", showStats = true }) => {
  const claimTypes = [
    {
      value: 'qualite',
      icon: '🔍',
      color: '#3b82f6',
      bg: '#dbeafe',
      border: '#93c5fd',
      label: 'Problème de qualité',
      description: 'Défaut de qualité du produit, matériaux défectueux, finition insuffisante',
      examples: ['Produit cassé', 'Matériau défectueux', 'Finition médiocre'],
      priority: 'Haute',
      avgResolutionTime: '2-3 jours'
    },
    {
      value: 'livraison',
      icon: '🚚',
      color: '#10b981',
      bg: '#d1fae5',
      border: '#6ee7b7',
      label: 'Erreur de livraison',
      description: 'Livraison à la mauvaise adresse, colis endommagé, erreur de transport',
      examples: ['Mauvaise adresse', 'Colis endommagé', 'Erreur de transport'],
      priority: 'Moyenne',
      avgResolutionTime: '1-2 jours'
    },
    {
      value: 'manquant',
      icon: '📦',
      color: '#f59e0b',
      bg: '#fef3c7',
      border: '#fde68a',
      label: 'Produit manquant',
      description: 'Article non reçu, pièce manquante, commande incomplète',
      examples: ['Article non reçu', 'Pièce manquante', 'Commande incomplète'],
      priority: 'Haute',
      avgResolutionTime: '1-3 jours'
    },
    {
      value: 'quantite',
      icon: '⚖️',
      color: '#8b5cf6',
      bg: '#ede9fe',
      border: '#a78bfa',
      label: 'Mauvaise quantité',
      description: 'Quantité incorrecte livrée, surplus ou manque de produits',
      examples: ['Quantité insuffisante', 'Surplus de produits', 'Mauvaise unité'],
      priority: 'Moyenne',
      avgResolutionTime: '1-2 jours'
    },
    {
      value: 'commande',
      icon: '📋',
      color: '#ec4899',
      bg: '#fce7f3',
      border: '#f9a8d4',
      label: 'Erreur de commande',
      description: 'Mauvais produit commandé, spécifications incorrectes, erreur de référence',
      examples: ['Mauvais produit', 'Spécifications incorrectes', 'Erreur de référence'],
      priority: 'Basse',
      avgResolutionTime: '2-4 jours'
    },
    {
      value: 'retard',
      icon: '⏰',
      color: '#ef4444',
      bg: '#fee2e2',
      border: '#fca5a5',
      label: 'Retard de livraison',
      description: 'Livraison en retard, délai non respecté, problème de planning',
      examples: ['Livraison en retard', 'Délai non respecté', 'Problème de planning'],
      priority: 'Moyenne',
      avgResolutionTime: '1-2 jours'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return '#ef4444';
      case 'Moyenne': return '#f59e0b';
      case 'Basse': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9'
    }}>
      {/* En-tête principal */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '32px',
          fontWeight: '900',
          color: '#0f172a',
          background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h2>
        <p style={{
          margin: '0',
          fontSize: '18px',
          color: '#64748b',
          fontWeight: '500',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Découvrez tous les types de réclamations que nous traitons et leurs caractéristiques
        </p>
      </div>

      {/* Grille des types avec informations détaillées */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {claimTypes.map((type, index) => (
          <div 
            key={type.value}
            style={{
              padding: '28px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '20px',
              border: `2px solid ${type.border}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = `0 16px 40px ${type.color}20`;
              e.currentTarget.style.borderColor = type.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = type.border;
            }}
          >
            {/* Effet de brillance */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              transform: 'rotate(45deg)',
              animation: 'shine 3s infinite'
            }} />
            
            {/* En-tête de la carte */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: `linear-gradient(135deg, ${type.color}20 0%, ${type.color}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0
              }}>
                {type.icon}
              </div>
              
              <div style={{ flex: 1 }}>
                <ClaimTypeBadge 
                  type={type.value} 
                  size="lg" 
                  variant="default"
                />
              </div>
            </div>
            
            {/* Description */}
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              {type.description}
            </p>
            
            {/* Exemples */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Exemples courants :
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {type.examples.map((example, idx) => (
                  <span key={idx} style={{
                    padding: '4px 8px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {example}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Statistiques */}
            {showStats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Priorité
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: getPriorityColor(type.priority)
                  }}>
                    {type.priority}
                  </div>
                </div>
                
                <div style={{
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Résolution
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#374151'
                  }}>
                    {type.avgResolutionTime}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Légende des priorités */}
      {showStats && (
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#374151'
          }}>
            📊 Légende des Priorités
          </h4>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ef4444'
              }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <strong style={{ color: '#ef4444' }}>Haute</strong> - Traitement prioritaire
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#f59e0b'
              }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <strong style={{ color: '#f59e0b' }}>Moyenne</strong> - Traitement standard
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981'
              }} />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                <strong style={{ color: '#10b981' }}>Basse</strong> - Traitement en arrière-plan
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimTypesOverview;
