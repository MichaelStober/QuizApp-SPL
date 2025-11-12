
import React from 'react';
import type { Question, UserAnswer } from '../types';

interface QuestionListProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  userAnswers: Record<number, UserAnswer>;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  userAnswers,
}) => {
  const getListItemClass = (questionId: number, index: number) => {
    const baseClass = 'w-full text-left p-3 rounded-lg transition-colors duration-200 cursor-pointer border-2';
    const userAnswer = userAnswers[questionId];

    if (index === currentQuestionIndex) {
      return `${baseClass} bg-cyan-600 border-cyan-400 text-white font-semibold`;
    }
    if (userAnswer) {
      if (userAnswer.isCorrect) {
        return `${baseClass} bg-green-900/60 hover:bg-green-800/80 border-green-700/50`;
      } else {
        return `${baseClass} bg-red-900/60 hover:bg-red-800/80 border-red-700/50`;
      }
    }
    return `${baseClass} bg-slate-700 hover:bg-slate-600 border-transparent`;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-h-[85vh] flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-slate-300 flex-shrink-0">Questions</h3>
      <div className="overflow-y-auto pr-2 space-y-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={getListItemClass(question.id, index)}
          >
            Question {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
