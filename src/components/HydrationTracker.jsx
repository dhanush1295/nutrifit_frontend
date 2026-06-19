import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function HydrationTracker({ onClose, hydrationL, setHydrationL }) {
  const [drankMask, setDrankMask] = useState(() => {
    const saved = localStorage.getItem('drankMask');
    return saved ? parseInt(saved, 10) : 0;
  });

  const periods = [
    { label: "8:00 AM", desc: "Morning Start", amount: 0.5 },
    { label: "11:00 AM", desc: "Mid-Morning", amount: 0.5 },
    { label: "2:00 PM", desc: "Afternoon", amount: 0.5 },
    { label: "5:00 PM", desc: "Evening", amount: 0.5 },
    { label: "8:00 PM", desc: "Night", amount: 0.5 }
  ];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastHydrationDate = localStorage.getItem('lastHydrationDate');
    if (lastHydrationDate !== today) {
      localStorage.setItem('lastHydrationDate', today);
      localStorage.setItem('drankMask', '0');
      localStorage.setItem('hydrationL', '0');
      setDrankMask(0);
      setHydrationL(0.0);
    }
  }, [setHydrationL]);

  const isDrank = (index) => {
    return (drankMask & (1 << index)) !== 0;
  };

  const toggleDrank = (index, amount) => {
    let currentMask = drankMask;
    let currentHydration = hydrationL;

    if (isDrank(index)) {
      currentMask &= ~(1 << index);
      currentHydration = Math.max(0, currentHydration - amount);
    } else {
      currentMask |= (1 << index);
      currentHydration += amount;
    }

    setDrankMask(currentMask);
    setHydrationL(currentHydration);
    localStorage.setItem('drankMask', currentMask.toString());
    localStorage.setItem('hydrationL', currentHydration.toString());
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Handle bar */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 24 }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'white', margin: 0 }}>Hydration Tracker</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'gray' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {periods.map((period, i) => {
          const drank = isDrank(i);
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              background: '#12121A',
              borderRadius: 16,
              border: drank ? '1px solid transparent' : '1px solid rgba(96, 165, 250, 0.15)',
              opacity: drank ? 0.6 : 1.0,
              gap: 16
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: drank ? 'rgba(96, 165, 250, 0.2)' : '#1A1A28',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <div style={{ fontSize: 20, color: drank ? '#60A5FA' : 'gray' }}>💧</div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: drank ? 'gray' : 'white' }}>{period.label}</div>
                <div style={{ fontSize: 13, color: 'gray' }}>{period.desc}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: '600', color: drank ? 'gray' : '#60A5FA' }}>
                  {period.amount.toFixed(1)}L
                </div>
                <button
                  onClick={() => toggleDrank(i, period.amount)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 12,
                    background: drank ? 'rgba(255,255,255,0.05)' : '#60A5FA',
                    color: drank ? 'gray' : 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {drank ? 'Drank' : 'Drink'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
