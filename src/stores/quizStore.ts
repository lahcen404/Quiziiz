import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '@/types/Question'

export const useQuizStore = defineStore('quiz', () => {

  const questions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const timeLeft = ref(300) 
  const currentLevel = ref(1)
  const isGameOver = ref(false)
  const timerInterval = ref<any>(null)

const formattedTime = computed(() => {
    const min = Math.floor(timeLeft.value / 60);
    const sec = timeLeft.value % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  });

  function startTimer() {
    if (timerInterval.value) return; // if already running, do nothing
    
    timerInterval.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    isGameOver.value = true;
    if (timerInterval.value) clearInterval(timerInterval.value);
  }

  function resetQuiz() {
    score.value = 0;
    timeLeft.value = 300;
    currentLevel.value = 1;
    isGameOver.value = false;
    if (timerInterval.value) clearInterval(timerInterval.value);
  }

  return { 
    questions, currentQuestionIndex, score, timeLeft, 
    currentLevel, isGameOver, formattedTime, 
    startTimer, endGame, resetQuiz 
  };


});

