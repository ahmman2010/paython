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
import { ReportsPage } from '@/domains/reports/pages/reports-page'
import { SettingsPage } from '@/domains/admin/pages/settings-page'

// Public pages
import { PublicLandingPage } from '@/domains/inventory/pages/public-landing-page'
import { PublicCatalogPage } from '@/domains/inventory/pages/public-catalog-page'
import { PublicCarDetailPage } from '@/domains/inventory/pages/public-car-detail-page'
import { PublicBookingPage } from '@/domains/appointments/pages/public-booking-page'

// Admin pages
import { AdminDashboardPage } from '@/domains/admin/pages/admin-dashboard-page'
import { AdminCompaniesPage } from '@/domains/admin/pages/admin-companies-page'

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
            <Route path="contracts" element={<PlaceholderPage title="Contracts" />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="payments" element={<PlaceholderPage title="Payments" />} />
            <Route path="delivery" element={<PlaceholderPage title="Delivery" />} />
            <Route path="registration" element={<PlaceholderPage title="Registration" />} />
            <Route path="sales-team" element={<PlaceholderPage title="Sales Team" />} />
            <Route path="tele-sales" element={<PlaceholderPage title="Tele-Sales" />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
          </Route>

          {/* Platform Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="plans" element={<PlaceholderPage title="Subscription Plans" />} />
            <Route path="templates" element={<PlaceholderPage title="Global Templates" />} />
            <Route path="integrations" element={<PlaceholderPage title="Global Integrations" />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
          </Route>

          {/* Public Company Pages */}
          <Route path="/:companySlug" element={<PublicLayout />}>
            <Route index element={<PublicLandingPage />} />
            <Route path="cars" element={<PublicCatalogPage />} />
            <Route path="cars/:carId" element={<PublicCarDetailPage />} />
            <Route path="book" element={<PublicBookingPage />} />
            <Route path="offers" element={<PlaceholderPage title="Special Offers" />} />
            <Route path="contact" element={<PlaceholderPage title="Contact Us" />} />
            <Route path="services" element={<PlaceholderPage title="Services" />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/app/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm">Coming soon - Phase 2</p>
    </div>
  )
}

export default App
