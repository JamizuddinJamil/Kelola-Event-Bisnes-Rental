// Types mengikut struktur jadual `business_profiles`
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

// Data input untuk CREATE / INSERT profil baru
// (Sebab 'id', 'user_id', 'created_at', & 'updated_at' dijana automatik oleh Supabase)
export type BusinessProfileInput = Omit<
  BusinessProfile,
  'id' | 'user_id' | 'created_at' | 'updated_at'
> & {
  logo_url?: string | null
}

// Data input untuk UPDATE / EDIT profil
export type BusinessProfileUpdate = Partial<BusinessProfileInput>