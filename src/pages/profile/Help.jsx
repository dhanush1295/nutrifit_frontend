import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Database, Headphones } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0D0B14', minHeight: '100vh', color: 'white' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 24px', paddingTop: '56px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#A78BFA', marginLeft: '12px' }}>Help</div>
      </div>
      
      <div style={{ height: '1px', backgroundColor: '#2A2440', marginBottom: '28px' }}></div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Title */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>How can we help?</h1>
          <p style={{ fontSize: '15px', color: '#9B8EC4', lineHeight: '1.5' }}>
            Search our knowledge base or browse categories below to find answers.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px' }}>
          
          <button 
            onClick={() => navigate(-1)} 
            style={{ flex: 1, backgroundColor: '#1A1530', borderRadius: '16px', border: '1px solid #2A2440', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', minHeight: '160px' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#2A2440', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto' }}>
              <UserCircle size={20} color="#A78BFA" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>Account</div>
            <div style={{ fontSize: '13px', color: '#9B8EC4', lineHeight: '1.4' }}>Privacy, security, and profile.</div>
          </button>

          <button 
            onClick={() => navigate('/privacy')} 
            style={{ flex: 1, backgroundColor: '#1A1530', borderRadius: '16px', border: '1px solid #2A2440', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', minHeight: '160px' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#2A2440', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto' }}>
              <Database size={20} color="#A78BFA" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>Your data</div>
            <div style={{ fontSize: '13px', color: '#9B8EC4', lineHeight: '1.4' }}>Manage your data.</div>
          </button>

        </div>

      </div>

      {/* Support Card */}
      <div style={{ padding: '40px 20px', marginTop: 'auto' }}>
        <div style={{ backgroundColor: '#1A1530', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#2A2440', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={24} color="#9B8EC4" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>Still need help?</h2>
            <p style={{ fontSize: '14px', color: '#9B8EC4', lineHeight: '1.5' }}>
              Our specialist team is available 24/7 for medical and technical support.
            </p>
          </div>
          <button 
            onClick={() => navigate('/support')}
            style={{ width: '100%', height: '52px', backgroundColor: 'rgba(124, 58, 237, 0.5)', borderRadius: '14px', border: 'none', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
          >
            Contact Support
          </button>
        </div>
      </div>

    </div>
  );
}
