
import React from 'react';
import type { Question } from '../types';

interface CategoryQuestionCardProps {
  question: Question;
  index: number;
}

const CategoryQuestionCard: React.FC<CategoryQuestionCardProps> = ({ question, index }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full mb-4">
      <div className="flex justify-between items-center mb-3 text-slate-400">
        <p className="font-bold text-lg">Question {index + 1}</p>
        <p className="text-sm font-mono">Frage {question.id} ({question.code})</p>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-slate-100">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map(option => (
          <div
            key={option.letter}
            className={`w-full text-left p-3 rounded-lg border-2 flex items-start ${
              option.letter === question.correctAnswer
                ? 'bg-green-900/60 border-green-700'
                : 'bg-slate-700 border-transparent'
            }`}
          >
            <span className="font-bold mr-4 h-7 w-7 flex items-center justify-center bg-slate-900 rounded-full flex-shrink-0 mt-1">{option.letter}</span>
            <span>{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CategoryQuestionViewerProps {
  category: string;
  questions: Question[];
  onBack: () => void;
}

const CategoryQuestionViewer: React.FC<CategoryQuestionViewerProps> = ({ category, questions, onBack }) => {
  return (
    <div className="w-full">
        <div className="bg-slate-800 p-4 rounded-xl shadow-2xl mb-6 sticky top-4 z-10">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-cyan-400">Category: {category}</h2>
                <button
                onClick={onBack}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                Back to Categories
                </button>
            </div>
        </div>
      
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
            {questions.map((q, index) => (
            <CategoryQuestionCard key={q.id} question={q} index={index} />
            ))}
        </div>
    </div>
  );
};

export default CategoryQuestionViewer;
