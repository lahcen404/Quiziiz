<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'

const quiz = useQuizStore()
const currentYear = new Date().getFullYear()

const difficulties = [
  { value: 'easy' as const, label: 'Easy', sub: 'Warm up' },
  { value: 'medium' as const, label: 'Medium', sub: 'Balanced' },
  { value: 'hard' as const, label: 'Hard', sub: 'Expert' },
]

const choices = computed(() => quiz.currentQuestion?.all_choices ?? [])
const questionNumber = computed(() => quiz.currentQuestionIndex + 1)
const progressPct = computed(() => (questionNumber.value / 5) * 100)

const showTimer = computed(() => quiz.setupPhase === 'playing' && !quiz.isGameOver)

const timeUrgent = computed(
  () => showTimer.value && quiz.timeLeft <= 60 && quiz.timeLeft > 0,
)
const timeCritical = computed(
  () => showTimer.value && quiz.timeLeft <= 15 && quiz.timeLeft > 0,
)

function choiceClasses(choice: string) {
  const base =
    'quiz-option group relative flex w-full max-w-xl items-center rounded-xl border p-4 text-left transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-5'

  if (!quiz.selectedAnswer) {
    return [
      base,
      'mx-auto border-outline-variant/25 bg-surface-container-low hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_8px_28px_-8px_rgba(215,186,255,0.25)] active:scale-[0.99]',
      'option-enter',
    ]
  }

  const correct = choice === quiz.currentQuestion?.correct_answer
  const selected = choice === quiz.selectedAnswer

  if (correct) {
    return [
      base,
      'mx-auto border-emerald-500/50 bg-emerald-950/35 shadow-[0_0_24px_-4px_rgba(52,211,153,0.35)]',
      selected ? 'ring-2 ring-emerald-400/40' : '',
    ]
  }
  if (selected && !correct) {
    return [base, 'mx-auto border-red-500/55 bg-red-950/30 shadow-[0_0_20px_-6px_rgba(248,113,113,0.35)]']
  }
  return [base, 'mx-auto border-outline-variant/15 opacity-45']
}

onMounted(() => {
  void quiz.loadCategoriesIfNeeded()
})
</script>

<template>
  <div
    class="quiz-page relative flex min-h-screen flex-col overflow-x-hidden bg-[#131314] text-on-background font-body"
  >
    <!-- Soft animated background (decorative) -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div class="animate-orb-a absolute -left-1/3 top-0 h-[40vh] w-[70vw] rounded-full bg-primary/10 blur-[100px]" />
      <div class="animate-orb-b absolute -right-1/4 bottom-0 h-[35vh] w-[60vw] rounded-full bg-secondary/8 blur-[90px]" />
    </div>

    <!-- Nav: content aligned with main column -->
    <nav
      class="fixed top-0 z-50 w-full border-b border-outline-variant/10 bg-[#131314]/85 backdrop-blur-xl"
      :class="showTimer && timeUrgent ? 'shadow-[0_0_32px_-8px_rgba(255,185,76,0.2)]' : ''"
    >
      <div
        class="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:max-w-3xl sm:px-6 sm:py-4"
      >
        <RouterLink
          to="/"
          class="font-['Plus_Jakarta_Sans'] text-xl font-bold tracking-tight text-primary no-underline transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-2xl"
        >
          Quiziiz
        </RouterLink>
        <div
          v-if="showTimer"
          class="flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-high/90 px-3 py-1.5 text-sm font-headline shadow-inner transition-all duration-300 sm:px-4 sm:py-2"
          :class="{
            'border-tertiary/40 shadow-[0_0_18px_-4px_rgba(255,185,76,0.35)]': timeUrgent,
            'animate-timer-pulse': timeCritical,
          }"
        >
          <span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1"
            >timer</span
          >
          <span
            class="min-w-13 tabular-nums font-bold text-tertiary"
            :class="timeCritical ? 'text-red-400' : ''"
          >
            {{ quiz.formattedTime }}
          </span>
        </div>
        <div
          v-else
          class="rounded-full border border-outline-variant/15 bg-surface-container-low/80 px-3 py-1.5 text-xs font-medium text-on-surface-variant sm:text-sm"
        >
          Setup
        </div>
      </div>
    </nav>

    <!-- Main: vertically centered quiz area -->
    <main
      class="relative flex w-full flex-1 flex-col items-center justify-center px-4 pb-12 pt-20 text-center sm:px-6 sm:pb-16 sm:pt-24"
    >
      <div
        class="flex w-full max-w-2xl flex-1 flex-col items-center justify-center sm:max-w-3xl"
      >
      <!-- Step 1: choose category -->
      <div
        v-if="quiz.setupPhase === 'category'"
        class="glass-card w-full max-w-xl animate-card-in rounded-2xl border border-outline-variant/15 p-6 text-left shadow-2xl sm:p-8"
      >
        <h2 class="font-headline text-2xl font-bold text-on-surface sm:text-3xl">Choose a category</h2>
        <p class="mt-2 text-sm text-on-surface-variant">
          Pick a topic — all levels will use this category.
        </p>
        <div v-if="quiz.categoriesLoading" class="mt-8 flex justify-center py-12">
          <div class="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <div
          v-else
          class="mt-6 grid max-h-[min(420px,50vh)] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          <button
            v-for="cat in quiz.categories"
            :key="cat.id"
            type="button"
            class="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-left text-sm text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_8px_24px_-8px_rgba(215,186,255,0.2)] active:scale-[0.99]"
            @click="quiz.pickCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Step 2: choose difficulty -->
      <div
        v-else-if="quiz.setupPhase === 'difficulty'"
        class="glass-card w-full max-w-xl animate-card-in rounded-2xl border border-outline-variant/15 p-6 text-left shadow-2xl sm:p-8"
      >
        <button
          type="button"
          class="mb-4 flex items-center gap-1 text-sm text-primary transition hover:underline"
          @click="quiz.goBackToCategory()"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Change category
        </button>
        <h2 class="font-headline text-2xl font-bold text-on-surface sm:text-3xl">Choose difficulty</h2>
        <p class="mt-2 text-sm text-on-surface-variant">
          Category:
          <span class="font-medium text-primary">{{ quiz.selectedCategoryName }}</span>
        </p>
        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            v-for="d in difficulties"
            :key="d.value"
            type="button"
            class="rounded-xl border px-4 py-4 text-center transition-all"
            :class="
              quiz.selectedDifficulty === d.value
                ? 'border-primary bg-primary/15 shadow-[0_0_24px_-6px_rgba(215,186,255,0.35)] ring-1 ring-primary/30'
                : 'border-outline-variant/25 bg-surface-container-low hover:border-primary/35'
            "
            @click="quiz.pickDifficulty(d.value)"
          >
            <span class="block font-headline text-lg font-bold text-on-surface">{{ d.label }}</span>
            <span class="mt-1 block text-xs text-on-surface-variant">{{ d.sub }}</span>
          </button>
        </div>
        <button
          type="button"
          class="mt-8 w-full rounded-xl bg-primary-container py-4 text-sm font-headline font-bold uppercase tracking-wider text-on-primary-container shadow-[0_0_28px_rgba(74,20,140,0.4)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.99]"
          :disabled="!quiz.selectedDifficulty"
          @click="quiz.beginQuizSession()"
        >
          Start quiz
        </button>
      </div>

      <!-- Step 3: play -->
      <template v-else-if="quiz.setupPhase === 'playing'">
      <!-- Progress header: centered -->
      <header class="mb-10 w-full max-w-xl animate-header-in">
        <p class="mb-1 line-clamp-2 text-[11px] text-on-surface-variant/90">
          {{ quiz.selectedCategoryName }}
        </p>
        <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-secondary">Level {{ quiz.currentLevel }} · {{ quiz.selectedDifficulty }}</p>
        <div class="mb-4 flex flex-col items-center gap-1 sm:gap-2">
          <h1 class="font-headline text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl md:text-4xl">
            Question <span class="text-primary">{{ questionNumber }}</span>
            <span class="text-on-surface-variant">/ 5</span>
          </h1>
          <p class="text-sm text-on-surface-variant">
            Score
            <span class="tabular-nums font-bold text-primary">{{ quiz.score }}</span>
            pts
          </p>
        </div>
        <div
          class="mx-auto h-2 w-full max-w-md overflow-hidden rounded-full bg-surface-container-highest/90 ring-1 ring-outline-variant/10"
        >
          <div
            class="h-full rounded-full bg-gradient-to-r from-primary-container via-primary to-tertiary shadow-[0_0_16px_rgba(215,186,255,0.35)] transition-[width] duration-700 ease-out"
            :style="{ width: `${progressPct}%` }"
          />
        </div>
      </header>

      <!-- Loading: centered skeleton -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="quiz.loading"
          key="load"
          class="w-full max-w-xl rounded-2xl border border-outline-variant/15 bg-surface-container-low/40 p-8 backdrop-blur-sm"
          role="status"
        >
          <div class="mx-auto mb-4 h-4 w-3/4 max-w-sm animate-shimmer rounded-lg" />
          <div class="mx-auto mb-6 h-4 w-full max-w-md animate-shimmer rounded-lg [animation-delay:0.1s]" />
          <div class="space-y-3">
            <div
              v-for="n in 4"
              :key="n"
              class="mx-auto h-14 max-w-xl animate-shimmer rounded-xl"
              :style="{ animationDelay: `${0.15 + n * 0.08}s` }"
            />
          </div>
          <p class="mt-6 text-sm text-on-surface-variant">Loading questions…</p>
        </div>
      </Transition>

      <!-- Question card: centered -->
      <div v-if="!quiz.loading" class="flex w-full flex-col items-center">
        <Transition name="question-swap" mode="out-in">
          <div
            v-if="quiz.currentQuestion && !quiz.isGameOver"
            :key="`${quiz.currentLevel}-${quiz.currentQuestionIndex}`"
            class="w-full max-w-xl"
          >
            <div
              class="glass-card animate-card-in relative overflow-hidden rounded-2xl border border-outline-variant/15 p-6 shadow-2xl shadow-black/40 ring-1 ring-primary/10 sm:p-8 md:p-10"
            >
              <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

              <div class="relative z-10 flex flex-col items-center">
                <span
                  class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-container/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
                >
                  <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
                  Curated quiz
                </span>

                <h2
                  class="mb-10 max-w-prose font-headline text-lg font-bold leading-snug text-on-surface sm:text-xl md:text-2xl"
                  v-html="quiz.currentQuestion.question"
                />

                <div class="flex w-full flex-col items-center gap-3">
                  <button
                    v-for="(choice, index) in choices"
                    :key="`${choice}-${index}`"
                    type="button"
                    :class="choiceClasses(choice)"
                    :style="{ animationDelay: `${index * 55}ms` }"
                    :disabled="!!quiz.selectedAnswer"
                    @click="quiz.submitAnswer(choice)"
                  >
                    <span
                      class="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-sm font-bold text-on-surface-variant transition-colors group-hover:bg-primary-container group-hover:text-primary sm:h-10 sm:w-10"
                    >
                      {{ String.fromCharCode(65 + index) }}
                    </span>
                    <span class="min-w-0 flex-1 text-left text-sm leading-snug text-on-surface sm:text-base">
                      {{ choice }}
                    </span>
                  </button>
                </div>

                <Transition name="feedback-pop">
                  <div
                    v-if="quiz.selectedAnswer"
                    class="mt-6 w-full max-w-md rounded-xl border px-4 py-3 text-sm"
                    :class="
                      quiz.selectedAnswer === quiz.currentQuestion.correct_answer
                        ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                        : 'border-red-500/35 bg-red-950/25 text-red-100'
                    "
                  >
                    <span v-if="quiz.selectedAnswer === quiz.currentQuestion.correct_answer">
                      Correct — +20 points
                    </span>
                    <span v-else>
                      Correct answer:
                      <strong>{{ quiz.currentQuestion.correct_answer }}</strong>
                    </span>
                  </div>
                </Transition>

                <Transition name="slide-up">
                  <div v-if="quiz.selectedAnswer" class="mt-4 w-full max-w-xs">
                    <button
                      type="button"
                      class="w-full rounded-xl bg-primary-container px-8 py-3.5 text-xs font-headline font-bold uppercase tracking-[0.15em] text-on-primary-container shadow-[0_0_28px_rgba(74,20,140,0.45)] transition-all hover:brightness-110 active:scale-[0.98]"
                      @click="quiz.nextStep()"
                    >
                      Next
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </Transition>

        <div
          v-if="quiz.loadError && !quiz.loading"
          class="mt-4 w-full max-w-xl rounded-xl border border-red-500/35 bg-red-950/25 px-4 py-3 text-left text-sm text-red-200"
        >
          {{ quiz.loadError }}
        </div>

        <div
          v-if="!quiz.loading && !quiz.isGameOver && !quiz.currentQuestion && !quiz.loadError"
          class="animate-fade-in-up pt-8 text-sm text-on-surface-variant"
        >
          No question loaded.
          <RouterLink to="/" class="text-primary underline-offset-2 hover:underline">Home</RouterLink>
        </div>

        <Transition name="scale-fade">
          <div
            v-if="quiz.isGameOver"
            class="mt-4 w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/90 p-8 text-center backdrop-blur-md"
          >
            <p class="font-headline text-2xl font-bold" :class="quiz.isWin ? 'text-emerald-300' : 'text-red-300'">
              {{ quiz.isWin ? 'You win!' : 'Game over' }}
            </p>
            <p class="mt-2 text-on-surface-variant">
              Score: <span class="tabular-nums font-bold text-primary">{{ quiz.score }}</span>
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                class="rounded-xl border border-outline-variant/30 px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
                @click="quiz.resetQuiz()"
              >
                New quiz
              </button>
              <RouterLink
                to="/"
                class="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-on-primary no-underline transition-transform hover:scale-[1.02]"
                @click="quiz.resetQuiz()"
              >
                Back home
              </RouterLink>
            </div>
          </div>
        </Transition>
      </div>
      </template>
      </div>
    </main>

    <!-- Footer: centered -->
    <footer
      class="relative mx-auto mt-auto w-full max-w-2xl border-t border-outline-variant/15 px-4 py-8 text-center sm:max-w-3xl sm:px-6"
      role="contentinfo"
    >
      <p class="font-['Plus_Jakarta_Sans'] text-sm font-semibold text-on-surface">Quiziiz</p>
      <p class="mt-1 text-xs text-on-surface-variant/70">
        © {{ currentYear }} Quiziiz. All rights reserved.
      </p>
      <nav class="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-on-surface-variant/80">
        <RouterLink to="/about" class="no-underline hover:text-primary">About</RouterLink>
        <a href="#" class="hover:text-primary">Privacy</a>
        <a href="#" class="hover:text-primary">Terms</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
/* Background orbs */
@keyframes orb-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translate(8%, 6%) scale(1.08);
    opacity: 1;
  }
}
@keyframes orb-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-6%, -4%) scale(1.05);
  }
}
.animate-orb-a {
  animation: orb-a 20s ease-in-out infinite;
}
.animate-orb-b {
  animation: orb-b 24s ease-in-out infinite;
}

/* Header */
@keyframes header-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-header-in {
  animation: header-in 0.55s ease forwards;
}

/* Question card entrance */
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-card-in {
  animation: card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Timer pulse when critical */
@keyframes timer-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.35);
  }
  50% {
    box-shadow: 0 0 20px 2px rgba(248, 113, 113, 0.2);
  }
}
.animate-timer-pulse {
  animation: timer-pulse 1s ease-in-out infinite;
}

/* Glass card */
.glass-card {
  background: rgba(28, 27, 28, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Option row entrance */
.option-enter {
  animation: option-in 0.45s ease backwards;
}
@keyframes option-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer loading */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgb(53 52 54 / 0.5) 0%,
    rgb(74 68 82 / 0.6) 50%,
    rgb(53 52 54 / 0.5) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

/* Vue transitions */
.question-swap-enter-active,
.question-swap-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.question-swap-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.question-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.feedback-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.feedback-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(6px);
}

.slide-up-enter-active {
  transition: all 0.4s ease 0.08s;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.scale-fade-enter-active {
  transition: all 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s ease forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-orb-a,
  .animate-orb-b,
  .animate-header-in,
  .animate-card-in,
  .animate-timer-pulse,
  .animate-shimmer,
  .option-enter,
  .animate-fade-in-up {
    animation: none !important;
  }
  .question-swap-enter-active,
  .question-swap-leave-active,
  .feedback-pop-enter-active,
  .slide-up-enter-active,
  .scale-fade-enter-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none !important;
  }
}
</style>
