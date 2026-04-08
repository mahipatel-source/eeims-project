import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import equipmentService from '../../../services/equipmentService';
import categoryService from '../../../services/categoryService';
import UserLayout from '../../../components/layout/UserLayout';
import toast from 'react-hot-toast';

const BrowseEquipment = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [equipRes, catRes] = await Promise.all([
        equipmentService.getAll(),
        categoryService.getAll(),
      ]);
      setEquipment(equipRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error('Failed to load equipment');
    } finally {
      setIsLoading(false);
    }
  };

  // filter equipment based on search and category
  const filteredEquipment = equipment.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory ? item.categoryId === parseInt(selectedCategory) : true;
    return matchSearch && matchCategory;
  });

  const getConditionColor = (condition) => {
    const colors = { good: '#16a34a', fair: '#d97706', poor: '#dc2626' };
    return colors[condition] || '#64748b';
  };

  if (isLoading) return <UserLayout><div style={styles.loading}>Loading...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Browse Equipment</h1>
          <p style={styles.subtitle}>Find and request electrical equipment for your work.</p>
        </div>

        {/* search and filter */}
        <div style={styles.filterRow}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={styles.select}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* equipment grid */}
        {filteredEquipment.length === 0 ? (
          <div style={styles.empty}>No equipment found</div>
        ) : (
          <div style={styles.grid}>
            {filteredEquipment.map(item => (
              <div key={item.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{item.name}</h3>
                  <span style={{ ...styles.conditionBadge, background: getConditionColor(item.condition) }}>
                    {item.condition}
                  </span>
                </div>

                <p style={styles.cardDesc}>{item.description || 'No description available'}</p>

                <div style={styles.cardInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Category:</span>
                    <span style={styles.infoValue}>{item.Category?.name || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Location:</span>
                    <span style={styles.infoValue}>{item.Location?.name || 'N/A'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Available:</span>
                    <span style={{ ...styles.infoValue, color: item.quantity > 0 ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                      {item.quantity} units
                    </span>
                  </div>
                </div>

                <button
                  style={{ ...styles.requestBtn, opacity: item.quantity === 0 ? 0.5 : 1 }}
                  onClick={() => navigate(`/user/request/${item.id}`)}
                  disabled={item.quantity === 0}
                >
                  {item.quantity === 0 ? 'Out of Stock' : 'Request Equipment'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const styles = {
  container: { padding: '24px' },
  loading: { padding: '40px', textAlign: 'center' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  filterRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  select: { padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', minWidth: '160px', outline: 'none' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', flex: 1 },
  conditionBadge: { padding: '3px 10px', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: '500', marginLeft: '8px' },
  cardDesc: { fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: '1.5' },
  cardInfo: { marginBottom: '16px' },
  infoItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  infoLabel: { fontSize: '13px', color: '#64748b' },
  infoValue: { fontSize: '13px', color: '#1e293b' },
  requestBtn: { width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
};

export default BrowseEquipment;