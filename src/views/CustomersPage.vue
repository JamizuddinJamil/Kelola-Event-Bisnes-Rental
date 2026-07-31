<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import DashboardLayout from '../components/DashboardLayout.vue'
import { useCustomers } from '../composables/Usecustomers.ts'
import type { Customer, CustomerInput } from '../types/customer.ts'

const { customers, loading, saving, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } =
  useCustomers()

onMounted(fetchCustomers)

// ---------- Search ----------
const searchQuery = ref('')
const filteredCustomers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter((c) =>
    [c.name, c.phone, c.email, c.company].some((field) => field?.toLowerCase().includes(q))
  )
})

// ---------- Modal (add/edit) ----------
const showModal = ref(false)
const editingId = ref<string | null>(null)
const errorMsg = ref('')

const emptyForm = (): CustomerInput => ({
  name: '',
  phone: '',
  email: '',
  address: '',
  company: '',
  notes: '',
})
const form = reactive<CustomerInput>(emptyForm())

function openAddModal() {
  editingId.value = null
  Object.assign(form, emptyForm())
  errorMsg.value = ''
  showModal.value = true
}

function openEditModal(customer: Customer) {
  editingId.value = customer.id
  Object.assign(form, {
    name: customer.name,
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    address: customer.address ?? '',
    company: customer.company ?? '',
    notes: customer.notes ?? '',
  })
  errorMsg.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function handleSubmit() {
  errorMsg.value = ''
  if (!form.name.trim()) {
    errorMsg.value = 'Nama customer wajib diisi.'
    return
  }

  const { error } = editingId.value
    ? await updateCustomer(editingId.value, form)
    : await createCustomer(form)

  if (error) {
    errorMsg.value = error.message
    return
  }
  showModal.value = false
}

async function handleDelete() {
  if (!editingId.value) return
  const confirmed = window.confirm('Padam customer ni? Tindakan ini tidak boleh diundur.')
  if (!confirmed) return

  const { error } = await deleteCustomer(editingId.value)
  if (error) {
    errorMsg.value = error.message
    return
  }
  showModal.value = false
}

function displayValue(value: string | null | undefined) {
  return value && value.trim() ? value : '—'
}
</script>

<template>
  <DashboardLayout active="Customer">
    <div class="mx-auto max-w-4xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">Customer Management</p>
          <h1 class="mt-2 font-display text-3xl text-ink">Customer</h1>
        </div>
        <button
          type="button"
          class="rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-canvas transition-transform hover:scale-[1.03]"
          @click="openAddModal"
        >
          + Tambah Customer
        </button>
      </div>

      <!-- Search -->
      <div class="mt-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari ikut nama, telefon, emel atau syarikat…"
          class="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
        />
      </div>

      <!-- List -->
      <div v-if="loading" class="mt-10 text-sm text-ink-soft">Memuatkan…</div>

      <div v-else-if="filteredCustomers.length === 0" class="mt-14 text-center">
        <p class="font-display text-xl text-ink">
          {{ customers.length === 0 ? 'Belum ada customer lagi.' : 'Tiada customer sepadan carian.' }}
        </p>
        <p v-if="customers.length === 0" class="mt-2 text-[15px] text-ink-soft">
          Klik "Tambah Customer" untuk mula rekod customer pertama anda.
        </p>
      </div>

      <div v-else class="mt-6 space-y-3">
        <button
          v-for="c in filteredCustomers"
          :key="c.id"
          type="button"
          class="flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-card p-5 text-left transition-shadow hover:shadow-md"
          @click="openEditModal(c)"
        >
          <div class="min-w-0">
            <p class="truncate font-display text-lg text-ink">{{ c.name }}</p>
            <p class="mt-1 truncate text-sm text-ink-soft">
              {{ displayValue(c.company) }} &middot; {{ displayValue(c.phone) }}
            </p>
          </div>
          <span class="shrink-0 font-utility text-xs text-ink-soft">Edit →</span>
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
            {{ editingId ? 'Kemaskini Customer' : 'Tambah Customer' }}
          </h2>
          <button type="button" class="text-ink-soft hover:text-ink" @click="closeModal">✕</button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-ink">Nama Customer</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Nama penuh"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="phone" class="block text-sm font-medium text-ink">Telefon</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="0123456789"
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-ink">Emel</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="nama@emel.com"
                class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
          </div>

          <div>
            <label for="company" class="block text-sm font-medium text-ink">Syarikat</label>
            <input
              id="company"
              v-model="form.company"
              type="text"
              placeholder="Pilihan — untuk customer korporat"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-ink">Alamat</label>
            <textarea
              id="address"
              v-model="form.address"
              rows="2"
              placeholder="Alamat penghantaran / rumah"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-ink">Nota</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="cth: Suka warna gold, pernah tempah 2 kali sebelum ini…"
              class="mt-1.5 w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
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
              Padam customer
            </button>
            <span v-else />

            <div class="flex items-center gap-3">
              <button type="button" class="text-sm font-semibold text-ink-soft hover:text-ink" @click="closeModal">
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
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