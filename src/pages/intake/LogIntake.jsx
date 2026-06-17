import { useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { globalFoodDatabase } from '../../utils/FoodDatabase';
import { useNavigate } from 'react-router-dom';

export default function LogIntake() {
  const [search, setSearch] = useState('');
  const [portion, setPortion] = useState(150);
  const [selectedFood, setSelectedFood] = useState(globalFoodDatabase[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const filteredFoods = useMemo(() => {
    if (!search) return globalFoodDatabase;
    return globalFoodDatabase.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const currentCarbs = Math.round((selectedFood.carbs * portion) / 100);
  const currentProtein = Math.round((selectedFood.protein * portion) / 100);
  const currentFat = Math.round((selectedFood.fat * portion) / 100);
  const currentCals = Math.round((selectedFood.calories * portion) / 100);

  const handleLog = () => {
    let eaten = parseFloat(localStorage.getItem('caloriesEaten')) || 0;
    eaten += currentCals;
    localStorage.setItem('caloriesEaten', eaten.toString());
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <h1 style={{ marginBottom: 20 }}>Log Food</h1>
      
      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
          <Search color="var(--text-muted)" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search for Indian cuisine, snacks..." 
          style={{ width: '100%', height: 52, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '0 40px 0 48px', color: 'white', fontSize: 14, outline: 'none' }}
          value={search}
          onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
        />
        <div style={{ position: 'absolute', right: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
          <ChevronDown color="var(--text-muted)" size={20} />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, maxHeight: 200, overflowY: 'auto', zIndex: 10 }}>
            {filteredFoods.length > 0 ? filteredFoods.map(f => (
              <div 
                key={f.name}
                onClick={() => { setSelectedFood(f); setShowDropdown(false); setSearch(f.name); }}
                style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span style={{ fontSize: 20 }}>{f.emoji}</span>
                <span style={{ fontSize: 14, color: 'white' }}>{f.name}</span>
              </div>
            )) : (
              <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>No foods found</div>
            )}
          </div>
        )}
      </div>

      {/* Selected Food Macro Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>{selectedFood.emoji}</span>
          <h2 style={{ fontSize: 18 }}>{selectedFood.name}</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>{selectedFood.calories} kcal per 100g</p>
        
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Carbs', val: currentCarbs, color: '#60A5FA' },
            { label: 'Protein', val: currentProtein, color: '#34D399' },
            { label: 'Fats', val: currentFat, color: '#FBBF24' }
          ].map(macro => (
            <div key={macro.label} style={{ flex: 1, background: 'var(--bg-primary)', padding: 12, borderRadius: 12, textAlign: 'center' }}>
              <div className="label-tiny" style={{ marginBottom: 4 }}>{macro.label}</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: macro.color }}>{macro.val}g</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="label-tiny">PORTION SIZE</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--primary-light)' }}>{currentCals} kcal</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <input 
            type="range" 
            min="50" max="500" step="10" 
            value={portion} 
            onChange={e => setPortion(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--primary-light)' }} 
          />
          <div style={{ fontWeight: 'bold', width: 45, textAlign: 'right' }}>{portion}g</div>
        </div>
      </div>

      <button className="btn-primary" onClick={handleLog}>
        <CheckCircle2 size={18} style={{ marginRight: 8 }} />
        Log {currentCals} kcal
      </button>
    </div>
  );
}
