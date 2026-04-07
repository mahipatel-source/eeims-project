import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px', // Sidebar width
        marginTop: '4rem' // Navbar height
      }}>
        <Navbar />
        <main style={{
          padding: '2rem',
          backgroundColor: 'var(--light)',
          minHeight: 'calc(100vh - 4rem)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;