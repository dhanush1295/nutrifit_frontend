import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        const p = res.data.profile;
        setName(p.name || '');
        setAge(p.age || '');
        setGender(p.gender || 'Male');
        setHeight(p.height_cm || '');
        setWeight(p.weight_kg || '');
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/profile', {
        name,
        age: parseInt(age) || null,
        gender,
        height_cm: parseFloat(height) || null,
        weight_kg: parseFloat(weight) || null
      });
      navigate('/profile');
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle = {
    backgroundColor: '#1C1C26',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const inputStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    outline: 'none',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '12px',
    color: 'gray',
    fontWeight: '600',
    letterSpacing: '1px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: 'white', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 24px', paddingTop: '56px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={24} />
          <span style={{ fontSize: '16px' }}>Cancel</span>
        </button>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Profile</div>
        <button onClick={handleSave} disabled={loading} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', padding: 0, fontSize: '16px', fontWeight: 'bold' }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: 'linear-gradient(to bottom right, #B38BFF, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', fontWeight: 'bold', color: 'white'
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <button style={{ 
              position: 'absolute', bottom: '0', right: '0', 
              width: '36px', height: '36px', borderRadius: '50%', 
              backgroundColor: '#A78BFA', border: '4px solid black', color: 'black',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={inputContainerStyle}>
            <div style={labelStyle}>FULL NAME</div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...inputContainerStyle, flex: 1 }}>
              <div style={labelStyle}>AGE</div>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ ...inputContainerStyle, flex: 1 }}>
              <div style={labelStyle}>GENDER</div>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ ...inputStyle, WebkitAppearance: 'none' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...inputContainerStyle, flex: 1 }}>
              <div style={labelStyle}>HEIGHT (CM)</div>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ ...inputContainerStyle, flex: 1 }}>
              <div style={labelStyle}>WEIGHT (KG)</div>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={inputStyle} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
