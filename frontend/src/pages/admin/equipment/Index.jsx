import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import equipmentService from '../../../services/equipmentService';
import categoryService from '../../../services/categoryService';
import locationService from '../../../services/locationService';
import toast from 'react-hot-toast';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, categoriesRes, locationsRes] = await Promise.all([
        equipmentService.getAll(),
        categoryService.getAll(),
        locationService.getAll()
      ]);

      setEquipment(equipmentRes.data || []);
      setCategories(categoriesRes.data || []);
      setLocations(locationsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEquipment) return;

    try {
      await equipmentService.delete(selectedEquipment.id);
      toast.success('Equipment deleted successfully');
      setShowDeleteModal(false);
      setSelectedEquipment(null);
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === parseInt(selectedCategory);
    const matchesLocation = !selectedLocation || item.locationId === parseInt(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getStatusBadge = (item) => {
    const isLowStock = item.quantity <= item.minimumStock;
    const isOutOfStock = item.quantity === 0;

    if (isOutOfStock) {
      return { text: 'Out of Stock', color: '#dc2626', bgColor: '#fef2f2' };
    } else if (isLowStock) {
      return { text: 'Low Stock', color: '#d97706', bgColor: '#fffbeb' };
    } else {
      return { text: 'In Stock', color: '#16a34a', bgColor: '#f0fdf4' };
    }
  };

  const getConditionBadge = (condition) => {
    const conditions = {
      good: { color: '#16a34a', bgColor: '#f0fdf4' },
      fair: { color: '#d97706', bgColor: '#fffbeb' },
      poor: { color: '#dc2626', bgColor: '#fef2f2' }
    };
    return conditions[condition] || conditions.good;
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
          <div>Loading equipment...</div>
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
            }}>Equipment Management</h1>
            <p style={{ color: '#6b7280' }}>Manage your equipment inventory and track stock levels.</p>
          </div>
          <Link
            to="/admin/equipment/add"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--white)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
          >
            ➕ Add Equipment
          </Link>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              minWidth: '150px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              minWidth: '150px'
            }}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>

        {/* Equipment Table */}
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
              Equipment List ({filteredEquipment.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Location</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Condition</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.length > 0 ? (
                  filteredEquipment.map((item) => {
                    const statusBadge = getStatusBadge(item);
                    const conditionBadge = getConditionBadge(item.condition);

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '500', color: '#111827' }}>{item.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              {item.description || 'No description'}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {categories.find(cat => cat.id === item.categoryId)?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {locations.find(loc => loc.id === item.locationId)?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#111827' }}>{item.quantity}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Min: {item.minimumStock}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: conditionBadge.bgColor,
                            color: conditionBadge.color,
                            textTransform: 'capitalize'
                          }}>
                            {item.condition}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: statusBadge.bgColor,
                            color: statusBadge.color
                          }}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <Link
                              to={`/admin/equipment/edit/${item.id}`}
                              style={{
                                padding: '0.375rem 0.75rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                borderRadius: '0.25rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedEquipment(item);
                                setShowDeleteModal(true);
                              }}
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{
                      padding: '3rem',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      No equipment found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEquipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Delete Equipment
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
              Are you sure you want to delete "{selectedEquipment.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEquipment(null);
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
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Equipment;
