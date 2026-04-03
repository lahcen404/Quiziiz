import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '@/types/Question'
import type { TriviaCategory } from '@/types/TriviaCategory'
import { fetchCategories, fetchQuestions } from '@/services/api'

export type SetupPhase = 'category' | 'difficulty' | 'playing'

export const useQuizStore = defineStore('quiz', () => {
  const setupPhase = ref<SetupPhase>('category')
  const categories = ref<TriviaCategory[]>([])
  const categoriesLoading = ref(false)
  const selectedCategoryId = ref<number | null>(null)
  const selectedDifficulty = ref<'easy' | 'medium' | 'hard' | null>(null)

  const questions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const levelScore = ref(0)
  const timeLeft = ref(300)
  const currentLevel = ref(1)
  const loading = ref(false)
  const loadError = ref('')
  const selectedAnswer = ref('')
  const isWin = ref(false)
  const isGameOver = ref(false)
  const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null)

  const selectedCategoryName = computed(() => {
    if (selectedCategoryId.value == null) return ''
    return categories.value.find((c) => c.id === selectedCategoryId.value)?.name ?? ''
  })

  const formattedTime = computed(() => {
    const min = Math.floor(timeLeft.value / 60)
    const sec = timeLeft.value % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  })

  async function loadCategoriesIfNeeded() {
    if (categories.value.length > 0) return
    categoriesLoading.value = true
    try {
      categories.value = await fetchCategories()
    } finally {
      categoriesLoading.value = false
    }
  }

  function pickCategory(id: number) {
    selectedCategoryId.value = id
    selectedDifficulty.value = null
    setupPhase.value = 'difficulty'
  }

  function pickDifficulty(d: 'easy' | 'medium' | 'hard') {
    selectedDifficulty.value = d
  }

  function goBackToCategory() {
    setupPhase.value = 'category'
    selectedDifficulty.value = null
  }

  function goBackToDifficulty() {
    setupPhase.value = 'difficulty'
  }

  function startTimer() {
    if (timerInterval.value) return

    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        endGame()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  async function loadQuestions() {
    if (selectedCategoryId.value == null || selectedDifficulty.value == null) {
      loadError.value = 'Pick a category and difficulty first.'
      return
    }
    loading.value = true
    loadError.value = ''
    try {
      const data = await fetchQuestions({
        amount: 5,
        categoryId: selectedCategoryId.value,
        difficulty: selectedDifficulty.value,
      })

      if (!data.length) {
        loadError.value = 'No questions returned. Try another category or difficulty.'
        questions.value = []
        return
      }

      questions.value = data.map((q) => {
        const choices = [...q.incorrect_answers, q.correct_answer]
        return {
          ...q,
          all_choices: choices.sort(() => Math.random() - 0.5),
        }
      })
      currentQuestionIndex.value = 0
      selectedAnswer.value = ''
      levelScore.value = 0
    } catch (e) {
      console.error('Failed to load questions', e)
      loadError.value = 'Failed to load questions.'
      questions.value = []
    } finally {
      loading.value = false
    }
  }

  /** Start the timed quiz after category + difficulty are chosen */
  async function beginQuizSession() {
    if (selectedCategoryId.value == null || selectedDifficulty.value == null) return

    questions.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    levelScore.value = 0
    timeLeft.value = 300
    currentLevel.value = 1
    selectedAnswer.value = ''
    isWin.value = false
    isGameOver.value = false
    loadError.value = ''
    stopTimer()

    setupPhase.value = 'playing'
    startTimer()
    await loadQuestions()
  }

  function endGame(win = false) {
    isWin.value = win
    isGameOver.value = true
    stopTimer()
  }

  function submitAnswer(answer: string) {
    if (!currentQuestion.value) return
    if (selectedAnswer.value) return

    selectedAnswer.value = answer
    if (answer === currentQuestion.value.correct_answer) {
      score.value += 20
      levelScore.value += 20
    }
  }

  async function nextStep() {
    const isLastQuestion = currentQuestionIndex.value >= questions.value.length - 1

    if (!isLastQuestion) {
      currentQuestionIndex.value++
      selectedAnswer.value = ''
      return
    }

    const minScoreToPass =
      currentLevel.value === 1 ? 40 : currentLevel.value === 2 ? 60 : 80

    if (levelScore.value < minScoreToPass) {
      endGame(false)
      return
    }

    if (currentLevel.value === 3) {
      endGame(true)
      return
    }

    currentLevel.value++
    await loadQuestions()
  }

  /** Full reset (e.g. home / play again) — back to category picker */
  function resetQuiz() {
    setupPhase.value = 'category'
    selectedCategoryId.value = null
    selectedDifficulty.value = null
    questions.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    levelScore.value = 0
    timeLeft.value = 300
    currentLevel.value = 1
    loading.value = false
    loadError.value = ''
    selectedAnswer.value = ''
    isWin.value = false
    isGameOver.value = false
    stopTimer()
  }

  return {
    setupPhase,
    categories,
    categoriesLoading,
    selectedCategoryId,
    selectedDifficulty,
    selectedCategoryName,
    loadError,
    questions,
    currentQuestionIndex,
    currentQuestion,
    score,
    levelScore,
    timeLeft,
    currentLevel,
    loading,
    selectedAnswer,
    isWin,
    isGameOver,
    formattedTime,
    loadCategoriesIfNeeded,
    pickCategory,
    pickDifficulty,
    goBackToCategory,
    goBackToDifficulty,
    beginQuizSession,
    loadQuestions,
    startTimer,
    submitAnswer,
    nextStep,
    endGame,
    resetQuiz,
  }
})
