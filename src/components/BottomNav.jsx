import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Calendar, MessageCircle, User, Heart } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: <Home size={24} />, label: 'Home' },
    { path: '/health', icon: <Heart size={24} />, label: 'Health' },
    { path: '/meals', icon: <Calendar size={24} />, label: 'Meals' },
    { path: '/coach', icon: <MessageCircle size={24} />, label: 'Coach' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      backgroundColor: 'rgba(13, 13, 24, 0.9)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px 10px',
      zIndex: 1000
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <div 
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              gap: '4px'
            }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: isActive ? '600' : '400' }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
