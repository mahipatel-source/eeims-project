const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error,
  disabled = false,
  name,
  id,
  style = {}
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={id || name}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}
        >
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <select
        name={name}
        id={id || name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: error ? '1px solid #dc2626' : '1px solid #d1d5db',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          backgroundColor: disabled ? '#f3f4f6' : '#fff',
          color: '#111827',
          outline: 'none',
          transition: 'border-color 0.15s',
          cursor: 'pointer',
          ...style
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{
          margin: '0.25rem 0 0',
          fontSize: '0.75rem',
          color: '#dc2626'
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
