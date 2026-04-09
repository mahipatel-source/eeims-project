import Sidebar from './Sidebar';
import Navbar from './Navbar';

const TechnicianLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px',
        marginTop: '4rem'
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

export default TechnicianLayout;
