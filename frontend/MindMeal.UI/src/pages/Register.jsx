import { UtensilsCrossed } from "lucide-react";
import Entry from "../components/Entry";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import HeroSvg from "../assets/hero.svg";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "İsim en az 3 karakter olmalı"),
    email: z.string().email("Geçerli bir email giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onRegisterSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5085/api/auth/register", {
        username: data.fullName,
        email: data.email,
        password: data.password,
      });
      toast.success("Kayıt başarılı!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data || "Hata oluştu");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#E5E5E5]">
      <div className="hidden lg:block w-1/2 h-full relative">
        <img
          src={HeroSvg}
          alt="MindMeal Hero"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 pb-20">
          <h2 className="text-white text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Özgüvenle <br /> Pişir
          </h2>
          <p className="text-white/90 text-lg max-w-md font-medium leading-relaxed">
            Binlerce tarifi keşfet, sevdiklerini sakla, mutfakta adım adım
            rehberinle fark yarat.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8">
            <UtensilsCrossed className="text-[#CD7102] w-8 h-8" />
            <span className="text-2xl font-bold text-[#4A4A4A]">MindMeal</span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
            Kayıt Olun
          </h1>
          <p className="text-gray-500 text-sm mb-6 text-center font-medium">
            yeni lezzetler keşfetmek için aramıza katılın
          </p>

          <hr className="w-full border-gray-300 mb-8" />

          <form
            onSubmit={handleSubmit(onRegisterSubmit)}
            className="w-full flex flex-col gap-5"
          >
            <div className="flex flex-col">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Entry
                    {...field}
                    iconName="User"
                    placeholder="İsim Soyisim"
                  />
                )}
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs mt-1 ml-2">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Entry
                    {...field}
                    iconName="Mail"
                    placeholder="Email adresi"
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 ml-2">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Entry
                    {...field}
                    iconName="Lock"
                    placeholder="Şifre"
                    type="password"
                  />
                )}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 ml-2">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Entry
                    {...field}
                    iconName="ShieldCheck"
                    placeholder="Şifre Tekrar"
                    type="password"
                  />
                )}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 ml-2">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full mt-4 py-3 shadow-lg">
              Hesap Oluştur <span className="text-xl">→</span>
            </Button>

            <p className="text-center mt-8 text-gray-500 text-sm font-medium">
              Zaten bir hesabınız var mı?{" "}
              <Link
                to="/login"
                className="text-[#CD7102] font-bold hover:underline"
              >
                Giriş Yapın
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
