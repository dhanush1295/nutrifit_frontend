import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import SwapMealSheet from '../../components/SwapMealSheet';
import { calculateBaseGoal } from '../../utils/healthCalculator';

export default function Meals() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedMeal, setExpandedMeal] = useState('Breakfast');
  const [meals, setMeals] = useState({ breakfast: null, lunch: null, snack: null, dinner: null });
  const [eaten, setEaten] = useState(0);
  const [eatenMeals, setEatenMeals] = useState([]);
  const [baseGoal, setBaseGoal] = useState(2000);
  const [userDiet, setUserDiet] = useState('pureVegetarian');
  
  // Swap Sheet State
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapType, setSwapType] = useState('');
  const [swapCurrentName, setSwapCurrentName] = useState('');

  const mealCalorieLimit = Math.floor(baseGoal * 0.4);
  const remaining = Math.max(0, baseGoal - eaten);
  const calPercent = Math.min((eaten / baseGoal) * 100, 100);

  const fetchData = async () => {
    try {
      // 1. Fetch Profile for goals
      const profileRes = await api.get('/profile');
      const p = profileRes.data.user;
      setUserDiet(p.diet || 'pureVegetarian');
      const goal = calculateBaseGoal(p.gender, p.weight_kg, p.height_cm, p.age);
      setBaseGoal(goal);

      // 2. Fetch Meals for selected date
      const dStr = selectedDate.toISOString().split('T')[0];
      const mealsRes = await api.get(`/meals/date/${dStr}`);
      const m = mealsRes.data.meals;
      
      // Adapt backend structure to frontend structure
      const adapt = (meal) => meal ? { ...meal, name: meal.food_name, diet: p.diet } : null;

      setMeals({
        breakfast: adapt(m['Breakfast']),
        lunch: adapt(m['Lunch']),
        snack: adapt(m['Snack']),
        dinner: adapt(m['Dinner'])
      });

      // 3. Fetch Intake to see what's eaten
      const intakeRes = await api.get('/intake/today');
      setEaten(intakeRes.data.totals.calories);
      setEatenMeals(intakeRes.data.entries.map(e => e.meal_name));

    } catch (err) {
      console.error("Failed to load meals data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleSwapClick = (type, currentName) => {
    setSwapType(type);
    setSwapCurrentName(currentName);
    setSwapOpen(true);
  };

  const applySwap = () => {
    fetchData();
    setSwapOpen(false);
  };

  const handleEatenClick = async (item) => {
    try {
      await api.post('/intake/log', {
        meal_name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        portion_g: 150,
        date: selectedDate.toISOString().split('T')[0]
      });
      fetchData();
    } catch (err) {
      console.error("Failed to log intake:", err);
    }
  };

  // Generate date array
  const today = new Date();
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  const getAccentColor = (type) => {
    switch (type) {
      case 'Breakfast': return '#FBBF24';
      case 'Lunch': return '#34D399';
      case 'Snack': return '#60A5FA';
      case 'Dinner': return '#A78BFA';
      default: return '#A78BFA';
    }
  };

  const ExpandableCard = ({ type, item }) => {
    if (!item) return null;
    const isExpanded = expandedMeal === type;
    const isEaten = eatenMeals.includes(item.name);
    const accent = getAccentColor(type);

    return (
      <div style={{
        background: 'linear-gradient(to bottom right, #141423, #0B0B13)',
        borderRadius: '22px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        marginBottom: '18px',
        opacity: isEaten ? 0.5 : 1
      }}>
        {/* Header */}
        <div 
          onClick={() => setExpandedMeal(isExpanded ? null : type)}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', cursor: 'pointer' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${accent}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            {item.emoji}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: accent, letterSpacing: '0.8px' }}>{type.toUpperCase()}</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ fontSize: '12px', color: 'gray' }}>{item.calories} kcal · {item.subtitle}</div>
          </div>
          <div style={{ color: 'gray' }}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: '14px' }}></div>
            
            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', padding: '7px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>🇮🇳 Indian</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', padding: '7px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>
                {item.diet === 'vegan' ? '🌱 Vegan' : item.diet === 'pureVegetarian' ? '🥦 Vegetarian' : '🍗 Non-Veg'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', padding: '7px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{item.calories} kcal</div>
            </div>

            {/* Macros */}
            <div style={{ display: 'flex', backgroundColor: '#0F0F18', borderRadius: '10px', padding: '10px 0', marginBottom: '14px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#34D399' }}>{item.protein}g</div>
                <div style={{ fontSize: '10px', color: 'gray' }}>Protein</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}></div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#60A5FA' }}>{item.carbs}g</div>
                <div style={{ fontSize: '10px', color: 'gray' }}>Carbs</div>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }}></div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#FBBF24' }}>{item.fat}g</div>
                <div style={{ fontSize: '10px', color: 'gray' }}>Fat</div>
              </div>
            </div>

            {/* Ingredients */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'gray', letterSpacing: '1px', marginBottom: '6px' }}>INGREDIENTS</div>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.4' }}>{item.ingredients}</div>
            </div>

            {/* Swap and Eaten Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); if (!isEaten) handleEatenClick(item); }}
                disabled={isEaten}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '10px 0', backgroundColor: isEaten ? 'rgba(255,255,255,0.05)' : 'rgba(52, 211, 153, 0.1)', color: isEaten ? 'gray' : '#34D399', border: isEaten ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: isEaten ? 'default' : 'pointer' }}
              >
                <span>{isEaten ? '✅' : '🍽️'}</span> Eaten
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); if (!isEaten) handleSwapClick(type, item.name); }}
                disabled={isEaten}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '10px 0', backgroundColor: isEaten ? 'rgba(255,255,255,0.05)' : `${accent}1A`, color: isEaten ? 'gray' : accent, border: isEaten ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${accent}4D`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: isEaten ? 'default' : 'pointer' }}
              >
                <RefreshCw size={14} /> Swap This Meal
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #040407, #070710, #040407)', paddingBottom: '100px', color: 'white' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 16px 14px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>NutriFit</h1>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.12)', padding: '5px 10px', borderRadius: '10px' }}>
          {userDiet === 'pureVegetarian' ? 'Pure Vegetarian' : userDiet === 'vegan' ? 'Vegan' : 'Non-Vegetarian'}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Goal Summary Card */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '18px', background: 'linear-gradient(to bottom right, #141423, #0B0B13)', borderRadius: '22px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '18px' }}>
          
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '8px solid rgba(255, 255, 255, 0.08)' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '8px solid #A78BFA', clipPath: `polygon(50% 50%, 50% 0, ${calPercent < 25 ? '100% 0' : '100% 100%'}, ${calPercent < 75 ? '0 100%' : '0 0'})`, transform: 'rotate(-90deg)' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{Math.floor(remaining)}</span>
              <span style={{ fontSize: '11px', color: 'gray' }}>LEFT</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '17px', color: 'gray' }}>Daily Goal</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{Math.floor(baseGoal)} kcal</div>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'gray' }}>P</span>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#A78BFA' }}>65g</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'gray' }}>C</span>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#A78BFA' }}>280g</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'gray' }}>F</span>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#A78BFA' }}>55g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
          {dates.map((d, i) => {
            const isSelected = selectedDate.getDate() === d.getDate();
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            return (
              <div 
                key={i} 
                onClick={() => setSelectedDate(d)}
                style={{ flexShrink: 0, width: '64px', height: '104px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px', borderRadius: '32px', backgroundColor: isSelected ? '#A78BFA' : '#11111B', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '11px', fontWeight: '500', color: isSelected ? 'black' : 'gray' }}>{days[d.getDay()]}</div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: isSelected ? 'black' : 'white' }}>{d.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Meals */}
        <ExpandableCard type="Breakfast" item={meals.breakfast} />
        <ExpandableCard type="Lunch" item={meals.lunch} />
        <ExpandableCard type="Snack" item={meals.snack} />
        <ExpandableCard type="Dinner" item={meals.dinner} />

      </div>

      <SwapMealSheet 
        isOpen={swapOpen} 
        onClose={() => setSwapOpen(false)} 
        mealType={swapType} 
        calorieLimit={mealCalorieLimit} 
        selectedDate={selectedDate}
        currentName={swapCurrentName} 
        onConfirm={applySwap} 
      />
    </div>
  );
}
