import { Clock, Star, Utensils, Heart, Activity } from "lucide-react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-[#F0F0F0] rounded-[40px] overflow-hidden w-full max-w-sm shadow-sm">
      <div className="relative h-72 w-full p-2">
        <div className="absolute top-6 left-6 bg-[#D47900] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold">
          <span className="text-xs">✓</span> Yeni Eklendi
        </div>

        <button className="absolute top-6 right-6 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
          <Heart size={20} className="text-black" />
        </button>
      </div>

      <div className="p-6 pt-2">
        <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-2">
          {recipe.title}
        </h2>

        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <div className="flex items-center gap-1">
            <Clock size={18} className="text-gray-500" />
            <span>{recipe.prepTime || "40"} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity size={18} className="text-gray-500" />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Utensils size={18} className="text-gray-500" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
