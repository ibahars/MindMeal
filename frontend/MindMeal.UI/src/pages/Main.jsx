import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import RecipeCard from "../components/RecipeCard";

const Main = () => {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5085/api/recipe");
        setRecipes(response.data);
      } catch (error) {
        toast.error("tarifler çekilemedi");
      }
    };
    fetchRecipes();
  }, []);
  return (
    <div className="px-8 md:px-16 py-12 font-sans bg-white min-h-screen">
      <div className="mb-12 text-left">
        <h1 className="text-5xl md:text-6xl font-black text-black leading-tight">
          Favori Lezzetini
        </h1>
        <h2 className="text-5xl md:text-6xl font-black text-[#D47900] leading-tight mb-6">
          Keşfet.
        </h2>
        <p className="text-gray-500 text-lg max-w-xl font-medium">
          Yüzlerce denenmiş tarifi araştır, favorilerini kaydet ve rehberlikle
          adım adım pişir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Main;
