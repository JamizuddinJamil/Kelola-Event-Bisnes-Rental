export interface BusinessProfile {
  id: string
  user_id: string
  business_name: string
  logo_url: string | null
  phone: string | null
  whatsapp: string | null
  address: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_holder: string | null
  terms_conditions: string | null
  created_at: string
  updated_at: string
}

export type BusinessProfileInput = Omit<
  BusinessProfile,
  'id' | 'user_id' | 'created_at' | 'updated_at' | 'logo_url'
>
