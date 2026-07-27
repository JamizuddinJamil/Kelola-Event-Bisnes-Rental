<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../components/AuthLayout.vue'

const router = useRouter()
const { updatePassword } = useAuth()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

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
  const { error } = await updatePassword(password.value)
  loading.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }

  success.value = true
  setTimeout(() => router.push('/dashboard'), 1500)
}
</script>

<template>
  <AuthLayout
    eyebrow="Akaun Bisnes"
    title="Set kata laluan baharu"
    subtitle="Ini akan gantikan kata laluan lama anda."
  >
    <div v-if="success" class="rounded-xl border border-line bg-card p-5">
      <p class="font-display text-lg text-ink">Kata laluan dikemas kini</p>
      <p class="mt-2 text-[15px] text-ink-soft">Membawa anda ke dashboard…</p>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label for="password" class="block text-sm font-medium text-ink">Kata laluan baharu</label>
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
        {{ loading ? 'Menyimpan…' : 'Simpan kata laluan' }}
      </button>
    </form>
  </AuthLayout>
</template>
