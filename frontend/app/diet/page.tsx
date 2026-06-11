'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import QuizStepper from '@/components/QuizStepper'
import { SingleSelectGrid, MultiSelectGrid } from '@/components/OptionSelectors'
import DietPlanDisplay from './DietPlanDisplay'
import { plannerApi, type DietInput } from '@/lib/api'

const STEPS = ['Diet Type', 'Your Goal', 'Food Choices', 'Budget & Meals', 'Your Profile']
const ACCENT = '#527238'

const dietTypes = [
  { value: 'veg', label: 'Vegetarian', emoji: '🥦', description: 'No meat, fish or eggs' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚', description: 'Veg + eggs' },
  { value: 'non_veg', label: 'Non-Vegetarian', emoji: '🍗', description: 'All foods' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', description: 'No animal products' },
]

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', emoji: '⚡', description: 'Calorie deficit, high satiety' },
  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪', description: 'High protein, calorie surplus' },
  { value: 'maintenance', label: 'Maintenance', emoji: '⚖️', description: 'Balanced, sustainable eating' },
  { value: 'diabetes_management', label: 'Diabetes Management', emoji: '🩺', description: 'Low GI, blood sugar control' },
  { value: 'general_health', label: 'General Health', emoji: '🌿', description: 'Nutritious, wholesome eating' },
]

const foodOptions = [
  { value: 'dal', label: 'Dal (all types)', emoji: '🫘' },
  { value: 'paneer', label: 'Paneer', emoji: '🧀' },
  { value: 'eggs', label: 'Eggs', emoji: '🥚' },
  { value: 'chicken', label: 'Chicken', emoji: '🍗' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'tofu', label: 'Tofu', emoji: '⬜' },
  { value: 'sprouts', label: 'Sprouts', emoji: '🌱' },
  { value: 'dry fruits', label: 'Dry Fruits', emoji: '🥜' },
  { value: 'millets', label: 'Millets (Bajra, Jowar)', emoji: '🌾' },
  { value: 'oats', label: 'Oats', emoji: '🥣' },
  { value: 'soya', label: 'Soya Chunks', emoji: '🟤' },
  { value: 'curd', label: 'Curd / Dahi', emoji: '🥛' },
]

const budgets = [
  { value: 'under_100', label: 'Under ₹100/day', emoji: '💰', description: 'Very budget-friendly' },
  { value: '100_to_200', label: '₹100–200/day', emoji: '💵', description: 'Moderate budget' },
  { value: 'above_200', label: '₹200+/day', emoji: '💳', description: 'Premium options available' },
]

const mealsOptions = [
  { value: '3', label: '3 meals', emoji: '🍽️', description: 'Breakfast, Lunch, Dinner' },
  { value: '4', label: '4 meals', emoji: '🍽️', description: '+ one snack' },
  { value: '5', label: '5 meals', emoji: '🍽️', description: '+ two snacks (for muscle gain)' },
]

const regions = [
  'North India', 'South India', 'West India (Maharashtra/Gujarat)',
  'East India (Bengal/Odisha)', 'Punjab/Haryana', 'General India',
]

export default function DietQuiz() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<Partial<DietInput>>({
    diet_type: undefined,
    goal: undefined,
    selected_foods: [],
    budget: undefined,
    meals_per_day: 3,
    allergies: [],
    region: 'General India',
    weight_kg: undefined,
    height_cm: undefined,
    age: undefined,
  })

  const canProceed = [
    !!form.diet_type,
    !!form.goal,
    (form.selected_foods?.length || 0) >= 3,
    !!form.budget && !!form.meals_per_day,
    true, // profile step is optional
  ][step]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await plannerApi.generateDietPlan(form as DietInput)
      setPlan(result.plan)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (plan) return <DietPlanDisplay plan={plan} onReset={() => setPlan(null)} />

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-display text-lg text-ink">
            Wellness<span className="text-sage-600">AI</span>
            <span className="text-slate-400 font-sans font-normal text-sm ml-2">/ Diet Planner</span>
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl text-ink mb-2">
            {['Your diet type', 'What\'s your goal?', 'Pick your foods', 'Budget & meals', 'A little about you'][step]}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {[
              'This shapes everything — we\'ll suggest foods that match your preference.',
              'Your goal determines calorie targets and macro ratios.',
              'Select at least 3 foods you like or have easy access to.',
              'We\'ll build a plan that fits your daily budget.',
              'Optional, but helps us personalise calorie targets.',
            ][step]}
          </p>
        </motion.div>

        <QuizStepper
          steps={STEPS}
          currentStep={step}
          onNext={step === STEPS.length - 1 ? handleSubmit : () => setStep(s => s + 1)}
          onBack={() => setStep(s => s - 1)}
          canProceed={canProceed}
          isLastStep={step === STEPS.length - 1}
          isLoading={isLoading}
          accentColor={ACCENT}
        >
          {step === 0 && (
            <SingleSelectGrid
              options={dietTypes}
              selected={form.diet_type || ''}
              onChange={(v) => setForm(f => ({ ...f, diet_type: v as any }))}
              accentColor={ACCENT}
              columns={2}
            />
          )}

          {step === 1 && (
            <SingleSelectGrid
              options={goals}
              selected={form.goal || ''}
              onChange={(v) => setForm(f => ({ ...f, goal: v as any }))}
              accentColor={ACCENT}
              columns={2}
            />
          )}

          {step === 2 && (
            <div>
              <p className="text-xs text-slate-400 mb-3">
                Selected: {form.selected_foods?.length || 0} / minimum 3
              </p>
              <MultiSelectGrid
                options={foodOptions}
                selected={form.selected_foods || []}
                onChange={(v) => setForm(f => ({ ...f, selected_foods: v }))}
                accentColor={ACCENT}
                columns={3}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Daily food budget</p>
                <SingleSelectGrid
                  options={budgets}
                  selected={form.budget || ''}
                  onChange={(v) => setForm(f => ({ ...f, budget: v as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Meals per day</p>
                <SingleSelectGrid
                  options={mealsOptions}
                  selected={String(form.meals_per_day || 3)}
                  onChange={(v) => setForm(f => ({ ...f, meals_per_day: parseInt(v) as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Region (optional)</p>
                <select
                  value={form.region || 'General India'}
                  onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sage-400"
                >
                  {regions.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'age', label: 'Age', placeholder: '25', unit: 'yrs' },
                  { key: 'weight_kg', label: 'Weight', placeholder: '65', unit: 'kg' },
                  { key: 'height_cm', label: 'Height', placeholder: '165', unit: 'cm' },
                ].map(({ key, label, placeholder, unit }) => (
                  <div key={key}>
                    <label className="text-xs text-slate-500 mb-1.5 block">{label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={placeholder}
                        value={(form as any)[key] || ''}
                        onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value ? parseFloat(e.target.value) : undefined }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-sage-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Any allergies? (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. peanuts, lactose"
                  value={form.allergies?.join(', ') || ''}
                  onChange={(e) => setForm(f => ({ ...f, allergies: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [] }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-sage-400"
                />
              </div>
              <div className="bg-sage-50 rounded-2xl p-4 text-sm text-sage-700 border border-sage-200">
                <p className="font-semibold mb-1">📝 All fields optional</p>
                <p className="text-xs text-sage-600">Providing weight/height helps us calculate precise calorie targets. Skip if you prefer.</p>
              </div>
            </div>
          )}
        </QuizStepper>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </div>
    </main>
  )
}
