<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../components/AuthLayout.vue'

const { sendPasswordReset } = useAuth()

const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const sent = ref(false)

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  const { error } = await sendPasswordReset(email.value.trim())
  loading.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }
  sent.value = true
}
</script>

<template>
  <AuthLayout
    eyebrow="Akaun Bisnes"
    title="Lupa kata laluan"
    subtitle="Masukkan emel anda, kami hantar pautan untuk set semula."
  >
    <div v-if="sent" class="rounded-xl border border-line bg-card p-5">
      <p class="font-display text-lg text-ink">Pautan dihantar</p>
      <p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Semak emel <strong class="text-ink">{{ email }}</strong> untuk pautan set semula kata laluan.
        Tak nampak? Semak folder spam.
      </p>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
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

      <p v-if="errorMsg" role="alert" class="rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-xl bg-night px-4 py-3 text-[15px] font-semibold text-canvas transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
      >
        {{ loading ? 'Menghantar…' : 'Hantar pautan set semula' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-ink-soft">
      Ingat kata laluan?
      <router-link to="/login" class="font-semibold text-ink hover:underline">Log masuk</router-link>
    </p>
  </AuthLayout>
</template>
