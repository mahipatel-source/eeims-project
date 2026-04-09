const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: { width: '20px', height: '20px', border: '2px' },
    md: { width: '40px', height: '40px', border: '3px' },
    lg: { width: '60px', height: '60px', border: '4px' }
  };

  const s = sizes[size] || sizes.md;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem'
    }}>
      <div style={{
        width: s.width,
        height: s.height,
        border: `${s.border} solid #e5e7eb`,
        borderTop: `${s.border} solid #2563eb`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && (
        <p style={{
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
