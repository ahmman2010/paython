import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import {
  Button, Input, SearchInput,
  DataTable, Modal, Badge,
} from '@/shared/components/ui'
import type { Column } from '@/shared/components/ui'

const companySchema = z.object({
  name: z.string().min(1, 'Required'),
  nameAr: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  vatNumber: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>

interface Company {
  id: string
  name: string
  nameAr: string
  slug: string
  isActive: boolean
  plan: string
  createdAt: string
}

const demoCompanies: Company[] = [
  { id: '1', name: 'Al-Futtaim Motors', nameAr: 'الفطيم للسيارات', slug: 'al-futtaim', isActive: true, plan: 'Enterprise', createdAt: '2024-01-15' },
  { id: '2', name: 'Gulf Auto Trading', nameAr: 'الخليج لتجارة السيارات', slug: 'gulf-auto', isActive: true, plan: 'Professional', createdAt: '2024-02-20' },
  { id: '3', name: 'Saudi Star Motors', nameAr: 'النجم السعودي', slug: 'saudi-star', isActive: false, plan: 'Starter', createdAt: '2024-03-10' },
]

export function AdminCompaniesPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  })

  const onSubmit = async (_data: CompanyFormData) => {
    setShowModal(false)
    reset()
  }

  const filtered = demoCompanies.filter((c) =>
    `${c.name} ${c.nameAr} ${c.slug}`.toLowerCase().includes(search.toLowerCase())
  )

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Company', headerAr: 'الشركة', render: (c) => (
      <div>
        <p className="font-medium">{c.name}</p>
        <p className="text-xs text-gray-500">{c.nameAr}</p>
      </div>
    )},
    { key: 'slug', header: 'Slug', headerAr: 'الرابط', render: (c) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{c.slug}</code> },
    { key: 'plan', header: 'Plan', headerAr: 'الخطة', render: (c) => <Badge variant="secondary">{c.plan}</Badge> },
    {
      key: 'isActive',
      header: 'Status',
      headerAr: 'الحالة',
      render: (c) => <Badge variant={c.isActive ? 'success' : 'danger'}>{c.isActive ? t('common.active') : t('common.inactive')}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerAr: 'إجراءات',
      render: (c) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">{t('common.edit')}</Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            {c.isActive ? t('admin.suspend') : t('admin.activate')}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t('admin.companies')}</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 me-2" />
          {t('admin.addCompany')}
        </Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} className="sm:w-72" />

      <div className="rounded-xl border border-gray-200 bg-white">
        <DataTable columns={columns} data={filtered} keyExtractor={(c) => c.id} />
      </div>

      <Modal open={showModal} onOpenChange={setShowModal} title={t('admin.addCompany')} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name (EN)" required error={errors.name?.message} {...register('name')} />
            <Input label="اسم الشركة (عربي)" required error={errors.nameAr?.message} {...register('nameAr')} />
          </div>
          <Input label="URL Slug" required error={errors.slug?.message} helperText="e.g., al-futtaim (will be intilaaqah.app/al-futtaim)" {...register('slug')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Contact Phone" {...register('contactPhone')} />
            <Input label="WhatsApp Number" {...register('whatsappNumber')} />
          </div>
          <Input label="VAT Number" {...register('vatNumber')} />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
