<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import DashboardLayout from '../components/DashboardLayout.vue'
import { useBusinessProfile } from '../composables/useBusinessProfile'
import type { BusinessProfileInput } from '../types/business'

const { profile, loading, saving, fetchProfile, saveProfile, uploadLogo } = useBusinessProfile()

const form = reactive<BusinessProfileInput>({
  business_name: '',
  phone: '',
  whatsapp: '',
  address: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_holder: '',
  terms_conditions: '',
})

// View mode by default once a profile exists; edit mode for first-time setup or when user clicks "Edit".
const isEditing = ref(false)
const logoUploading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

function populateForm() {
  if (!profile.value) return
  form.business_name = profile.value.business_name ?? ''
  form.phone = profile.value.phone ?? ''
  form.whatsapp = profile.value.whatsapp ?? ''
  form.address = profile.value.address ?? ''
  form.bank_name = profile.value.bank_name ?? ''
  form.bank_account_number = profile.value.bank_account_number ?? ''
  form.bank_account_holder = profile.value.bank_account_holder ?? ''
  form.terms_conditions = profile.value.terms_conditions ?? ''
}

onMounted(async () => {
  await fetchProfile()
  if (profile.value) {
    populateForm()
    isEditing.value = false
  } else {
    // Tiada profile lagi — terus buka form untuk first-time setup.
    isEditing.value = true
  }
})

function startEdit() {
  populateForm()
  errorMsg.value = ''
  successMsg.value = ''
  isEditing.value = true
}

function cancelEdit() {
  populateForm()
  errorMsg.value = ''
  isEditing.value = false
}

async function handleLogoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMsg.value = ''
  logoUploading.value = true
  const { error } = await uploadLogo(file)
  logoUploading.value = false

  if (error) errorMsg.value = 'Gagal upload logo: ' + error.message
}

async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.business_name.trim()) {
    errorMsg.value = 'Nama bisnes wajib diisi.'
    return
  }

  const { error } = await saveProfile(form)
  if (error) {
    errorMsg.value = error.message
    return
  }
  successMsg.value = 'Profil bisnes disimpan.'
  isEditing.value = false
}

// Small helper so blank optional fields show a muted placeholder in view mode
// instead of an empty gap, e.g. "Belum diisi".
function displayValue(value: string | null | undefined) {
  return value && value.trim() ? value : null
}
</script>

<template>
  <DashboardLayout active="Profil Bisnes">
    <div class="mx-auto max-w-2xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">Tetapan</p>
          <h1 class="mt-2 font-display text-3xl text-ink">Profil Bisnes</h1>
        </div>
        <button
          v-if="!isEditing && profile"
          type="button"
          class="shrink-0 rounded-full border border-line bg-card px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas"
          @click="startEdit"
        >
          Edit Profil
        </button>
      </div>

      <div v-if="loading" class="mt-10 text-sm text-ink-soft">Memuatkan…</div>

      <!-- ============ VIEW MODE ============ -->
      <div v-else-if="!isEditing && profile" class="mt-8 space-y-6">
        <p v-if="successMsg" role="status" class="rounded-lg bg-night/10 px-3 py-2 text-sm text-night">
          {{ successMsg }}
        </p>

        <!-- Identity card -->
        <div class="flex items-center gap-5 rounded-2xl border border-line bg-card p-6">
          <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas">
            <img
              v-if="profile.logo_url"
              :src="profile.logo_url"
              alt="Logo bisnes"
              class="h-full w-full object-cover"
            />
            <span v-else class="font-utility text-[10px] text-ink-soft">Tiada logo</span>
          </div>
          <div class="min-w-0">
            <h2 class="truncate font-display text-2xl text-ink">{{ profile.business_name }}</h2>
            <p class="mt-1 text-sm text-ink-soft">
              Kemaskini {{ new Date(profile.updated_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Contact -->
        <div class="rounded-2xl border border-line bg-card p-6">
          <h3 class="font-utility text-xs uppercase tracking-[0.15em] text-ink-soft">Maklumat Perhubungan</h3>
          <dl class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs text-ink-soft">Nombor Telefon</dt>
              <dd class="mt-1 text-[15px] text-ink" :class="{ 'italic text-ink-soft/70': !displayValue(profile.phone) }">
                {{ displayValue(profile.phone) ?? 'Belum diisi' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-soft">Nombor WhatsApp</dt>
              <dd class="mt-1 text-[15px] text-ink" :class="{ 'italic text-ink-soft/70': !displayValue(profile.whatsapp) }">
                {{ displayValue(profile.whatsapp) ?? 'Belum diisi' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-xs text-ink-soft">Alamat</dt>
              <dd class="mt-1 whitespace-pre-line text-[15px] text-ink" :class="{ 'italic text-ink-soft/70': !displayValue(profile.address) }">
                {{ displayValue(profile.address) ?? 'Belum diisi' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Bank details -->
        <div class="rounded-2xl border border-line bg-night p-6 text-canvas">
          <h3 class="font-utility text-xs uppercase tracking-[0.15em] text-gold-soft">Maklumat Bank</h3>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs text-mist/70">Nama Bank</dt>
              <dd class="mt-1 text-[15px]" :class="{ 'italic text-mist/50': !displayValue(profile.bank_name) }">
                {{ displayValue(profile.bank_name) ?? 'Belum diisi' }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-mist/70">Nama Pemegang Akaun</dt>
              <dd class="mt-1 text-[15px]" :class="{ 'italic text-mist/50': !displayValue(profile.bank_account_holder) }">
                {{ displayValue(profile.bank_account_holder) ?? 'Belum diisi' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-xs text-mist/70">Nombor Akaun</dt>
              <dd class="mt-1 font-utility text-lg tracking-wider" :class="{ 'italic text-mist/50 font-body text-[15px] tracking-normal': !displayValue(profile.bank_account_number) }">
                {{ displayValue(profile.bank_account_number) ?? 'Belum diisi' }}
              </dd>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="rounded-2xl border border-line bg-card p-6">
          <h3 class="font-utility text-xs uppercase tracking-[0.15em] text-ink-soft">Terma & Syarat</h3>
          <p
            class="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink"
            :class="{ 'italic text-ink-soft/70': !displayValue(profile.terms_conditions) }"
          >
            {{ displayValue(profile.terms_conditions) ?? 'Belum diisi — akan disertakan pada setiap sebut harga.' }}
          </p>
        </div>
      </div>

      <!-- ============ EDIT MODE ============ -->
      <form v-else class="mt-8 space-y-8" @submit.prevent="handleSubmit">
        <p v-if="!profile" class="text-[15px] text-ink-soft">
          Lengkapkan maklumat di bawah — akan digunakan pada setiap sebut harga dan invois.
        </p>

        <!-- Logo -->
        <div>
          <label class="block text-sm font-medium text-ink">Logo Bisnes</label>
          <div class="mt-2 flex items-center gap-4">
            <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-line bg-card">
              <img v-if="profile?.logo_url" :src="profile.logo_url" alt="Logo bisnes" class="h-full w-full object-cover" />
              <span v-else class="font-utility text-xs text-ink-soft">Tiada logo</span>
            </div>
            <label class="cursor-pointer rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium text-ink hover:bg-canvas">
              {{ logoUploading ? 'Sedang upload…' : 'Tukar logo' }}
              <input type="file" accept="image/*" class="hidden" :disabled="logoUploading" @change="handleLogoChange" />
            </label>
          </div>
        </div>

        <!-- Basic info -->
        <div class="space-y-5">
          <div>
            <label for="business_name" class="block text-sm font-medium text-ink">Nama Bisnes</label>
            <input
              id="business_name"
              v-model="form.business_name"
              type="text"
              required
              placeholder="cth: Kelola Event Rentals"
              class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="phone" class="block text-sm font-medium text-ink">Nombor Telefon</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="03-1234 5678"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
            <div>
              <label for="whatsapp" class="block text-sm font-medium text-ink">Nombor WhatsApp</label>
              <input
                id="whatsapp"
                v-model="form.whatsapp"
                type="tel"
                placeholder="60123456789"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-ink">Alamat</label>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              placeholder="Alamat penuh bisnes"
              class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
            />
          </div>
        </div>

        <!-- Bank details -->
        <div class="border-t border-line pt-6">
          <h2 class="font-display text-lg text-ink">Maklumat Bank</h2>
          <p class="mt-1 text-sm text-ink-soft">Dipaparkan pada invois untuk customer buat pembayaran.</p>
          <div class="mt-4 space-y-5">
            <div>
              <label for="bank_name" class="block text-sm font-medium text-ink">Nama Bank</label>
              <input
                id="bank_name"
                v-model="form.bank_name"
                type="text"
                placeholder="cth: Maybank"
                class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
              />
            </div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="bank_account_number" class="block text-sm font-medium text-ink">Nombor Akaun</label>
                <input
                  id="bank_account_number"
                  v-model="form.bank_account_number"
                  type="text"
                  inputmode="numeric"
                  placeholder="1234567890"
                  class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
                />
              </div>
              <div>
                <label for="bank_account_holder" class="block text-sm font-medium text-ink">Nama Pemegang Akaun</label>
                <input
                  id="bank_account_holder"
                  v-model="form.bank_account_holder"
                  type="text"
                  placeholder="Nama seperti dalam buku bank"
                  class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="border-t border-line pt-6">
          <label for="terms_conditions" class="block text-sm font-medium text-ink">Terma & Syarat</label>
          <p class="mt-1 text-sm text-ink-soft">Akan disertakan pada setiap sebut harga.</p>
          <textarea
            id="terms_conditions"
            v-model="form.terms_conditions"
            rows="6"
            placeholder="cth: Deposit 50% wajib untuk kunci tempahan. Baki dibayar sebelum hari majlis..."
            class="mt-2 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none focus:border-night focus:ring-2 focus:ring-night/15"
          />
        </div>

        <p v-if="errorMsg" role="alert" class="rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">{{ errorMsg }}</p>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            :disabled="saving"
            class="rounded-xl bg-night px-6 py-3 text-[15px] font-semibold text-canvas transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
          >
            {{ saving ? 'Menyimpan…' : 'Simpan Profil' }}
          </button>
          <button
            v-if="profile"
            type="button"
            class="rounded-xl px-6 py-3 text-[15px] font-semibold text-ink-soft hover:text-ink"
            @click="cancelEdit"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>
