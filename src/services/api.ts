import axios from 'axios'
import type { Question } from '@/types/Question'
import type { TriviaCategory } from '@/types/TriviaCategory'

const apiClient = axios.create({
  baseURL: 'https://opentdb.com/api.php',
})

export async function fetchCategories(): Promise<TriviaCategory[]> {
  try {
    const { data } = await axios.get<{ trivia_categories: TriviaCategory[] }>(
      'https://opentdb.com/api_category.php',
    )
    return data.trivia_categories ?? []
  } catch (error) {
    console.error('Failed to load categories', error)
    return []
  }
}

export async function fetchQuestions(params: {
  amount: number
  categoryId: number
  difficulty: 'easy' | 'medium' | 'hard'
}): Promise<Question[]> {
  try {
    const response = await apiClient.get('', {
      params: {
        amount: params.amount,
        category: params.categoryId,
        difficulty: params.difficulty,
        type: 'multiple',
      },
    })
    return response.data.results as Question[]
  } catch (error) {
    console.error('Error fetching questions', error)
    return []
  }
}
