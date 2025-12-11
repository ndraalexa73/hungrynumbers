import React from "react";
import { Home, RotateCcw } from "lucide-react";
import Button from "../components/Button";
import ModoCharacter from "../components/ModoCharacter";

const ResultScreen = ({ isWin, score, bestScore, onRetry, onHome }) => (
  <div
    className={`min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in ${
      isWin ? "bg-green-50" : "bg-red-50"
    }`}
  >
    <ModoCharacter state={isWin ? "eating" : "full"} />

    <h2
      className={`text-4xl font-extrabold mt-6 mb-2 ${
        isWin ? "text-green-700" : "text-red-700"
      }`}
    >
      {isWin ? "LEVEL SELESAI!" : "WADUH, GAGAL!"}
    </h2>

    <p className="text-xl text-gray-700">
      Skor Kamu: <span className="font-bold">{score}</span>
    </p>

    <p className="text-lg text-gray-500 mb-8">
      Skor Tertinggi: <span className="font-semibold">{bestScore}</span>
    </p>

    <div className="flex gap-4">
      <Button variant="neutral" onClick={onHome}>
        <Home className="mr-2" size={20} /> Menu
      </Button>

      <Button variant={isWin ? "success" : "primary"} onClick={onRetry}>
        <RotateCcw className="mr-2" size={20} />
        {isWin ? "Main Lagi" : "Coba Lagi"}
      </Button>
    </div>
  </div>
);

export default ResultScreen;
