import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { InventoryItem, InventoryItemInput } from '../types/Inventory'

const items = ref<InventoryItem[]>([])
const loading = ref(false)
const saving = ref(false)

async function fetchItems() {
  const { user } = useAuth()
  if (!user.value) return

  loading.value = true
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('user_id', user.value.id)
    .order('item_name', { ascending: true })
  loading.value = false

  if (error) {
    console.error('[useInventory] fetchItems error:', error.message)
    return { error }
  }
  items.value = data ?? []
  return { data }
}

async function createItem(input: InventoryItemInput) {
  const { user } = useAuth()
  if (!user.value) return { error: new Error('Tiada sesi log masuk.') }

  saving.value = true
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({ ...input, user_id: user.value.id })
    .select()
    .single()
  saving.value = false

  if (error) return { error }
  items.value = [...items.value, data].sort((a, b) => a.item_name.localeCompare(b.item_name))
  return { data }
}

async function updateItem(id: string, input: InventoryItemInput) {
  saving.value = true
  const { data, error } = await supabase
    .from('inventory_items')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  saving.value = false

  if (error) return { error }
  items.value = items.value
    .map((i) => (i.id === id ? data : i))
    .sort((a, b) => a.item_name.localeCompare(b.item_name))
  return { data }
}

async function deleteItem(id: string) {
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) return { error }
  items.value = items.value.filter((i) => i.id !== id)
  return {}
}

// Upload sahaja ke storage dan pulangkan public URL — TIDAK write ke DB di sini.
// URL ni akan disertakan dalam payload createItem/updateItem, supaya photo
// dan data item disimpan dalam SATU write. Ini elak isu row-belum-wujud
// macam yang berlaku pada logo bisnes (rujuk fasa 2).
async function uploadPhoto(file: File) {
  const { user } = useAuth()
  if (!user.value) return { error: new Error('Tiada sesi log masuk.') }

  const ext = file.name.split('.').pop()
  const path = `${user.value.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('inventory-photos')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError }

  const { data } = supabase.storage.from('inventory-photos').getPublicUrl(path)
  return { data: data.publicUrl }
}

export function useInventory() {
  return { items, loading, saving, fetchItems, createItem, updateItem, deleteItem, uploadPhoto }
}