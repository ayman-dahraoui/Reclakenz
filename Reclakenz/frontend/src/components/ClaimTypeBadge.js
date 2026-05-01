import React from 'react';

// Composant de badge de type de réclamation professionnel et réutilisable
const ClaimTypeBadge = ({ type, size = 'md', variant = 'default' }) => {
  const getTypeConfig = (type) => {
    switch (type) {
      case 'qualite':
        return { 
          icon: '🔍', 
          color: '#3b82f6', 
          bg: '#dbeafe', 
          border: '#93c5fd', 
          label: 'Problème de qualité',
          description: 'Défaut de qualité du produit'
        };
      case 'livraison':
        return { 
          icon: '🚚', 
          color: '#10b981', 
          bg: '#d1fae5', 
          border: '#6ee7b7', 
          label: 'Erreur de livraison',
          description: 'Problème lors de la livraison'
        };
      case 'manquant':
        return { 
          icon: '📦', 
          color: '#f59e0b', 
          bg: '#fef3c7', 
          border: '#fde68a', 
          label: 'Produit manquant',
          description: 'Article non reçu'
        };
      case 'quantite':
        return { 
          icon: '⚖️', 
          color: '#8b5cf6', 
          bg: '#ede9fe', 
          border: '#a78bfa', 
          label: 'Mauvaise quantité',
          description: 'Quantité incorrecte livrée'
        };
      case 'commande':
        return { 
          icon: '📋', 
          color: '#ec4899', 
          bg: '#fce7f3', 
          border: '#f9a8d4', 
          label: 'Erreur de commande',
          description: 'Problème avec la commande'
        };
      case 'retard':
        return { 
          icon: '⏰', 
          color: '#ef4444', 
          bg: '#fee2e2', 
          border: '#fca5a5', 
          label: 'Retard de livraison',
          description: 'Livraison en retard'
        };
      default:
        return { 
          icon: '❓', 
          color: '#6b7280', 
          bg: '#f3f4f6', 
          border: '#d1d5db', 
          label: type || 'Autre problème',
          description: 'Problème non spécifié'
        };
    }
  };

  const config = getTypeConfig(type);
  
  // Styles selon la taille
  const sizeStyles = {
    sm: {
      padding: '4px 8px',
      fontSize: '10px',
      iconSize: '10px',
      borderRadius: '8px'
    },
    md: {
      padding: '6px 12px',
      fontSize: '11px',
      iconSize: '12px',
      borderRadius: '12px'
    },
    lg: {
      padding: '8px 16px',
      fontSize: '12px',
      iconSize: '14px',
      borderRadius: '16px'
    }
  };

  // Styles selon la variante
  const variantStyles = {
    default: {
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
      boxShadow: 'none'
    },
    outlined: {
      background: 'transparent',
      color: config.color,
      border: `2px solid ${config.color}`,
      boxShadow: 'none'
    },
    filled: {
      background: config.color,
      color: 'white',
      border: `1px solid ${config.color}`,
      boxShadow: `0 2px 8px ${config.color}30`
    }
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <span 
      style={{
        ...currentSize,
        ...currentVariant,
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s ease',
        cursor: 'default',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
        if (variant === 'filled') {
          e.target.style.boxShadow = `0 4px 16px ${config.color}50`;
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        if (variant === 'filled') {
          e.target.style.boxShadow = `0 2px 8px ${config.color}30`;
        }
      }}
      title={config.description}
    >
      <span style={{ fontSize: currentSize.iconSize }}>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ClaimTypeBadge;
