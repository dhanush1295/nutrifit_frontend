import { useState, useEffect } from 'react';
import { Shuffle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function SwapMealSheet({ 
  isOpen, 
  onClose, 
  mealType, 
  calorieLimit,
  selectedDate, 
  currentName, 
  onConfirm 
}) {
  const [candidate, setCandidate] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      shuffle();
    }
  }, [isOpen, mealType]);

  const shuffle = async () => {
    setIsAnimating(true);
    setError(null);
    try {
      const dStr = selectedDate.toISOString().split('T')[0];
      const res = await api.post('/meals/swap', {
        meal_type: mealType,
        date: dStr,
        current_food: currentName,
        calorie_limit: calorieLimit
      });
      setCandidate({
        ...res.data.meal,
        name: res.data.meal.food_name
      });
    } catch (err) {
      console.error(err);
      setCandidate(null);
      setError(err.response?.data?.error || "Failed to fetch alternative.");
    } finally {
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const handleConfirm = async () => {
    try {
      const dStr = selectedDate.toISOString().split('T')[0];
      await api.post('/meals/swap', {
        meal_type: mealType,
        date: dStr,
        current_food: currentName,
        new_food: candidate.name,
        calorie_limit: calorieLimit
      });
      onConfirm(candidate);
    } catch (err) {
      console.error("Failed to save swap", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0A0A0F', borderRadius: '24px 24px 0 0',
        padding: '24px 20px 40px', zIndex: 1000,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        transform: 'translateY(0)', transition: 'transform 0.3s'
      }}>
        
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 24px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, color: 'white', marginBottom: 4 }}>Swap {mealType}</h2>
            <p style={{ fontSize: 13, color: '#8B7AB8' }}>Under {calorieLimit} kcal • Filter-safe</p>
          </div>
          <button 
            onClick={shuffle}
            style={{ 
              width: 44, height: 44, borderRadius: 12, background: 'rgba(124, 58, 237, 0.15)',
              border: 'none', color: 'var(--primary-light)', cursor: 'pointer',
              transform: isAnimating ? 'rotate(360deg)' : 'rotate(0)',
              transition: 'transform 0.4s ease-in-out',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Shuffle size={18} />
          </button>
        </div>

        {candidate ? (
          <div className="card" style={{ background: '#12121A', padding: 20, borderColor: 'rgba(124, 58, 237, 0.2)' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1A1A28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
                {candidate.emoji}
              </div>
              <div>
                <h3 style={{ fontSize: 17, color: 'white', marginBottom: 4 }}>{candidate.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--primary-light)' }}>{candidate.subtitle}</p>
              </div>
            </div>

            <div style={{ display: 'flex', background: '#0F0F18', borderRadius: 12, padding: '10px 0', marginBottom: 16 }}>
               {[
                 { label: 'Calories', val: candidate.calories, unit: 'kcal', color: '#A78BFA' },
                 { label: 'Protein', val: candidate.protein, unit: 'g', color: '#34D399' },
                 { label: 'Carbs', val: candidate.carbs, unit: 'g', color: '#60A5FA' },
                 { label: 'Fat', val: candidate.fat, unit: 'g', color: '#FBBF24' }
               ].map((m, i) => (
                 <div key={m.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                   <div style={{ fontSize: 16, fontWeight: 'bold', color: m.color, marginBottom: 2 }}>{m.val}</div>
                   <div style={{ fontSize: 9, fontWeight: 500, color: '#8B7AB8' }}>{m.label} {m.unit}</div>
                 </div>
               ))}
            </div>

            <div className="label-tiny" style={{ marginBottom: 6 }}>INGREDIENTS</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, marginBottom: 20 }}>
              {candidate.ingredients}
            </p>

            <button 
              onClick={handleConfirm}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                background: 'var(--primary-gradient)', color: 'white', fontSize: 16, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={18} /> Use This Meal
            </button>
          </div>
        ) : (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, color: 'white', marginBottom: 8 }}>No Alternatives Found</h3>
            <p style={{ fontSize: 13, color: '#8B7AB8', lineHeight: 1.4 }}>
              {error || "No safe options found within your calorie limit and health filters. Try adjusting your filters."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
