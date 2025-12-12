import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Recipe, Category } from './types';
import { generateRecipes } from './services/geminiService';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { Home, Compass, Heart, Sparkles, Search, Loader2 } from 'lucide-react';

const CATEGORIES: Category[] = [
  { id: 'fat-loss', name: '高效减脂', query: '低热量高饱腹感的减脂餐', icon: '🥗' },
  { id: 'muscle', name: '增肌蛋白', query: '高蛋白健身后的恢复餐', icon: '💪' },
  { id: 'student', name: '宿舍快手', query: '适合宿舍只用电煮锅做的简单美食', icon: '🎓' },
  { id: 'work', name: '打工人便当', query: '适合带饭的健康便当，冷吃也好吃', icon: '🍱' },
  { id: 'low-carb', name: '低碳饮食', query: '生酮或低碳水化合物食谱', icon: '🥑' },
];

const INITIAL_RECIPES: Recipe[] = [
  {
    id: "seed-1",
    title: "青柠手撕鸡胸肉",
    description: "清爽不腻，高蛋白低脂肪，夏日减脂必备神器。",
    calories: 280,
    timeMinutes: 20,
    difficulty: "Easy",
    tags: ["高蛋白", "凉拌", "减脂"],
    imageUrl: "https://picsum.photos/seed/chickensalad/600/400",
    ingredients: ["鸡胸肉 200g", "青柠檬 1个", "小米辣 2根", "香菜 1把", "生抽 1勺"],
    steps: ["鸡胸肉冷水下锅煮熟，撕成丝。", "青柠檬切片，小米辣切圈，香菜切段。", "所有调料混合淋在鸡丝上拌匀即可。"],
    macros: { protein: 45, fat: 5, carbs: 8 },
    category: "高效减脂"
  },
  {
    id: "seed-2",
    title: "无米番茄烩饭",
    description: "用花菜碎代替米饭，热量减半，饱腹感不减。",
    calories: 150,
    timeMinutes: 15,
    difficulty: "Easy",
    tags: ["低碳", "伪炒饭", "晚餐"],
    imageUrl: "https://picsum.photos/seed/caulirice/600/400",
    ingredients: ["花菜 半颗", "番茄 1个", "鸡蛋 1个", "黑胡椒 适量"],
    steps: ["花菜切碎成米粒大小。", "番茄炒出汁，加入花菜碎翻炒。", "打入鸡蛋炒散，加盐黑胡椒出锅。"],
    macros: { protein: 12, fat: 8, carbs: 10 },
    category: "低碳饮食"
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [activeCategory, setActiveCategory] = useState<string>('fat-loss');
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const loadRecipes = useCallback(async (categoryQuery: string, append = false) => {
    setLoading(true);
    const newRecipes = await generateRecipes(categoryQuery);
    setLoading(false);
    if (newRecipes.length > 0) {
      setRecipes(prev => append ? [...newRecipes, ...prev] : newRecipes);
    }
  }, []);

  const handleCategoryClick = (cat: Category) => {
    setActiveCategory(cat.id);
    loadRecipes(cat.query);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(recipe.id)) {
        next.delete(recipe.id);
      } else {
        next.add(recipe.id);
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView('EXPLORE');
      loadRecipes(searchQuery);
    }
  };

  // Views logic
  const renderHome = () => (
    <div className="pb-24">
      <header className="px-5 pt-8 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">轻食记 🌿</h1>
            <p className="text-sm text-gray-500">今天也要好好吃饭</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
            U
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="搜索食材或食谱 (如: 豆腐, 减脂餐)" 
            className="w-full bg-gray-100 text-gray-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </header>

      <div className="px-5 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">热门分类</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[80px] transition-all ${activeCategory === cat.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-600 border border-gray-100'}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          今日推荐
        </h2>
        
        {/* Render recipes list with disabled state when loading */}
        <div>
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={setSelectedRecipe}
              disabled={loading} 
            />
          ))}
        </div>

        {/* Loading Indicator at the bottom */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
            <p className="text-sm animate-pulse">AI 大厨正在为您设计菜谱...</p>
          </div>
        )}

        {/* Load More Button - only show when NOT loading and there are recipes */}
        {!loading && recipes.length > 0 && (
          <button 
            onClick={() => loadRecipes(CATEGORIES.find(c => c.id === activeCategory)?.query || activeCategory, true)}
            className="w-full py-3 mt-4 text-emerald-600 font-medium bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            加载更多食谱
          </button>
        )}
      </div>
    </div>
  );

  const renderFavorites = () => {
    const favRecipes = recipes.filter(r => favorites.has(r.id));
    
    return (
      <div className="px-5 py-8 pb-24 min-h-screen">
         <h1 className="text-2xl font-extrabold text-gray-900 mb-6">我的收藏 ❤️</h1>
         {favRecipes.length === 0 ? (
           <div className="text-center text-gray-400 mt-20">
             <Heart className="w-16 h-16 mx-auto mb-4 stroke-1" />
             <p>还没有收藏任何食谱哦</p>
           </div>
         ) : (
            favRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
            ))
         )}
      </div>
    );
  };

  const renderExplore = () => (
    <div className="px-5 py-8 pb-24">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">发现更多 🌍</h1>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => handleCategoryClick(cat)}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-emerald-200 transition-colors"
          >
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <h3 className="font-bold text-gray-800">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{cat.query}</p>
            </div>
          </div>
        ))}
      </div>
      
      {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm text-gray-400 mt-4">AI 正在搜索美味...</p>
          </div>
      ) : (
        recipes.length > 0 && (
          <div>
             <h2 className="text-lg font-bold text-gray-800 mb-4">搜索结果</h2>
             {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
            ))}
          </div>
        )
      )}
    </div>
  );

  return (
    <>
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onBack={() => setSelectedRecipe(null)} 
          isFavorite={favorites.has(selectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <main className="min-h-screen bg-gray-50 max-w-md mx-auto relative shadow-2xl">
        {view === 'HOME' && renderHome()}
        {view === 'EXPLORE' && renderExplore()}
        {view === 'FAVORITES' && renderFavorites()}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 py-3 px-6 flex justify-between items-center z-40 pb-safe">
          <button 
            onClick={() => setView('HOME')}
            className={`flex flex-col items-center gap-1 ${view === 'HOME' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <Home size={24} className={view === 'HOME' ? 'fill-current' : ''} />
            <span className="text-[10px] font-medium">首页</span>
          </button>
          
          <button 
            onClick={() => setView('EXPLORE')}
            className={`flex flex-col items-center gap-1 ${view === 'EXPLORE' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <Compass size={24} className={view === 'EXPLORE' ? 'fill-current' : ''} />
            <span className="text-[10px] font-medium">发现</span>
          </button>
          
          <button 
            onClick={() => setView('FAVORITES')}
            className={`flex flex-col items-center gap-1 ${view === 'FAVORITES' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <Heart size={24} className={view === 'FAVORITES' ? 'fill-current' : ''} />
            <span className="text-[10px] font-medium">收藏</span>
          </button>
        </nav>
      </main>
    </>
  );
}