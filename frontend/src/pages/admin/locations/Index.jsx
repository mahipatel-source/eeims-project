import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import locationService from '../../../services/locationService';
import equipmentService from '../../../services/equipmentService';
import Modal from '../../../components/ui/Modal';
import EmptyState from '../../../components/ui/EmptyState';
import Loader from '../../../components/ui/Loader';
import toast from 'react-hot-toast';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const [locationResponse, equipmentResponse] = await Promise.all([
        locationService.getAll(),
        equipmentService.getAll(),
      ]);
      setLocations(locationResponse.data || []);
      setEquipment(equipmentResponse.data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.description && location.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Location name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Location name must be at least 2 characters';
    }

    // Check for duplicate names (excluding current location when editing)
    const existingLocation = locations.find(loc =>
      loc.name.toLowerCase() === formData.name.toLowerCase().trim() &&
      (!selectedLocation || loc.id !== selectedLocation.id)
    );
    if (existingLocation) {
      errors.name = 'A location with this name already exists';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await locationService.create({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      toast.success('Location added successfully');
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      loadLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error(error.response?.data?.message || 'Failed to add location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await locationService.update(selectedLocation.id, {
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      toast.success('Location updated successfully');
      setShowEditModal(false);
      setSelectedLocation(null);
      setFormData({ name: '', description: '' });
      loadLocations();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error(error.response?.data?.message || 'Failed to update location');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;

    setSubmitting(true);
    try {
      await locationService.delete(selectedLocation.id);
      toast.success('Location deleted successfully');
      setShowDeleteModal(false);
      setSelectedLocation(null);
      loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error(error.response?.data?.message || 'Failed to delete location');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      description: location.description || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (location) => {
    setSelectedLocation(location);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <Loader text="Loading locations..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>Location Management</h1>
            <p style={{ color: '#6b7280' }}>Manage storage locations for your equipment inventory.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            ➕ Add Location
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Locations Table */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--light)'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Locations ({filteredLocations.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>#</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Equipment Count</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location, index) => (
                    <tr key={location.id} style={{ borderBottom: '1px solid var(--border)', backgroundColor: index % 2 ? '#fcfdff' : '#ffffff' }}>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500', color: '#111827' }}>{location.name}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>
                        {location.description || 'No description'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#111827', fontWeight: '600' }}>
                        {equipment.filter((item) => item.locationId === location.id).length}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(location)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(location)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '1.5rem' }}>
                      <EmptyState
                        title={searchTerm ? 'No locations found' : 'No locations found'}
                        description={searchTerm ? 'Try a different search term.' : 'Add your first location to organize equipment.'}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Location"
      >
        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Location Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter location name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: formErrors.name ? '1px solid #dc2626' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            />
            {formErrors.name && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {formErrors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter location description"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--white)',
                color: '#374151',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Location"
      >
        <form onSubmit={handleEdit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Location Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter location name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: formErrors.name ? '1px solid #dc2626' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            />
            {formErrors.name && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {formErrors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter location description"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--white)',
                color: '#374151',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Updating...' : 'Update Location'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedLocation(null);
        }}
        title="Delete Location"
      >
        <div>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
            Are you sure you want to delete the location "{selectedLocation?.name}"? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedLocation(null);
              }}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--white)',
                color: '#374151',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? 'Deleting...' : 'Delete Location'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Locations;
