import React from 'react';
import { Recipe } from '../types';
import { ArrowLeft, Clock, Flame, PieChart, CheckCircle2, Heart } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, isFavorite, onToggleFavorite }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
      {/* Header Image Area */}
      <div className="relative h-72 w-full">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <button 
          onClick={() => onToggleFavorite(recipe)}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <Heart size={24} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-800"} />
        </button>
      </div>

      <div className="px-6 py-6 -mt-6 relative bg-white rounded-t-3xl min-h-screen">
        {/* Title & Stats */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight flex-1 mr-2">{recipe.title}</h1>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
               {recipe.calories} 卡
            </span>
          </div>
          <p className="text-gray-500 leading-relaxed">{recipe.description}</p>
        </div>

        {/* Macros Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-3 rounded-2xl text-center">
            <div className="text-xs text-blue-600 mb-1 font-medium">蛋白质</div>
            <div className="text-xl font-bold text-blue-800">{recipe.macros.protein}g</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-2xl text-center">
            <div className="text-xs text-yellow-600 mb-1 font-medium">碳水</div>
            <div className="text-xl font-bold text-yellow-800">{recipe.macros.carbs}g</div>
          </div>
          <div className="bg-rose-50 p-3 rounded-2xl text-center">
            <div className="text-xs text-rose-600 mb-1 font-medium">脂肪</div>
            <div className="text-xl font-bold text-rose-800">{recipe.macros.fat}g</div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-emerald-500" />
            所需食材
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">{ing}</span>
                <CheckCircle2 size={18} className="text-gray-300" />
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="mb-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            烹饪步骤
          </h2>
          <div className="space-y-6">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm mt-1">
                  {idx + 1}
                </div>
                <div className="pb-4 border-b border-gray-100 last:border-0">
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-8">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
            开始烹饪
          </button>
        </div>
      </div>
    </div>
  );
};
