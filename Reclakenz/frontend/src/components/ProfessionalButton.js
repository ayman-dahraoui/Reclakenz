import React from 'react';

const ProfessionalButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  href,
  target,
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'w-100' : '',
    loading ? 'loading' : '',
    className
  ].filter(Boolean).join(' ');

  const iconElement = icon && (
    <span className={`btn-icon ${iconPosition === 'right' ? 'ms-2' : 'me-2'}`}>
      {icon}
    </span>
  );

  const content = (
    <>
      {loading && (
        <span className="btn-spinner me-2">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </span>
      )}
      {iconPosition === 'left' && iconElement}
      <span className="btn-text">{children}</span>
      {iconPosition === 'right' && iconElement}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default ProfessionalButton; 