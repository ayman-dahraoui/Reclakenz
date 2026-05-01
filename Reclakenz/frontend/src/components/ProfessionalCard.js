import React from 'react';

const ProfessionalCard = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className = '', 
  onClick,
  hoverable = true,
  shadow = 'md',
  border = true,
  padding = 'var(--spacing-6)',
  headerPadding = 'var(--spacing-4) var(--spacing-6)',
  bodyPadding = 'var(--spacing-6)',
  footerPadding = 'var(--spacing-4) var(--spacing-6)',
  header,
  footer,
  badge,
  status,
  ...props 
}) => {
  const cardClasses = [
    'professional-card',
    className,
    hoverable ? 'hoverable' : '',
    onClick ? 'clickable' : '',
    `shadow-${shadow}`,
    border ? 'with-border' : 'no-border'
  ].filter(Boolean).join(' ');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'approved':
        return 'success';
      case 'danger':
      case 'rejected':
      case 'error':
        return 'danger';
      case 'warning':
      case 'pending':
        return 'warning';
      case 'info':
      case 'processing':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      style={{ padding }}
      {...props}
    >
      {(title || subtitle || icon || badge) && (
        <div className="card-header" style={{ padding: headerPadding }}>
          {header || (
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center gap-3">
                {icon && (
                  <div className="card-icon">
                    {icon}
                  </div>
                )}
                <div>
                  {title && <h3 className="card-title">{title}</h3>}
                  {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
              </div>
              {(badge || status) && (
                <div className="card-badges">
                  {badge && <span className="badge badge-primary">{badge}</span>}
                  {status && (
                    <span className={`badge badge-${getStatusColor(status)}`}>
                      {status}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="card-body" style={{ padding: bodyPadding }}>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer" style={{ padding: footerPadding }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default ProfessionalCard; 