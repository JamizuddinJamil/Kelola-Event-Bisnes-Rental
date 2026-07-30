<script setup lang="ts">
import { ref, onMounted } from 'vue'

// TODO: replace with real sales WhatsApp number (format: 60123456789, no +/spaces)
const WHATSAPP_NUMBER = '60123456789'
const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`

const painPoints = [
  'Lead dari WhatsApp bercampur dengan chat peribadi, senang hilang.',
  'Tak pasti unit mana yang free — risiko double-booking khemah/kerusi.',
  'Sebut harga ditaip manual setiap kali, lambat nak balas customer.',
  'Deposit, jadual delivery dan pickup — semua track dalam kepala atau buku.',
]

const features = [
  {
    title: 'Lead Management',
    desc: 'Tangkap setiap inquiry WhatsApp jadi satu lead. Tiada lagi customer hilang dalam chat.',
    tag: 'Modul 01',
  },
  {
    title: 'Sebut Harga Automatik',
    desc: 'Jana quotation profesional dalam saat, terus hantar untuk customer approve.',
    tag: 'Modul 02',
  },
  {
    title: 'Booking & Kalendar',
    desc: 'Semak availability sebelum confirm — sistem halang double-booking secara automatik.',
    tag: 'Modul 03',
  },
  {
    title: 'Inventori',
    desc: 'Track setiap unit khemah, kerusi, peralatan AV — tahu apa free, apa reserved, apa rosak.',
    tag: 'Modul 04',
  },
  {
    title: 'Jadual Delivery & Setup',
    desc: 'Urus jadual hantar, pasang, dan ambil balik untuk seluruh team lapangan.',
    tag: 'Modul 05',
  },
  {
    title: 'Customer Management',
    desc: 'Sejarah lengkap setiap customer — booking lepas, pembayaran, dan preference mereka.',
    tag: 'Modul 06',
  },
]

const steps = [
  { n: '01', label: 'Lead masuk dari WhatsApp', desc: 'Owner atau staf create lead dalam sistem dalam beberapa saat.' },
  { n: '02', label: 'Sistem semak availability', desc: 'Tahu terus unit mana free untuk tarikh tu.' },
  { n: '03', label: 'Quotation & deposit', desc: 'Hantar sebut harga, customer approve, deposit direkod.' },
  { n: '04', label: 'Delivery & setup dijadualkan', desc: 'Team lapangan nampak jadual harian dengan jelas.' },
  { n: '05', label: 'Pickup & baki bayaran', desc: 'Sistem ingatkan pickup dan track baki sehingga selesai.' },
]

const revealed = ref<Set<string>>(new Set())
onMounted(() => {
  const els = document.querySelectorAll('[data-reveal]')
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).dataset.reveal!
          revealed.value.add(id)
          ;(entry.target as HTMLElement).classList.add('is-visible')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  els.forEach((el) => io.observe(el))
})
</script>

<template>
  <div class="bg-canvas text-ink font-body">
    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" class="font-display text-2xl tracking-tight text-ink">Kelola</a>
        <nav class="hidden items-center gap-8 font-body text-[15px] text-ink-soft md:flex">
          <a href="#ciri" class="hover:text-ink transition-colors">Ciri-ciri</a>
          <a href="#proses" class="hover:text-ink transition-colors">Cara ia berfungsi</a>
          <a href="#testimoni" class="hover:text-ink transition-colors">Testimoni</a>
        </nav>
        <div class="flex items-center gap-3">
          <router-link
            to="/login"
            class="hidden text-sm font-medium text-ink-soft hover:text-ink transition-colors sm:inline"
          >
            Log masuk
          </router-link>
          <router-link
            to="/sign-up"
            class="rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-canvas transition-transform hover:scale-[1.03] hover:bg-night-soft"
          >
            Mula percuma
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div>
          <p class="mb-5 font-utility text-xs uppercase tracking-[0.2em] text-maroon">
            Untuk bisnes sewa khemah, perkakasan & peralatan event
          </p>
          <h1 class="font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Bisnes rental anda,
            <span class="italic text-maroon">bukan lagi dalam kepala</span>
            atau buku nota.
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Kelola tukar chat WhatsApp yang berselerak jadi satu sistem: lead, sebut
            harga, booking, inventori dan jadual delivery — semua dalam satu tempat,
            senang team lapangan dan office guna sekali.
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <router-link
              to="/sign-up"
              class="rounded-full bg-maroon px-7 py-3.5 text-[15px] font-semibold text-canvas shadow-[0_8px_24px_-8px_rgba(122,46,50,0.6)] transition-transform hover:scale-[1.03]"
            >
              Mula percuma 14 hari
            </router-link>
            <a
              :href="waLink('Hai, saya nak tanya pasal sistem Kelola untuk bisnes rental event saya.')"
              target="_blank"
              rel="noopener"
              class="text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              Chat dengan kami
            </a>
          </div>
          <p class="mt-6 font-utility text-xs text-ink-soft">
            Tiada kad kredit diperlukan &middot; Setup dalam masa 10 minit
          </p>
        </div>

        <!-- Signature visual: product UI mockup showing the lead pipeline -->
        <div class="relative mx-auto w-full max-w-sm rounded-[1.5rem] border border-line bg-card p-5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-line pb-3">
            <span class="font-utility text-xs uppercase tracking-wide text-ink-soft">Papan Lead</span>
            <span class="rounded-full bg-gold/15 px-2.5 py-1 font-utility text-[10px] text-gold">7 aktif</span>
          </div>
          <div class="mt-4 space-y-3">
            <div class="rounded-xl border border-line bg-canvas p-3">
              <p class="font-utility text-[10px] uppercase tracking-wide text-maroon">Baru</p>
              <p class="mt-1 text-sm font-medium text-ink">Siti — Majlis Kahwin, 14 Sept</p>
              <p class="mt-0.5 text-xs text-ink-soft">Khemah 40x60 + kerusi 300</p>
            </div>
            <div class="rounded-xl border border-line bg-canvas p-3">
              <p class="font-utility text-[10px] uppercase tracking-wide text-gold">Sebut Harga Dihantar</p>
              <p class="mt-1 text-sm font-medium text-ink">Ahmad Corp — Majlis Korporat</p>
              <p class="mt-0.5 text-xs text-ink-soft">RM 4,200 &middot; Menunggu approve</p>
            </div>
            <div class="rounded-xl border border-night/20 bg-night p-3 text-canvas">
              <p class="font-utility text-[10px] uppercase tracking-wide text-gold-soft">Deposit Diterima</p>
              <p class="mt-1 text-sm font-medium">Kak Yati — Majlis Rumah Terbuka</p>
              <p class="mt-0.5 text-xs text-mist/80">Booking dikunci &middot; Setup 2 Okt</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pain points -->
    <section class="border-t border-line bg-night py-20 text-canvas">
      <div class="mx-auto max-w-6xl px-6">
        <p class="font-utility text-xs uppercase tracking-[0.2em] text-gold-soft">Situasi biasa</p>
        <h2 class="mt-3 max-w-xl font-display text-3xl sm:text-4xl">
          Kenal ke situasi ni?
        </h2>
        <ul class="mt-10 grid gap-5 sm:grid-cols-2">
          <li
            v-for="point in painPoints"
            :key="point"
            class="flex gap-3 rounded-xl border border-mist/15 bg-night-soft/40 p-4 text-[15px] leading-relaxed text-mist"
          >
            <span class="mt-0.5 text-gold-soft">—</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Features -->
    <section id="ciri" class="border-b border-line bg-card py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div data-reveal="features-head" class="reveal max-w-xl">
          <p class="font-utility text-xs uppercase tracking-[0.2em] text-maroon">Ciri-ciri</p>
          <h2 class="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Setiap bahagian bisnes rental anda, satu sistem.
          </h2>
        </div>
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(f, i) in features"
            :key="f.title"
            :data-reveal="'feature-' + i"
            class="reveal rounded-2xl border border-line bg-canvas p-7 transition-shadow hover:shadow-lg"
          >
            <span class="font-utility text-xs uppercase tracking-wide text-gold">{{ f.tag }}</span>
            <h3 class="mt-4 font-display text-xl text-ink">{{ f.title }}</h3>
            <p class="mt-3 text-[15px] leading-relaxed text-ink-soft">{{ f.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section id="proses" class="bg-night py-24 text-canvas">
      <div class="mx-auto max-w-6xl px-6">
        <p class="font-utility text-xs uppercase tracking-[0.2em] text-gold-soft">Cara ia berfungsi</p>
        <h2 class="mt-3 max-w-xl font-display text-3xl sm:text-4xl">
          Dari WhatsApp pertama sampai booking selesai.
        </h2>
        <ol class="mt-14 grid gap-8 md:grid-cols-5">
          <li v-for="step in steps" :key="step.n" class="border-t border-mist/25 pt-5">
            <span class="font-utility text-sm text-gold-soft">{{ step.n }}</span>
            <p class="mt-3 font-display text-lg leading-snug">{{ step.label }}</p>
            <p class="mt-2 text-sm leading-relaxed text-mist/80">{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Testimonial -->
    <section id="testimoni" class="border-b border-line bg-card py-24">
      <div class="mx-auto max-w-3xl px-6 text-center">
        <p class="font-display text-2xl italic leading-relaxed text-ink sm:text-3xl">
          "Dulu saya track semua booking dalam buku nota. Sekarang staf saya boleh
          check availability sendiri, tak payah tanya saya setiap kali."
        </p>
        <p class="mt-6 font-utility text-sm text-ink-soft">— Owner, bisnes sewa khemah & perkakasan event di Johor Bahru</p>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="bg-maroon py-20 text-canvas">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <h2 class="font-display text-3xl sm:text-4xl">Sedia nak berhenti track manual?</h2>
        <p class="max-w-md text-[15px] text-canvas/85">
          Daftar percuma, setup dalam 10 minit, dan mula urus lead pertama anda hari ini.
        </p>
        <router-link
          to="/sign-up"
          class="rounded-full bg-canvas px-8 py-3.5 text-[15px] font-semibold text-maroon transition-transform hover:scale-[1.03]"
        >
          Mula percuma 14 hari
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-canvas py-12">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink-soft sm:flex-row">
        <span class="font-display text-lg text-ink">Kelola</span>
        <span>&copy; {{ new Date().getFullYear() }} Kelola. Hak cipta terpelihara.</span>
        <router-link to="/login" class="hover:text-ink transition-colors">Log masuk</router-link>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
