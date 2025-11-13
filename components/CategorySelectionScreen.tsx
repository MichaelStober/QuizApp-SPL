
import React from 'react';

interface CategorySelectionScreenProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({ categories, onSelectCategory, onBack }) => {
  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400">Select a Category</h2>
        <button
          onClick={onBack}
          className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className="bg-slate-700 hover:bg-cyan-600 text-white font-semibold py-4 px-2 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
