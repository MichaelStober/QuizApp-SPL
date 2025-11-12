export interface AnswerOption {
  letter: string;
  text: string;
}

export interface Question {
  id: number;
  code: string;
  question: string;
  options: AnswerOption[];
  correctAnswer: string;
}

export interface UserAnswer {
  selected: string;
  isCorrect: boolean;
}
