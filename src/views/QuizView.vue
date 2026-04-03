<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'

const quiz = useQuizStore()

const choices = computed(() => quiz.currentQuestion?.all_choices ?? [])
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0B] px-4 pb-12 pt-24 text-on-surface">
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center justify-between gap-4 text-sm">
        <RouterLink to="/" class="text-primary no-underline hover:underline">← Home</RouterLink>
        <span class="text-on-surface-variant">Time: {{ quiz.formattedTime }}</span>
        <span>Level {{ quiz.currentLevel }} · Score {{ quiz.score }}</span>
      </div>

      <p v-if="quiz.loading" class="text-on-surface-variant">Loading questions…</p>

      <template v-else-if="quiz.currentQuestion && !quiz.isGameOver">
        <p class="mb-2 text-xs uppercase tracking-wide text-primary">Question {{ quiz.currentQuestionIndex + 1 }} / 5</p>
        <h1 class="mb-8 text-xl font-semibold leading-snug" v-html="quiz.currentQuestion.question"></h1>

        <div class="flex flex-col gap-3">
          <button
            v-for="choice in choices"
            :key="choice"
            type="button"
            class="rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-left text-sm transition-colors hover:border-primary/50 disabled:opacity-60"
            :disabled="!!quiz.selectedAnswer"
            @click="quiz.submitAnswer(choice)"
          >
            {{ choice }}
          </button>
        </div>

        <p v-if="quiz.selectedAnswer" class="mt-4 text-sm text-on-surface-variant">
          <span v-if="quiz.selectedAnswer === quiz.currentQuestion.correct_answer" class="text-green-400"
            >Correct +20</span
          >
          <span v-else class="text-red-300">Wrong — correct: {{ quiz.currentQuestion.correct_answer }}</span>
        </p>

        <button
          v-if="quiz.selectedAnswer"
          type="button"
          class="mt-6 rounded-xl bg-tertiary px-6 py-3 font-bold text-on-tertiary"
          @click="quiz.nextStep()"
        >
          Next
        </button>
      </template>

      <div v-else-if="!quiz.loading && !quiz.isGameOver" class="text-on-surface-variant">
        No question loaded. <RouterLink to="/" class="text-primary">Go home</RouterLink>
      </div>

      <div v-if="quiz.isGameOver" class="mt-8 rounded-2xl border border-outline-variant/20 p-6">
        <p v-if="quiz.isWin" class="text-lg font-bold text-green-400">You win!</p>
        <p v-else class="text-lg font-bold text-red-300">Game over</p>
        <p class="mt-2 text-sm text-on-surface-variant">Final score: {{ quiz.score }}</p>
        <RouterLink
          to="/"
          class="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary no-underline"
          @click="quiz.resetQuiz()"
        >
          Back home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
