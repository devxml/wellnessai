'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, FlaskConical, Leaf, AlertTriangle, Salad } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HaircarePlanDisplayProps {
  plan: any
  onReset: () => void
}

const SECTION_CONFIG = [
  {
    key: 'pre_wash_routine',
    label: 'Pre-Wash',
    emoji: '🫙',
    description: 'Do this before shampooing',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'wash_day_routine',
    label: 'Wash Day',
    emoji: '🚿',
    description: 'Shampoo & conditioning steps',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'post_wash_routine',
    label: 'Post-Wash',
    emoji: '💆',
    description: 'Leave-ins & styling',
    color: 'indigo',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    key: 'weekly_treatments',
    label: 'Weekly Treatments',
    emoji: '⭐',
    description: 'Deep care once or twice a week',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
  },
]

function HaircareStepCard({ step, badgeClass }: { step: any; badgeClass: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-semibold text-sm text-ink">{step.step || step.product_type}</p>
          <p className="text-xs text-blue-600 font-medium">{step.product_type}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
          ₹{step.price_range_inr}
        </span>
      </div>

      {step.key_ingredients?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {step.key_ingredients.map((ing: string, i: number) => (
            <span key={i} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
              {ing}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mb-2 leading-relaxed">{step.how_to_apply}</p>

      <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-1.5 mb-3">
        🕐 {step.frequency}
      </p>

      {step.india_product_suggestions?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-slate-400 mb-1">Products in India:</p>
          <div className="flex flex-wrap gap-1.5">
            {step.india_product_suggestions.map((p: string, i: number) => (
              <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.diy_alternative && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          🌿 DIY: {step.diy_alternative}
        </p>
      )}
    </div>
  )
}

export default function HaircarePlanDisplay({ plan, onReset }: HaircarePlanDisplayProps) {
  const [activeSection, setActiveSection] = useState(0)

  if (!plan) return null

  const currentSection = SECTION_CONFIG[activeSection]
  const steps = plan[currentSection.key] || []

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="font-display text-lg text-ink">Your Haircare Plan</span>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium">
            <RefreshCw size={13} /> Regenerate
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {SECTION_CONFIG.map((section, i) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === i
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200'
              }`}
            >
              <span>{section.emoji}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Active section */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`rounded-2xl ${currentSection.bg} border ${currentSection.border} p-5 mb-6`}>
            <p className="font-display text-lg text-ink mb-1">
              {currentSection.emoji} {currentSection.label}
            </p>
            <p className="text-xs text-slate-500">{currentSection.description}</p>
          </div>

          {steps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {steps.map((step: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <HaircareStepCard step={step} badgeClass={currentSection.badge} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No steps for this section.</p>
          )}
        </motion.div>

        {/* Ingredients to look for / avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {plan.ingredients_to_look_for?.length > 0 && (
            <div className="bg-sage-50 rounded-2xl border border-sage-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={15} className="text-sage-600" />
                <h3 className="font-semibold text-xs text-sage-800 uppercase tracking-wider">Look for These</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.ingredients_to_look_for.map((ing: string, i: number) => (
                  <span key={i} className="text-xs bg-white border border-sage-200 text-sage-700 px-2 py-0.5 rounded-full">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {plan.ingredients_to_avoid?.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-red-500" />
                <h3 className="font-semibold text-xs text-red-800 uppercase tracking-wider">Avoid These</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.ingredients_to_avoid.map((ing: string, i: number) => (
                  <span key={i} className="text-xs bg-white border border-red-200 text-red-600 px-2 py-0.5 rounded-full">{ing}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DIY remedies */}
        {plan.diy_home_remedies?.length > 0 && (
          <div className="bg-green-50 rounded-2xl border border-green-100 p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Leaf size={15} className="text-green-600" />
              <h3 className="font-semibold text-sm text-green-800">🌿 Desi Home Remedies</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.diy_home_remedies.map((remedy: string, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-green-100 p-3 text-xs text-green-800 leading-relaxed">
                  {remedy}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diet tips */}
        {plan.diet_tips_for_hair?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Salad size={15} className="text-saffron-500" />
              <h3 className="font-semibold text-sm text-ink">🥗 Diet Tips for Hair Health</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {plan.diet_tips_for_hair.map((tip: string, i: number) => (
                <p key={i} className="text-xs text-slate-600">→ {tip}</p>
              ))}
            </div>
          </div>
        )}

        {/* General tips */}
        {plan.general_tips?.length > 0 && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
            <h3 className="font-semibold text-sm text-blue-800 mb-3">💡 General Tips</h3>
            <ul className="space-y-1.5">
              {plan.general_tips.map((tip: string, i: number) => (
                <li key={i} className="text-xs text-blue-700">→ {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
