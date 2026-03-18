-- Intilaaqah Demo Seed Data
-- Creates a sample tenant with branches, users, cars, and leads

-- Plan
INSERT INTO plans (id, name, name_ar, max_cars, max_users, max_branches, price_monthly)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Starter', 'المبتدئ', 50, 5, 2, 499),
  ('22222222-2222-2222-2222-222222222222', 'Professional', 'الاحترافي', 200, 15, 5, 1499),
  ('33333333-3333-3333-3333-333333333333', 'Enterprise', 'المؤسسي', 1000, 50, 20, 3999);

-- Demo Tenant
INSERT INTO tenants (id, name, name_ar, slug, brand_color, contact_phone, whatsapp_number, address, address_ar, vat_number, plan_id, is_active)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Al-Jazeera Motors',
  'الجزيرة للسيارات',
  'al-jazeera',
  '#2563EB',
  '+966501234567',
  '+966501234567',
  'King Fahd Road, Riyadh, Saudi Arabia',
  'طريق الملك فهد، الرياض، المملكة العربية السعودية',
  '300000000000003',
  '22222222-2222-2222-2222-222222222222',
  true
);

-- Branches
INSERT INTO branches (id, tenant_id, name, name_ar, address, address_ar, city, phone, appointment_capacity, is_active)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Riyadh Main Showroom', 'معرض الرياض الرئيسي', 'King Fahd Road, Riyadh', 'طريق الملك فهد، الرياض', 'Riyadh', '+966501111111', 15, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jeddah Branch', 'فرع جدة', 'Tahlia Street, Jeddah', 'شارع التحلية، جدة', 'Jeddah', '+966502222222', 10, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dammam Branch', 'فرع الدمام', 'King Saud Street, Dammam', 'شارع الملك سعود، الدمام', 'Dammam', '+966503333333', 8, true);

-- Cars
INSERT INTO cars (id, tenant_id, make, model, trim, year, body_type, transmission, fuel_type, condition, description, description_ar, features, is_published)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toyota', 'Camry', 'GLE', 2024, 'sedan', 'automatic', 'petrol', 'new', 'Brand new Toyota Camry GLE with full options', 'تويوتا كامري GLE جديدة بالكامل', '["Leather Seats", "Sunroof", "Apple CarPlay", "Lane Assist", "Blind Spot Monitor"]', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toyota', 'Land Cruiser', 'VXR', 2024, 'suv', 'automatic', 'petrol', 'new', 'Toyota Land Cruiser VXR - top of the line', 'تويوتا لاندكروزر VXR - الفئة الأعلى', '["V8 Engine", "Full Leather", "Crawl Control", "Multi-Terrain Select", "JBL Audio"]', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hyundai', 'Tucson', 'Limited', 2024, 'suv', 'automatic', 'petrol', 'new', 'Hyundai Tucson Limited - smart and stylish', 'هيونداي توسان ليمتد - ذكية وأنيقة', '["Panoramic Roof", "Bose Audio", "360 Camera", "Ventilated Seats"]', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nissan', 'Patrol', 'Platinum', 2024, 'suv', 'automatic', 'petrol', 'new', 'Nissan Patrol Platinum V8', 'نيسان باترول بلاتينيوم V8', '["V8 Engine", "Hydraulic Body Motion Control", "Quilted Leather", "Rear Entertainment"]', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kia', 'K5', 'GT-Line', 2024, 'sedan', 'automatic', 'petrol', 'new', 'Kia K5 GT-Line with sporty design', 'كيا K5 GT-Line بتصميم رياضي', '["Turbocharged", "Harman Kardon", "Smart Cruise", "LED Headlights"]', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Toyota', 'Hilux', 'SR5', 2023, 'pickup', 'automatic', 'diesel', 'used', 'Used Toyota Hilux SR5 - excellent condition', 'تويوتا هايلكس SR5 مستعمل - حالة ممتازة', '["4WD", "Bed Liner", "Reverse Camera", "Bluetooth"]', true);

-- Car Units
INSERT INTO car_units (id, car_id, tenant_id, branch_id, vin, exterior_color, interior_color, mileage, cost_price, selling_price, min_price, availability, warranty_months)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'JTD12345678901234', 'White', 'Beige', 0, 85000, 105000, 98000, 'in_stock', 36),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'JTD12345678901235', 'Silver', 'Black', 0, 85000, 105000, 98000, 'in_stock', 36),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', 'cccccccc-cccc-cccc-cccc-cccccccccc02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'JTD22345678901234', 'White Pearl', 'Brown', 0, 280000, 345000, 330000, 'in_stock', 60),
  ('dddddddd-dddd-dddd-dddd-dddddddddd04', 'cccccccc-cccc-cccc-cccc-cccccccccc03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'HYU32345678901234', 'Blue', 'Gray', 0, 72000, 89000, 84000, 'in_stock', 60),
  ('dddddddd-dddd-dddd-dddd-dddddddddd05', 'cccccccc-cccc-cccc-cccc-cccccccccc04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'NSN42345678901234', 'Black', 'Beige', 0, 260000, 320000, 305000, 'in_stock', 36),
  ('dddddddd-dddd-dddd-dddd-dddddddddd06', 'cccccccc-cccc-cccc-cccc-cccccccccc05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'KIA52345678901234', 'Red', 'Black', 0, 68000, 82000, 78000, 'in_stock', 60),
  ('dddddddd-dddd-dddd-dddd-dddddddddd07', 'cccccccc-cccc-cccc-cccc-cccccccccc06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'TYT62345678901234', 'White', 'Gray', 45000, 95000, 115000, 108000, 'in_stock', 12);

-- Customers
INSERT INTO customers (id, tenant_id, first_name, last_name, first_name_ar, last_name_ar, phone, email, city, preferred_language, preferred_contact, marketing_consent)
VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mohammed', 'Al-Rashid', 'محمد', 'الراشد', '+966551234001', 'mohammed@email.com', 'Riyadh', 'ar', 'whatsapp', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sara', 'Al-Otaibi', 'سارة', 'العتيبي', '+966551234002', 'sara@email.com', 'Jeddah', 'ar', 'phone', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Abdullah', 'Al-Dossary', 'عبدالله', 'الدوسري', '+966551234003', 'abdullah@email.com', 'Dammam', 'ar', 'whatsapp', false),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fatima', 'Al-Harbi', 'فاطمة', 'الحربي', '+966551234004', null, 'Riyadh', 'ar', 'whatsapp', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Omar', 'Hassan', 'عمر', 'حسن', '+966551234005', 'omar@email.com', 'Riyadh', 'en', 'email', true);

-- Leads
INSERT INTO leads (id, tenant_id, customer_id, branch_id, source, status, name, phone, email, notes, preferred_contact)
VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'website', 'qualified', 'Mohammed Al-Rashid', '+966551234001', 'mohammed@email.com', 'Interested in Land Cruiser', 'whatsapp'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'walk_in', 'new', 'Sara Al-Otaibi', '+966551234002', 'sara@email.com', 'Looking for an SUV', 'phone'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'whatsapp', 'contacted', 'Ahmed Al-Zahrani', '+966551234006', null, 'Asked about Camry pricing', 'whatsapp'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, null, 'campaign', 'new', 'Khalid Al-Mutairi', '+966551234007', 'khalid@email.com', 'From Instagram campaign', 'whatsapp'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'referral', 'qualified', 'Omar Hassan', '+966551234005', 'omar@email.com', 'Referred by Mohammed', 'email');

-- Deals
INSERT INTO deals (id, tenant_id, customer_id, car_unit_id, branch_id, stage, sale_type, total_amount, deposit_amount, notes, expected_close_date)
VALUES
  ('77777777-7777-7777-7777-777777777701', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'quote_sent', 'installment', 345000, 50000, 'Land Cruiser VXR - bank financing', '2024-04-15'),
  ('77777777-7777-7777-7777-777777777702', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'car_selected', 'cash', 105000, 10000, 'Cash deal for Camry', '2024-04-01'),
  ('77777777-7777-7777-7777-777777777703', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', null, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'new_lead', 'cash', null, null, 'Needs more info on Tucson', null);

-- Appointments
INSERT INTO appointments (id, tenant_id, branch_id, customer_id, lead_id, type, date, time_slot, status, notes)
VALUES
  ('88888888-8888-8888-8888-888888888801', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffffff01', 'test_drive', '2024-04-01', '10:00', 'confirmed', 'Test drive for Land Cruiser'),
  ('88888888-8888-8888-8888-888888888802', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'ffffffff-ffff-ffff-ffff-ffffffffffff02', 'showroom_visit', '2024-04-02', '14:00', 'scheduled', 'First showroom visit'),
  ('88888888-8888-8888-8888-888888888803', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', null, null, 'inspection', '2024-04-03', '11:00', 'scheduled', 'Walk-in inspection');

-- Quotes
INSERT INTO quotes (id, tenant_id, deal_id, customer_id, quote_number, status, subtotal, vat_amount, total, discount_amount, valid_until)
VALUES
  ('99999999-9999-9999-9999-999999999901', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777701', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'QT-001', 'sent', 345000, 51750, 396750, 0, '2024-04-30');

-- Quote Items
INSERT INTO quote_items (quote_id, description, description_ar, quantity, unit_price, total)
VALUES
  ('99999999-9999-9999-9999-999999999901', 'Toyota Land Cruiser VXR 2024 - White Pearl', 'تويوتا لاندكروزر VXR 2024 - أبيض لؤلؤي', 1, 345000, 345000);

-- Offers
INSERT INTO offers (tenant_id, title, title_ar, description, description_ar, discount_type, discount_value, start_date, end_date, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ramadan Special', 'عروض رمضان', 'Get up to 10% off on selected models', 'احصل على خصم حتى 10% على موديلات مختارة', 'percentage', 10, '2024-03-10', '2024-04-10', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Free Service Package', 'باقة صيانة مجانية', 'Free 3-year service package with every new car', 'باقة صيانة مجانية لمدة 3 سنوات مع كل سيارة جديدة', 'fixed', 0, '2024-01-01', '2024-12-31', true);
