import React from 'react';
import { ProfessionalCard } from './index';

const DashboardStats = ({ stats = [] }) => {
  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case 'users':
        return <i className="fas fa-users"></i>;
      case 'claims':
        return <i className="fas fa-file-alt"></i>;
      case 'pending':
        return <i className="fas fa-clock"></i>;
      case 'approved':
        return <i className="fas fa-check-circle"></i>;
      case 'rejected':
        return <i className="fas fa-times-circle"></i>;
      case 'revenue':
        return <i className="fas fa-dollar-sign"></i>;
      case 'quality':
        return <i className="fas fa-award"></i>;
      default:
        return <i className="fas fa-chart-bar"></i>;
    }
  };

  const getColorForType = (type) => {
    switch (type?.toLowerCase()) {
      case 'users':
        return 'primary';
      case 'claims':
        return 'info';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'revenue':
        return 'success';
      case 'quality':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <ProfessionalCard
          key={index}
          className={`stat-card stat-${getColorForType(stat.type)}`}
          title={stat.value}
          subtitle={stat.label}
          icon={getIconForType(stat.type)}
          hoverable
          shadow="md"
        >
          {stat.description && (
            <p className="stat-description text-muted">
              {stat.description}
            </p>
          )}
          {stat.trend && (
            <div className={`stat-trend ${stat.trend > 0 ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${stat.trend > 0 ? 'up' : 'down'}`}></i>
              <span>{Math.abs(stat.trend)}%</span>
            </div>
          )}
        </ProfessionalCard>
      ))}
    </div>
  );
};

export default DashboardStats; 