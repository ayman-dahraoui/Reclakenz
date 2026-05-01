import React from 'react';

const ProfessionalTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  className = '',
  striped = true,
  hover = true,
  responsive = true,
  size = 'md',
  bordered = false,
  ...props
}) => {
  const tableClasses = [
    'table',
    'professional-table',
    striped ? 'table-striped' : '',
    hover ? 'table-hover' : '',
    bordered ? 'table-bordered' : '',
    `table-${size}`,
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3 text-muted">Chargement des données...</p>
      </div>
    );
  }

  const TableComponent = (
    <table className={tableClasses} {...props}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className={column.headerClassName || ''}
              style={column.headerStyle || {}}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center py-5">
              <div className="empty-state">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p className="text-muted">{emptyMessage}</p>
              </div>
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className={row.className || ''}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={column.cellClassName || ''}
                  style={column.cellStyle || {}}
                >
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return responsive ? (
    <div className="table-responsive">
      {TableComponent}
    </div>
  ) : (
    TableComponent
  );
};

export default ProfessionalTable; 