import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import AssignmentDetail from './pages/AssignmentDetail';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import AdminUsers from './pages/AdminUsers';
import AdminStats from './pages/AdminStats';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Rrugët Publike */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rrugët e Mbrojtura (Kërkojnë Autentikim) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/assignments/:id" element={<AssignmentDetail />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/bookings" element={<Bookings />} />

                  {/* Rrugë Ekskluzive për Administratorin */}
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/stats" element={<AdminStats />} />
                  </Route>
                </Route>
              </Route>

              {/* Rruga e parazgjedhur */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
