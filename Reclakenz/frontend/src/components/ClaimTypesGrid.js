import React from 'react';
import ClaimTypeBadge from './ClaimTypeBadge';

// Composant pour afficher tous les types de réclamations disponibles
const ClaimTypesGrid = ({ title = "Types de Réclamations", showDescriptions = true, size = 'md', variant = 'default' }) => {
  const claimTypes = [
    {
      value: 'qualite',
      icon: '🔍',
      color: '#3b82f6',
      bg: '#dbeafe',
      border: '#93c5fd',
      label: 'Problème de qualité',
      description: 'Défaut de qualité du produit, matériaux défectueux, finition insuffisante'
    },
    {
      value: 'livraison',
      icon: '🚚',
      color: '#10b981',
      bg: '#d1fae5',
      border: '#6ee7b7',
      label: 'Erreur de livraison',
      description: 'Livraison à la mauvaise adresse, colis endommagé, erreur de transport'
    },
    {
      value: 'manquant',
      icon: '📦',
      color: '#f59e0b',
      bg: '#fef3c7',
      border: '#fde68a',
      label: 'Produit manquant',
      description: 'Article non reçu, pièce manquante, commande incomplète'
    },
    {
      value: 'quantite',
      icon: '⚖️',
      color: '#8b5cf6',
      bg: '#ede9fe',
      border: '#a78bfa',
      label: 'Mauvaise quantité',
      description: 'Quantité incorrecte livrée, surplus ou manque de produits'
    },
    {
      value: 'commande',
      icon: '📋',
      color: '#ec4899',
      bg: '#fce7f3',
      border: '#f9a8d4',
      label: 'Erreur de commande',
      description: 'Mauvais produit commandé, spécifications incorrectes, erreur de référence'
    },
    {
      value: 'retard',
      icon: '⏰',
      color: '#ef4444',
      bg: '#fee2e2',
      border: '#fca5a5',
      label: 'Retard de livraison',
      description: 'Livraison en retard, délai non respecté, problème de planning'
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f1f5f9'
    }}>
      {/* En-tête */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '24px',
          fontWeight: '800',
          color: '#0f172a',
          background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h3>
        <p style={{
          margin: '0',
          fontSize: '16px',
          color: '#64748b',
          fontWeight: '500'
        }}>
          Sélectionnez le type de réclamation qui correspond à votre problème
        </p>
      </div>

      {/* Grille des types */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {claimTypes.map((type, index) => (
          <div 
            key={type.value}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '16px',
              border: `2px solid ${type.border}`,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${type.color}20`;
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
            
            {/* Contenu de la carte */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              {/* Icône */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${type.color}20 0%, ${type.color}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}>
                {type.icon}
              </div>
              
              {/* Informations */}
              <div style={{ flex: 1 }}>
                <div style={{
                  marginBottom: '12px'
                }}>
                  <ClaimTypeBadge 
                    type={type.value} 
                    size={size} 
                    variant={variant}
                  />
                </div>
                
                {showDescriptions && (
                  <p style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    fontWeight: '400'
                  }}>
                    {type.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note informative */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #0ea5e9',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#0369a1',
          fontWeight: '500'
        }}>
          💡 <strong>Conseil :</strong> Choisissez le type le plus approprié pour un traitement plus rapide de votre réclamation
        </p>
      </div>
    </div>
  );
};

export default ClaimTypesGrid;
