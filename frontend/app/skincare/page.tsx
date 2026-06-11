'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import QuizStepper from '@/components/QuizStepper'
import { SingleSelectGrid, MultiSelectGrid } from '@/components/OptionSelectors'
import SkincareRoutineDisplay from './SkincareRoutineDisplay'
import { plannerApi, type SkincareInput } from '@/lib/api'

const STEPS = ['Skin Type', 'Your Concerns', 'Budget & Details']
const ACCENT = '#c47d63'

const skinTypes = [
  { value: 'oily', label: 'Oily', emoji: '💧', description: 'Shiny, enlarged pores, prone to acne' },
  { value: 'dry', label: 'Dry', emoji: '🏜️', description: 'Tight, flaky, feels rough' },
  { value: 'combination', label: 'Combination', emoji: '☯️', description: 'Oily T-zone, dry cheeks' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸', description: 'Easily irritated, reactive skin' },
  { value: 'normal', label: 'Normal', emoji: '✨', description: 'Balanced, few imperfections' },
]

const concerns = [
  { value: 'dull_skin', label: 'Dull Skin', emoji: '😶' },
  { value: 'pigmentation', label: 'Pigmentation', emoji: '🔶' },
  { value: 'dark_spots', label: 'Dark Spots', emoji: '⚫' },
  { value: 'acne', label: 'Acne / Breakouts', emoji: '😖' },
  { value: 'anti_aging', label: 'Anti-Aging', emoji: '⌛' },
  { value: 'uneven_tone', label: 'Uneven Tone', emoji: '🎭' },
  { value: 'large_pores', label: 'Large Pores', emoji: '🔍' },
  { value: 'blackheads', label: 'Blackheads', emoji: '⚫' },
  { value: 'redness', label: 'Redness / Irritation', emoji: '🔴' },
]

const budgets = [
  { value: 'under_500', label: 'Under ₹500/mo', emoji: '💰', description: 'Essentials only' },
  { value: '500_to_1500', label: '₹500–₹1500/mo', emoji: '💵', description: 'Good mid-range routine' },
  { value: 'above_1500', label: '₹1500+/mo', emoji: '💎', description: 'Premium products' },
]

export default function SkincarePage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<Partial<SkincareInput>>({
    skin_type: undefined,
    concerns: [],
    budget: undefined,
    current_products: [],
    city: '',
    age: undefined,
  })

  const canProceed = [
    !!form.skin_type,
    (form.concerns?.length || 0) >= 1,
    !!form.budget,
  ][step]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await plannerApi.generateSkincareRoutine(form as SkincareInput)
      setPlan(result.plan)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Generation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (plan) return <SkincareRoutineDisplay plan={plan} onReset={() => setPlan(null)} />

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-display text-lg text-ink">
            Wellness<span className="text-rose-deep">AI</span>
            <span className="text-slate-400 font-sans font-normal text-sm ml-2">/ Skincare Planner</span>
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl text-ink mb-2">
            {['Know your skin', 'What bothers your skin?', 'Budget & details'][step]}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {[
              'Your skin type determines which ingredients are safe and effective for you.',
              'Select all concerns you want to address. We\'ll handle ingredient compatibility.',
              'We\'ll suggest Indian brands that fit your budget.',
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
              options={skinTypes}
              selected={form.skin_type || ''}
              onChange={(v) => setForm(f => ({ ...f, skin_type: v as any }))}
              accentColor={ACCENT}
              columns={3}
            />
          )}

          {step === 1 && (
            <MultiSelectGrid
              options={concerns}
              selected={form.concerns || []}
              onChange={(v) => setForm(f => ({ ...f, concerns: v }))}
              accentColor={ACCENT}
              columns={3}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Monthly skincare budget</p>
                <SingleSelectGrid
                  options={budgets}
                  selected={form.budget || ''}
                  onChange={(v) => setForm(f => ({ ...f, budget: v as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Age (optional)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={form.age || ''}
                    onChange={(e) => setForm(f => ({ ...f, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-orange-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">City (optional)</label>
                  <input
                    type="text"
                    placeholder="Mumbai, Delhi..."
                    value={form.city || ''}
                    onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-orange-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Current products (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cetaphil cleanser, Minimalist Niacinamide"
                  value={form.current_products?.join(', ') || ''}
                  onChange={(e) => setForm(f => ({ ...f, current_products: e.target.value ? e.target.value.split(',').map(s => s.trim()) : [] }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-orange-300"
                />
              </div>
            </div>
          )}
        </QuizStepper>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            ⚠️ {error}
          </motion.div>
        )}
      </div>
    </main>
  )
}
