import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import RecipeCard from "../components/RecipeCard";
import AddRecipeModal from "../components/AddRecipeModal";
import { useLocation } from "react-router-dom";
import { UtensilsCrossed, Search } from "lucide-react";

const Main = ({ searchTerm }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };
  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5085/api/recipe";

      if (filter === "mine") {
        url = "http://localhost:5085/api/recipe/my-recipes";
      } else if (filter === "favorites") {
        url = "http://localhost:5085/api/recipe/favorites";
      }

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRecipes(response.data);
    } catch (error) {
      toast.error("tarifler yüklenemedi");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="px-8 md:px-16 py-12 font-sans bg-white min-h-screen">
      <div className="flex justify-between items-start mb-12">
        <div className="text-left">
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
        <div className="flex flex-col items-end gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-[#D47900] transition-all shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span> Tarif Paylaş
          </button>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-100 p-8 rounded-full mb-6">
            <UtensilsCrossed size={48} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            {searchTerm
              ? "Aradığınız kriterde tarif bulunamadı"
              : "Henüz hiç tarif eklenmediniz"}
          </h3>
          <p className="text-gray-500 max-w-xs">
            {searchTerm
              ? "Farklı anahtar kelimelerle aramayı deneyebilirsiniz."
              : "Paylaştığınız lezzetler burada listelenecek. İlk tarifinizi hemen ekleyebilirsiniz!"}
          </p>
        </div>
      )}

      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchRecipes}
        editData={selectedRecipe}
      />
    </div>
  );
};

export default Main;
