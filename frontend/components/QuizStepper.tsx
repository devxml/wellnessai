'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QuizStepperProps {
  steps: string[]
  currentStep: number
  onNext: () => void
  onBack: () => void
  canProceed: boolean
  isLastStep?: boolean
  isLoading?: boolean
  accentColor?: string
  children: React.ReactNode
}

export default function QuizStepper({
  steps,
  currentStep,
  onNext,
  onBack,
  canProceed,
  isLastStep = false,
  isLoading = false,
  accentColor = '#527238',
  children,
}: QuizStepperProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`step-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
            style={
              i === currentStep
                ? { background: accentColor, transform: 'scale(1.4)' }
                : i < currentStep
                ? { background: accentColor, opacity: 0.6 }
                : {}
            }
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-widest">
        Step {currentStep + 1} of {steps.length} — {steps[currentStep]}
      </p>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                     text-white disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all hover:opacity-90 active:scale-95"
          style={{ background: canProceed && !isLoading ? accentColor : '#9ca3af' }}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : isLastStep ? (
            <>Generate Plan <span>✨</span></>
          ) : (
            <>Next <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}
