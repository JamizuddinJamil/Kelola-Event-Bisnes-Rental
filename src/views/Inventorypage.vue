<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '../components/DashboardLayout.vue'
import { useInventory } from '../composables/useinventory.ts'
import { INVENTORY_STATUS_LABELS } from '../types/Inventory'
import type { InventoryItem, InventoryItemInput, InventoryStatus } from '../types/Inventory'

const { items, loading, saving, fetchItems, createItem, updateItem, deleteItem, uploadPhoto } =
  useInventory()

onMounted(fetchItems)

const categorySuggestions = [
  'Khemah & Kanopi',
  'Kerusi & Meja',
  'Pelamin',
  'Photobooth',
  'AV & Lighting',
  'Peralatan Katering',
]

const statusOptions: InventoryStatus[] = ['tersedia', 'disewa', 'pembaikan', 'tidak_aktif']

const statusStyles: Record<InventoryStatus, string> = {
  tersedia: 'bg-night/10 text-night',
  disewa: 'bg-maroon/10 text-maroon',
  pembaikan: 'bg-gold/20 text-gold',
  tidak_aktif: 'bg-ink-soft/10 text-ink-soft',
}

// ---------- Search / filter ----------
const searchQuery = ref('')
const statusFilter = ref<InventoryStatus | 'semua'>('semua')

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return items.value.filter((i) => {
    const matchesQuery = !q || [i.item_name, i.category].some((f) => f?.toLowerCase().includes(q))
    const matchesStatus = statusFilter.value === 'semua' || i.status === statusFilter.value
    return matchesQuery && matchesStatus
  })
})

// ---------- Modal (add/edit) ----------
const showModal = ref(false)
const editingId = ref<string | null>(null)
const errorMsg = ref('')
const photoUploading = ref(false)

const emptyForm = (): InventoryItemInput => ({
  item_name: '',
  category: '',
  photo_url: null,
  quantity: 1,
  rental_price: null,
  deposit: null,
  status: 'tersedia',
})
const form = reactive<InventoryItemInput>(emptyForm())

function openAddModal() {
  editingId.value = null
  Object.assign(form, emptyForm())
  errorMsg.value = ''
  showModal.value = true
}

function openEditModal(item: InventoryItem) {
  editingId.value = item.id
  Object.assign(form, {
    item_name: item.item_name,
    category: item.category ?? '',
    photo_url: item.photo_url,
    quantity: item.quantity,
    rental_price: item.rental_price,
    deposit: item.deposit,
    status: item.status,
  })
  errorMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handlePhotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMsg.value = ''
  photoUploading.value = true
  const { data, error } = await uploadPhoto(file)
  photoUploading.value = false

  if (error) {
    errorMsg.value = 'Gagal upload gambar: ' + error.message
    return
  }
  form.photo_url = data ?? null
}

async function handleSubmit() {
  errorMsg.value = ''
  if (!form.item_name.trim()) {
    errorMsg.value = 'Nama item wajib diisi.'
    return
  }
  if (form.quantity < 0) {
    errorMsg.value = 'Kuantiti tidak boleh negatif.'
    return
  }

  const { error } = editingId.value
    ? await updateItem(editingId.value, form)
    : await createItem(form)

  if (error) {
    errorMsg.value = error.message
    return
  }
  showModal.value = false
}

async function handleDelete() {
  if (!editingId.value) return
  const confirmed = window.confirm('Padam item ni? Tindakan ini tidak boleh diundur.')
  if (!confirmed) return

  const { error } = await deleteItem(editingId.value)
  if (error) {
    errorMsg.value = error.message
    return
  }
  showModal.value = false
}

function formatRM(value: number | null) {
  if (value === null || value === undefined) return '—'
  return `RM ${value.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`
}
</script>

<template>
  <DashboardLayout active="Inventori">
    <div class="mx-auto max-w-5xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">Inventory</p>
          <h1 class="mt-2 font-display text-3xl text-ink">Inventori</h1>
        </div>
        <button
          type="button"
          class="rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-canvas transition-transform hover:scale-[1.03]"
          @click="openAddModal"
        >
          + Tambah Item
        </button>
      </div>

      <!-- Filters -->
      <div class="mt-6 flex flex-wrap gap-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari ikut nama atau kategori…"
          class="min-w-[220px] flex-1 rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
        />
        <select
          v-model="statusFilter"
          class="rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink outline-none focus:border-night focus:ring-2 focus:ring-night/15"
        >
          <option value="semua">Semua status</option>
          <option v-for="s in statusOptions" :key="s" :value="s">{{ INVENTORY_STATUS_LABELS[s] }}</option>
        </select>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="mt-10 text-sm text-ink-soft">Memuatkan…</div>

      <div v-else-if="filteredItems.length === 0" class="mt-14 text-center">
        <p class="font-display text-xl text-ink">
          {{ items.length === 0 ? 'Belum ada item inventori lagi.' : 'Tiada item sepadan carian.' }}
        </p>
        <p v-if="items.length === 0" class="mt-2 text-[15px] text-ink-soft">
          Klik "Tambah Item" untuk mula rekod inventori pertama anda.
        </p>
      </div>

      <div v-else class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          type="button"
          class="overflow-hidden rounded-2xl border border-line bg-card text-left transition-shadow hover:shadow-md"
          @click="openEditModal(item)"
        >
          <div class="flex h-36 items-center justify-center bg-canvas">
            <img v-if="item.photo_url" :src="item.photo_url" :alt="item.item_name" class="h-full w-full object-cover" />
            <span v-else class="font-utility text-xs text-ink-soft">Tiada gambar</span>
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between gap-2">
              <p class="truncate font-display text-lg text-ink">{{ item.item_name }}</p>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 font-utility text-[10px] uppercase tracking-wide"
                :class="statusStyles[item.status]"
              >
                {{ INVENTORY_STATUS_LABELS[item.status] }}
              </span>
            </div>
            <p class="mt-1 truncate text-sm text-ink-soft">{{ item.category || '—' }}</p>
            <div class="mt-3 flex items-center justify-between text-sm">
              <span class="text-ink-soft">Kuantiti: <strong class="text-ink">{{ item.quantity }}</strong></span>
              <span class="font-utility text-ink">{{ formatRM(item.rental_price) }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      @click.self="closeModal"
    >
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-xl text-ink">
            {{ editingId ? 'Kemaskini Item' : 'Tambah Item' }}
          </h2>
          <button type="button" class="text-ink-soft hover:text-ink" @click="closeModal">✕</button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <!-- Photo -->
          <div>
            <label class="block text-sm font-medium text-ink">Gambar</label>
            <div class="mt-2 flex items-center gap-4">
              <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas">
                <img v-if="form.photo_url" :src="form.photo_url" alt="Preview" class="h-full w-full object-cover" />
                <span v-else class="font-utility text-[10px] text-ink-soft">Tiada</span>
              </div>
              <label class="cursor-pointer rounded-lg border border-line bg-canvas px-4 py-2 text-sm font-medium text-ink hover:bg-canvas/70">
                {{ photoUploading ? 'Sedang upload…' : 'Pilih gambar' }}
                <input type="file" accept="image/*" class="hidden" :disabled="photoUploading" @change="handlePhotoChange" />
              </label>
            </div>
          </div>

          <div>
            <label for="item_name" class="block text-sm font-medium text-ink">Nama Item</label>
            <input
              id="item_name"
              v-model="form.item_name"
              type="text"
              required
              placeholder="cth: Khemah Kanopi 20x30"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-ink">Kategori</label>
            <input
              id="category"
              v-model="form.category"
              type="text"
              list="category-suggestions"
              placeholder="Pilih atau taip kategori baharu"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
            <datalist id="category-suggestions">
              <option v-for="c in categorySuggestions" :key="c" :value="c" />
            </datalist>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="quantity" class="block text-sm font-medium text-ink">Kuantiti</label>
              <input
                id="quantity"
                v-model.number="form.quantity"
                type="number"
                min="0"
                required
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-ink">Status</label>
              <select
                id="status"
                v-model="form.status"
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              >
                <option v-for="s in statusOptions" :key="s" :value="s">{{ INVENTORY_STATUS_LABELS[s] }}</option>
              </select>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="rental_price" class="block text-sm font-medium text-ink">Harga Sewa (RM)</label>
              <input
                id="rental_price"
                v-model.number="form.rental_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
            <div>
              <label for="deposit" class="block text-sm font-medium text-ink">Deposit (RM)</label>
              <input
                id="deposit"
                v-model.number="form.deposit"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
          </div>

          <p v-if="errorMsg" role="alert" class="rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">
            {{ errorMsg }}
          </p>

          <div class="flex items-center justify-between pt-2">
            <button
              v-if="editingId"
              type="button"
              class="text-sm font-semibold text-maroon hover:underline"
              @click="handleDelete"
            >
              Padam item
            </button>
            <span v-else />

            <div class="flex items-center gap-3">
              <button type="button" class="text-sm font-semibold text-ink-soft hover:text-ink" @click="closeModal">
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving || photoUploading"
                class="rounded-xl bg-night px-5 py-2.5 text-sm font-semibold text-canvas transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {{ saving ? 'Menyimpan…' : 'Simpan' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>