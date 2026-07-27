<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex min-h-screen bg-canvas font-body text-ink">
    <!-- Form side -->
    <div class="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
      <router-link to="/" class="mb-10 inline-flex items-center gap-2 font-display text-2xl text-ink">
        Kelola
      </router-link>

      <div class="mx-auto w-full max-w-sm">
        <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">{{ eyebrow }}</p>
        <h1 class="mt-3 font-display text-3xl text-ink">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-[15px] text-ink-soft">{{ subtitle }}</p>

        <div class="mt-8">
          <slot />
        </div>
      </div>
    </div>

    <!-- Visual side -->
    <div class="relative hidden overflow-hidden bg-night lg:block lg:w-1/2">
      <svg viewBox="0 0 320 400" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="glow2" cx="50%" cy="10%" r="70%">
            <stop offset="0%" stop-color="#E4C989" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#0F3D3E" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="400" fill="#0F3D3E" />
        <rect width="320" height="400" fill="url(#glow2)" />
        <path d="M-10 70 Q160 130 330 70" stroke="#E4C989" stroke-width="1.5" fill="none" opacity="0.5" />
        <circle v-for="i in 10" :key="'sl'+i" :cx="-10 + i * 34" :cy="70 + Math.sin(i) * 20 + 20" r="3" fill="#E4C989" />
        <path d="M20 250 L160 160 L300 250 Z" fill="#7A2E32" opacity="0.9" />
        <path d="M20 250 L160 160 L300 250" stroke="#C9973B" stroke-width="2" fill="none" />
      </svg>
      <div class="absolute bottom-12 left-12 right-12 rounded-2xl bg-card/95 p-6 shadow-xl backdrop-blur">
        <p class="font-display text-xl leading-snug text-ink">
          "Tak de dah double-booking sejak team saya guna sistem ni."
        </p>
        <p class="mt-2 font-utility text-xs text-ink-soft">Owner bisnes rental &middot; Urus lead, sebut harga & tempahan</p>
      </div>
    </div>
  </div>
</template>
