import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Flame, BarChart3, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const Recipes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false);

  if (!recipe)
    return (
      <div className="p-10 text-center font-['Montserrat']">
        Tarif bulunamadı.
      </div>
    );

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Favorilere eklemek için giriş yapmalısın!");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `h${API_URL}/api/favorite/${recipe.id}`,
        {},
        config,
      );

      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
      );
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      toast.error("İşlem gerçekleştirilemedi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-['Montserrat']">
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden shadow-xl">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover object-bottom brightness-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2.5 bg-white/95 text-black rounded-full hover:bg-[#D47900] hover:text-white transition-all duration-300 shadow-md z-10"
        >
          <ArrowLeft size={22} />
        </button>

        <button
          onClick={handleFavoriteToggle}
          className="absolute top-6 right-6 p-2.5 bg-white/95 rounded-full hover:scale-110 transition-all duration-300 shadow-md z-10"
        >
          <Heart
            size={22}
            className={`${isFavorite ? "text-red-500" : "text-black"}`}
            fill={isFavorite ? "#EF4444" : "none"}
          />
        </button>

        <div className="absolute bottom-10 left-24 right-12 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#D47900] rounded-full shadow-md">
            <span className="text-white text-xs md:text-sm font-semibold tracking-wider capitalize">
              {recipe.category || "Genel"}
            </span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg tracking-tight text-left">
            {recipe.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base font-medium">
            <div className="flex items-center gap-1.5">
              <Clock size={18} className="text-[#D47900]" />
              <span>{recipe.prepTime} dk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-[#D47900]" />
              <span>{recipe.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 size={18} className="text-[#D47900]" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-[#D47900] rounded-full" />
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Hazırlanış Aşamaları
            </h2>
          </div>

          {recipe.instructions && recipe.instructions.length > 0 ? (
            <div className="grid gap-5">
              {[...recipe.instructions]
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step, index) => (
                  <div
                    key={index}
                    className="group flex gap-5 p-6 bg-white rounded-[28px] shadow-sm border border-gray-100 items-start transition-all hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-[#D47900] text-white rounded-2xl flex items-center justify-center font-bold shrink-0 text-base shadow-sm group-hover:bg-black transition-colors duration-300">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-[15px] pt-1.5 font-medium">
                      {step.action}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[28px] border border-dashed border-gray-300 text-center">
              <p className="text-gray-400 italic">
                Bu tarif için henüz bir adım eklenmemiş.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
