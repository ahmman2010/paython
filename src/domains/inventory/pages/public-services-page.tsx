import { useTranslation } from 'react-i18next'
import { Car, Shield, Banknote, Wrench, FileText, Repeat } from 'lucide-react'
import { Card, CardContent, Button } from '@/shared/components/ui'

interface Service {
  icon: typeof Car
  title: string
  titleAr: string
  description: string
  descriptionAr: string
}

const services: Service[] = [
  { icon: Car, title: 'New Car Sales', titleAr: 'بيع السيارات الجديدة', description: 'Wide selection of brand-new vehicles from top manufacturers with competitive pricing and flexible payment options.', descriptionAr: 'تشكيلة واسعة من السيارات الجديدة من أفضل الشركات المصنعة بأسعار تنافسية وخيارات دفع مرنة.' },
  { icon: Repeat, title: 'Trade-In Program', titleAr: 'برنامج الاستبدال', description: 'Trade in your current vehicle and get the best value towards your new car purchase.', descriptionAr: 'استبدل سيارتك الحالية واحصل على أفضل قيمة لشراء سيارتك الجديدة.' },
  { icon: Banknote, title: 'Financing Solutions', titleAr: 'حلول التمويل', description: 'Flexible financing plans through our banking partners with competitive rates and easy approval process.', descriptionAr: 'خطط تمويل مرنة من خلال شركائنا البنكيين بأسعار تنافسية وعملية موافقة سهلة.' },
  { icon: Shield, title: 'Extended Warranty', titleAr: 'الضمان الممتد', description: 'Comprehensive warranty packages to protect your investment and give you peace of mind.', descriptionAr: 'باقات ضمان شاملة لحماية استثمارك ومنحك راحة البال.' },
  { icon: Wrench, title: 'Service & Maintenance', titleAr: 'الصيانة والخدمة', description: 'Certified service center with genuine parts and expert technicians for all your maintenance needs.', descriptionAr: 'مركز خدمة معتمد بقطع غيار أصلية وفنيين خبراء لجميع احتياجات الصيانة.' },
  { icon: FileText, title: 'Insurance Services', titleAr: 'خدمات التأمين', description: 'Comprehensive and third-party insurance options from leading providers at negotiated rates.', descriptionAr: 'خيارات تأمين شامل وطرف ثالث من مقدمي خدمات رائدين بأسعار تفاوضية.' },
]

export function PublicServicesPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">{isAr ? 'خدماتنا' : 'Our Services'}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">{isAr ? 'نقدم مجموعة متكاملة من الخدمات لتلبية جميع احتياجاتكم في عالم السيارات' : 'We offer a comprehensive range of services to meet all your automotive needs'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{isAr ? service.titleAr : service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{isAr ? service.descriptionAr : service.description}</p>
                <Button variant="outline" size="sm">{isAr ? 'اعرف المزيد' : 'Learn More'}</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">{isAr ? 'هل تحتاج مساعدة؟' : 'Need Assistance?'}</h2>
        <p className="mb-6 opacity-90">{isAr ? 'فريقنا جاهز لمساعدتك في اختيار الخدمة المناسبة' : 'Our team is ready to help you choose the right service'}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary">{isAr ? 'اتصل بنا' : 'Call Us'}</Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">{isAr ? 'واتساب' : 'WhatsApp'}</Button>
        </div>
      </div>
    </div>
  )
}
