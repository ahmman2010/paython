import { useTranslation } from 'react-i18next'
import { Tag, Calendar } from 'lucide-react'
import { Badge, Card, CardContent, EmptyState } from '@/shared/components/ui'

interface Offer { id: string; title: string; titleAr: string; description: string; descriptionAr: string; discountType: string; discountValue: number; startDate: string; endDate: string }

const demoOffers: Offer[] = [
  { id: '1', title: 'Ramadan Special', titleAr: 'عروض رمضان', description: 'Get up to 10% off on selected models', descriptionAr: 'احصل على خصم حتى 10% على موديلات مختارة', discountType: 'percentage', discountValue: 10, startDate: '2024-03-10', endDate: '2024-04-10' },
  { id: '2', title: 'Free Service Package', titleAr: 'باقة صيانة مجانية', description: 'Free 3-year service package with every new car', descriptionAr: 'باقة صيانة مجانية لمدة 3 سنوات مع كل سيارة جديدة', discountType: 'fixed', discountValue: 0, startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: '3', title: 'Trade-In Bonus', titleAr: 'مكافأة الاستبدال', description: 'Extra SAR 5,000 when you trade in your old car', descriptionAr: 'مبلغ إضافي 5,000 ريال عند استبدال سيارتك القديمة', discountType: 'fixed', discountValue: 5000, startDate: '2024-02-01', endDate: '2024-06-30' },
]

export function PublicOffersPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  if (demoOffers.length === 0) return <div className="container mx-auto px-4 py-16"><EmptyState icon={Tag} title={isAr ? 'لا توجد عروض حالياً' : 'No offers available'} /></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isAr ? 'العروض الخاصة' : 'Special Offers'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demoOffers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <Badge className="bg-white/20 text-white mb-3">{offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : isAr ? 'عرض خاص' : 'Special'}</Badge>
              <h2 className="text-2xl font-bold">{isAr ? offer.titleAr : offer.title}</h2>
            </div>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">{isAr ? offer.descriptionAr : offer.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" /><span>{offer.startDate} - {offer.endDate}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
