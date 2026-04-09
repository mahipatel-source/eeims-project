const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: { bg: '#e5e7eb', color: '#374151' },
    success: { bg: '#dcfce7', color: '#15803d' },
    warning: { bg: '#fef3c7', color: '#92400e' },
    danger: { bg: '#fee2e2', color: '#991b1b' },
    info: { bg: '#dbeafe', color: '#0c4a6e' },
    primary: { bg: '#dbeafe', color: '#1d4ed8' }
  };

  const sizes = {
    sm: { padding: '0.125rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
    lg: { padding: '0.375rem 1rem', fontSize: '1rem' }
  };

  const style = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: style.bg,
      color: style.color,
      borderRadius: '0.25rem',
      fontWeight: '600',
      ...sizeStyle
    }}>
      {children}
    </span>
  );
};

export default Badge;
