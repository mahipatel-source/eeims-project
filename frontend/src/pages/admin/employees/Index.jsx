import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import userService from '../../../services/userService';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      const allUsers = response.data || [];
      setEmployees(allUsers.filter((user) => user.role === 'employee'));
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      setSubmitting(true);
      await userService.delete(selectedEmployee.id);
      toast.success('Employee deleted successfully');
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div>Loading employees...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Employee Records</h1>
            
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--light)' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
              Employees ({filteredEmployees.length})
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500', color: '#111827' }}>{employee.name}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{employee.email}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          textTransform: 'capitalize',
                        }}>
                          {employee.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => openDeleteModal(employee)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }}
        title="Delete Employee"
        size="sm"
      >
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Are you sure you want to permanently delete <strong style={{ color: '#111827' }}>{selectedEmployee?.name}</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedEmployee(null);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: '500',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Employees;
