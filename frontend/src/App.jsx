import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';

// auth pages
import Login from './pages/auth/login/Index';

// admin pages
import AdminDashboard from './pages/admin/dashboard/Index';
import Equipment from './pages/admin/equipment/Index';
import AddEquipment from './pages/admin/add-equipment/Index';
import EditEquipment from './pages/admin/edit-equipment/Index';
import Categories from './pages/admin/categories/Index';
import Locations from './pages/admin/locations/Index';
import Users from './pages/admin/users/Index';
import Alerts from './pages/admin/alerts/Index';
import Maintenance from './pages/admin/maintenance/Index';
import Reports from './pages/admin/reports/Index';

// manager pages
import ManagerDashboard from './pages/manager/dashboard/Index';
import IssuePart from './pages/manager/issue-part/Index';
import IssueHistory from './pages/manager/issue-history/Index';
import EquipmentView from './pages/manager/equipment-view/Index';

// technician pages
import MySchedule from './pages/technician/my-schedule/Index';
import LogMaintenance from './pages/technician/log-maintenance/Index';
import ReportDamage from './pages/technician/report-damage/Index';
import MaintenanceHistory from './pages/technician/maintenance-history/Index';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* admin routes */}
          <Route path="/admin/dashboard" element={
            <RoleRoute roles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="/admin/equipment" element={
            <RoleRoute roles={['admin']}>
              <Equipment />
            </RoleRoute>
          } />
          <Route path="/admin/equipment/add" element={
            <RoleRoute roles={['admin']}>
              <AddEquipment />
            </RoleRoute>
          } />
          <Route path="/admin/equipment/edit/:id" element={
            <RoleRoute roles={['admin']}>
              <EditEquipment />
            </RoleRoute>
          } />
          <Route path="/admin/categories" element={
            <RoleRoute roles={['admin']}>
              <Categories />
            </RoleRoute>
          } />
          <Route path="/admin/locations" element={
            <RoleRoute roles={['admin']}>
              <Locations />
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute roles={['admin']}>
              <Users />
            </RoleRoute>
          } />
          <Route path="/admin/alerts" element={
            <RoleRoute roles={['admin']}>
              <Alerts />
            </RoleRoute>
          } />
          <Route path="/admin/maintenance" element={
            <RoleRoute roles={['admin']}>
              <Maintenance />
            </RoleRoute>
          } />
          <Route path="/admin/reports" element={
            <RoleRoute roles={['admin']}>
              <Reports />
            </RoleRoute>
          } />

          {/* manager routes */}
          <Route path="/manager/dashboard" element={
            <RoleRoute roles={['manager']}>
              <ManagerDashboard />
            </RoleRoute>
          } />
          <Route path="/manager/issue-part" element={
            <RoleRoute roles={['manager']}>
              <IssuePart />
            </RoleRoute>
          } />
          <Route path="/manager/issue-history" element={
            <RoleRoute roles={['manager']}>
              <IssueHistory />
            </RoleRoute>
          } />
          <Route path="/manager/equipment" element={
            <RoleRoute roles={['manager']}>
              <EquipmentView />
            </RoleRoute>
          } />

          {/* technician routes */}
          <Route path="/technician/schedule" element={
            <RoleRoute roles={['technician']}>
              <MySchedule />
            </RoleRoute>
          } />
          <Route path="/technician/log-maintenance" element={
            <RoleRoute roles={['technician']}>
              <LogMaintenance />
            </RoleRoute>
          } />
          <Route path="/technician/report-damage" element={
            <RoleRoute roles={['technician']}>
              <ReportDamage />
            </RoleRoute>
          } />
          <Route path="/technician/maintenance-history" element={
            <RoleRoute roles={['technician']}>
              <MaintenanceHistory />
            </RoleRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;