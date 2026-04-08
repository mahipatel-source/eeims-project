import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';

// auth pages
import Login from './pages/auth/login/Index';
import Register from './pages/auth/register/Index';

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
import IssueEquipment from './pages/manager/issue-equipment/Index';
import TrackReturns from './pages/manager/track-returns/Index';
import MaintenanceTracking from './pages/manager/maintenance-tracking/Index';

// technician pages
import MySchedule from './pages/technician/my-schedule/Index';
import LogMaintenance from './pages/technician/log-maintenance/Index';
import ReportDamage from './pages/technician/report-damage/Index';
import MaintenanceHistory from './pages/technician/maintenance-history/Index';

// user pages
import UserDashboard from './pages/user/dashboard/Index';
import BrowseEquipment from './pages/user/browse-equipment/Index';
import RequestEquipment from './pages/user/request-equipment/Index';
import MyRequests from './pages/user/my-requests/Index';
import MyHistory from './pages/user/my-history/Index';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* admin routes */}
          <Route path="/admin/dashboard" element={
            <RoleRoute roles={['admin', 'manager']}>
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="/admin/equipment" element={
            <RoleRoute roles={['admin', 'manager']}>
              <Equipment />
            </RoleRoute>
          } />
          <Route path="/admin/equipment/add" element={
            <RoleRoute roles={['admin', 'manager']}>
              <AddEquipment />
            </RoleRoute>
          } />
          <Route path="/admin/equipment/edit/:id" element={
            <RoleRoute roles={['admin', 'manager']}>
              <EditEquipment />
            </RoleRoute>
          } />
          <Route path="/admin/categories" element={
            <RoleRoute roles={['admin', 'manager']}>
              <Categories />
            </RoleRoute>
          } />
          <Route path="/admin/locations" element={
            <RoleRoute roles={['admin', 'manager']}>
              <Locations />
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute roles={['admin']}>
              <Users />
            </RoleRoute>
          } />
          <Route path="/admin/alerts" element={
            <RoleRoute roles={['admin', 'manager']}>
              <Alerts />
            </RoleRoute>
          } />
          <Route path="/admin/maintenance" element={
            <RoleRoute roles={['admin', 'manager']}>
              <Maintenance />
            </RoleRoute>
          } />
          <Route path="/admin/reports" element={
            <RoleRoute roles={['admin', 'manager']}>
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
          <Route path="/manager/issue-equipment" element={
            <RoleRoute roles={['manager']}>
              <IssueEquipment />
            </RoleRoute>
          } />
          <Route path="/manager/track-returns" element={
            <RoleRoute roles={['manager']}>
              <TrackReturns />
            </RoleRoute>
          } />
          <Route path="/manager/maintenance-tracking" element={
            <RoleRoute roles={['manager']}>
              <MaintenanceTracking />
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

          {/* user routes */}
          <Route path="/user/dashboard" element={
            <RoleRoute roles={['user', 'employee']}>
              <UserDashboard />
            </RoleRoute>
          } />
          <Route path="/user/browse" element={
            <RoleRoute roles={['user', 'employee']}>
              <BrowseEquipment />
            </RoleRoute>
          } />
          <Route path="/user/request/:id" element={
            <RoleRoute roles={['user', 'employee']}>
              <RequestEquipment />
            </RoleRoute>
          } />
          <Route path="/user/my-requests" element={
            <RoleRoute roles={['user', 'employee']}>
              <MyRequests />
            </RoleRoute>
          } />
          <Route path="/user/history" element={
            <RoleRoute roles={['user', 'employee']}>
              <MyHistory />
            </RoleRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;