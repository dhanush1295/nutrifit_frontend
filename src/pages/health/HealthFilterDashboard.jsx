import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import api from '../../services/api';

export default function HealthFilterDashboard() {
  const navigate = useNavigate();
  
  const [conditions, setConditions] = useState([]);
  const [diet, setDiet] = useState('pureVegetarian');
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [safeFoods, setSafeFoods] = useState([]);
  const [avoidFoods, setAvoidFoods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, intakeRes, foodsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/intake/today'),
          api.get('/meals/foods')
        ]);
        
        const conds = (profileRes.data.profile.conditions || []).filter(c => c !== 'none_');
        setConditions(conds);
        setDiet(profileRes.data.profile.diet || 'pureVegetarian');
        setCaloriesEaten(intakeRes.data.totals.calories);

        const allFoods = foodsRes.data.foods || [];
        const condSet = new Set(conds);
        
        const safe = [];
        const avoid = [];

        for (const f of allFoods) {
          // Diet filter logic (simplified for UI display purposes)
          if (profileRes.data.profile.diet === 'pureVegetarian' && !['pureVegetarian', 'vegan'].includes(f.diet)) continue;
          if (profileRes.data.profile.diet === 'vegan' && f.diet !== 'vegan') continue;

          const fAvoid = new Set((f.avoid_for || '').split(',').map(s => s.trim()).filter(Boolean));
          let hasConflict = false;
          for (const c of fAvoid) {
            if (condSet.has(c)) {
              hasConflict = true;
              break;
            }
          }

          if (hasConflict) avoid.push(f);
          else safe.push(f);
        }

        setSafeFoods(safe.slice(0, 3));
        setAvoidFoods(avoid.slice(0, 3));

      } catch (err) {
        console.error("Failed to load health data:", err);
      }
    };
    fetchData();
  }, []);

  const giLoadPercentage = Math.min((caloriesEaten / 2000.0) * 100, 100);

  let giLoadColor = '#F87171'; // red
  let giLoadText = 'HIGH LOAD\nAVOID CARBS';
  if (giLoadPercentage < 50) {
    giLoadColor = '#34D399'; // green
    giLoadText = 'SAFE ZONE\nOPTIMAL';
  } else if (giLoadPercentage < 80) {
    giLoadColor = '#FBBF24'; // yellow
    giLoadText = 'MODERATE\nMONITOR';
  }

  const showHighSodium = conditions.includes('hypertension');
  const showStarchAlert = conditions.includes('diabetes') || caloriesEaten > 1500;

  const cardStyle = {
    backgroundColor: '#12121A',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '22px'
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', padding: '18px 20px 100px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '22px' }}>NutriFit</h1>
        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}></div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'gray', letterSpacing: '1.2px' }}>ACTIVE FILTERS</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#A78BFA', cursor: 'pointer' }} onClick={() => navigate('/setup')}>Edit</span>
        </div>
        {conditions.length === 0 ? (
          <div style={{ fontSize: '14px', color: 'gray' }}>No conditions selected</div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {conditions.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 14px', backgroundColor: 'rgba(167, 139, 250, 0.12)', borderRadius: '16px', border: '1px solid rgba(167, 139, 250, 0.35)', whiteSpace: 'nowrap' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A78BFA' }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#A78BFA' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safe Foods Card */}
      <div style={{ ...cardStyle, marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Today's safe foods</h2>
            <p style={{ fontSize: '16px', color: 'gray', margin: 0 }}>Based on current biometric data</p>
          </div>
          <div style={{ width: '58px', height: '58px', borderRadius: '18px', backgroundColor: 'rgba(52, 211, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color={giLoadColor} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'gray' }}>CUMULATIVE GI LOAD</span>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: giLoadColor }}>{Math.floor(giLoadPercentage)}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ flex: 1, height: '12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${giLoadPercentage}%`, backgroundColor: giLoadColor, borderRadius: '6px' }}></div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500', color: 'gray', whiteSpace: 'pre-line', width: '80px' }}>
              {giLoadText}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(showHighSodium || showStarchAlert) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {showHighSodium && (
            <div style={{ display: 'flex', alignItems: 'center', height: '72px', backgroundColor: '#12121A', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div style={{ width: '4px', height: '100%', backgroundColor: '#F87171' }}></div>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(248, 113, 113, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={20} color="#F87171" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>High Sodium Alert</div>
                  <div style={{ fontSize: '14px', color: 'gray' }}>Restricts Blood Pressure (BP) filter</div>
                </div>
                <ChevronRight size={16} color="gray" />
              </div>
            </div>
          )}
          {showStarchAlert && (
            <div style={{ display: 'flex', alignItems: 'center', height: '72px', backgroundColor: '#12121A', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div style={{ width: '4px', height: '100%', backgroundColor: '#FBBF24' }}></div>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(251, 191, 36, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} color="#FBBF24" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>Starch Threshold</div>
                  <div style={{ fontSize: '14px', color: 'gray' }}>Approaching Diabetes daily limit</div>
                </div>
                <ChevronRight size={16} color="gray" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Food Lists */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#34D399', letterSpacing: '1px', marginBottom: '18px' }}>RECOMMENDED</h3>
          <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {safeFoods.map(f => (
              <div key={f.name}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>{f.name}</div>
                <div style={{ fontSize: '13px', color: 'gray' }}>{f.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#F87171', letterSpacing: '1px', marginBottom: '18px' }}>AVOID</h3>
          <div style={{ ...cardStyle, padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {avoidFoods.length === 0 ? (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>No restricted foods</div>
                <div style={{ fontSize: '13px', color: 'gray' }}>All foods safe</div>
              </div>
            ) : (
              avoidFoods.map(f => (
                <div key={f.name}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>{f.name}</div>
                  <div style={{ fontSize: '13px', color: 'gray' }}>{f.subtitle}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
