import React from "react";
import { Home, Star, Lock, Play } from "lucide-react";
import { LEVEL_CONFIG } from "../data/levelConfig";
import Button from "../components/Button";
import { AudioManager } from "../utils/audioManager";

const LevelSelectScreen = ({
  unlockedLevel,
  totalScore,
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-indigo-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <Button variant="neutral" onClick={onBack}>
          <Home size={20} />
        </Button>
        <div className="bg-white px-4 py-2 rounded-full shadow font-bold text-indigo-600 flex items-center gap-2 border border-indigo-100">
          <Star className="fill-yellow-400 text-yellow-400" /> {totalScore}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-indigo-900 mb-6">Pilih Level</h2>

      <div className="grid gap-4 w-full max-w-2xl">
        {LEVEL_CONFIG.map((level) => {
          const isLocked = level.id > unlockedLevel;

          return (
            <div
              key={level.id}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isLocked
                  ? "bg-gray-100 border-gray-200 opacity-70"
                  : "bg-white border-indigo-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
              }`}
              onClick={() => {
                if (isLocked) {
                  AudioManager.play("wrong");
                  return;
                }

                AudioManager.play("select");
                onSelectLevel(level);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isLocked ? "text-gray-500" : "text-indigo-700"
                    }`}
                  >
                    {level.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {level.description}
                  </p>

                  {isLocked ? (
                    <div className="mt-2 text-xs font-bold text-red-400 flex items-center gap-1">
                      <Lock size={12} /> Butuh Total Skor{" "}
                      {level.minScoreToUnlock}
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                        {level.modeType === "multi"
                          ? "Multi Modus"
                          : "Single Modus"}
                      </span>
                      {level.timer && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                          ⏱ {level.timer} Detik
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {isLocked ? (
                  <Lock className="text-gray-400" />
                ) : (
                  <Play className="text-indigo-500 fill-indigo-100" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelectScreen;
