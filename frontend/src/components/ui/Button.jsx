const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  type = 'button',
  fullWidth = false,
  style = {}
}) => {
  const variants = {
    primary: { bg: '#2563eb', color: '#fff', hover: '#1d4ed8' },
    secondary: { bg: '#6b7280', color: '#fff', hover: '#4b5563' },
    success: { bg: '#16a34a', color: '#fff', hover: '#15803d' },
    danger: { bg: '#dc2626', color: '#fff', hover: '#b91c1c' },
    warning: { bg: '#f59e0b', color: '#fff', hover: '#d97706' },
    outline: { bg: 'transparent', color: '#2563eb', border: '#2563eb', hover: '#dbeafe' },
    ghost: { bg: 'transparent', color: '#374151', hover: '#f3f4f6' }
  };

  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' }
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#9ca3af' : v.bg,
        color: v.color,
        border: v.border ? `1px solid ${v.border}` : 'none',
        borderRadius: '0.375rem',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        transition: 'all 0.15s',
        width: fullWidth ? '100%' : 'auto',
        ...s,
        ...style
      }}
      onMouseOver={(e) => {
        if (!disabled) e.target.style.backgroundColor = v.hover;
      }}
      onMouseOut={(e) => {
        if (!disabled) e.target.style.backgroundColor = v.bg;
      }}
    >
      {children}
    </button>
  );
};

export default Button;
