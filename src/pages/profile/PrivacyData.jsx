import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, User, Download, Trash2, ChevronRight } from 'lucide-react';

export default function PrivacyData() {
  const navigate = useNavigate();
  const [healthSync, setHealthSync] = useState(true);

  const handleExportData = () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      
      const conditions = user.health_conditions ? user.health_conditions.join(';') : 'None';
      const csv = `Name,Age,Weight(kg),Height(cm),Conditions\n${user.name || 'User'},${user.age || ''},${user.weight || ''},${user.height || ''},${conditions}`;
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'NutriFit_Data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const cardStyle = {
    backgroundColor: '#1C1C26',
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const IconWrapper = ({ icon: Icon, color, bgColor }) => (
    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color={color} />
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', padding: '12px 24px 100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>Privacy & Data</div>
        <div style={{ width: '24px' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Data Sharing */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '18px' }}>Data Sharing</h2>
          <div style={cardStyle}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Health Data Sync</div>
              <div style={{ fontSize: '14px', color: 'gray' }}>Share data with Apple Health</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
              <input type="checkbox" checked={healthSync} onChange={(e) => setHealthSync(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: healthSync ? '#A78BFA' : '#333', 
                transition: '.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                  transform: healthSync ? 'translateX(22px)' : 'translateX(0)'
                }}></span>
              </span>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '18px' }}>Data Management</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <button onClick={() => navigate('/chat-history')} style={{ ...cardStyle, border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <IconWrapper icon={MessageSquare} color="#A78BFA" bgColor="rgba(167, 139, 250, 0.15)" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Chat History</div>
                <div style={{ fontSize: '14px', color: 'gray' }}>View your past conversations</div>
              </div>
              <ChevronRight size={16} color="gray" />
            </button>

            <button onClick={() => navigate('/edit-profile')} style={{ ...cardStyle, border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <IconWrapper icon={User} color="#A78BFA" bgColor="rgba(167, 139, 250, 0.15)" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Personal Info</div>
                <div style={{ fontSize: '14px', color: 'gray' }}>View or update your profile</div>
              </div>
              <ChevronRight size={16} color="gray" />
            </button>

            <button onClick={handleExportData} style={{ ...cardStyle, border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <IconWrapper icon={Download} color="#A78BFA" bgColor="rgba(167, 139, 250, 0.15)" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Export Data</div>
                <div style={{ fontSize: '14px', color: 'gray' }}>Download your nutrition data</div>
              </div>
              <ChevronRight size={16} color="gray" />
            </button>

          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '18px' }}>Danger Zone</h2>
          <button onClick={() => navigate('/delete-account')} style={{ ...cardStyle, border: '1px solid rgba(239, 68, 68, 0.35)', color: 'white', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <IconWrapper icon={Trash2} color="#EF4444" bgColor="rgba(239, 68, 68, 0.15)" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Delete Account</div>
              <div style={{ fontSize: '14px', color: 'gray' }}>Permanently remove all data</div>
            </div>
            <ChevronRight size={16} color="gray" />
          </button>
        </div>

      </div>
    </div>
  );
}
