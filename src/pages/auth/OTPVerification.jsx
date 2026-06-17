import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      navigate('/setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div style={{ padding: 20, paddingTop: 100 }}>
      <h1 style={{ marginBottom: 10 }}>Verify Email,</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Enter the 6-digit code sent to {email}</p>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: 20 }}>{error}</div>}
      
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input 
          type="text" 
          placeholder="000000" 
          className="input-field" 
          style={{ letterSpacing: '8px', fontSize: 24, textAlign: 'center' }}
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" style={{ marginTop: 20 }}>
          Verify
        </button>
      </form>
    </div>
  );
}
