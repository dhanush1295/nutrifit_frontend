export function calculateBaseGoal(gender, weightKg, heightCm, age) {
  let bmr = 0;
  if (gender === 'Male' || gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'Female' || gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 80;
  }
  return Math.round(bmr * 1.375);
}

export function calculateHydrationGoal(weightKg, conditions) {
  let goal = weightKg * 0.033;
  if (conditions.includes('ckd') || conditions.includes('CKD')) {
      goal = Math.min(goal, 1.5);
  } else if (conditions.includes('diabetes') || conditions.includes('Diabetes')) {
      goal += 0.5;
  }
  return Math.min(Math.max(goal, 1.5), 4.0).toFixed(1);
}

export function getConditionRecommendations(conditions, diet, fastingGlucose, carbLimit) {
  const results = [];
  
  if (conditions.includes('diabetes')) {
      const carbGrams = carbLimit === 'strict' ? '<130g/day' : '175g/day';
      results.push({
          label: 'Diabetes',
          text: `Keep Fasting Glucose target around ${fastingGlucose} mg/dL. Strict limit carb intake to ${carbGrams}.`
      });
  }
  if (conditions.includes('hypertension')) {
      results.push({
          label: 'Hypertension',
          text: 'Sodium intake limited to <2,300 mg/day. Increase intake of green leafy vegetables and potassium-rich fruits.'
      });
  }
  if (conditions.includes('pcos')) {
      results.push({
          label: 'PCOS',
          text: 'Focus on complex carbs and lean proteins to manage insulin resistance. Avoid processed sugars.'
      });
  }
  if (conditions.includes('thyroid')) {
      results.push({
          label: 'Thyroid',
          text: 'Ensure sufficient intake of selenium, zinc, and iodine. Coordinate goitrogenic food intake with your dietitian.'
      });
  }
  if (conditions.includes('ckd')) {
      results.push({
          label: 'CKD',
          text: 'Monitor and cap protein intake. Avoid excess sodium and phosphorus in your meals.'
      });
  }
  if (conditions.includes('cholesterol')) {
      results.push({
          label: 'Cholesterol',
          text: 'Limit saturated fats to less than 7% of daily calories. Focus on soluble fibers (oatmeal, legumes).'
      });
  }
  if (conditions.includes('ibs')) {
      results.push({
          label: 'IBS',
          text: 'Track food triggers in your daily digest. Follow a low-FODMAP protocol for active flare-ups.'
      });
  }

  return results;
}
