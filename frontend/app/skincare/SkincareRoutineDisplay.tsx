'use client'
import { motion } from 'framer-motion'
import { RefreshCw, Sun, Moon, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface SkincareRoutineDisplayProps {
  plan: any
  onReset: () => void
}

function RoutineStep({ step, index }: { step: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-1">
        {step.step_number}
      </div>
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="font-semibold text-sm text-ink">{step.product_type}</p>
            <p className="text-xs text-orange-600 font-medium">{step.active_ingredient}</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            ₹{step.price_range_inr}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">{step.how_to_use}</p>
        <p className="text-xs text-sage-700 bg-sage-50 rounded-lg px-3 py-2 mb-3">
          💡 {step.why_this_works}
        </p>
        {step.india_product_suggestions?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1.5">Available in India:</p>
            <div className="flex flex-wrap gap-1.5">
              {step.india_product_suggestions.map((p: string, i: number) => (
                <span key={i} className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-1 rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function SkincareRoutineDisplay({ plan, onReset }: SkincareRoutineDisplayProps) {
  if (!plan) return null

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="font-display text-lg text-ink">Your Skincare Routine</span>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-800 font-medium">
            <RefreshCw size={13} /> Regenerate
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* AM Routine */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Sun size={18} className="text-saffron-500" />
              <h2 className="font-display text-xl text-ink">Morning Routine</h2>
            </div>
            <div className="space-y-4">
              {plan.am_routine?.map((step: any, i: number) => (
                <RoutineStep key={i} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* PM Routine */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Moon size={18} className="text-indigo-400" />
              <h2 className="font-display text-xl text-ink">Night Routine</h2>
            </div>
            <div className="space-y-4">
              {plan.pm_routine?.map((step: any, i: number) => (
                <RoutineStep key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Ingredient conflicts */}
        {plan.ingredient_conflicts?.length > 0 && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-600" />
              <h3 className="font-semibold text-sm text-amber-800">Ingredient Conflicts to Avoid</h3>
            </div>
            <ul className="space-y-1.5">
              {plan.ingredient_conflicts.map((c: string, i: number) => (
                <li key={i} className="text-xs text-amber-700">⚠️ {c}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Ingredients to use */}
          {plan.ingredients_to_use?.length > 0 && (
            <div className="bg-sage-50 rounded-2xl border border-sage-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-sage-600" />
                <h3 className="font-semibold text-xs text-sage-800 uppercase tracking-wider">Use These</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.ingredients_to_use.map((ing: string, i: number) => (
                  <span key={i} className="text-xs bg-white border border-sage-200 text-sage-700 px-2 py-0.5 rounded-full">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients to avoid */}
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

          {/* Weekly treatments */}
          {plan.weekly_treatments?.length > 0 && (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
              <h3 className="font-semibold text-xs text-indigo-800 uppercase tracking-wider mb-3">Weekly Treatments</h3>
              <ul className="space-y-1.5">
                {plan.weekly_treatments.map((t: string, i: number) => (
                  <li key={i} className="text-xs text-indigo-700">→ {t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Diet tips */}
        {plan.diet_tips_for_skin?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <h3 className="font-semibold text-sm text-ink mb-3">🥗 Diet Tips for Better Skin</h3>
            <div className="grid grid-cols-2 gap-2">
              {plan.diet_tips_for_skin.map((tip: string, i: number) => (
                <p key={i} className="text-xs text-slate-600">→ {tip}</p>
              ))}
            </div>
          </div>
        )}

        {plan.general_notes && (
          <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5 text-sm text-orange-800">
            <p className="font-semibold mb-1">Dermatologist's Note</p>
            <p className="text-xs text-orange-700 leading-relaxed">{plan.general_notes}</p>
          </div>
        )}
      </div>
    </main>
  )
}
