import axios from 'axios';
import type { Question } from '@/types/Question';

const apiClient = axios.create({
  baseURL: 'https://opentdb.com/api.php',
});

export const fetchQuestions = async (level: number) => {
    const difficulty = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';

    try{

        const response = await apiClient.get('',{
            params: {
        amount: 5,           
        difficulty: difficulty,
        type: 'multiple',    
        category: 18         
      }
        });

        return response.data.results as Question[];
    }catch (error) {
    console.error("Error cant geet questions !!", error);
    return [];
  }
}