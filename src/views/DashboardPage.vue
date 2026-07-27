<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, signOut } = useAuth()

async function handleSignOut() {
  await signOut()
  router.push('/login')
}

const navItems = [
  { label: 'Lead', active: true },
  { label: 'Sebut Harga', active: false },
  { label: 'Tempahan', active: false },
  { label: 'Inventori', active: false },
  { label: 'Penghantaran', active: false },
]
</script>

<template>
  <div class="flex min-h-screen bg-canvas font-body text-ink">
    <!-- Sidebar -->
    <aside class="hidden w-64 shrink-0 border-r border-line bg-card md:flex md:flex-col">
      <div class="px-6 py-6">
        <router-link to="/" class="font-display text-2xl text-ink">Kelola</router-link>
      </div>
      <nav class="flex-1 space-y-1 px-3">
        <a
          v-for="item in navItems"
          :key="item.label"
          href="#"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="item.active ? 'bg-night text-canvas' : 'text-ink-soft hover:bg-canvas hover:text-ink'"
        >
          {{ item.label }}
        </a>
      </nav>
      <div class="border-t border-line p-4">
        <p class="truncate text-sm font-medium text-ink">{{ user?.email }}</p>
        <button
          class="mt-2 text-sm font-medium text-maroon hover:underline"
          @click="handleSignOut"
        >
          Log keluar
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex flex-1 flex-col">
      <header class="flex items-center justify-between border-b border-line bg-card px-6 py-4 md:hidden">
        <span class="font-display text-xl text-ink">Kelola</span>
        <button class="text-sm font-medium text-maroon hover:underline" @click="handleSignOut">
          Log keluar
        </button>
      </header>

      <main class="flex flex-1 items-center justify-center px-6 py-16">
        <div class="max-w-md text-center">
          <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">Dashboard</p>
          <h1 class="mt-3 font-display text-3xl text-ink">Belum ada apa-apa di sini lagi.</h1>
          <p class="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Ni tempat untuk urus lead, sebut harga, tempahan dan inventori. Modul-modul
            ini akan ditambah pada langkah seterusnya.
          </p>
        </div>
      </main>
    </div>
  </div>
</template>
