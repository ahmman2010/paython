import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Step {
  label: string
  labelAr?: string
  description?: string
  descriptionAr?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const { i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile view */}
      <div className="flex items-center justify-center gap-2 md:hidden mb-4">
        <span className="text-sm font-medium text-blue-600">
          {currentStep + 1} / {steps.length}
        </span>
        <span className="text-sm text-gray-600">
          {isRtl && steps[currentStep].labelAr ? steps[currentStep].labelAr : steps[currentStep].label}
        </span>
      </div>
      {/* Desktop view */}
      <div className="hidden md:flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={index} className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    isCompleted && 'border-blue-600 bg-blue-600 text-white',
                    isCurrent && 'border-blue-600 bg-white text-blue-600',
                    !isCompleted && !isCurrent && 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[80px]',
                    isCurrent ? 'text-blue-600' : 'text-gray-500'
                  )}
                >
                  {isRtl && step.labelAr ? step.labelAr : step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1',
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200',
                    isRtl && 'scale-x-[-1]'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
