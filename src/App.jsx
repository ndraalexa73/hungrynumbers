import React, { useState, useEffect } from "react";
import StartScreen from "./screens/StartScreen";
import LevelSelectScreen from "./screens/LevelSelectScreen";
import GameSession from "./screens/GameSession";
import ResultScreen from "./screens/ResultScreen";
import { StorageManager } from "./utils/storageManager";

export default function App() {
  const [screen, setScreen] = useState("start"); // start, levelSelect, game, result
  const [userData, setUserData] = useState({ unlockedLevel: 1, totalScore: 0 });
  const [activeLevel, setActiveLevel] = useState(null);
  const [lastGameResult, setLastGameResult] = useState(null);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    Promise.resolve().then(() => {
      const data = StorageManager.load();
      setUserData(data);
      setBestScore(StorageManager.getBestScore());
    });
  }, []);

  const handleLevelSelect = (level) => {
    setActiveLevel(level);
    setScreen("game");
  };

  const handleFinishLevel = (score, isWin) => {
    const newData = StorageManager.updateScore(activeLevel.id, score, isWin);

    setUserData(newData);
    setBestScore(newData.levelScores[activeLevel.id] || 0);

    setLastGameResult({ isWin, score });
    setScreen("result");
  };

  // Screen Router
  if (screen === "start") {
    return (
      <StartScreen
        totalScore={userData.totalScore}
        onStart={() => setScreen("levelSelect")}
      />
    );
  }

  if (screen === "levelSelect") {
    return (
      <LevelSelectScreen
        unlockedLevel={userData.unlockedLevel}
        totalScore={userData.totalScore}
        onSelectLevel={handleLevelSelect}
        onBack={() => setScreen("start")}
      />
    );
  }

  if (screen === "game" && activeLevel) {
    return (
      <GameSession
        level={activeLevel}
        onFinishLevel={handleFinishLevel}
        onExit={() => setScreen("levelSelect")}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        isWin={lastGameResult?.isWin}
        score={lastGameResult?.score}
        bestScore={bestScore}
        onRetry={() => setScreen("game")}
        onHome={() => setScreen("levelSelect")}
      />
    );
  }

  return null;
}
