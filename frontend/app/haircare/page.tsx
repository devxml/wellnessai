'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import QuizStepper from '@/components/QuizStepper'
import { SingleSelectGrid, MultiSelectGrid } from '@/components/OptionSelectors'
import HaircarePlanDisplay from './HaircarePlanDisplay'
import { plannerApi, type HaircareInput } from '@/lib/api'

const STEPS = ['Hair Type', 'Scalp & Texture', 'Your Concerns', 'Routine & Budget']
const ACCENT = '#3b5a9a'

const hairTypes = [
  { value: 'straight', label: 'Straight', emoji: '〰️', description: 'Lies flat, usually oily at roots' },
  { value: 'wavy', label: 'Wavy', emoji: '〜', description: 'S-shaped waves, medium volume' },
  { value: 'curly', label: 'Curly', emoji: '🌀', description: 'Defined curls, prone to frizz' },
  { value: 'coily', label: 'Coily / Kinky', emoji: '🌪️', description: 'Tight coils, very fragile' },
]

const porosityOptions = [
  {
    value: 'low',
    label: 'Low Porosity',
    emoji: '💧',
    description: 'Water beads on hair, takes long to dry, products sit on top',
  },
  {
    value: 'medium',
    label: 'Medium Porosity',
    emoji: '✅',
    description: 'Hair absorbs and retains moisture well',
  },
  {
    value: 'high',
    label: 'High Porosity',
    emoji: '🧽',
    description: 'Absorbs moisture fast but loses it quickly, feels rough',
  },
]

const scalpTypes = [
  { value: 'oily', label: 'Oily Scalp', emoji: '🫧', description: 'Greasy within a day of washing' },
  { value: 'dry', label: 'Dry Scalp', emoji: '🏜️', description: 'Tight, itchy, flaky' },
  { value: 'normal', label: 'Normal', emoji: '✨', description: 'Balanced, no major issues' },
  { value: 'sensitive', label: 'Sensitive', emoji: '🌸', description: 'Easily irritated by products' },
  { value: 'dandruff_prone', label: 'Dandruff-Prone', emoji: '❄️', description: 'White/yellow flakes' },
]

const textureOptions = [
  { value: 'fine', label: 'Fine', emoji: '🪶', description: 'Thin individual strands, easily weighed down' },
  { value: 'medium', label: 'Medium', emoji: '➖', description: 'Average thickness' },
  { value: 'thick', label: 'Thick', emoji: '🌿', description: 'Dense, takes long to dry' },
  { value: 'coarse', label: 'Coarse', emoji: '🪵', description: 'Rough texture, resistant to products' },
]

const concerns = [
  { value: 'dandruff', label: 'Dandruff', emoji: '❄️' },
  { value: 'hair_fall', label: 'Hair Fall', emoji: '😔' },
  { value: 'frizz', label: 'Frizz', emoji: '⚡' },
  { value: 'dryness', label: 'Dryness', emoji: '🏜️' },
  { value: 'split_ends', label: 'Split Ends', emoji: '✂️' },
  { value: 'slow_growth', label: 'Slow Growth', emoji: '🐌' },
  { value: 'oily_scalp', label: 'Oily Scalp', emoji: '💧' },
  { value: 'color_damaged', label: 'Color Damaged', emoji: '🎨' },
  { value: 'heat_damaged', label: 'Heat Damaged', emoji: '🔥' },
]

const washFrequencies = [
  { value: 'daily', label: 'Daily', emoji: '📅', description: 'Wash every day' },
  { value: 'every_2_days', label: 'Every 2 days', emoji: '📆', description: 'Most common' },
  { value: 'twice_a_week', label: 'Twice a week', emoji: '🗓️', description: 'For drier hair types' },
  { value: 'once_a_week', label: 'Once a week', emoji: '📅', description: 'Curly / coily hair' },
]

const budgets = [
  { value: 'under_300', label: 'Under ₹300/mo', emoji: '💰', description: 'Budget-friendly' },
  { value: '300_to_800', label: '₹300–₹800/mo', emoji: '💵', description: 'Mid-range' },
  { value: 'above_800', label: '₹800+/mo', emoji: '💎', description: 'Premium' },
]

export default function HaircarePage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState<Partial<HaircareInput>>({
    hair_type: undefined,
    hair_porosity: undefined,
    scalp_type: undefined,
    hair_texture: undefined,
    concerns: [],
    wash_frequency: undefined,
    budget: undefined,
    age: undefined,
  })

  const canProceed = [
    !!form.hair_type && !!form.hair_porosity,
    !!form.scalp_type && !!form.hair_texture,
    (form.concerns?.length || 0) >= 1,
    !!form.wash_frequency && !!form.budget,
  ][step]

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await plannerApi.generateHaircarePlan(form as HaircareInput)
      setPlan(result.plan)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Generation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (plan) return <HaircarePlanDisplay plan={plan} onReset={() => setPlan(null)} />

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-display text-lg text-ink">
            Wellness<span className="text-blue-600">AI</span>
            <span className="text-slate-400 font-sans font-normal text-sm ml-2">/ Haircare Planner</span>
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl text-ink mb-2">
            {[
              'What\'s your hair type?',
              'Scalp & hair texture',
              'What are you dealing with?',
              'Routine frequency & budget',
            ][step]}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {[
              'Select both your hair type and porosity — porosity is key to which products work.',
              'Your scalp type determines how we treat the roots. Texture shapes the routine.',
              'Select all concerns — we\'ll prioritise the most impactful ones.',
              'How often you wash changes your entire routine.',
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
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Hair Type</p>
                <SingleSelectGrid
                  options={hairTypes}
                  selected={form.hair_type || ''}
                  onChange={(v) => setForm(f => ({ ...f, hair_type: v as any }))}
                  accentColor={ACCENT}
                  columns={2}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-1">Hair Porosity</p>
                <p className="text-xs text-slate-400 mb-3">
                  Quick test: Drop a strand in water. Sinks fast = High. Floats = Low. Middle = Medium.
                </p>
                <SingleSelectGrid
                  options={porosityOptions}
                  selected={form.hair_porosity || ''}
                  onChange={(v) => setForm(f => ({ ...f, hair_porosity: v as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Scalp Type</p>
                <SingleSelectGrid
                  options={scalpTypes}
                  selected={form.scalp_type || ''}
                  onChange={(v) => setForm(f => ({ ...f, scalp_type: v as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Hair Texture</p>
                <SingleSelectGrid
                  options={textureOptions}
                  selected={form.hair_texture || ''}
                  onChange={(v) => setForm(f => ({ ...f, hair_texture: v as any }))}
                  accentColor={ACCENT}
                  columns={2}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <MultiSelectGrid
              options={concerns}
              selected={form.concerns || []}
              onChange={(v) => setForm(f => ({ ...f, concerns: v }))}
              accentColor={ACCENT}
              columns={3}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-ink mb-3">How often do you wash?</p>
                <SingleSelectGrid
                  options={washFrequencies}
                  selected={form.wash_frequency || ''}
                  onChange={(v) => setForm(f => ({ ...f, wash_frequency: v as any }))}
                  accentColor={ACCENT}
                  columns={2}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Monthly haircare budget</p>
                <SingleSelectGrid
                  options={budgets}
                  selected={form.budget || ''}
                  onChange={(v) => setForm(f => ({ ...f, budget: v as any }))}
                  accentColor={ACCENT}
                  columns={3}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Age (optional)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={form.age || ''}
                  onChange={(e) => setForm(f => ({ ...f, age: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-48 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-300"
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
