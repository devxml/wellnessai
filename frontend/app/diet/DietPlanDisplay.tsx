'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ShoppingCart, Droplets, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface DietPlanDisplayProps {
  plan: any
  onReset: () => void
}

export default function DietPlanDisplay({ plan, onReset }: DietPlanDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number>(0)

  if (!plan || !plan.weekly_meals) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Something went wrong with plan generation.</p>
          <button onClick={onReset} className="text-sage-600 font-semibold">Try again</button>
        </div>
      </div>
    )
  }

  const macros = plan.weekly_macros_summary || {}

  return (
    <main className="min-h-screen bg-mist">
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="font-display text-lg text-ink">Your Diet Plan</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-800 font-medium"
          >
            <RefreshCw size={13} /> Regenerate
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">{plan.title}</h1>

          {/* Macros summary */}
          {macros.avg_calories && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: 'Avg Calories', value: `${macros.avg_calories}`, unit: 'kcal' },
                { label: 'Protein', value: `${macros.avg_protein_g}g`, unit: '/day' },
                { label: 'Carbs', value: `${macros.avg_carbs_g}g`, unit: '/day' },
                { label: 'Fat', value: `${macros.avg_fat_g}g`, unit: '/day' },
              ].map(({ label, value, unit }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-sage-100 text-center">
                  <p className="font-display text-2xl text-sage-700">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{unit}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Weekly meals */}
        <div className="space-y-3 mb-10">
          <h2 className="font-display text-xl text-ink mb-4">7-Day Meal Plan</h2>
          {plan.weekly_meals.map((day: any, i: number) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-ink">{day.day}</span>
                  <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                    {day.total_calories} kcal · {day.total_protein_g}g protein
                  </span>
                </div>
                {expandedDay === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {expandedDay === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-6 pb-5 border-t border-slate-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {['breakfast', 'lunch', 'snack', 'dinner'].map((meal) => {
                      const items = day[meal]
                      if (!items || items.length === 0) return null
                      return (
                        <div key={meal}>
                          <p className="text-xs font-bold uppercase tracking-wider text-sage-600 mb-2">
                            {meal === 'snack' ? '🍎 Snack' : meal === 'breakfast' ? '🌅 Breakfast' : meal === 'lunch' ? '☀️ Lunch' : '🌙 Dinner'}
                          </p>
                          <div className="space-y-2">
                            {items.map((item: any, j: number) => (
                              <div key={j} className="bg-mist rounded-xl p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-sm text-ink">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.quantity}</p>
                                  </div>
                                  <span className="text-xs text-sage-600 font-semibold bg-sage-50 px-2 py-0.5 rounded-full">
                                    {item.calories} cal
                                  </span>
                                </div>
                                {item.preparation_tip && (
                                  <p className="text-xs text-slate-400 mt-1.5 italic">💡 {item.preparation_tip}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Shopping list */}
        {plan.shopping_list?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart size={18} className="text-saffron-500" />
              <h3 className="font-semibold text-ink">Weekly Shopping List</h3>
              {plan.estimated_weekly_cost_inr && (
                <span className="ml-auto text-sm font-semibold text-sage-600">
                  ~₹{plan.estimated_weekly_cost_inr}/week
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {plan.shopping_list.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hydration tips */}
          {plan.hydration_tips?.length > 0 && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Droplets size={16} className="text-blue-500" />
                <h3 className="font-semibold text-sm text-blue-800">Hydration Tips</h3>
              </div>
              <ul className="space-y-1.5">
                {plan.hydration_tips.map((tip: string, i: number) => (
                  <li key={i} className="text-xs text-blue-700">→ {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* General tips */}
          {plan.general_tips?.length > 0 && (
            <div className="bg-sage-50 rounded-2xl border border-sage-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-sage-600" />
                <h3 className="font-semibold text-sm text-sage-800">Tips to Follow</h3>
              </div>
              <ul className="space-y-1.5">
                {plan.general_tips.map((tip: string, i: number) => (
                  <li key={i} className="text-xs text-sage-700">→ {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
