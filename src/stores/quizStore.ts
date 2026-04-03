import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '@/types/Question'
import { fetchQuestions } from '@/services/api'

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const levelScore = ref(0)
  const timeLeft = ref(300)
  const currentLevel = ref(1)
  const loading = ref(false)
  const selectedAnswer = ref('')
  const isWin = ref(false)
  const isGameOver = ref(false)
  const timerInterval = ref<any>(null)
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null)

  const formattedTime = computed(() => {
    const min = Math.floor(timeLeft.value / 60)
    const sec = timeLeft.value % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  })

  function startTimer() {
    if (timerInterval.value) return // if already running, do nothing

    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        endGame()
      }
    }, 1000)
  }

  async function loadQuestions() {
    loading.value = true
    try {
      const data = await fetchQuestions(currentLevel.value)

      // miiix correct with incorrect answers and mix them
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
    } catch (error) {
      console.error('Failed to load questions', error)
    } finally {
      loading.value = false
    }
  }

  function endGame(win = false) {
    isWin.value = win
    isGameOver.value = true
    if (timerInterval.value) clearInterval(timerInterval.value)
    timerInterval.value = null
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

  async function startGame() {
    resetQuiz()
    startTimer()
    await loadQuestions()
  }

  function resetQuiz() {
    questions.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    levelScore.value = 0
    timeLeft.value = 300
    currentLevel.value = 1
    loading.value = false
    selectedAnswer.value = ''
    isWin.value = false
    isGameOver.value = false
    if (timerInterval.value) clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  return {
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
    startGame,
    loadQuestions,
    startTimer,
    submitAnswer,
    nextStep,
    endGame,
    resetQuiz,
  }
})
