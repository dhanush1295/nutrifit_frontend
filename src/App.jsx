import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import OTPVerification from './pages/auth/OTPVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyResetOTP from './pages/auth/VerifyResetOTP';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import ProfileSetup from './pages/profile/ProfileSetup';
import LogIntake from './pages/intake/LogIntake';
import Meals from './pages/meals/Meals';
import Coach from './pages/coach/Coach';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import PrivacyData from './pages/profile/PrivacyData';
import ChatHistory from './pages/profile/ChatHistory';
import DeleteAccount from './pages/profile/DeleteAccount';
import Help from './pages/profile/Help';
import Support from './pages/profile/Support';
import HealthFilterDashboard from './pages/health/HealthFilterDashboard';
import Notifications from './pages/notifications/Notifications';
import BottomNav from './components/BottomNav';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function MainLayout({ children }) {
  const location = useLocation();
  const hideNav = ['/login', '/signup', '/otp', '/setup', '/forgot-password', '/verify-reset-otp', '/reset-password'].includes(location.pathname);
  
  return (
    <>
      <div style={{ paddingBottom: hideNav ? 0 : '80px' }}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Auth Flow */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Flow */}
          <Route path="/setup" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/health" element={<PrivateRoute><HealthFilterDashboard /></PrivateRoute>} />
          <Route path="/intake" element={<PrivateRoute><LogIntake /></PrivateRoute>} />
          <Route path="/meals" element={<PrivateRoute><Meals /></PrivateRoute>} />
          <Route path="/coach" element={<PrivateRoute><Coach /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/privacy" element={<PrivateRoute><PrivacyData /></PrivateRoute>} />
          <Route path="/chat-history" element={<PrivateRoute><ChatHistory /></PrivateRoute>} />
          <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
          <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
