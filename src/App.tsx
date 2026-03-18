import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout, PublicLayout, AdminLayout } from '@/shared/components/layout'

// Auth
import { LoginPage } from '@/domains/auth/pages/login-page'
import { AdminLoginPage } from '@/domains/auth/pages/admin-login-page'

// Backoffice pages
import { DashboardPage } from '@/domains/reports/pages/dashboard-page'
import { InventoryPage } from '@/domains/inventory/pages/inventory-page'
import { AddCarPage } from '@/domains/inventory/pages/add-car-page'
import { CustomersPage } from '@/domains/crm/pages/customers-page'
import { LeadsPage } from '@/domains/crm/pages/leads-page'
import { AppointmentsPage } from '@/domains/appointments/pages/appointments-page'
import { DealsPage } from '@/domains/sales/pages/deals-page'
import { QuotesPage } from '@/domains/sales/pages/quotes-page'
import { ContractsPage } from '@/domains/sales/pages/contracts-page'
import { DeliveryPage } from '@/domains/sales/pages/delivery-page'
import { RegistrationPage } from '@/domains/sales/pages/registration-page'
import { SalesTeamPage } from '@/domains/sales/pages/sales-team-page'
import { TeleSalesPage } from '@/domains/sales/pages/tele-sales-page'
import { InvoicesPage } from '@/domains/billing/pages/invoices-page'
import { PaymentsPage } from '@/domains/billing/pages/payments-page'
import { ReportsPage } from '@/domains/reports/pages/reports-page'
import { SettingsPage } from '@/domains/admin/pages/settings-page'

// Public pages
import { PublicLandingPage } from '@/domains/inventory/pages/public-landing-page'
import { PublicCatalogPage } from '@/domains/inventory/pages/public-catalog-page'
import { PublicCarDetailPage } from '@/domains/inventory/pages/public-car-detail-page'
import { PublicBookingPage } from '@/domains/appointments/pages/public-booking-page'
import { PublicOffersPage } from '@/domains/inventory/pages/public-offers-page'
import { PublicContactPage } from '@/domains/inventory/pages/public-contact-page'
import { PublicServicesPage } from '@/domains/inventory/pages/public-services-page'

// Admin pages
import { AdminDashboardPage } from '@/domains/admin/pages/admin-dashboard-page'
import { AdminCompaniesPage } from '@/domains/admin/pages/admin-companies-page'
import { AdminPlansPage } from '@/domains/admin/pages/admin-plans-page'
import { AdminTemplatesPage } from '@/domains/admin/pages/admin-templates-page'
import { AdminIntegrationsPage } from '@/domains/admin/pages/admin-integrations-page'
import { AuditLogsPage } from '@/domains/admin/pages/audit-logs-page'

// i18n
import '@/shared/i18n/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Company Backoffice */}
          <Route path="/app/:tenant" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/add" element={<AddCarPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="sales-team" element={<SalesTeamPage />} />
            <Route path="tele-sales" element={<TeleSalesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Platform Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="plans" element={<AdminPlansPage />} />
            <Route path="templates" element={<AdminTemplatesPage />} />
            <Route path="integrations" element={<AdminIntegrationsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Public Company Pages */}
          <Route path="/:companySlug" element={<PublicLayout />}>
            <Route index element={<PublicLandingPage />} />
            <Route path="cars" element={<PublicCatalogPage />} />
            <Route path="cars/:carId" element={<PublicCarDetailPage />} />
            <Route path="book" element={<PublicBookingPage />} />
            <Route path="offers" element={<PublicOffersPage />} />
            <Route path="contact" element={<PublicContactPage />} />
            <Route path="services" element={<PublicServicesPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/app/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
