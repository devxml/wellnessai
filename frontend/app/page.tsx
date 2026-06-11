'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Sparkles, Wind } from 'lucide-react'

const planners = [
  {
    id: 'diet',
    icon: Leaf,
    emoji: '🍛',
    title: 'Diet Planner',
    tagline: 'Real Indian food, real results',
    description:
      'No quinoa. No avocado. Just dal, paneer, sprouts and millets — personalized for your goal and budget.',
    href: '/diet',
    accent: '#527238',
    light: '#e6eede',
    highlights: ['7-day meal plan', 'Budget under ₹200/day', 'Shopping list included'],
    gradient: 'from-sage-100 to-sage-50',
    border: 'border-sage-200',
    badge: 'bg-sage-500',
  },
  {
    id: 'skincare',
    icon: Sparkles,
    emoji: '✨',
    title: 'Skincare Planner',
    tagline: 'Acids, serums & routines that work',
    description:
      'Tell us your skin type and concerns. Get an AM/PM routine with Indian-available products and zero guesswork.',
    href: '/skincare',
    accent: '#c47d63',
    light: '#f9e8e2',
    highlights: ['AM + PM routine', 'Ingredient conflict checker', 'Minimalist, Plum & more'],
    gradient: 'from-orange-50 to-rose-50',
    border: 'border-orange-200',
    badge: 'bg-saffron-500',
  },
  {
    id: 'haircare',
    icon: Wind,
    emoji: '💆',
    title: 'Haircare Planner',
    tagline: 'From porosity to products',
    description:
      'Straight to coily, low to high porosity — get a complete weekly haircare routine with DIY desi remedies.',
    href: '/haircare',
    accent: '#3b5a9a',
    light: '#eef2fb',
    highlights: ['Weekly wash routine', 'DIY amla & methi masks', 'Porosity-specific advice'],
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    badge: 'bg-blue-500',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-mist">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-mist/80 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-xl text-ink font-semibold tracking-tight">
            Wellness<span className="text-sage-600">AI</span>
          </span>
          <span className="text-xs text-sage-600 bg-sage-100 px-3 py-1 rounded-full font-medium">
            India-first
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-saffron-500 font-medium text-sm tracking-widest uppercase mb-4">
            Powered by AI · Made for India
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-ink leading-tight mb-6">
            Wellness plans that{' '}
            <em className="not-italic text-sage-600">actually fit</em>
            <br />your life
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            No overpriced imports. No western-centric advice. Just practical, affordable plans
            built around Indian ingredients, brands and lifestyles.
          </p>
        </motion.div>
      </section>

      {/* Planner Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {planners.map((planner) => {
            const Icon = planner.icon
            return (
              <motion.div key={planner.id} variants={item}>
                <Link href={planner.href} className="block h-full">
                  <div
                    className={`
                      card-lift h-full rounded-3xl border ${planner.border}
                      bg-gradient-to-br ${planner.gradient}
                      p-8 flex flex-col cursor-pointer
                    `}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <span className="text-4xl">{planner.emoji}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-2xl text-ink mb-1">
                      {planner.title}
                    </h2>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: planner.accent }}>
                      {planner.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                      {planner.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1.5 mb-8">
                      {planner.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: planner.accent }} />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm font-semibold"
                      style={{ color: planner.accent }}>
                      Start planner
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sage-100 py-8 text-center text-xs text-slate-400">
        WellnessAI · Built for India · Open source
      </footer>
    </main>
  )
}
