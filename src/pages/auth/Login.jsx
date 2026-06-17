import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      const res = await api.post('/auth/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user?.full_name || 'User');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', marginBottom: '20px' }}>
        <button style={{ background: 'var(--bg-card)', border: 'none', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft color="var(--text-main)" size={20} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-light)' }}>NutriFit</span>
        <div style={{ width: 36, height: 36 }} />
      </div>

      <div style={{ padding: '0 24px' }}>
        <h1 style={{ marginBottom: 6 }}>Welcome Back!</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.4 }}>
          Sign in to continue your nutrition journey
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-container">
            <Mail color="var(--text-muted)" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
            />
          </div>



          {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="link-btn" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password?</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 24 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Don't have an account?</span>
          <button className="link-btn" onClick={() => navigate('/signup')} style={{ textTransform: 'uppercase' }}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
