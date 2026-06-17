import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Pencil, ChevronRight, Lock, LogOut, BriefcaseMedical } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName') || 'Dhanush';
  const weightKg = parseFloat(localStorage.getItem('userWeight')) || 74.5;
  const heightCm = parseFloat(localStorage.getItem('userHeight')) || 178;
  const selectedConditions = (localStorage.getItem('selectedConditions') || '').split(',').filter(Boolean).filter(c => c !== 'none_');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const firstLetter = userName.charAt(0).toUpperCase();

  const cardBG = {
    background: 'linear-gradient(to bottom right, #171725, #12121D, #0B0B14)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 18px rgba(167, 139, 250, 0.08)'
  };

  const MetricCard = ({ title, value, unit }) => (
    <div style={{ ...cardBG, flex: 1, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'gray' }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', color: 'white' }}>
        <span style={{ fontSize: '22px', fontWeight: 'bold' }}>{value}</span>
        <span style={{ fontSize: '14px', color: 'gray' }}>{unit}</span>
      </div>
    </div>
  );

  const SectionTitle = ({ text }) => (
    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6B7280', letterSpacing: '2.5px', marginTop: '10px' }}>
      {text}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #040407, #080812, #040407)', paddingBottom: '100px', color: 'white' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px 14px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'serif' }}>NutriFit</h1>
        <button 
          onClick={() => navigate('/help')}
          style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#A78BFA', border: 'none', color: 'black', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ?
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}></div>

      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Avatar & Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '104px', height: '104px', borderRadius: '50%', 
              background: 'linear-gradient(to bottom right, #B38BFF, #8B5CF6)',
              boxShadow: '0 0 20px rgba(167, 139, 250, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '38px', fontWeight: 'bold', color: 'white'
            }}>
              {firstLetter}
            </div>
            <button 
              onClick={() => navigate('/edit-profile')}
              style={{ 
                position: 'absolute', bottom: 0, right: 0, 
                width: '34px', height: '34px', borderRadius: '50%', 
                backgroundColor: '#A78BFA', border: 'none', color: 'black',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Pencil size={14} />
            </button>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{userName}</div>
        </div>

        {/* Weight & Height */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <MetricCard title="WEIGHT" value={weightKg.toFixed(1)} unit="kg" />
          <MetricCard title="HEIGHT" value={heightCm.toFixed(0)} unit="cm" />
        </div>

        {/* Health Profile */}
        <SectionTitle text="HEALTH PROFILE" />
        
        <button 
          onClick={() => navigate('/health')}
          style={{ ...cardBG, width: '100%', display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', color: 'white' }}
        >
          <BriefcaseMedical size={20} color="white" />
          <span style={{ fontSize: '15px', marginLeft: '12px' }}>Conditions & Injuries</span>
          <div style={{ flex: 1 }}></div>
          <div style={{ fontSize: '11px', fontWeight: '500', padding: '6px 10px', backgroundColor: 'rgba(167, 139, 250, 0.15)', borderRadius: '16px', marginRight: '10px' }}>
            {selectedConditions.length} active
          </div>
          <ChevronRight size={16} color="gray" />
        </button>

        {/* Account & App */}
        <SectionTitle text="ACCOUNT & APP" />
        
        <div style={{ ...cardBG, display: 'flex', flexDirection: 'column' }}>
          <button 
            onClick={() => navigate('/privacy')}
            style={{ display: 'flex', alignItems: 'center', padding: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'white' }}
          >
            <Lock size={20} color="white" />
            <span style={{ fontSize: '15px', marginLeft: '12px' }}>Privacy & Data</span>
            <div style={{ flex: 1 }}></div>
            <ChevronRight size={16} color="gray" />
          </button>
          
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}></div>
          
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', padding: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
          >
            <LogOut size={20} color="#EF4444" />
            <span style={{ fontSize: '15px', marginLeft: '12px', fontWeight: '500' }}>Log Out</span>
            <div style={{ flex: 1 }}></div>
          </button>
        </div>

      </div>
    </div>
  );
}
