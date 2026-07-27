<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../components/AuthLayout.vue'

const { signUp } = useAuth()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const submitted = ref(false)

const passwordsMatch = computed(
  () => confirmPassword.value === '' || password.value === confirmPassword.value
)

async function handleSubmit() {
  errorMsg.value = ''

  if (password.value.length < 8) {
    errorMsg.value = 'Kata laluan mesti sekurang-kurangnya 8 aksara.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Kata laluan tidak sepadan.'
    return
  }

  loading.value = true
  const { error } = await signUp(email.value.trim(), password.value, fullName.value.trim())
  loading.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }

  submitted.value = true
}
</script>

<template>
  <AuthLayout
    eyebrow="Akaun Bisnes"
    title="Daftar akaun"
    subtitle="Daftar akaun bisnes anda dan mula urus rental dalam 10 minit."
  >
    <div v-if="submitted" class="rounded-xl border border-line bg-card p-5">
      <p class="font-display text-lg text-ink">Semak emel anda</p>
      <p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Kami hantar pautan pengesahan ke <strong class="text-ink">{{ email }}</strong>.
        Klik pautan tu untuk aktifkan akaun sebelum log masuk.
      </p>
      <router-link to="/login" class="mt-4 inline-block text-sm font-semibold text-maroon hover:underline">
        Kembali ke log masuk
      </router-link>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label for="fullName" class="block text-sm font-medium text-ink">Nama penuh</label>
        <input
          id="fullName"
          v-model="fullName"
          type="text"
          required
          autocomplete="name"
          placeholder="Nama anda"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-night focus:ring-2 focus:ring-night/15"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-ink">Emel</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="nama@syarikat.com"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-night focus:ring-2 focus:ring-night/15"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-ink">Kata laluan</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
          placeholder="Sekurang-kurangnya 8 aksara"
          class="mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-night focus:ring-2 focus:ring-night/15"
        />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-ink">Sahkan kata laluan</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          autocomplete="new-password"
          placeholder="Taip semula kata laluan"
          class="mt-1.5 w-full rounded-xl border px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:ring-2"
          :class="passwordsMatch ? 'border-line bg-card focus:border-night focus:ring-night/15' : 'border-maroon bg-maroon/5 focus:border-maroon focus:ring-maroon/15'"
        />
        <p v-if="!passwordsMatch" class="mt-1.5 text-sm text-maroon">Kata laluan tidak sepadan.</p>
      </div>

      <p v-if="errorMsg" role="alert" class="rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-xl bg-night px-4 py-3 text-[15px] font-semibold text-canvas transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
      >
        {{ loading ? 'Sedang daftar…' : 'Daftar akaun' }}
      </button>
    </form>

    <p v-if="!submitted" class="mt-8 text-center text-sm text-ink-soft">
      Dah ada akaun?
      <router-link to="/login" class="font-semibold text-ink hover:underline">Log masuk</router-link>
    </p>
  </AuthLayout>
</template>
