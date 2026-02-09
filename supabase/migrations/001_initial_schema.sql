-- Intilaaqah SaaS Platform - Initial Schema
-- Multi-tenant car dealership management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Subscription plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  max_cars INTEGER NOT NULL DEFAULT 100,
  max_users INTEGER NOT NULL DEFAULT 10,
  max_branches INTEGER NOT NULL DEFAULT 3,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenants (companies/car dealerships)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#2563EB',
  contact_phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  address_ar TEXT,
  cr_number TEXT,
  vat_number TEXT,
  plan_id UUID REFERENCES plans(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);

-- Tenant domains
CREATE TABLE tenant_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Branches/Showrooms
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  address TEXT,
  address_ar TEXT,
  city TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  phone TEXT,
  working_hours JSONB,
  appointment_capacity INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branches_tenant ON branches(tenant_id);

-- Users (linked to Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID NOT NULL UNIQUE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'sales_rep',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_auth ON users(auth_id);

-- User branch access (many-to-many)
CREATE TABLE user_branch_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, branch_id)
);

-- ============================================
-- CRM TABLES
-- ============================================

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name_ar TEXT,
  last_name_ar TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  national_id TEXT,
  address TEXT,
  city TEXT,
  preferred_language TEXT DEFAULT 'ar',
  preferred_contact TEXT DEFAULT 'whatsapp',
  notes TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_customers_phone ON customers(tenant_id, phone);
CREATE INDEX idx_customers_national_id ON customers(tenant_id, national_id) WHERE national_id IS NOT NULL;

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  branch_id UUID REFERENCES branches(id),
  assigned_to UUID REFERENCES users(id),
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  preferred_branch_id UUID REFERENCES branches(id),
  preferred_contact TEXT DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_status ON leads(tenant_id, status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);

-- Interactions timeline
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  lead_id UUID REFERENCES leads(id),
  deal_id UUID,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  channel TEXT,
  subject TEXT,
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_lead ON interactions(lead_id);

-- ============================================
-- INVENTORY TABLES
-- ============================================

-- Cars (model/listing level)
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  year INTEGER NOT NULL,
  body_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'new',
  description TEXT,
  description_ar TEXT,
  features JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cars_tenant ON cars(tenant_id);
CREATE INDEX idx_cars_published ON cars(tenant_id, is_published) WHERE is_published = true;

-- Car units (VIN-level physical units)
CREATE TABLE car_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  vin TEXT,
  sku TEXT,
  exterior_color TEXT NOT NULL,
  interior_color TEXT,
  mileage INTEGER,
  cost_price NUMERIC(12,2),
  selling_price NUMERIC(12,2) NOT NULL,
  min_price NUMERIC(12,2),
  availability TEXT NOT NULL DEFAULT 'in_stock',
  warranty_months INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_car_units_car ON car_units(car_id);
CREATE INDEX idx_car_units_tenant ON car_units(tenant_id);
CREATE INDEX idx_car_units_branch ON car_units(branch_id);
CREATE INDEX idx_car_units_availability ON car_units(tenant_id, availability);
CREATE UNIQUE INDEX idx_car_units_vin ON car_units(vin) WHERE vin IS NOT NULL;

-- Car media (images, videos)
CREATE TABLE car_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_car_media_car ON car_media(car_id);

-- Tenant custom fields for cars
CREATE TABLE tenant_car_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_name_ar TEXT,
  field_type TEXT NOT NULL DEFAULT 'text',
  options JSONB,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id),
  customer_id UUID REFERENCES customers(id),
  lead_id UUID REFERENCES leads(id),
  deal_id UUID,
  assigned_to UUID REFERENCES users(id),
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  no_show BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX idx_appointments_date ON appointments(branch_id, date);

-- ============================================
-- SALES PIPELINE
-- ============================================

-- Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  car_unit_id UUID REFERENCES car_units(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  assigned_to UUID REFERENCES users(id),
  stage TEXT NOT NULL DEFAULT 'new_lead',
  sale_type TEXT NOT NULL DEFAULT 'cash',
  total_amount NUMERIC(12,2),
  deposit_amount NUMERIC(12,2),
  notes TEXT,
  lost_reason TEXT,
  expected_close_date DATE,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deals_tenant ON deals(tenant_id);
CREATE INDEX idx_deals_stage ON deals(tenant_id, stage);
CREATE INDEX idx_deals_customer ON deals(customer_id);
CREATE INDEX idx_deals_assigned ON deals(assigned_to);

-- Deal tasks
CREATE TABLE deal_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  stage TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deal documents
CREATE TABLE deal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  type TEXT NOT NULL,
  url TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_uploaded BOOLEAN NOT NULL DEFAULT false,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BILLING & DOCUMENTS
-- ============================================

-- Quotes
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  quote_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  valid_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotes_tenant ON quotes(tenant_id);

-- Quote items
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  description_ar TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contracts
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  contract_number TEXT NOT NULL,
  template_id TEXT,
  content JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);

-- Invoice items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  description_ar TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  amount NUMERIC(12,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash',
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);

-- ============================================
-- FINANCING & DELIVERY
-- ============================================

-- Banks
CREATE TABLE banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  contact_info JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financing applications
CREATE TABLE financing_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id),
  bank_id UUID NOT NULL REFERENCES banks(id),
  status TEXT NOT NULL DEFAULT 'submitted',
  amount NUMERIC(12,2),
  term_months INTEGER,
  monthly_payment NUMERIC(12,2),
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Registration steps
CREATE TABLE registration_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_name_ar TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Delivery orders
CREATE TABLE delivery_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  scheduled_date DATE,
  scheduled_time TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  checklist JSONB DEFAULT '[]',
  notes TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- OFFERS & PROMOTIONS
-- ============================================

CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  applies_to JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INTEGRATIONS & AUDIT
-- ============================================

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Webhook subscriptions
CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Integration tokens
CREATE TABLE integration_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  token_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_branch_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user is platform admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'platform_admin'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tenants: platform admin sees all, users see own tenant
CREATE POLICY tenants_select ON tenants FOR SELECT USING (
  is_platform_admin() OR id = get_user_tenant_id()
);
CREATE POLICY tenants_insert ON tenants FOR INSERT WITH CHECK (is_platform_admin());
CREATE POLICY tenants_update ON tenants FOR UPDATE USING (
  is_platform_admin() OR id = get_user_tenant_id()
);

-- Public access for tenant by slug (for public catalog pages)
CREATE POLICY tenants_public_select ON tenants FOR SELECT USING (is_active = true);

-- Branches: tenant-scoped
CREATE POLICY branches_select ON branches FOR SELECT USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);
CREATE POLICY branches_insert ON branches FOR INSERT WITH CHECK (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);
CREATE POLICY branches_update ON branches FOR UPDATE USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);
CREATE POLICY branches_delete ON branches FOR DELETE USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

-- Users: tenant-scoped
CREATE POLICY users_select ON users FOR SELECT USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id() OR auth_id = auth.uid()
);
CREATE POLICY users_insert ON users FOR INSERT WITH CHECK (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);
CREATE POLICY users_update ON users FOR UPDATE USING (
  is_platform_admin() OR auth_id = auth.uid() OR tenant_id = get_user_tenant_id()
);

-- Generic tenant isolation policy macro
-- Applied to: customers, leads, cars, car_units, appointments, deals, quotes, invoices, payments, audit_logs, etc.

CREATE POLICY customers_tenant ON customers FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY leads_tenant ON leads FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY interactions_tenant ON interactions FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY cars_select ON cars FOR SELECT USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id() OR is_published = true
);
CREATE POLICY cars_modify ON cars FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY car_units_tenant ON car_units FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY car_media_select ON car_media FOR SELECT USING (
  is_platform_admin() OR EXISTS (
    SELECT 1 FROM cars WHERE cars.id = car_media.car_id AND (cars.tenant_id = get_user_tenant_id() OR cars.is_published = true)
  )
);

CREATE POLICY appointments_tenant ON appointments FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY deals_tenant ON deals FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY deal_tasks_tenant ON deal_tasks FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY deal_documents_tenant ON deal_documents FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY quotes_tenant ON quotes FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY quote_items_select ON quote_items FOR SELECT USING (
  is_platform_admin() OR EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.tenant_id = get_user_tenant_id()
  )
);

CREATE POLICY invoices_tenant ON invoices FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY payments_tenant ON payments FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY contracts_tenant ON contracts FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY financing_apps_tenant ON financing_applications FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY registration_steps_tenant ON registration_steps FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY delivery_orders_tenant ON delivery_orders FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY offers_select ON offers FOR SELECT USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id() OR is_active = true
);
CREATE POLICY offers_modify ON offers FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY audit_logs_select ON audit_logs FOR SELECT USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY webhook_subs_tenant ON webhook_subscriptions FOR ALL USING (
  is_platform_admin() OR tenant_id = get_user_tenant_id()
);

CREATE POLICY user_branch_access_select ON user_branch_access FOR SELECT USING (
  is_platform_admin() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = user_branch_access.user_id AND users.tenant_id = get_user_tenant_id()
  )
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON car_units FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON financing_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON delivery_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON webhook_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
