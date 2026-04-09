const EmptyState = ({ icon = '📭', title = 'No data found', description, action }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      borderRadius: 'var(--radius)',
      border: '1px dashed #d1d5db'
    }}>
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</span>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#111827',
        margin: '0 0 0.5rem'
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: '0 0 1.5rem',
          maxWidth: '300px'
        }}>
          {description}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
