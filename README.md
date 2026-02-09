# Intilaaqah (انطلاقة)

**Smart Car Sales Management Platform for Saudi Arabia**

A multi-tenant SaaS platform for managing car companies and showrooms, with full Arabic/English bilingual support and RTL/LTR layout.

## Features

### Multi-Tenant Architecture
- Company (tenant) isolation with Row-Level Security
- Subscription plans with configurable limits
- Branch/showroom management per company
- Role-based access control (11 roles)

### Core Modules
- **Inventory Management**: Cars, units (VIN-level), media, pricing, availability
- **Public Catalog**: SEO-ready car listings with filters, detail pages
- **CRM**: Customers, leads, interaction timeline, deduplication
- **Appointments**: Booking system with branch capacity, calendar view
- **Sales Pipeline**: 12-stage deal workflow (cash, installment, lease-to-own)
- **Quotes**: Builder with VAT calculation, PDF generation
- **Analytics**: KPI dashboard, pipeline funnel, charts

### Bilingual Support (Arabic/English)
- Full RTL/LTR layout support
- Language switcher with persisted preference
- All labels and validation messages bilingual
- Arabic font (Noto Sans Arabic) support

### Mobile-First Design
- Responsive UI using Tailwind CSS
- Wizard-driven workflows for mobile usability
- Touch-friendly components

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + Custom Design System |
| State | Zustand + TanStack React Query |
| Forms | React Hook Form + Zod validation |
| Backend | Supabase (Auth, Database, Storage, RLS) |
| i18n | i18next + react-i18next |
| Charts | Recharts |
| Icons | Lucide React |

## Project Structure

```
src/
├── config/           # App constants, permissions
├── lib/              # Utilities, Supabase client
├── shared/
│   ├── components/
│   │   ├── ui/       # Design system (Button, Input, Table, Modal, etc.)
│   │   ├── layout/   # App, Public, Admin layouts
│   │   └── forms/    # Shared form components
│   ├── hooks/        # useAuth, useLanguage
│   ├── i18n/         # Translations (en, ar)
│   ├── services/     # Shared services
│   └── types/        # Database types, auth types, common types
├── domains/
│   ├── auth/         # Login pages, auth service
│   ├── inventory/    # Cars CRUD, public catalog
│   ├── crm/          # Customers, leads
│   ├── appointments/ # Booking system
│   ├── sales/        # Deals pipeline, quotes
│   ├── reports/      # Dashboard, analytics
│   ├── admin/        # Platform admin, settings
│   ├── billing/      # Invoices, payments (Phase 2)
│   └── integrations/ # Webhooks, API (Phase 2)
└── supabase/
    ├── migrations/   # SQL schema + RLS policies
    └── seed/         # Demo data
```

## Routes

### Public (per tenant)
- `/{companySlug}` - Landing page
- `/{companySlug}/cars` - Car catalog
- `/{companySlug}/cars/:id` - Car detail
- `/{companySlug}/book` - Appointment booking
- `/{companySlug}/offers` - Promotions
- `/{companySlug}/contact` - Contact page

### Backoffice (per tenant)
- `/app/:tenant/dashboard` - KPI dashboard
- `/app/:tenant/inventory` - Cars management
- `/app/:tenant/leads` - Lead management
- `/app/:tenant/customers` - CRM
- `/app/:tenant/appointments` - Appointment calendar
- `/app/:tenant/deals` - Sales pipeline
- `/app/:tenant/quotes` - Quote builder
- `/app/:tenant/reports` - Analytics
- `/app/:tenant/settings` - Company settings

### Platform Admin
- `/admin/dashboard` - Platform overview
- `/admin/companies` - Tenant management
- `/admin/plans` - Subscription plans

## Setup

### Prerequisites
- Node.js 18+
- Supabase account (or local Supabase)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Run the database migration:
   - Apply `supabase/migrations/001_initial_schema.sql` to your Supabase project
   - Optionally run `supabase/seed/demo-data.sql` for demo data
6. Start the dev server:
   ```bash
   npm run dev
   ```

## Roles & Permissions

| Role | Description |
|------|------------|
| `platform_admin` | Full platform access |
| `company_admin` | Full tenant access |
| `branch_manager` | Branch-level management |
| `sales_manager` | Team and deals management |
| `sales_rep` | Deal and customer management |
| `inventory_manager` | Inventory and pricing |
| `finance` | Invoices, payments, contracts |
| `customer_service` | Customer and lead support |
| `tele_sales` | Call-based lead management |
| `operations` | Delivery and logistics |
| `analyst` | Read-only analytics |

## Database

30+ tables with full RLS policies for multi-tenant isolation. Key entities:
- `tenants`, `branches`, `users`, `user_branch_access`
- `customers`, `leads`, `interactions`
- `cars`, `car_units`, `car_media`
- `appointments`, `deals`, `deal_tasks`, `deal_documents`
- `quotes`, `contracts`, `invoices`, `payments`
- `banks`, `financing_applications`
- `registration_steps`, `delivery_orders`
- `offers`, `audit_logs`, `webhook_subscriptions`

## Webhooks & API Events

Integration-ready events:
- `lead.created`, `deal.stage_changed`, `appointment.booked`
- `payment.recorded`, `car.reserved`, `car.sold`

## License

Proprietary - All rights reserved.
