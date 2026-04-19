import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import Entry from "./Entry";
import Button from "./Button";

const recipeSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  prepTime: z.string().min(1, "Süre gerekli"),
  difficulty: z.string().min(1, "Zorluk seçiniz"),
  calories: z.string().min(1, "Kalori bilgisi gerekli"),
  description: z.string().min(10, "Kısa bir açıklama yazın"),
});

const AddRecipeModal = ({ isOpen, onClose, onRefresh }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(recipeSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5085/api/recipe",
        {
          title: data.title,
          prepTime: parseInt(data.prepTime),
          calories: parseInt(data.calories),
          difficulty: data.difficulty,
          description: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Tarif başarıyla eklendi!");
      reset();
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Tarif eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#E5E5E5] w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black font-bold text-xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-black text-black mb-6">Yeni Tarif Ekle</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Entry {...field} iconName="Utensils" placeholder="Yemek Adı" />
            )}
          />
          <div className="flex gap-4">
            <Controller
              name="prepTime"
              control={control}
              render={({ field }) => (
                <Entry
                  {...field}
                  type="number"
                  iconName="Clock"
                  placeholder="Dakika"
                />
              )}
            />
            <Controller
              name="calories"
              control={control}
              render={({ field }) => (
                <Entry
                  {...field}
                  type="number"
                  iconName="Activity"
                  placeholder="Kalori"
                />
              )}
            />
          </div>

          <select
            {...control.register("difficulty")}
            className="w-full bg-white rounded-full px-6 py-3 shadow-sm border-none outline-none text-sm font-medium text-gray-700"
          >
            <option value="">Zorluk Seçin</option>
            <option value="kolay">Kolay</option>
            <option value="orta">Orta</option>
            <option value="zor">Zor</option>
          </select>

          <textarea
            {...control.register("description")}
            placeholder="Kısa bir açıklama..."
            className="w-full bg-white rounded-[20px] px-6 py-4 shadow-sm border-none outline-none text-sm font-medium text-gray-700 min-h-[100px]"
          />

          <Button type="submit" className="mt-4">
            Tarifi Kaydet
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
