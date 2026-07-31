import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { Customer, CustomerInput } from '../types/customer'

const customers = ref<Customer[]>([])
const loading = ref(false)
const saving = ref(false)

async function fetchCustomers() {
  const { user } = useAuth()
  if (!user.value) return

  loading.value = true
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.value.id)
    .order('name', { ascending: true })
  loading.value = false

  if (error) {
    console.error('[useCustomers] fetchCustomers error:', error.message)
    return { error }
  }
  customers.value = data ?? []
  return { data }
}

async function createCustomer(input: CustomerInput) {
  const { user } = useAuth()
  if (!user.value) return { error: new Error('Tiada sesi log masuk.') }

  saving.value = true
  const { data, error } = await supabase
    .from('customers')
    .insert({ ...input, user_id: user.value.id })
    .select()
    .single()
  saving.value = false

  if (error) return { error }
  customers.value = [...customers.value, data].sort((a, b) => a.name.localeCompare(b.name))
  return { data }
}

async function updateCustomer(id: string, input: CustomerInput) {
  saving.value = true
  const { data, error } = await supabase
    .from('customers')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  saving.value = false

  if (error) return { error }
  customers.value = customers.value
    .map((c) => (c.id === id ? data : c))
    .sort((a, b) => a.name.localeCompare(b.name))
  return { data }
}

async function deleteCustomer(id: string) {
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) return { error }
  customers.value = customers.value.filter((c) => c.id !== id)
  return {}
}

export function useCustomers() {
  return { customers, loading, saving, fetchCustomers, createCustomer, updateCustomer, deleteCustomer }
}