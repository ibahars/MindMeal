import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

const Recipes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe)
    return (
      <div className="p-10 text-center font-['Montserrat']">
        Tarif bulunamadı.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-['Montserrat']">
      <div className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden shadow-xl">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover object-center brightness-90"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2.5 bg-white/95 text-black rounded-full hover:bg-[#D47900] hover:text-white transition-all duration-300 shadow-md z-10"
        >
          <ArrowLeft size={22} />
        </button>

        <button className="absolute top-6 right-6 p-2.5 bg-white/95 rounded-full hover:scale-110 transition-all duration-300 shadow-md z-10">
          <Heart
            size={22}
            className={`${recipe.isFavorite ? "text-red-500" : "text-black"}`}
            fill={recipe.isFavorite ? "#EF4444" : "none"}
          />
        </button>

        <div className="absolute bottom-8 left-36 right-12">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md tracking-tight text-left">
            {recipe.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-10">
        <div className="flex gap-6 mb-10 text-gray-700 font-medium text-sm bg-white p-4 rounded-3xl shadow-sm border border-gray-100 justify-center md:justify-start">
          <span className="flex items-center gap-2">
            🕒 {recipe.prepTime} dk
          </span>
          <span className="flex items-center gap-2">
            🔥 {recipe.calories} kcal
          </span>
          <span className="flex items-center gap-2">
            📊 {recipe.difficulty}
          </span>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-black mb-5">
            Hazırlanış Aşamaları
          </h2>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <div className="grid gap-4">
              {[...recipe.instructions]
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 items-start"
                  >
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm pt-0.5">
                      {step.action}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">
              Bu tarif için henüz adım eklenmemiş.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
