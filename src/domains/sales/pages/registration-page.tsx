import { useTranslation } from 'react-i18next'
import { ClipboardList, Check, Circle, AlertCircle } from 'lucide-react'
import { Badge, Button, EmptyState } from '@/shared/components/ui'

interface RegistrationDeal {
  id: string; customerName: string; carName: string
  steps: { name: string; nameAr: string; status: 'pending' | 'in_progress' | 'completed' }[]
}

const demoRegistrations: RegistrationDeal[] = [
  { id: '1', customerName: 'محمد الراشد', carName: 'Toyota Land Cruiser VXR 2024', steps: [
    { name: 'Insurance', nameAr: 'التأمين', status: 'completed' },
    { name: 'Traffic Department', nameAr: 'المرور', status: 'in_progress' },
    { name: 'Plate Registration', nameAr: 'تسجيل اللوحة', status: 'pending' },
    { name: 'License Issuance', nameAr: 'إصدار الرخصة', status: 'pending' },
    { name: 'Ownership Transfer', nameAr: 'نقل الملكية', status: 'pending' },
    { name: 'Final Paperwork', nameAr: 'الأوراق النهائية', status: 'pending' },
  ]},
  { id: '2', customerName: 'عمر حسن', carName: 'Toyota Camry GLE 2024', steps: [
    { name: 'Insurance', nameAr: 'التأمين', status: 'completed' },
    { name: 'Traffic Department', nameAr: 'المرور', status: 'completed' },
    { name: 'Plate Registration', nameAr: 'تسجيل اللوحة', status: 'completed' },
    { name: 'License Issuance', nameAr: 'إصدار الرخصة', status: 'completed' },
    { name: 'Ownership Transfer', nameAr: 'نقل الملكية', status: 'completed' },
    { name: 'Final Paperwork', nameAr: 'الأوراق النهائية', status: 'completed' },
  ]},
]

function StepIcon({ status }: { status: string }) {
  if (status === 'completed') return <Check className="h-4 w-4 text-green-600" />
  if (status === 'in_progress') return <AlertCircle className="h-4 w-4 text-yellow-600" />
  return <Circle className="h-4 w-4 text-gray-300" />
}

export function RegistrationPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.registration')}</h1>
      {demoRegistrations.length === 0 ? <EmptyState icon={ClipboardList} title={t('common.noData')} /> : (
        <div className="space-y-4">
          {demoRegistrations.map((reg) => {
            const completed = reg.steps.filter((s) => s.status === 'completed').length
            const pct = Math.round((completed / reg.steps.length) * 100)
            const allDone = completed === reg.steps.length
            return (
              <div key={reg.id} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div><h3 className="font-semibold text-lg">{reg.customerName}</h3><p className="text-sm text-gray-500">{reg.carName}</p></div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <div className="h-2 w-32 rounded-full bg-gray-200"><div className={`h-2 rounded-full transition-all ${allDone ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${pct}%` }} /></div>
                    <Badge variant={allDone ? 'success' : 'default'}>{allDone ? (isAr ? 'مكتمل' : 'Complete') : `${completed}/${reg.steps.length}`}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {reg.steps.map((step, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${step.status === 'in_progress' ? 'bg-yellow-50 border border-yellow-200' : step.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3"><StepIcon status={step.status} /><span className={step.status === 'completed' ? 'text-gray-400 line-through' : 'font-medium'}>{isAr ? step.nameAr : step.name}</span></div>
                      {step.status === 'pending' && <Button variant="ghost" size="sm">{isAr ? 'بدء' : 'Start'}</Button>}
                      {step.status === 'in_progress' && <Button variant="ghost" size="sm" className="text-green-600">{isAr ? 'إكمال' : 'Complete'}</Button>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
