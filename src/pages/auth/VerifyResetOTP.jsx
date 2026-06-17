import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function VerifyResetOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Missing email address. Please go back and try again.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/verify-otp', { email, code: otp });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Verification failed. Please try again.');
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
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>Verify Code</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 style={{ marginBottom: 6 }}>Check Your Email</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.4 }}>
          Enter the 6-digit verification code sent to <strong style={{color:'white'}}>{email}</strong>
        </p>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input 
            type="text" 
            placeholder="000000" 
            className="input-field" 
            style={{ letterSpacing: '8px', fontSize: 24, textAlign: 'center', padding: '16px' }}
            maxLength={6}
            value={otp}
            onChange={e => setOtp(e.target.value)}
            disabled={isLoading}
            required
          />

          {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 10 }} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
}
