import { useTranslation } from 'react-i18next'
import { Check, Star } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/shared/components/ui'
import { formatCurrency } from '@/lib/utils'

interface Plan { id: string; name: string; nameAr: string; price: number; maxCars: number; maxUsers: number; maxBranches: number; features: string[]; popular?: boolean }

const plans: Plan[] = [
  { id: '1', name: 'Starter', nameAr: 'المبتدئ', price: 499, maxCars: 50, maxUsers: 5, maxBranches: 2, features: ['Inventory management', 'Basic CRM', 'Public catalog', 'Appointments', 'Email support'] },
  { id: '2', name: 'Professional', nameAr: 'الاحترافي', price: 1499, maxCars: 200, maxUsers: 15, maxBranches: 5, features: ['Everything in Starter', 'Sales pipeline', 'Quotes & invoices', 'Analytics', 'WhatsApp integration', 'Priority support'], popular: true },
  { id: '3', name: 'Enterprise', nameAr: 'المؤسسي', price: 3999, maxCars: 1000, maxUsers: 50, maxBranches: 20, features: ['Everything in Professional', 'Financing module', 'Custom domain', 'API & webhooks', 'Advanced analytics', 'Dedicated support', 'Custom integrations'] },
]

export function AdminPlansPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isAr ? 'خطط الاشتراك' : 'Subscription Plans'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-blue-600 text-white"><Star className="h-3 w-3 me-1" />{isAr ? 'الأكثر شعبية' : 'Most Popular'}</Badge></div>
            )}
            <CardContent className="pt-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">{isAr ? plan.nameAr : plan.name}</h3>
                <div className="mt-3"><span className="text-4xl font-bold">{formatCurrency(plan.price)}</span><span className="text-gray-500 text-sm">/{isAr ? 'شهر' : 'mo'}</span></div>
              </div>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">{isAr ? 'السيارات' : 'Cars'}</span><span className="font-medium">{isAr ? 'حتى' : 'Up to'} {plan.maxCars}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">{isAr ? 'المستخدمين' : 'Users'}</span><span className="font-medium">{isAr ? 'حتى' : 'Up to'} {plan.maxUsers}</span></div>
                <div className="flex justify-between py-2 border-b"><span className="text-gray-500">{isAr ? 'الفروع' : 'Branches'}</span><span className="font-medium">{isAr ? 'حتى' : 'Up to'} {plan.maxBranches}</span></div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>{isAr ? 'تعديل الخطة' : 'Edit Plan'}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
