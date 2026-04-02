import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '@/types/Question'
import { fetchQuestions } from '@/services/api';

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

  async function loadQuestions() {
    loading.value = true;
    try {
      const data = await fetchQuestions(currentLevel.value);
      
      // miiix correct with incorrect answers and mix them
      questions.value = data.map(q => {
        const choices = [...q.incorrect_answers, q.correct_answer];
        return {
          ...q,
          all_choices: choices.sort(() => Math.random() - 0.5)
        };
      });
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      loading.value = false;
    }
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
    currentLevel, isGameOver, formattedTime, loadQuestions,
    startTimer, endGame, resetQuiz 
  };


});

