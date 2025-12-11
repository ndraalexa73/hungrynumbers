import React from "react";
import { Play, Trophy } from "lucide-react";
import Button from "../components/Button";
import ModoCharacter from "../components/ModoCharacter";
import { AudioManager } from "../utils/audioManager";

const StartScreen = ({ onStart, totalScore }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-6 text-center space-y-8 animate-fade-in">
    <div className="space-y-2">
      <h1 className="text-5xl font-extrabold text-orange-600 tracking-tight">
        Hungry Numbers
      </h1>
      <p className="text-lg text-orange-800 font-medium">
        Bantu Modo mencari angka Modus!
      </p>
    </div>

    <ModoCharacter state="happy" />

    <div className="bg-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 border border-yellow-200">
      <Trophy className="text-yellow-500" />
      <span className="font-bold text-gray-700">Total Skor: {totalScore}</span>
    </div>

    <Button
      onClick={() => {
        AudioManager.play("start");
        onStart();
      }}
      className="text-xl px-12 py-4 shadow-orange-300"
    >
      <Play size={24} /> MULAI PETUALANGAN
    </Button>
  </div>
);

export default StartScreen;
