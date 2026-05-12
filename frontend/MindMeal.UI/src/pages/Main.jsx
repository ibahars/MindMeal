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
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");

  const categories = [
    "Hepsi",
    "Kahvaltı",
    "Ana Yemek",
    "Tatlı",
    "İçecek",
    "Atıştırmalık",
    "Diyet",
  ];

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

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Hepsi" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-8 md:px-16 py-12 font-sans bg-[#F9F8F3] min-h-screen">
      {/* ÜST KISIM (HERO) */}
      <div className="flex justify-between items-start mb-16">
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-[#D47900] transition-all shadow-lg flex items-center gap-2"
        >
          <span className="text-xl">+</span> Tarif Paylaş
        </button>
      </div>

      {/* AYIRICI ÇİZGİ VE FİLTRELER */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-end">
          <div className="flex flex-wrap gap-2 bg-[#F9F8F3] pl-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#D47900] text-white border-[#D47900] shadow-md scale-105"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#D47900] hover:text-[#D47900]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ALT KISIM (RECIPE GRID) */}
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
          <div className="bg-white p-8 rounded-full mb-6 shadow-sm border border-gray-100">
            <UtensilsCrossed size={48} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Tarif Bulunamadı
          </h3>
          <p className="text-gray-500 max-w-xs font-medium">
            {selectedCategory !== "Hepsi"
              ? `${selectedCategory} kategorisinde henüz uygun bir tarifimiz yok.`
              : "Aradığınız kriterlere uygun lezzetleri henüz hazırlayamadık."}
          </p>
        </div>
      )}

      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={fetchRecipes}
        editData={selectedRecipe}
      />
    </div>
  );
};

export default Main;
