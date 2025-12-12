export interface Macros {
  protein: number; // in grams
  fat: number; // in grams
  carbs: number; // in grams
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  calories: number;
  timeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ingredients: string[];
  steps: string[];
  macros: Macros;
  imageUrl?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  query: string; // The query sent to AI
  icon: string;
}

export type ViewState = 'HOME' | 'EXPLORE' | 'FAVORITES' | 'RECIPE_DETAIL';
