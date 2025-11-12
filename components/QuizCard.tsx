
import React from 'react';
import type { Question } from '../types';
import { CheckIcon, XMarkIcon, PencilIcon } from './icons';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerLetter: string) => void;
  onNext: () => void;
  onEdit: (questionId: number) => void;
  selectedAnswer: string | null;
  isAnswered: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onEdit,
  selectedAnswer,
  isAnswered,
}) => {
  const getButtonClass = (optionLetter: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (optionLetter === question.correctAnswer) {
      return 'bg-green-700 border-green-500';
    }
    if (optionLetter === selectedAnswer) {
      return 'bg-red-700 border-red-500';
    }
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-slate-400">
          <p className="font-bold">Question {questionNumber} / {totalQuestions}</p>
          <div className="flex items-center gap-4">
            <p className="text-sm font-mono">Frage {question.id} ({question.code})</p>
            <button onClick={() => onEdit(question.id)} className="hover:text-cyan-400 transition-colors" aria-label="Edit question">
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-cyan-500 h-2.5 rounded-full"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-100">{question.question}</h2>

      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.letter}
            onClick={() => onAnswer(option.letter)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-300 flex items-center justify-between ${getButtonClass(
              option.letter
            )} disabled:cursor-not-allowed`}
          >
            <span className="flex items-center">
                <span className="font-bold mr-4 h-8 w-8 flex items-center justify-center bg-slate-900 rounded-full">{option.letter}</span>
                {option.text}
            </span>
            {isAnswered && option.letter === question.correctAnswer && <CheckIcon className="h-6 w-6 text-green-400" />}
            {isAnswered && option.letter === selectedAnswer && option.letter !== question.correctAnswer && <XMarkIcon className="h-6 w-6 text-red-400" />}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-8 text-right">
          <button
            onClick={onNext}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
