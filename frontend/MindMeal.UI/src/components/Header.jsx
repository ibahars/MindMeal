import React, { useState } from "react";
import { UtensilsCrossed, User, LogOut, BookOpen, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const currentFilter = queryParams.get("filter");
  const isMyRecipes = currentFilter === "mine";
  const isFavorites = currentFilter === "favorites";

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Başarıyla çıkış yapıldı!");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 font-sans">
      <Link
        to="/main"
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <UtensilsCrossed className="text-[#CD7102] w-7 h-7" />
        <span className="text-xl font-bold text-[#4A4A4A] tracking-tight">
          MindMeal
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden md:block relative flex-1 max-w-md mx-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tarif ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F0F0F0] rounded-full py-2 pl-12 pr-6 outline-none focus:ring-2 focus:ring-[#D47900] transition-all font-medium text-black text-sm"
          />
        </div>
        <Button
          variant={isMyRecipes ? "primary" : "outline"}
          className={`!px-4 !py-2 ${!isMyRecipes ? "border-[#CD7102] text-[#CD7102]" : ""}`}
          onClick={() =>
            isMyRecipes ? navigate("/main") : navigate("/main?filter=mine")
          }
        >
          Tariflerim
        </Button>
        <Button
          variant={isFavorites ? "primary" : "outline"}
          className={`flex items-center gap-2 !px-4 !py-2 ${!isFavorites ? "border-[#CD7102] text-[#CD7102]" : ""}`}
          onClick={() =>
            isFavorites ? navigate("/main") : navigate("/main?filter=favorites")
          }
        >
          Favorilerim
        </Button>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
          >
            <div className="w-8 h-8 bg-[#CD7102]/10 rounded-full flex items-center justify-center">
              <User className="text-[#CD7102] w-5 h-5" />
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
