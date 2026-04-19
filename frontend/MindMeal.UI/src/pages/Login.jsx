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
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(1, "Şifre zorunludur"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5085/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
      );

      login(response.data);
      toast.success(`Hoş geldin, ${response.data.username}!`);
      navigate("/main");
    } catch (error) {
      const errorMessage = error.response?.data || "Giriş yapılamadı!";
      toast.error(errorMessage);
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
            Mutfaktaki yolculuğuna kaldığın yerden devam et.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-10">
            <UtensilsCrossed className="text-[#CD7102] w-8 h-8" />
            <span className="text-2xl font-bold text-[#4A4A4A]">MindMeal</span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
            Giriş Yapın
          </h1>
          <p className="text-gray-500 text-sm mb-8 text-center font-medium">
            yemek serüvenine devam edebilmek için giriş yapın
          </p>

          <hr className="w-full border-gray-300 mb-8" />

          <form
            onSubmit={handleSubmit(onLoginSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Entry
                    {...field}
                    iconName="Mail"
                    placeholder="Email adresi"
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

            <div className="flex items-center justify-between w-full mt-1">
              <label className="flex items-center gap-2 text-gray-500 text-xs cursor-pointer font-medium">
                <input type="checkbox" className="rounded border-gray-400" />
                Beni Hatırla
              </label>
              <a
                href="#"
                className="text-[#CD7102] text-xs font-bold hover:opacity-80"
              >
                Şifrenizi mi unuttunuz?
              </a>
            </div>

            <Button type="submit" className="w-full mt-4 py-3 shadow-lg">
              Giriş Yap <span className="text-xl">→</span>
            </Button>

            <p className="text-center mt-10 text-gray-500 text-sm font-medium">
              Hesabınız yok mu?{" "}
              <Link
                to="/register"
                className="text-[#CD7102] font-bold hover:underline"
              >
                Oluşturun
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
