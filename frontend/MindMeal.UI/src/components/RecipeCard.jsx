import { Clock, Star, Utensils, Heart, Activity, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RecipeCard = ({ recipe, onEdit }) => {
  const [isLiked, setIsLiked] = useState(recipe.isFavorite);
  useEffect(() => {
    setIsLiked(recipe.isFavorite);
  }, [recipe.isFavorite]);
  const handleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:5085/api/favorite/${recipe.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIsLiked(response.data.isFavorite);
    } catch (error) {
      toast.error("Beğeni işlemi sırasında bir hata oluştu.");
    }
  };

  const isNew = () => {
    if (!recipe.createdAt) return false;

    const createdDate = new Date(recipe.createdAt);
    const today = new Date();

    const diffTime = Math.abs(today - createdDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 2;
  };

  const { user } = useAuth();
  const isOwner =
    user && String(recipe.userId) === String(user.id || user.nameid);
  return (
    <div className="bg-[#F0F0F0] rounded-[40px] overflow-hidden w-full max-w-sm shadow-sm">
      <div className="relative h-72 w-full p-2">
        {isNew() && (
          <div className="absolute top-6 left-6 bg-[#D47900] text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold shadow-lg">
            <span className="text-xs">✓</span> Yeni Eklendi
          </div>
        )}

        <button
          onClick={handleLike}
          className="absolute top-6 right-6 bg-white/80 p-2 rounded-full hover:bg-white transition-all shadow-md active:scale-90"
        >
          <Heart
            size={20}
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-black"}`}
          />
        </button>

        {isOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(recipe);
            }}
            className="absolute top-6 right-16 bg-white/80 p-2 rounded-full hover:bg-black hover:text-white transition-all shadow-md"
          >
            <Pencil size={18} />
          </button>
        )}
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
            <span className="font-medium">{recipe.difficulty}</span>
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
