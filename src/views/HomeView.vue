<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'

const router = useRouter()
const quizStore = useQuizStore()

const currentYear = new Date().getFullYear()

function startQuiz() {
  quizStore.resetQuiz()
  router.push('/quiz')
}
</script>

<template>
  <div class="home-page bg-[#0A0A0B]">
    <!-- TopNavBar -->
    <header
      class="fixed top-0 z-50 w-full border-b border-outline-variant/15 bg-[#131314]/85 backdrop-blur-xl"
    >
      <nav
        class="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4"
        aria-label="Main"
      >
        <RouterLink
          to="/"
          class="group flex shrink-0 items-baseline gap-2 font-['Plus_Jakarta_Sans'] no-underline"
        >
          <span
            class="text-xl font-bold tracking-tight text-primary drop-shadow-[0_0_12px_rgba(215,186,255,0.35)] sm:text-2xl"
            >Quiziiz</span
          >
          <span class="hidden text-xs font-medium text-on-surface-variant/80 sm:inline"
            >Quiz &amp; challenges</span
          >
        </RouterLink>

        <div
          class="order-3 flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto sm:justify-end sm:gap-2 md:gap-6"
        >
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-2 text-sm font-medium text-on-surface no-underline transition-colors hover:bg-surface-container-highest/60 hover:text-primary"
            active-class="!text-primary"
            >Home</RouterLink
          >
          <RouterLink
            to="/about"
            class="rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant no-underline transition-colors hover:bg-surface-container-highest/60 hover:text-primary"
            active-class="!text-primary"
            >About</RouterLink
          >
        </div>

        <div class="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            class="hidden rounded-lg border border-outline-variant/30 px-3 py-2 text-sm font-semibold text-on-surface transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex"
            @click="startQuiz"
          >
            Quick start
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl bg-tertiary px-4 py-2.5 text-sm font-bold text-on-tertiary shadow-[0_0_20px_rgba(255,185,76,0.2)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:px-5"
            @click="startQuiz"
          >
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1"
              >play_arrow</span
            >
            <span>Start</span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Main Content Canvas -->
    <main class="mx-auto max-w-[1600px] px-6 pb-16 pt-28 md:px-12 lg:px-16">
      <section class="mb-20">
        <div
          class="relative flex min-h-[500px] flex-col items-center gap-12 overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-gradient-to-br from-[#1c1b1c] to-[#0A0A0B] p-8 md:flex-row md:p-16"
        >
          <div class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-container/20 blur-[100px]"></div>
          <div
            class="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary-container/10 blur-[100px]"
          ></div>
          <div class="z-10 flex-1">
            <span
              class="mb-6 inline-block rounded-full border border-tertiary/30 px-4 py-1 text-xs font-bold uppercase tracking-widest text-tertiary"
              >Featured Anthology</span
            >
            <h1 class="mb-6 font-headline text-5xl font-extrabold leading-[1.1] tracking-tighter text-on-surface md:text-7xl">
              The
              <span class="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent"
                >Cosmic</span
              >
              Inquiry
            </h1>
            <p class="mb-10 max-w-xl font-body text-lg leading-relaxed text-on-surface-variant/80">
              Journey through the celestial unknowns. A curated series of existential challenges
              designed for the modern intellectual mind.
            </p>
            <div class="flex flex-wrap gap-4">
              <button
                class="flex items-center gap-2 rounded-xl bg-tertiary px-8 py-4 font-bold text-on-tertiary shadow-[0_0_30px_rgba(255,185,76,0.3)] transition-all hover:scale-105 active:scale-95"
                @click="startQuiz"
              >
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                  >play_arrow</span
                >
                Start Quiz
              </button>
              <button
                class="rounded-xl border border-outline-variant/20 bg-surface-container-highest/40 px-8 py-4 font-bold text-on-surface backdrop-blur-md transition-all hover:bg-surface-container-highest"
              >
                View Syllabus
              </button>
            </div>
          </div>
          <div class="relative z-10 hidden aspect-square w-full max-w-md flex-1 lg:block">
            <div class="absolute inset-0 rotate-3 overflow-hidden rounded-3xl shadow-2xl">
              <img
                alt="Cosmic Nebula"
                class="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy5lCzxFiFMCqiR1SirtAqzmGXBq6iy1C62g46dM-S7Q6kpCW8pBzAQ6PaMaRPSOYA9Sk4SvqynXSWlYrx-ndL0YF-uQrozh3OeV1FE1k3mg347-C3Ew8baatFCNfHhiwGFobtoUTWVXgbXyvoFfXCuUCdiafK61WyK4eaCytkvA2XlJ0xNtXXi__5SB8CkY4f_Sel-gGq_yLZMBZCz8iZI67lczn75-iOh-uJnGu6CrzQdHcLN-1oEvM63KSBx81xokwlqwbVnw"
              />
            </div>
            <div
              class="glass-panel absolute -bottom-6 -left-6 flex h-32 w-32 -rotate-6 flex-col items-center justify-center rounded-2xl border border-outline-variant/20 p-4"
            >
              <div class="text-2xl font-black text-tertiary">4.9</div>
              <div class="text-[10px] uppercase tracking-tighter text-on-surface-variant">
                Global Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- (Kept your full lower layout) -->
      <section class="mb-20">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <h2 class="font-headline text-3xl font-bold tracking-tight">Today's Curation</h2>
            <p class="mt-2 text-sm text-on-surface-variant">
              Tailored artifacts based on your elite tier status.
            </p>
          </div>
          <button class="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View Archive <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <div
            class="group relative overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-low md:col-span-2 lg:row-span-2"
          >
            <div class="h-[400px] w-full overflow-hidden">
              <img
                alt="Mathematics of Nature"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVsHJr3X0yicCrF_7RkmnziHrPTRgITy4mb_7Ue1sTVOMJQh4tT8H4n9nMEPhqVJITBV1YFWFCKHKmKJHhb_VvCFWqMKWjCqXUjQ93OBo2347T1UI03sY913eCc-J66LC96xcqzvrfzs98YhtSWOPC8j0Kdyh_GRGnChnuH_xmaRRQnsMI_Yge7ZtDMDVDmjf6Xgo_bJnHMBrUWdaFcl21giwWOh30wM2Kx4eeGxroEvJeOQSxy7RPKyyD7OJOzmQOlh54oNbEcA"
              />
            </div>
            <div
              class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent p-8"
            >
              <div class="mb-4 flex items-center gap-2">
                <span class="rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase text-primary"
                  >Mathematics</span
                >
                <span class="text-[10px] text-on-surface-variant">12 Mins</span>
              </div>
              <h3 class="mb-4 text-3xl font-bold leading-tight transition-colors group-hover:text-primary">
                The Architecture of Geometry
              </h3>
              <p class="mb-6 line-clamp-2 text-sm text-on-surface-variant">
                Explore the invisible blueprints of the natural world through our most complex
                logic series yet.
              </p>
              <div class="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  class="h-full w-[65%] bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(215,186,255,0.4)]"
                ></div>
              </div>
              <div class="mt-2 flex justify-between">
                <span class="text-[10px] uppercase text-on-surface-variant">Current Mastery</span>
                <span class="text-[10px] font-bold text-primary">65%</span>
              </div>
            </div>
          </div>
          <div
            class="group relative flex flex-col justify-between rounded-3xl border border-outline-variant/10 bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-bright lg:col-span-1"
          >
            <div>
              <span
                class="material-symbols-outlined mb-4 text-3xl text-secondary"
                style="font-variation-settings: 'FILL' 1"
                >history_edu</span
              >
              <h4 class="mb-2 text-xl font-bold">Lost Scripts</h4>
              <p class="text-sm text-on-surface-variant">Deciphering ancient cryptographic alphabets.</p>
            </div>
          </div>
          <div
            class="group relative flex flex-col justify-between rounded-3xl border border-outline-variant/10 bg-surface-container-low p-6 transition-all duration-300 hover:bg-surface-bright lg:col-span-1"
          >
            <div>
              <span
                class="material-symbols-outlined mb-4 text-3xl text-tertiary"
                style="font-variation-settings: 'FILL' 1"
                >psychology</span
              >
              <h4 class="mb-2 text-xl font-bold">Mental Models</h4>
              <p class="text-sm text-on-surface-variant">
                Strategic frameworks for high-stakes decision making.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer
      class="border-t border-outline-variant/20 bg-[#0A0A0B]/80"
      role="contentinfo"
    >
      <div
        class="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:py-12"
      >
        <div class="text-center sm:text-left">
          <p class="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-on-surface">
            Quiziiz
          </p>
          <p class="mt-1 text-xs text-on-surface-variant/70">
            © {{ currentYear }} Quiziiz. All rights reserved.
          </p>
        </div>
        <nav
          class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant/80 sm:justify-end"
          aria-label="Footer"
        >
          <RouterLink
            to="/about"
            class="no-underline transition-colors hover:text-primary"
            >About</RouterLink
          >
          <a href="#" class="no-underline transition-colors hover:text-primary">Privacy</a>
          <a href="#" class="no-underline transition-colors hover:text-primary">Terms</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

.home-page {
  background-color: #0a0a0b;
  color: #e5e2e3;
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.glass-panel {
  background: rgba(28, 27, 28, 0.6);
  backdrop-filter: blur(20px);
}
</style>
