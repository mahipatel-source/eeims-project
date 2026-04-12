import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../../../components/layout/AdminLayout';
import Loader from '../../../components/ui/Loader';
import categoryService from '../../../services/categoryService';
import equipmentService from '../../../services/equipmentService';
import locationService from '../../../services/locationService';

const fieldLabelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#0f172a',
  marginBottom: '0.5rem',
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.8rem 0.9rem',
  border: hasError ? '1px solid #dc2626' : '1px solid #dbe3ef',
  borderRadius: '12px',
  fontSize: '0.95rem',
  color: '#0f172a',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
});

const errorStyle = {
  color: '#dc2626',
  fontSize: '0.75rem',
  marginTop: '0.4rem',
};

const helperStyle = {
  color: '#64748b',
  fontSize: '0.8rem',
  marginTop: '0.4rem',
};

const initialFormData = {
  name: '',
  description: '',
  categoryId: '',
  locationId: '',
  quantity: '0',
  minimumStock: '5',
  condition: 'good',
};

const AddEquipment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFormOptions();
  }, []);

  const loadFormOptions = async () => {
    try {
      setLoading(true);
      const [categoriesRes, locationsRes] = await Promise.all([
        categoryService.getAll(),
        locationService.getAll(),
      ]);

      setCategories(categoriesRes.data || []);
      setLocations(locationsRes.data || []);
    } catch (error) {
      console.error('Error loading equipment form options:', error);
      toast.error('Failed to load categories and locations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }

    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    if (formData.minimumStock === '' || Number(formData.minimumStock) < 1) {
      newErrors.minimumStock = 'Minimum stock must be at least 1';
    }

    if (!['good', 'fair', 'poor'].includes(formData.condition)) {
      newErrors.condition = 'Please select a valid condition';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      locationId: formData.locationId ? Number(formData.locationId) : null,
      quantity: Number(formData.quantity),
      minimumStock: Number(formData.minimumStock),
      condition: formData.condition,
    };

    try {
      setSaving(true);
      await equipmentService.create(payload);
      toast.success('Equipment added successfully');
      setFormData(initialFormData);
      navigate('/admin/equipment');
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast.error(error.response?.data?.message || 'Failed to add equipment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader text="Loading equipment form..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              color: '#0f172a',
            }}>
              Add New Equipment
            </h1>
            <p style={{
              margin: '0.5rem 0 0',
              color: '#64748b',
              fontSize: '0.95rem',
            }}>
              Create a new electrical equipment item for your inventory catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/equipment')}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              border: '1px solid #dbe3ef',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Back to Equipment
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
            padding: '2rem',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={fieldLabelStyle}>
                Equipment Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter equipment name"
                style={inputStyle(errors.name)}
              />
              {errors.name ? <p style={errorStyle}>{errors.name}</p> : null}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={fieldLabelStyle}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter equipment description"
                rows={3}
                style={{
                  ...inputStyle(errors.description),
                  resize: 'vertical',
                  minHeight: '110px',
                }}
              />
            </div>

            <div>
              <label style={fieldLabelStyle}>Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                style={inputStyle(errors.categoryId)}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>Location</label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                style={inputStyle(errors.locationId)}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Quantity <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter current quantity"
                style={inputStyle(errors.quantity)}
              />
              {errors.quantity ? <p style={errorStyle}>{errors.quantity}</p> : null}
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Minimum Stock Level <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="number"
                name="minimumStock"
                min="1"
                value={formData.minimumStock}
                onChange={handleInputChange}
                placeholder="Alert when stock falls below this number"
                style={inputStyle(errors.minimumStock)}
              />
              {errors.minimumStock ? (
                <p style={errorStyle}>{errors.minimumStock}</p>
              ) : (
                <p style={helperStyle}>
                  System will create an alert when quantity drops below this value.
                </p>
              )}
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Condition <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                style={inputStyle(errors.condition)}
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
              {errors.condition ? <p style={errorStyle}>{errors.condition}</p> : null}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}>
            <button
              type="button"
              onClick={() => navigate('/admin/equipment')}
              disabled={saving}
              style={{
                padding: '0.9rem 1.3rem',
                borderRadius: '12px',
                border: '1px solid #dbe3ef',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.9rem 1.4rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Equipment'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddEquipment;
