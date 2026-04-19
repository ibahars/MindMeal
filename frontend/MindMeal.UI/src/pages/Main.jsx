import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { toast } from "react-toastify";

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
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Tarifler</h1>
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border p-4 rounded bg-white shadow-sm"
          >
            <h2 className="font-bold text-lg">{recipe.title}</h2>
            <p className="text-gray-600">{recipe.description}</p>
            <p className="text-orange-600 font-bold">{recipe.calories} kcal</p>
            <small className="text-gray-400">Zorluk: {recipe.difficulty}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
