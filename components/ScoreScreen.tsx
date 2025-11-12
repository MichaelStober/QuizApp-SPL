
import React from 'react';

interface ScoreScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const performanceMessage =
    percentage >= 80
      ? 'Excellent!'
      : percentage >= 60
      ? 'Good Job!'
      : 'Keep Practicing!';

  return (
    <div className="text-center bg-slate-800 p-8 rounded-xl shadow-2xl flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Quiz Complete!</h2>
      <p className="text-xl text-slate-300 mb-4">{performanceMessage}</p>
      
      <div className="my-6">
        <p className="text-5xl font-bold">{score} / {totalQuestions}</p>
        <p className="text-lg text-slate-400 mt-1">Correct Answers</p>
      </div>

      <div className="text-6xl font-bold text-cyan-500 mb-8">{percentage}%</div>

      <button
        onClick={onRestart}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
};

export default ScoreScreen;
