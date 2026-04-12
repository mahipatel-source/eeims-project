import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ManagerLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        marginTop: 'var(--topbar-height)',
        minWidth: 0,
      }}>
        <Navbar />
        <main style={{
          padding: '1.75rem',
          backgroundColor: 'var(--light)',
          minHeight: 'calc(100vh - var(--topbar-height))'
        }}>
          <div style={{ width: '100%', maxWidth: 'var(--content-max-width)', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
