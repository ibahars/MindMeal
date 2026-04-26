import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Utensils, Clock, Activity, ImagePlus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Entry from "./Entry";
import Button from "./Button";

const recipeSchema = z.object({
  title: z.string().min(1, "Yemek adı zorunludur"),
  prepTime: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Süre 1'den büyük olmalıdır"),
  ),
  calories: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Kalori 1'den büyük olmalıdır"),
  ),
  difficulty: z.string().min(1, "Zorluk seçimi zorunludur"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
});

const AddRecipeModal = ({ isOpen, onClose, onRefresh, editData }) => {
  const isEdit = !!editData;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      prepTime: "",
      calories: "",
      difficulty: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        reset({
          title: editData.title || "",
          prepTime: editData.prepTime || "",
          calories: editData.calories || "",
          difficulty: editData.difficulty || "",
          description: editData.description || "",
        });
        setPreviewUrl(editData.imageUrl || null);
      } else {
        reset({
          title: "",
          prepTime: "",
          calories: "",
          difficulty: "",
          description: "",
        });
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    }
  }, [editData, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("prepTime", data.prepTime);
      formData.append("calories", data.calories);
      formData.append("difficulty", data.difficulty);
      if (selectedFile) formData.append("imageFile", selectedFile);

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEdit) {
        await axios.put(
          `http://localhost:5085/api/recipe/${editData.id}`,
          formData,
          config,
        );
        toast.success("Güncellendi!");
      } else {
        await axios.post("http://localhost:5085/api/recipe", formData, config);
        toast.success("Paylaşıldı!");
      }
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("İşlem başarısız!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#E5E5E5] w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-black text-black mb-8">
          {isEdit ? "Tarifi Düzenle" : "Yeni Tarif Paylaş"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="relative w-full h-44 bg-white rounded-[25px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#D47900]">
            {previewUrl ? (
              <img
                src={previewUrl}
                className="w-full h-full object-cover"
                alt="Önizleme"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImagePlus size={40} />
                <span className="text-sm font-bold mt-2">
                  Kapak Fotoğrafı Ekle
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Entry {...field} iconName="Utensils" placeholder="Yemek Adı" />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-xs ml-4 mt-1 font-semibold">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
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
              {errors.prepTime && (
                <p className="text-red-500 text-xs ml-4 mt-1 font-semibold">
                  {errors.prepTime.message}
                </p>
              )}
            </div>
            <div className="flex-1">
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
              {errors.calories && (
                <p className="text-red-500 text-xs ml-4 mt-1 font-semibold">
                  {errors.calories.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <select
              {...register("difficulty")}
              className={`w-full bg-white rounded-full px-6 py-3 shadow-sm border-none outline-none text-sm font-medium text-gray-700 appearance-none ${errors.difficulty ? "ring-2 ring-red-500" : ""}`}
            >
              <option value="">Zorluk Seçin</option>
              <option value="Kolay">Kolay</option>
              <option value="Orta">Orta</option>
              <option value="Zor">Zor</option>
            </select>
            {errors.difficulty && (
              <p className="text-red-500 text-xs ml-4 mt-1 font-semibold">
                {errors.difficulty.message}
              </p>
            )}
          </div>
          <div>
            <textarea
              {...register("description")}
              placeholder="Tarif detaylarını buraya yazın..."
              className={`w-full bg-white rounded-[20px] px-6 py-4 shadow-sm border-none outline-none text-sm font-medium text-gray-700 min-h-[120px] resize-none ${errors.description ? "ring-2 ring-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs ml-4 mt-1 font-semibold">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 !rounded-full py-4 border-black text-black hover:bg-black hover:text-white"
              onClick={onClose}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 !rounded-full py-4 bg-black text-white hover:bg-[#D47900]"
            >
              {isEdit ? "Güncelle" : "Paylaş"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;
