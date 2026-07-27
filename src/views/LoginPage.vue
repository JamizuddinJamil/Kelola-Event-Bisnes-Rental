<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthLayout from '../components/AuthLayout.vue'

const router = useRouter()
const route = useRoute()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  const { error } = await signIn(email.value.trim(), password.value)
  loading.value = false

  if (error) {
    errorMsg.value =
      error.message === 'Invalid login credentials'
        ? 'Emel atau kata laluan salah. Cuba lagi.'
        : error.message
    return
  }

  const redirect = (route.query.redirect as string) || '/dashboard'
  router.push(redirect)
}
</script>

<template>
  <AuthLayout
    eyebrow="Akaun Bisnes"
    title="Log masuk"
    subtitle="Masuk ke sistem untuk urus lead, sebut harga dan tempahan."
  >
    <form class="space-y-5" @submit.prevent="handleSubmit">
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
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium text-ink">Kata laluan</label>
          <router-link to="/forgot-password" class="text-sm font-medium text-maroon hover:underline">
            Lupa kata laluan?
          </router-link>
        </div>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="••••••••"
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
        {{ loading ? 'Sedang log masuk…' : 'Log masuk' }}
      </button>
    </form>

    <p class="mt-8 text-center text-sm text-ink-soft">
      Belum ada akaun?
      <router-link to="/sign-up" class="font-semibold text-ink hover:underline">Daftar di sini</router-link>
    </p>
  </AuthLayout>
</template>
