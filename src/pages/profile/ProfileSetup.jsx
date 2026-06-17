import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import api from '../../services/api';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState([]);
  const [diet, setDiet] = useState('pureVegetarian');

  const availableConditions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'pcos', label: 'PCOS' },
    { id: 'thyroid', label: 'Thyroid' },
    { id: 'ckd', label: 'CKD' },
    { id: 'cholesterol', label: 'Cholesterol' },
    { id: 'ibs', label: 'IBS' },
    { id: 'none_', label: 'None' }
  ];

  const dietOptions = [
    { id: 'pureVegetarian', label: 'Pure Vegetarian', subtitle: 'VEG ONLY', emoji: '🥗' },
    { id: 'nonVegetarian', label: 'Non-Vegetarian', subtitle: 'INCLUDES MEAT', emoji: '🍗' },
    { id: 'vegan', label: 'Vegan', subtitle: 'PLANT BASED', emoji: '🌱' }
  ];

  const toggleCondition = (c) => {
    if (c === 'none_') {
      setConditions(['none_']);
      return;
    }
    setConditions(prev => {
      const filtered = prev.filter(x => x !== 'none_');
      return filtered.includes(c) ? filtered.filter(x => x !== c) : [...filtered, c];
    });
  };

  const handleSave = async () => {
    try {
      await api.put('/profile/health', {
        conditions: conditions.join(','),
        diet: diet,
        fasting_glucose: 110,
        carb_limit: 'moderate'
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/dashboard'); // Proceed anyway for demo
    }
  };

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      {/* Header */}
      <h1 style={{ marginBottom: 8, fontSize: 26 }}>Any health conditions?</h1>
      <p style={{ fontSize: 14, color: '#9B8EC4', lineHeight: 1.4, marginBottom: 24 }}>
        Select any conditions so we can tailor your nutrition plan to support your health goals.
      </p>

      {/* Conditions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {availableConditions.map(c => {
          const isSelected = conditions.includes(c.id);
          return (
            <button 
              key={c.id}
              onClick={() => toggleCondition(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px',
                borderRadius: 22,
                border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(124, 58, 237, 0.35)'}`,
                background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                color: isSelected ? 'white' : 'var(--text-light-muted)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isSelected ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {isSelected && <Check size={12} strokeWidth={3} />}
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="label-tiny" style={{ marginBottom: 6 }}>DIET PREFERENCE</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
        {dietOptions.map(d => {
          const isSelected = diet === d.id;
          return (
            <div 
              key={d.id}
              onClick={() => setDiet(d.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                borderRadius: 16,
                border: `1px solid ${isSelected ? 'rgba(124, 58, 237, 0.55)' : 'rgba(124, 58, 237, 0.2)'}`,
                background: isSelected ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: isSelected ? 'rgba(124, 58, 237, 0.25)' : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>
                {d.emoji}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: isSelected ? 'white' : 'var(--text-light-muted)', marginBottom: 3 }}>
                  {d.label}
                </div>
                <div style={{ 
                  display: 'inline-block',
                  fontSize: 10, fontWeight: 800, color: 'var(--success)',
                  padding: '2px 7px', borderRadius: 5,
                  background: 'rgba(52, 211, 153, 0.12)'
                }}>
                  {d.subtitle}
                </div>
              </div>

              {isSelected && (
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={14} color="white" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Build my health plan
      </button>
    </div>
  );
}
