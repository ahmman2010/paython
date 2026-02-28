import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Headphones, Phone, ArrowRight, ArrowLeft, User } from 'lucide-react'
import { Button, Badge, Card, CardContent, EmptyState, Textarea } from '@/shared/components/ui'
import { useLanguage } from '@/shared/hooks/useLanguage'

interface CallTask { id: string; leadName: string; phone: string; source: string; attempts: number; notes: string }

const demoTasks: CallTask[] = [
  { id: '1', leadName: 'خالد المطيري', phone: '+966551234007', source: 'campaign', attempts: 0, notes: 'From Instagram campaign - interested in SUVs' },
  { id: '2', leadName: 'أحمد الزهراني', phone: '+966551234006', source: 'whatsapp', attempts: 1, notes: 'Asked about Camry pricing, follow up needed' },
  { id: '3', leadName: 'Layla Hussain', phone: '+966551234008', source: 'website', attempts: 0, notes: 'Submitted contact form - budget 80-100K' },
]

const outcomes = [
  { value: 'no_answer', label: 'No Answer', labelAr: 'لم يرد', color: 'secondary' as const },
  { value: 'interested', label: 'Interested', labelAr: 'مهتم', color: 'success' as const },
  { value: 'follow_up', label: 'Follow Up', labelAr: 'متابعة', color: 'warning' as const },
  { value: 'booked', label: 'Booked Appointment', labelAr: 'تم الحجز', color: 'default' as const },
  { value: 'not_interested', label: 'Not Interested', labelAr: 'غير مهتم', color: 'danger' as const },
]

export function TeleSalesPage() {
  const { i18n } = useTranslation()
  const { isRtl } = useLanguage()
  const isAr = i18n.language === 'ar'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [callNotes, setCallNotes] = useState('')
  const ArrowNext = isRtl ? ArrowLeft : ArrowRight
  const current = demoTasks[currentIdx]

  if (!current) return <EmptyState icon={Headphones} title={isAr ? 'لا توجد مهام' : 'No tasks'} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isAr ? 'المبيعات الهاتفية' : 'Tele-Sales'}</h1>
        <Badge variant="default">{currentIdx + 1} / {demoTasks.length}</Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"><User className="h-6 w-6 text-blue-600" /></div>
                  <div><h2 className="text-xl font-bold">{current.leadName}</h2><p className="text-gray-500 font-mono">{current.phone}</p></div>
                </div>
                <Button size="lg" className="bg-green-600 hover:bg-green-700"><Phone className="h-5 w-5 me-2" />{isAr ? 'اتصل' : 'Call'}</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg bg-gray-50 p-3 text-center"><p className="text-xs text-gray-500">{isAr ? 'المصدر' : 'Source'}</p><p className="font-medium capitalize">{current.source}</p></div>
                <div className="rounded-lg bg-gray-50 p-3 text-center"><p className="text-xs text-gray-500">{isAr ? 'المحاولات' : 'Attempts'}</p><p className="font-medium">{current.attempts}</p></div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 mb-6"><p className="text-sm font-medium text-blue-800 mb-1">{isAr ? 'ملاحظات' : 'Notes'}</p><p className="text-sm text-blue-700">{current.notes}</p></div>
              <Textarea label={isAr ? 'ملاحظات المكالمة' : 'Call Notes'} value={callNotes} onChange={(e) => setCallNotes(e.target.value)} placeholder={isAr ? 'اكتب ملاحظات المكالمة...' : 'Write call notes...'} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">{isAr ? 'نتيجة المكالمة' : 'Call Outcome'}</h3>
              <div className="space-y-2">
                {outcomes.map((o) => (
                  <Button key={o.value} variant="outline" className="w-full justify-start" onClick={() => { setCallNotes(''); setCurrentIdx((p) => Math.min(p + 1, demoTasks.length - 1)) }}>
                    <Badge variant={o.color} className="me-2">{isAr ? o.labelAr : o.label}</Badge><ArrowNext className="h-4 w-4 ms-auto" />
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1" disabled={currentIdx === 0} onClick={() => setCurrentIdx((p) => p - 1)}>{isAr ? 'السابق' : 'Previous'}</Button>
                <Button variant="outline" size="sm" className="flex-1" disabled={currentIdx >= demoTasks.length - 1} onClick={() => setCurrentIdx((p) => p + 1)}>{isAr ? 'تخطي' : 'Skip'}</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">{isAr ? 'نص المكالمة' : 'Call Script'}</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">{isAr ? 'المقدمة:' : 'Introduction:'}</p>
                <p className="bg-gray-50 p-3 rounded-lg">{isAr ? '"السلام عليكم، معك [اسمك] من الجزيرة للسيارات. هل وقتك مناسب؟"' : '"Hello, this is [your name] from Al-Jazeera Motors. Is this a good time?"'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
