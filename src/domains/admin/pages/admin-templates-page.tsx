import { useTranslation } from 'react-i18next'
import { FileText, Download, Eye, Copy, Plus } from 'lucide-react'
import { Button, Badge, Card, CardContent, DataTable } from '@/shared/components/ui'

interface Template { id: string; name: string; nameAr: string; type: string; category: string; lastUpdated: string; usageCount: number; status: 'active' | 'draft' }

const demoTemplates: Template[] = [
  { id: '1', name: 'Sales Contract - Standard', nameAr: 'عقد بيع - قياسي', type: 'Contract', category: 'Sales', lastUpdated: '2024-11-15', usageCount: 245, status: 'active' },
  { id: '2', name: 'Sales Contract - Financing', nameAr: 'عقد بيع - بالتقسيط', type: 'Contract', category: 'Sales', lastUpdated: '2024-11-10', usageCount: 180, status: 'active' },
  { id: '3', name: 'Tax Invoice', nameAr: 'فاتورة ضريبية', type: 'Invoice', category: 'Billing', lastUpdated: '2024-11-20', usageCount: 520, status: 'active' },
  { id: '4', name: 'Price Quotation', nameAr: 'عرض سعر', type: 'Quote', category: 'Sales', lastUpdated: '2024-10-28', usageCount: 310, status: 'active' },
  { id: '5', name: 'Vehicle Handover Report', nameAr: 'تقرير تسليم مركبة', type: 'Delivery', category: 'Operations', lastUpdated: '2024-09-15', usageCount: 95, status: 'active' },
  { id: '6', name: 'Test Drive Agreement', nameAr: 'اتفاقية تجربة قيادة', type: 'Agreement', category: 'Sales', lastUpdated: '2024-08-22', usageCount: 42, status: 'draft' },
]

export function AdminTemplatesPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const columns = [
    { key: 'name' as const, header: isAr ? 'اسم القالب' : 'Template Name', render: (t: Template) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><FileText className="h-4 w-4 text-blue-600" /></div>
        <div><p className="font-medium">{isAr ? t.nameAr : t.name}</p><p className="text-xs text-gray-500">{t.type} • {t.category}</p></div>
      </div>
    )},
    { key: 'usageCount' as const, header: isAr ? 'الاستخدام' : 'Usage', render: (t: Template) => <span className="text-sm">{t.usageCount} {isAr ? 'مرة' : 'times'}</span> },
    { key: 'lastUpdated' as const, header: isAr ? 'آخر تحديث' : 'Last Updated' },
    { key: 'status' as const, header: isAr ? 'الحالة' : 'Status', render: (t: Template) => (
      <Badge variant={t.status === 'active' ? 'success' : 'secondary'}>{t.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'مسودة' : 'Draft')}</Badge>
    )},
    { key: 'id' as const, header: '', render: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isAr ? 'القوالب العامة' : 'Global Templates'}</h1>
        <Button><Plus className="h-4 w-4 me-2" />{isAr ? 'قالب جديد' : 'New Template'}</Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <DataTable data={demoTemplates} columns={columns} keyExtractor={(t) => t.id} />
        </CardContent>
      </Card>
    </div>
  )
}
