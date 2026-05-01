import React from 'react';
import { Container } from 'react-bootstrap';

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  showHeader = true, 
  className = '',
  maxWidth = '1200px',
  padding = 'var(--spacing-8) 0'
}) => {
  return (
    <div className={`page-layout ${className}`}>
      {showHeader && (title || subtitle) && (
        <div className="page-header">
          <Container>
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </Container>
        </div>
      )}
      
      <div 
        className="page-content"
        style={{ 
          maxWidth, 
          margin: '0 auto', 
          padding,
          minHeight: showHeader ? 'calc(100vh - 200px)' : 'calc(100vh - 80px)'
        }}
      >
        <Container>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default PageLayout; 