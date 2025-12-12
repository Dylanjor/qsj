import React from 'react';
import { Recipe } from '../types';
import { Flame, Clock, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      onClick={() => onClick(recipe)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 active:scale-95 transition-transform duration-150 cursor-pointer"
    >
      <div className="relative h-48 w-full">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 shadow-sm">
          {recipe.difficulty === 'Easy' ? '简单易上手' : recipe.difficulty === 'Medium' ? '进阶烹饪' : '挑战级'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
          <h3 className="text-white text-xl font-bold truncate">{recipe.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Flame size={16} className="text-orange-500" />
            <span className="font-medium">{recipe.calories} kcal</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-blue-500" />
            <span>{recipe.timeMinutes} 分钟</span>
          </div>
          <div className="flex items-center gap-1">
             <ChefHat size={16} className="text-purple-500" />
             <span>{recipe.macros.protein}g 蛋白</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
