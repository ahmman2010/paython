import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, User, Car, FileText, DollarSign, Settings } from 'lucide-react'
import { Badge, DataTable, SearchInput } from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'

interface AuditLog { id: string; userName: string; action: string; entityType: string; entityId: string; createdAt: string; details: string }

const entityIcons: Record<string, typeof Shield> = { car: Car, user: User, deal: FileText, payment: DollarSign, settings: Settings }

const demoLogs: AuditLog[] = [
  { id: '1', userName: 'أحمد السالم', action: 'create', entityType: 'deal', entityId: 'D-001', createdAt: '2024-03-28 14:30', details: 'Created deal for Mohammed Al-Rashid' },
  { id: '2', userName: 'System', action: 'update', entityType: 'car', entityId: 'C-003', createdAt: '2024-03-28 13:15', details: 'Unit reserved: Land Cruiser VXR White' },
  { id: '3', userName: 'فهد الدوسري', action: 'update', entityType: 'deal', entityId: 'D-001', createdAt: '2024-03-28 12:00', details: 'Stage: car_selected → quote_sent' },
  { id: '4', userName: 'أحمد السالم', action: 'create', entityType: 'payment', entityId: 'P-001', createdAt: '2024-03-27 16:45', details: 'Payment: SAR 50,000 deposit' },
  { id: '5', userName: 'Admin', action: 'update', entityType: 'settings', entityId: '-', createdAt: '2024-03-27 10:00', details: 'Updated VAT settings' },
]

const actionVariant: Record<string, 'success' | 'default' | 'danger'> = { create: 'success', update: 'default', delete: 'danger' }

export function AuditLogsPage() {
  const { i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const isAr = i18n.language === 'ar'
  const filtered = demoLogs.filter((log) => `${log.userName} ${log.action} ${log.entityType} ${log.details}`.toLowerCase().includes(search.toLowerCase()))

  const columns: Column<AuditLog>[] = [
    { key: 'time', header: isAr ? 'الوقت' : 'Time', render: (l) => <span className="text-xs text-gray-500 font-mono">{l.createdAt}</span> },
    { key: 'user', header: isAr ? 'المستخدم' : 'User', render: (l) => <span className="font-medium">{l.userName}</span> },
    { key: 'action', header: isAr ? 'الإجراء' : 'Action', render: (l) => <Badge variant={actionVariant[l.action] || 'secondary'}>{l.action}</Badge> },
    { key: 'entity', header: isAr ? 'الكيان' : 'Entity', render: (l) => { const Icon = entityIcons[l.entityType] || Shield; return <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-gray-400" /><span className="capitalize">{l.entityType}</span><code className="text-xs bg-gray-100 px-1 rounded">{l.entityId}</code></div> }},
    { key: 'details', header: isAr ? 'التفاصيل' : 'Details', render: (l) => <span className="text-sm text-gray-600">{l.details}</span> },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{isAr ? 'سجل العمليات' : 'Audit Logs'}</h1>
      <SearchInput value={search} onChange={setSearch} placeholder={isAr ? 'بحث...' : 'Search...'} className="sm:w-72" />
      <div className="rounded-xl border border-gray-200 bg-white"><DataTable columns={columns} data={filtered} keyExtractor={(l) => l.id} /></div>
    </div>
  )
}
