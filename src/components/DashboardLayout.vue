<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

defineProps<{
  active: string
}>()

const router = useRouter()
const { user, signOut } = useAuth()

async function handleSignOut() {
  await signOut()
  router.push('/login')
}

const navItems = [
  { label: 'Lead', to: '/dashboard' },
  { label: 'Sebut Harga', to: '/dashboard' },
  { label: 'Tempahan', to: '/dashboard' },
  { label: 'Inventori', to: '/dashboard' },
  { label: 'Penghantaran', to: '/dashboard' },
  { label: 'Profil Bisnes', to: '/dashboard/business-profile' },
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
        <router-link
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="item.label === active ? 'bg-night text-canvas' : 'text-ink-soft hover:bg-canvas hover:text-ink'"
        >
          {{ item.label }}
        </router-link>
      </nav>
      <div class="border-t border-line p-4">
        <p class="truncate text-sm font-medium text-ink">{{ user?.email }}</p>
        <button class="mt-2 text-sm font-medium text-maroon hover:underline" @click="handleSignOut">
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

      <main class="flex-1 px-6 py-12">
        <slot />
      </main>
    </div>
  </div>
</template>
