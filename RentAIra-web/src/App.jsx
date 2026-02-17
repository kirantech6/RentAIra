import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LocaleProvider } from './context/LocaleContext';
import ProtectedRoute, { PublicLayout } from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import MaintenancePage from './pages/MaintenancePage';
import PaymentsPage from './pages/PaymentsPage';
import Profile from './pages/Profile';
import MessagesPage from './pages/MessagesPage';
import Landlords from './pages/Landlords';

import { app, analytics } from './lib/firebase';

function App() {
  console.log("Firebase initialized:", app.name);
  return (
    <AuthProvider>
      <LocaleProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 text-slate-900">
              <Routes>
                {/* Public Routes with Layout */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/listings" element={<Listings />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/landlords" element={<Landlords />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<MessagesPage />} />
                </Route>

                <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}

export default App;
