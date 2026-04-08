import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import categoryService from '../../../services/categoryService';
import locationService from '../../../services/locationService';
import toast from 'react-hot-toast';

const ManagerEquipmentView = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipRes, catRes, locRes] = await Promise.all([
        equipmentService.getAll(),
        categoryService.getAll(),
        locationService.getAll()
      ]);

      setEquipment(equipRes.data || []);
      setCategories(catRes.data || []);
      setLocations(locRes.data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
      toast.error('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.categoryId === parseInt(filterCategory);
    const matchesLocation = !filterLocation || item.locationId === parseInt(filterLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryName = (categoryId) => categories.find(c => c.id === categoryId)?.name || 'N/A';
  const getLocationName = (locationId) => locations.find(l => l.id === locationId)?.name || 'N/A';

  const openDetailModal = (item) => {
    setSelectedEquipment(item);
    setShowDetail(true);
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedEquipment(null);
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading equipment...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>Equipment View</h1>
        <p style={{ color: '#6b7280' }}>View all equipment and their details</p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Search</label>
            <input
              type="text"
              placeholder="Equipment name or serial..."
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

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <div key={item.id} style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
            onClick={() => openDetailModal(item)}
            >
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border)',
                backgroundColor: item.quantity <= item.minimumStock ? '#fef2f2' : 'var(--white)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>{item.name}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.75rem'
                }}>SN: {item.serialNumber}</p>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#dbeafe',
                    color: '#0c4a6e',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>{getCategoryName(item.categoryId)}</span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>{getLocationName(item.locationId)}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Stock Level</p>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: item.quantity <= item.minimumStock ? '#dc2626' : '#111827'
                    }}>{item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Minimum</p>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#6b7280' }}>{item.minimumStock}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f9fafb' }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>Condition: <span style={{ fontWeight: '600', color: '#111827' }}>{item.condition}</span></p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetailModal(item);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '1.125rem' }}>No equipment found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedEquipment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={closeDetailModal}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}>{selectedEquipment.name}</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Serial Number</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{selectedEquipment.serialNumber}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Category</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{getCategoryName(selectedEquipment.categoryId)}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{getLocationName(selectedEquipment.locationId)}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Condition</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{selectedEquipment.condition}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Stock</p>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#dc2626' : '#16a34a'
                  }}>{selectedEquipment.quantity}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Minimum Stock</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{selectedEquipment.minimumStock}</p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Purchase Date</p>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                    {new Date(selectedEquipment.purchaseDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</p>
                  <p style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#fee2e2' : '#dcfce7',
                    color: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#991b1b' : '#166534',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {selectedEquipment.quantity <= selectedEquipment.minimumStock ? 'Low Stock' : 'In Stock'}
                  </p>
                </div>
              </div>

              {selectedEquipment.notes && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Notes</p>
                  <p style={{ fontSize: '0.95rem', color: '#111827', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.25rem' }}>
                    {selectedEquipment.notes}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={closeDetailModal}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#e5e7eb',
                  color: '#111827',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerEquipmentView;
