import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/setup');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Sign up failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '20px' }}>
        <button onClick={() => navigate('/login')} style={{ background: 'var(--bg-card)', border: 'none', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft color="var(--text-main)" size={20} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>NutriFit</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 style={{ marginBottom: 6 }}>Create Account</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.4 }}>
          Start your personalized nutrition journey today
        </p>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-container">
            <Mail color="var(--text-muted)" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Lock color="var(--text-muted)" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
            Sign Up
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 24 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Already have an account?</span>
          <button className="link-btn" onClick={() => navigate('/login')} style={{ textTransform: 'uppercase' }}>Log in</button>
        </div>
      </div>
    </div>
  );
}
