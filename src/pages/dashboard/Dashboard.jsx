import { useState, useEffect } from 'react';
import { Bell, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { calculateBaseGoal, calculateHydrationGoal, getConditionRecommendations } from '../../utils/healthCalculator';
import SwapMealSheet from '../../components/SwapMealSheet';
import LogIntake from '../intake/LogIntake';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Profile Data
  const [profile, setProfile] = useState({
    name: 'User',
    age: 28,
    gender: 'Male',
    weight_kg: 74.5,
    height_cm: 178,
    conditions: [],
    diet: 'pureVegetarian',
    fastingGlucose: 110,
    carbLimit: 'moderate'
  });

  // Computed Goals
  const [baseGoal, setBaseGoal] = useState(2000);
  const [hydrationGoal, setHydrationGoal] = useState(2.0);
  const mealCalorieLimit = Math.floor(baseGoal * 0.4);
  const [eaten, setEaten] = useState(0);
  const remaining = Math.max(0, baseGoal - eaten);
  const calPercent = Math.min((eaten / baseGoal) * 100, 100);

  // Meals State
  const [meals, setMeals] = useState({ breakfast: null, lunch: null, snack: null, dinner: null });
  
  // Notification State
  const [unreadCount, setUnreadCount] = useState(0);

  // Swap Sheet State
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapType, setSwapType] = useState('');
  const [swapCurrentName, setSwapCurrentName] = useState('');

  // Log Modal State
  const [showLogIntake, setShowLogIntake] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, mealsRes, intakeRes, notifRes] = await Promise.all([
        api.get('/profile'),
        api.get('/meals/today'),
        api.get('/intake/today'),
        api.get('/notifications')
      ]);

      const p = profileRes.data.profile;
      const conds = (p.conditions || []).filter(c => c !== 'none_');
      setProfile({
        name: p.name || 'User',
        age: p.age || 28,
        gender: p.gender || 'Male',
        weight_kg: p.weight_kg || 74.5,
        height_cm: p.height_cm || 178,
        conditions: conds,
        diet: p.diet || 'pureVegetarian',
        fastingGlucose: p.fasting_glucose || 110,
        carbLimit: p.carb_limit || 'moderate'
      });

      const goal = calculateBaseGoal(p.gender || 'Male', p.weight_kg || 74.5, p.height_cm || 178, p.age || 28);
      setBaseGoal(goal);
      setHydrationGoal(calculateHydrationGoal(p.weight_kg || 74.5, conds));

      const m = mealsRes.data.meals;
      const adapt = (meal) => meal ? { ...meal, name: meal.food_name, diet: p.diet } : null;
      setMeals({
        breakfast: adapt(m['Breakfast']),
        lunch: adapt(m['Lunch']),
        snack: adapt(m['Snack']),
        dinner: adapt(m['Dinner'])
      });

      setEaten(intakeRes.data.totals.calories);
      
      if (notifRes.data && notifRes.data.unread_count !== undefined) {
        setUnreadCount(notifRes.data.unread_count);
      }

    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSwapClick = (type, currentName) => {
    setSwapType(type);
    setSwapCurrentName(currentName);
    setSwapOpen(true);
  };

  const applySwap = () => {
    fetchData();
    setSwapOpen(false);
  };

  const recommendations = getConditionRecommendations(profile.conditions, profile.diet, profile.fastingGlucose, profile.carbLimit);

  // Fake Activity Rings data
  const moveCalories = 420; const moveGoal = 500;
  const exerciseMins = 22; const exerciseGoal = 30;
  const standHours = 8; const standGoal = 12;

  const renderMealRow = (item, typeLabel) => {
    if (!item) return null;
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1A1A28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
          {item.emoji}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div className="label-tiny" style={{ letterSpacing: 0.8 }}>{typeLabel.toUpperCase()}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F0E6FF' }}>{item.name}</div>
          <div style={{ fontSize: 11, color: '#8B7AB8' }}>{item.calories} KCAL · {item.subtitle}</div>
        </div>
        <button 
          onClick={() => handleSwapClick(typeLabel, item.name)}
          style={{ padding: '6px 10px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: 14, border: 'none', color: '#A78BFA', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <span style={{ fontSize: 10 }}>🔄</span> Swap
        </button>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Top Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 20px 20px' }}>
        <h2 style={{ color: 'var(--primary-light)', fontSize: 20 }}>NutriFit</h2>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
          <Bell color="#F0E6FF" size={22} />
          {unreadCount > 0 && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 'bold' }}>{unreadCount}</div>
          )}
        </div>
      </div>

      {/* Greeting Card */}
      <div style={{ margin: '0 20px 16px', padding: 20, background: 'var(--primary-gradient)', borderRadius: 20 }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Good Morning,</p>
        <h1 style={{ fontSize: 28 }}>{profile.name}</h1>
      </div>

      {/* Calories + Ring */}
      <div className="card" style={{ margin: '0 20px 16px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div className="label-tiny" style={{ marginBottom: 8 }}>REMAINING</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: '#F0E6FF' }}>{remaining}</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>kcal</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div>
              <div className="label-tiny" style={{ fontSize: 9, color: '#4B4566', marginBottom: 2 }}>BASE GOAL</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-light-muted)' }}>{baseGoal}</div>
            </div>
            <div>
              <div className="label-tiny" style={{ fontSize: 9, color: '#4B4566', marginBottom: 2 }}>EATEN</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>{eaten}</div>
            </div>
          </div>
        </div>
        <div className="ring-container" style={{ width: 80, height: 80 }}>
          <div className="ring-bg"></div>
          <div className="ring-progress" style={{ background: 'var(--accent-gradient)', transform: 'rotate(-90deg)', clipPath: `polygon(50% 50%, 50% 0, ${calPercent < 25 ? '100% 0' : '100% 100%'}, ${calPercent < 75 ? '0 100%' : '0 0'})` }}></div>
          <span style={{ position: 'absolute', fontSize: 18 }}>🍽️</span>
        </div>
      </div>

      {/* Activity & Hydration */}
      <div style={{ display: 'flex', gap: 14, margin: '0 20px 16px' }}>
        <div className="card" style={{ flex: 1, padding: 14 }}>
          <div className="label-tiny" style={{ marginBottom: 12 }}>ACTIVITY</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
             <div style={{ width: 88, height: 88, borderRadius: '50%', border: '8px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '8px solid rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '8px solid rgba(6, 182, 212, 0.2)' }} />
                </div>
             </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: '#EF4444' }}>•</span> M</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: '#22C55E' }}>•</span> E</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: '#06B6D4' }}>•</span> S</span>
          </div>
        </div>

        <div className="card" style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, color: '#60A5FA', marginBottom: 10 }}>💧</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#F0E6FF', marginBottom: 2 }}>1.2L</div>
          <div className="label-tiny" style={{ marginBottom: 8 }}>HYDRATION</div>
          <div style={{ width: '100%', height: 5, background: '#1A1A28', borderRadius: 3, marginBottom: 8, marginTop: 'auto' }}>
            <div style={{ width: '48%', height: '100%', background: '#60A5FA', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Goal: {hydrationGoal}L</div>
        </div>
      </div>

      {/* Conditions */}
      {(recommendations.length > 0 || profile.diet !== 'pureVegetarian') && (
        <div style={{ margin: '0 20px 16px' }}>
          <h2 style={{ fontSize: 17, color: '#F0E6FF', marginBottom: 12 }}>Personalized Plan Highlights</h2>
          <div className="card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Diet Style:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '3px 8px', borderRadius: 6 }}>{profile.diet}</span>
            </div>
            
            {recommendations.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Condition Specific Guidelines:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recommendations.map(r => (
                    <div key={r.label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <HeartPulse color="#A78BFA" size={14} style={{ marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 'bold', color: 'white', marginBottom: 2 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.3 }}>{r.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Meals */}
      <div style={{ margin: '0 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, color: '#F0E6FF' }}>Today's Meals</h2>
          <button 
            onClick={() => setShowLogIntake(true)}
            style={{ padding: '7px 14px', background: 'var(--primary)', color: 'white', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 20, cursor: 'pointer' }}
          >
            Add Log
          </button>
        </div>
        
        {renderMealRow(meals.breakfast, 'Breakfast')}
        {renderMealRow(meals.lunch, 'Lunch')}
        {renderMealRow(meals.snack, 'Snack')}
        {renderMealRow(meals.dinner, 'Dinner')}
      </div>

      <SwapMealSheet 
        isOpen={swapOpen} 
        onClose={() => setSwapOpen(false)} 
        mealType={swapType} 
        calorieLimit={mealCalorieLimit} 
        selectedDate={new Date()}
        currentName={swapCurrentName} 
        onConfirm={applySwap} 
      />

      {/* Log Intake Modal */}
      {showLogIntake && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#0A0A0F', zIndex: 2000, overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px 0' }}>
            <button 
              onClick={() => {
                setShowLogIntake(false);
                fetchData(); // Refresh meals when closing
              }}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 20, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
          <LogIntake />
        </div>
      )}
    </div>
  );
}
