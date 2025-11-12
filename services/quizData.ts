
import type { Question } from '../types';

let cachedQuestions: Question[] | null = null;

export const getQuestions = async (): Promise<Question[]> => {
  if (cachedQuestions) {
    return cachedQuestions;
  }
  
  const response = await fetch('/services/quiz.json');
  if (!response.ok) {
    throw new Error('Failed to fetch quiz data');
  }
  const data = await response.json();
  cachedQuestions = data as Question[];
  return cachedQuestions;
};
