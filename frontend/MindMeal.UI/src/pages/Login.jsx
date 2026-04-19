import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import Entry from "../components/Entry";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import HeroSvg from "../assets/hero.svg";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5085/api/auth/login",
        {
          email: email,
          password: password,
        },
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      alert("welcome");
    } catch (error) {
      console.error("Login Hatası:", error.response?.data || error.message);
      alert("giriş başarısız");
    }
  };
  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <div className="hidden lg:block w-1/2 h-full relative bg-gray-300">
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

      <div className="w-full lg:w-1/2 bg-[#E5E5E5] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-10">
            <UtensilsCrossed className="text-[#CD7102] w-8 h-8" />
            <span className="text-2xl font-bold text-[#4A4A4A]">MindMeal</span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
            Giriş Yapın
          </h1>
          <br></br>
          <p className="text-gray-500 text-sm mb-8 text-center leading-tight font-medium">
            yemek serüvenine devam edebilmek için giriş yapın
          </p>

          <hr className="w-full border-gray-300 mb-8" />

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            <Entry
              iconName="Mail"
              placeholder="Email adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Entry
              iconName="AlertCircle"
              placeholder="şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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

            <Button
              className="w-full mt-4 flex items-center justify-center gap-2 text-lg py-3 shadow-lg"
              type="submit"
            >
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
