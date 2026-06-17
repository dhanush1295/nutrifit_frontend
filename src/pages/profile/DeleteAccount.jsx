import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

export default function DeleteAccount() {
  const navigate = useNavigate();

  const handleDelete = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', padding: '12px 24px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Delete Account</div>
        <div style={{ width: '24px' }}></div>
      </div>
      
      <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
        <AlertTriangle size={48} color="#EF4444" />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Are you absolutely sure?</h2>
        <p style={{ fontSize: '14px', color: 'gray', lineHeight: '1.5' }}>
          This action cannot be undone. This will permanently delete your account, remove your health profile, and wipe all your logged data.
        </p>
        <button onClick={handleDelete} style={{ marginTop: '12px', width: '100%', padding: '16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Yes, delete my account
        </button>
        <button onClick={() => navigate(-1)} style={{ width: '100%', padding: '16px', backgroundColor: 'transparent', color: 'white', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
