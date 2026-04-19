import { useEffect } from "react";
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

const AddRecipeModal = ({ isOpen, onClose, onRefresh, editData }) => {
  const isEdit = !!editData;

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(recipeSchema),
  });

  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);
      setValue("prepTime", editData.prepTime.toString());
      setValue("calories", editData.calories.toString());
      setValue("difficulty", editData.difficulty);
      setValue("description", editData.description);
    } else {
      reset();
    }
  }, [editData, setValue, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const url = isEdit
      ? `http://localhost:5085/api/recipe/${editData.id}`
      : "http://localhost:5085/api/recipe";

    try {
      await axios({
        method: isEdit ? "put" : "post",
        url: url,
        data: {
          title: data.title,
          prepTime: parseInt(data.prepTime),
          calories: parseInt(data.calories),
          difficulty: data.difficulty,
          description: data.description,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(isEdit ? "Tarif güncellendi!" : "Tarif eklendi!");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu tarifi silmek istediğine emin misin?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5085/api/recipe/${editData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tarif silindi.");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Silinemedi.");
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

        <h2 className="text-3xl font-black mb-6">
          {isEdit ? "Tarifi Düzenle" : "Yeni Tarif Ekle"}
        </h2>

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
            <option value="Kolay">Kolay</option>
            <option value="Orta">Orta</option>
            <option value="Zor">Zor</option>
          </select>

          <textarea
            {...control.register("description")}
            placeholder="Kısa bir açıklama..."
            className="w-full bg-white rounded-[20px] px-6 py-4 shadow-sm border-none outline-none text-sm font-medium text-gray-700 min-h-[100px]"
          />

          <div className="flex gap-4 mt-4">
            <Button type="submit" className="flex-1">
              {isEdit ? "Güncelle" : "Kaydet"}
            </Button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 rounded-full font-bold hover:bg-red-700 transition-colors px-8"
              >
                Sil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
