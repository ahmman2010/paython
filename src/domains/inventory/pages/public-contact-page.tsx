import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { Button, Card, CardContent, Input, Textarea } from '@/shared/components/ui'

const contactInfo = {
  phone: '+966 50 123 4567',
  email: 'info@aljazeera-motors.com',
  address: 'King Fahd Road, Riyadh 12345, Saudi Arabia',
  addressAr: 'طريق الملك فهد، الرياض 12345، المملكة العربية السعودية',
  hours: 'Sat-Thu: 9:00 AM - 10:00 PM | Fri: 4:00 PM - 10:00 PM',
  hoursAr: 'السبت-الخميس: 9:00 ص - 10:00 م | الجمعة: 4:00 م - 10:00 م',
}

export function PublicContactPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{isAr ? 'تواصل معنا' : 'Contact Us'}</h1>
      <p className="text-gray-500 mb-8">{isAr ? 'نسعد بخدمتكم والرد على استفساراتكم' : 'We\'re happy to help and answer your questions'}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">{isAr ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label={isAr ? 'الاسم الكامل' : 'Full Name'} placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'} />
                  <Input label={isAr ? 'رقم الجوال' : 'Phone Number'} type="tel" placeholder="+966 5X XXX XXXX" />
                </div>
                <Input label={isAr ? 'البريد الإلكتروني' : 'Email'} type="email" placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} />
                <Input label={isAr ? 'الموضوع' : 'Subject'} placeholder={isAr ? 'ما هو موضوع رسالتك؟' : 'What is your message about?'} />
                <Textarea label={isAr ? 'الرسالة' : 'Message'} placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'} rows={5} />
                <Button type="submit"><Send className="h-4 w-4 me-2" />{isAr ? 'إرسال الرسالة' : 'Send Message'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <h2 className="text-xl font-semibold mb-2">{isAr ? 'معلومات التواصل' : 'Contact Information'}</h2>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{isAr ? 'الهاتف' : 'Phone'}</p>
                  <p className="text-gray-600 text-sm" dir="ltr">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{isAr ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="text-gray-600 text-sm">{contactInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{isAr ? 'العنوان' : 'Address'}</p>
                  <p className="text-gray-600 text-sm">{isAr ? contactInfo.addressAr : contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{isAr ? 'ساعات العمل' : 'Working Hours'}</p>
                  <p className="text-gray-600 text-sm">{isAr ? contactInfo.hoursAr : contactInfo.hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map placeholder */}
          <Card>
            <CardContent className="pt-6">
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">{isAr ? 'خريطة الموقع' : 'Location Map'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
