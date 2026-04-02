<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { fetchQuestions } from '@/services/api' 
import type { Question } from '@/types/Question' 

const testData = ref<Question[]>([])
const loading = ref(true)
const firstQuestion = ref<Question | null>(null)

onMounted(async () => {
  console.log(" Testing API call for Level 1...")
  
  // We call our service
  const data = await fetchQuestions(1) 
  
  testData.value = data
  firstQuestion.value = data[0] ?? null
  loading.value = false
  
  console.log(" Data Received:", data)
})
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>API Connection Test</h1>
    
    <p v-if="loading"> Fetching questions from Open Trivia DB...</p>
    
    <div v-else>
      <p style="color: green; font-weight: bold;">Success! Found {{ testData.length }} questions.</p>
      
      <div v-if="firstQuestion" style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
        <h3>First Question:</h3>
        <p v-html="firstQuestion.question"></p> 
        <p><strong>Correct Answer:</strong> {{ firstQuestion.correct_answer }}</p>
      </div>
    </div>
  </div>
</template>