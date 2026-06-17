import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Missing email address. Please restart the process.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/reset-password', { email, new_password: password });
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/login')}
          style={{ background: 'var(--bg-card)', border: 'none', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft color="var(--text-main)" size={20} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>Create Password</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 style={{ marginBottom: 6 }}>New Password</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.4 }}>
          Your new password must be unique from those previously used.
        </p>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-container">
            <Lock color="var(--text-muted)" size={20} />
            <input 
              type="password" 
              placeholder="New Password (min 8 chars)" 
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading || !!success}
              required
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}
          {success && <div style={{ color: 'var(--primary-light)', fontSize: 14, fontWeight: 'bold' }}>{success} Redirecting...</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }} disabled={isLoading || !!success}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
