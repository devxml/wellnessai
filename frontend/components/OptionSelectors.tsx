'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface OptionCardProps {
  label: string
  description?: string
  emoji?: string
  selected: boolean
  onClick: () => void
  accentColor?: string
}

export function OptionCard({
  label,
  description,
  emoji,
  selected,
  onClick,
  accentColor = '#527238',
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`
        w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
        ${selected
          ? 'shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        }
      `}
      style={
        selected
          ? { borderColor: accentColor, background: `${accentColor}10` }
          : {}
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {emoji && <span className="text-2xl mt-0.5">{emoji}</span>}
          <div>
            <p className="font-semibold text-sm text-ink">{label}</p>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: accentColor }}
          >
            <Check size={11} className="text-white" strokeWidth={3} />
          </motion.div>
        )}
      </div>
    </motion.button>
  )
}

interface MultiSelectGridProps {
  options: { value: string; label: string; emoji?: string; description?: string }[]
  selected: string[]
  onChange: (values: string[]) => void
  accentColor?: string
  columns?: 2 | 3
}

export function MultiSelectGrid({
  options,
  selected,
  onChange,
  accentColor = '#527238',
  columns = 2,
}: MultiSelectGridProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {options.map((opt) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          emoji={opt.emoji}
          selected={selected.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          accentColor={accentColor}
        />
      ))}
    </div>
  )
}

interface SingleSelectGridProps {
  options: { value: string; label: string; emoji?: string; description?: string }[]
  selected: string
  onChange: (value: string) => void
  accentColor?: string
  columns?: 2 | 3
}

export function SingleSelectGrid({
  options,
  selected,
  onChange,
  accentColor = '#527238',
  columns = 2,
}: SingleSelectGridProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-3`}>
      {options.map((opt) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          emoji={opt.emoji}
          selected={selected === opt.value}
          onClick={() => onChange(opt.value)}
          accentColor={accentColor}
        />
      ))}
    </div>
  )
}
