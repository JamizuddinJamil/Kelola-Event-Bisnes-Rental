import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { BusinessProfile, BusinessProfileInput } from '../types/business'

const profile = ref<BusinessProfile | null>(null)
const loading = ref(false)
const saving = ref(false)

async function fetchProfile() {
  const { user } = useAuth()
  if (!user.value) return

  loading.value = true
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('user_id', user.value.id)
    .maybeSingle()
  loading.value = false

  if (error) {
    console.error('[useBusinessProfile] fetchProfile error:', error.message)
    return { error }
  }
  profile.value = data
  return { data }
}

async function saveProfile(input: BusinessProfileInput) {
  const { user } = useAuth()
  if (!user.value) return { error: new Error('Tiada sesi log masuk.') }

  saving.value = true
  const { data, error } = await supabase
    .from('business_profiles')
    // upsert on user_id: create row if belum ada, update kalau dah ada
    .upsert({ ...input, user_id: user.value.id }, { onConflict: 'user_id' })
    .select()
    .single()
  saving.value = false

  if (error) {
    return { error }
  }
  profile.value = data
  return { data }
}

async function uploadLogo(file: File) {
  const { user } = useAuth()
  if (!user.value) return { error: new Error('Tiada sesi log masuk.') }

  // Simpan dalam folder {user_id}/ supaya RLS storage policy match
  const ext = file.name.split('.').pop()
  const path = `${user.value.id}/logo-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true })

  if (uploadError) {
    return { error: uploadError }
  }

  const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(path)
  const logoUrl = publicUrlData.publicUrl

const { data, error: upsertError } = await supabase
    .from('business_profiles')
    .upsert(
      {
        user_id: user.value.id,
        logo_url: logoUrl,
        business_name: profile.value?.business_name || 'Bisnes Baharu',
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (upsertError) {
    return { error: upsertError }
  }

  profile.value = data
  return { data: logoUrl }
}

export function useBusinessProfile() {
  return { profile, loading, saving, fetchProfile, saveProfile, uploadLogo }
}
