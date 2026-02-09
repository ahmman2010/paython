export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          name_ar: string
          slug: string
          logo_url: string | null
          brand_color: string
          contact_phone: string | null
          whatsapp_number: string | null
          address: string | null
          address_ar: string | null
          cr_number: string | null
          vat_number: string | null
          plan_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>
      }
      branches: {
        Row: {
          id: string
          tenant_id: string
          name: string
          name_ar: string
          address: string | null
          address_ar: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          working_hours: Json | null
          appointment_capacity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['branches']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['branches']['Insert']>
      }
      users: {
        Row: {
          id: string
          auth_id: string
          tenant_id: string | null
          email: string
          full_name: string
          full_name_ar: string | null
          phone: string | null
          role: string
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      user_branch_access: {
        Row: {
          id: string
          user_id: string
          branch_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_branch_access']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['user_branch_access']['Insert']>
      }
      customers: {
        Row: {
          id: string
          tenant_id: string
          first_name: string
          last_name: string
          first_name_ar: string | null
          last_name_ar: string | null
          email: string | null
          phone: string
          national_id: string | null
          address: string | null
          city: string | null
          preferred_language: string
          preferred_contact: string
          notes: string | null
          marketing_consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      leads: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string | null
          branch_id: string | null
          assigned_to: string | null
          source: string
          status: string
          name: string
          phone: string
          email: string | null
          notes: string | null
          preferred_branch_id: string | null
          preferred_contact: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      cars: {
        Row: {
          id: string
          tenant_id: string
          make: string
          model: string
          trim: string | null
          year: number
          body_type: string
          transmission: string
          fuel_type: string
          condition: string
          description: string | null
          description_ar: string | null
          features: Json | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cars']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['cars']['Insert']>
      }
      car_units: {
        Row: {
          id: string
          car_id: string
          tenant_id: string
          branch_id: string
          vin: string | null
          sku: string | null
          exterior_color: string
          interior_color: string | null
          mileage: number | null
          cost_price: number | null
          selling_price: number
          min_price: number | null
          availability: string
          warranty_months: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['car_units']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['car_units']['Insert']>
      }
      car_media: {
        Row: {
          id: string
          car_id: string
          url: string
          type: string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['car_media']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['car_media']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          tenant_id: string
          branch_id: string
          customer_id: string | null
          lead_id: string | null
          deal_id: string | null
          assigned_to: string | null
          type: string
          date: string
          time_slot: string
          status: string
          notes: string | null
          no_show: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      deals: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          car_unit_id: string | null
          branch_id: string
          assigned_to: string | null
          stage: string
          sale_type: string
          total_amount: number | null
          deposit_amount: number | null
          notes: string | null
          lost_reason: string | null
          expected_close_date: string | null
          closed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['deals']['Insert']>
      }
      quotes: {
        Row: {
          id: string
          tenant_id: string
          deal_id: string | null
          customer_id: string
          quote_number: string
          status: string
          subtotal: number
          vat_amount: number
          total: number
          discount_amount: number
          notes: string | null
          valid_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          description: string
          description_ar: string | null
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quote_items']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['quote_items']['Insert']>
      }
      invoices: {
        Row: {
          id: string
          tenant_id: string
          deal_id: string | null
          customer_id: string
          invoice_number: string
          status: string
          subtotal: number
          vat_amount: number
          total: number
          due_date: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      payments: {
        Row: {
          id: string
          tenant_id: string
          invoice_id: string
          amount: number
          method: string
          reference: string | null
          status: string
          paid_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
      }
      webhook_subscriptions: {
        Row: {
          id: string
          tenant_id: string
          url: string
          events: string[]
          secret: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['webhook_subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['webhook_subscriptions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
