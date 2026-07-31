export type InventoryStatus = 'tersedia' | 'disewa' | 'pembaikan' | 'tidak_aktif'

export const INVENTORY_STATUS_LABELS: Record<InventoryStatus, string> = {
  tersedia: 'Tersedia',
  disewa: 'Disewa',
  pembaikan: 'Dalam Pembaikan',
  tidak_aktif: 'Tidak Aktif',
}

export interface InventoryItem {
  id: string
  user_id: string
  item_name: string
  category: string | null
  photo_url: string | null
  quantity: number
  rental_price: number | null
  deposit: number | null
  status: InventoryStatus
  created_at: string
  updated_at: string
}

export type InventoryItemInput = Omit<InventoryItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>