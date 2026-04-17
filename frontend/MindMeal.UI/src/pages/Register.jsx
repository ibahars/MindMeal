import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import Entry from "../components/Entry";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import HeroSvg from "../assets/hero.svg";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            Kayıt Olun
          </h1>
          <br />
          <p className="text-gray-500 text-sm mb-8 text-center leading-tight font-medium">
            yeni lezzetler keşfetmek için aramıza katılın
          </p>

          <hr className="w-full border-gray-300 mb-8" />

          <div className="w-full flex flex-col gap-5">
            <Entry
              iconName="User"
              placeholder="İsim Soyisim"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Entry
              iconName="Mail"
              placeholder="Email adresi"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Entry
              iconName="Lock"
              placeholder="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Entry
              iconName="ShieldCheck"
              placeholder="Şifre Tekrar"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              className="w-full mt-4 flex items-center justify-center gap-2 text-lg py-3 shadow-lg"
              onClick={() => console.log("Kayıt olunuyor...")}
            >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
