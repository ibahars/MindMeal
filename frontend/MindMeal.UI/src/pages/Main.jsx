import React from "react";
import Header from "../components/Header";
const Main = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#F8F8F8] font-sans">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-[#4A4A4A] mb-4">
          Anasayfa
        </h1>
        <p className="text-gray-500 font-medium">
          MindMeal dünyasına hoş geldiniz! Tariflerinizi yönetmeye hazır
          mısınız?
        </p>
      </div>
    </div>
  );
};

export default Main;
