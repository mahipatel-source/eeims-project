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
  const [filterCondition, setFilterCondition] = useState('');
  const [loading, setLoading] = useState(true);

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
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || item.categoryId === parseInt(filterCategory);
    const matchesLocation = !filterLocation || item.locationId === parseInt(filterLocation);
    const matchesCondition = !filterCondition || item.condition === filterCondition;
    return matchesSearch && matchesCategory && matchesLocation && matchesCondition;
  });

  const getCategoryName = (categoryId) => categories.find(c => c.id === categoryId)?.name || 'N/A';
  const getLocationName = (locationId) => locations.find(l => l.id === locationId)?.name || 'N/A';

  const getConditionBadge = (condition) => {
    const styles = {
      good: { bg: '#dcfce7', color: '#166534', label: 'Good' },
      fair: { bg: '#fef3c7', color: '#92400e', label: 'Fair' },
      poor: { bg: '#fee2e2', color: '#991b1b', label: 'Poor' },
    };
    const s = styles[condition] || styles.good;
    return <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const getStockStatus = (item) => {
    const isLow = item.quantity <= item.minimumStock;
    const isOut = item.quantity === 0;
    if (isOut) return { text: 'Out of Stock', bg: '#fee2e2', color: '#991b1b' };
    if (isLow) return { text: 'Low Stock', bg: '#fef3c7', color: '#92400e' };
    return { text: 'In Stock', bg: '#dcfce7', color: '#166534' };
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading equipment...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>Equipment Inventory</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>View current stock levels (Read-only)</p>
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.5rem'
            }}>Search Equipment</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.5rem'
            }}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'white'
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
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.5rem'
            }}>Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '0.5rem'
            }}>Condition</label>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="">All Conditions</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            Equipment List ({filteredEquipment.length})
          </h3>
          <span style={{
            fontSize: '0.75rem',
            color: '#64748b',
            fontWeight: '500'
          }}>
            View Only - No Editing
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipment</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Qty</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min Stock</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Condition</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map((item, index) => {
                  const stockStatus = getStockStatus(item);
                  const isLowStock = item.quantity <= item.minimumStock;
                  return (
                    <tr key={item.id} style={{
                      borderBottom: '1px solid var(--border-light)',
                      background: isLowStock ? '#fef2f2' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => !isLowStock && (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => e.currentTarget.style.background = isLowStock ? '#fef2f2' : 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <p style={{ fontWeight: '600', color: '#0f172a', margin: 0, fontSize: '0.9375rem' }}>{item.name}</p>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        {getCategoryName(item.categoryId)}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        {getLocationName(item.locationId)}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: isLowStock ? '#dc2626' : '#0f172a'
                        }}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        {item.minimumStock}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        {getConditionBadge(item.condition)}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.6875rem',
                          fontWeight: '600',
                          background: stockStatus.bg,
                          color: stockStatus.color
                        }}>
                          {stockStatus.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#64748b'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
                    <p style={{ fontSize: '1rem', fontWeight: '500' }}>No equipment found</p>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerEquipmentView;