import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Send } from 'lucide-react';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0D0B14', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }}></div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Contact Support</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer', padding: '4px' }}>
          <ChevronDown size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'gray', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>SUBJECT</label>
          <input type="text" placeholder="What do you need help with?" style={{ width: '100%', padding: '16px', backgroundColor: '#1A1530', border: '1px solid #2A2440', borderRadius: '12px', color: 'white', fontSize: '15px' }} />
        </div>
        
        <div>
          <label style={{ fontSize: '12px', color: 'gray', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>MESSAGE</label>
          <textarea placeholder="Describe your issue in detail..." style={{ width: '100%', padding: '16px', backgroundColor: '#1A1530', border: '1px solid #2A2440', borderRadius: '12px', color: 'white', fontSize: '15px', minHeight: '150px', resize: 'vertical' }}></textarea>
        </div>

        <button style={{ width: '100%', padding: '16px', backgroundColor: '#A78BFA', border: 'none', borderRadius: '14px', color: 'black', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginTop: '20px' }}>
          <Send size={18} />
          Send Message
        </button>
      </div>
    </div>
  );
}
