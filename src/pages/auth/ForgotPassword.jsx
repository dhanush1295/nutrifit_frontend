import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      // Navigate to OTP verification and pass email in state
      navigate('/verify-reset-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'var(--bg-card)', border: 'none', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft color="var(--text-main)" size={20} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>Password Reset</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 style={{ marginBottom: 6 }}>Forgot Password</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.4 }}>
          Enter your registered email address to receive a verification code.
        </p>

        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-container">
            <Mail color="var(--text-muted)" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
