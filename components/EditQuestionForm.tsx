
import React, { useState } from 'react';
import type { Question } from '../types';

interface EditQuestionFormProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onCancel: () => void;
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedQuestion(prev => ({ ...prev, question: e.target.value }));
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index].text = text;
    setEditedQuestion(prev => ({ ...prev, options: newOptions }));
  };
  
  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedQuestion(prev => ({ ...prev, correctAnswer: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedQuestion);
  };

  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Edit Question {question.id}</h2>
        
        <div className="mb-4">
          <label htmlFor="questionText" className="block text-slate-400 font-semibold mb-2">Question Text</label>
          <textarea
            id="questionText"
            value={editedQuestion.question}
            onChange={handleQuestionTextChange}
            className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
            <h3 className="block text-slate-400 font-semibold mb-2">Options</h3>
            <div className="space-y-3">
            {editedQuestion.options.map((option, index) => (
                <div key={option.letter} className="flex items-center gap-3">
                    <span className="font-bold h-8 w-8 flex items-center justify-center bg-slate-900 rounded-full">{option.letter}</span>
                    <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(index, e.target.value)}
                        className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                    />
                </div>
            ))}
            </div>
        </div>

        <div className="mb-6">
            <label htmlFor="correctAnswer" className="block text-slate-400 font-semibold mb-2">Correct Answer</label>
            <select
                id="correctAnswer"
                value={editedQuestion.correctAnswer}
                onChange={handleCorrectAnswerChange}
                className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                {editedQuestion.options.map(option => (
                    <option key={option.letter} value={option.letter}>{option.letter}</option>
                ))}
            </select>
        </div>

        <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Save Changes
            </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-right">
            Changes are saved to your browser's local storage and will persist on this device.
        </p>
      </form>
    </div>
  );
};

export default EditQuestionForm;
