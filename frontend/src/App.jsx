import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RoleRoute from './components/layout/RoleRoute';

// auth pages
import Login from './pages/auth/login/Index';
import Register from './pages/auth/register/Index';
import StaffLogin from './pages/auth/staff-login/Index';

// admin pages
import AdminDashboard from './pages/admin/dashboard/Index';
import Equipment from './pages/admin/equipment/Index';
import AddEquipment from './pages/admin/add-equipment/Index';
import EditEquipment from './pages/admin/edit-equipment/Index';
import Categories from './pages/admin/categories/Index';
import Locations from './pages/admin/locations/Index';
import Users from './pages/admin/users/Index';
import Employees from './pages/admin/employees/Index';
import Alerts from './pages/admin/alerts/Index';
import Maintenance from './pages/admin/maintenance/Index';
import Reports from './pages/admin/reports/Index';

// manager pages
import ManagerDashboard from './pages/manager/dashboard/Index';
import IssuePart from './pages/manager/issue-part/Index';
import IssueHistory from './pages/manager/issue-history/Index';
import EquipmentView from './pages/manager/equipment-view/Index';
import IssueEquipment from './pages/manager/issue-equipment/Index';
import ManagerReports from './pages/manager/reports/Index';
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
      <Toaster position="top-right" />
      <Routes>
          {/* public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<div style={{ padding: '2rem' }}>Unauthorized Access</div>} />

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
          <Route path="/admin/employees" element={
            <RoleRoute roles={['admin']}>
              <Employees />
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
              <IssueEquipment />
            </RoleRoute>
          } />
          <Route path="/manager/issue-history" element={
            <RoleRoute roles={['manager']}>
              <IssueHistory />
            </RoleRoute>
          } />
          <Route path="/manager/equipment-view" element={
            <RoleRoute roles={['manager']}>
              <EquipmentView />
            </RoleRoute>
          } />
          <Route path="/manager/pending-requests" element={
            <RoleRoute roles={['manager']}>
              <IssuePart />
            </RoleRoute>
          } />
          <Route path="/manager/reports" element={
            <RoleRoute roles={['manager']}>
              <ManagerReports />
            </RoleRoute>
          } />
          <Route path="/manager/equipment" element={<Navigate to="/manager/equipment-view" replace />} />
          <Route path="/manager/issue-equipment" element={<Navigate to="/manager/issue-part" replace />} />
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
            <RoleRoute roles={['employee']}>
              <UserDashboard />
            </RoleRoute>
          } />
          <Route path="/user/browse" element={
            <RoleRoute roles={['employee']}>
              <BrowseEquipment />
            </RoleRoute>
          } />
          <Route path="/user/request/:id" element={
            <RoleRoute roles={['employee']}>
              <RequestEquipment />
            </RoleRoute>
          } />
          <Route path="/user/my-requests" element={
            <RoleRoute roles={['employee']}>
              <MyRequests />
            </RoleRoute>
          } />
          <Route path="/user/history" element={
            <RoleRoute roles={['employee']}>
              <MyHistory />
            </RoleRoute>
          } />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
