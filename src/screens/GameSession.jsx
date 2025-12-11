import React, { useState, useEffect, useCallback } from "react";
import { Star, X, Volume, VolumeX } from "lucide-react";
import { GameLogic } from "../utils/gameLogic";
import ModoCharacter from "../components/ModoCharacter";
import NumberCard from "../components/NumberCard";
import Button from "../components/Button";
import { AudioManager } from "../utils/audioManager";

const GameSession = ({ level, onFinishLevel, onExit }) => {
  // Gunakan Lazy Initialization
  const [gameState, setGameState] = useState(() =>
    GameLogic.generateProblem(level)
  );

  const [session, setSession] = useState(() => ({
    score: 0,
    lives: 3,
    wins: 0,
    timer: level.timer || 0,
    isOver: false,
    message:
      level.modeType === "multi"
        ? "Pilih SEMUA modus yang ada!"
        : "Cari angka yang paling sering muncul!",
    modoState: "idle",
  }));

  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isMuted, setIsMuted] = useState(AudioManager.muted);

  const toggleMusic = () => {
    AudioManager.setMuted(!isMuted);
    setIsMuted((v) => !v);
  };

  // NEXT ROUND
  const nextRound = useCallback(() => {
    const data = GameLogic.generateProblem(level);
    setGameState(data);
    setSelectedAnswers([]);
    setSession((prev) => ({
      ...prev,
      timer: level.timer || 0,
      modoState: "idle",
      message:
        level.modeType === "multi"
          ? "Pilih SEMUA modus yang ada!"
          : "Cari angka yang paling sering muncul!",
    }));
  }, [level]);

  // LOSE LIFE
  const handleLoseLife = useCallback(
    (msg) => {
      AudioManager.play("wrong"); // 🔊 salah / kehilangan nyawa

      setSession((prev) => {
        const newLives = prev.lives - 1;
        const isDead = newLives <= 0;

        if (isDead) {
          setTimeout(() => {
            AudioManager.play("lose"); // 🔊 mati
            onFinishLevel(prev.score, false);
          }, 1200);
        } else {
          setTimeout(nextRound, 1500);
        }

        return {
          ...prev,
          lives: newLives,
          modoState: isDead ? "full" : "angry",
          message: msg,
          isOver: isDead,
        };
      });
    },
    [onFinishLevel, nextRound]
  );

  // TIMER
  useEffect(() => {
    if (level.timer && !session.isOver) {
      if (session.timer > 0) {
        const interval = setInterval(() => {
          setSession((prev) => ({ ...prev, timer: prev.timer - 1 }));
        }, 1000);
        return () => clearInterval(interval);
      }

      // WAKTU HABIS
      if (session.timer === 0) {
        AudioManager.play("wrong"); // 🔊 waktu habis
        setTimeout(() => handleLoseLife("Waktu Habis!"), 0);
      }
    }
  }, [
    session.timer,
    session.isOver,
    level.timer,
    session.modoState,
    handleLoseLife,
  ]);

  // CHECK ANSWER (MULTI)
  const checkAnswer = () => {
    const isCorrectLength = selectedAnswers.length === gameState.modes.length;
    const allCorrect = selectedAnswers.every((ans) =>
      gameState.modes.includes(ans)
    );

    if (isCorrectLength && allCorrect) {
      AudioManager.play("correct"); // 🔊 benar

      const bonusTime = session.timer * 5;
      const roundScore = 100 + bonusTime;

      setSession((prev) => {
        const newWins = prev.wins + 1;
        const isLevelComplete = newWins >= level.targetWins;

        if (isLevelComplete) {
          setTimeout(() => {
            AudioManager.play("win"); // 🔊 level menang
            const finalScore = prev.score + roundScore;
            onFinishLevel(finalScore, true);
          }, 1600);
        } else {
          setTimeout(nextRound, 1600);
        }

        return {
          ...prev,
          score: prev.score + roundScore,
          wins: newWins,
          modoState: "eating",
          message: "Nyam! Benar!",
          isOver: isLevelComplete,
        };
      });
    } else {
      AudioManager.play("wrong"); // 🔊 salah multi
      handleLoseLife(
        level.modeType === "multi" &&
          selectedAnswers.length < gameState.modes.length
          ? "Jawaban kurang lengkap!"
          : "Salah! Modo marah."
      );
    }
  };

  // TOGGLE ANSWER (SINGLE / MULTI)
  const toggleAnswer = (num) => {
    if (session.isOver) return;

    AudioManager.play("select"); // 🔊 klik angka

    if (level.modeType === "single") {
      const isCorrect = gameState.modes.includes(num);
      setSelectedAnswers([num]);

      if (isCorrect) {
        AudioManager.play("correct"); // 🔊 benar 1 klik

        const bonusTime = session.timer * 5;
        const roundScore = 100 + bonusTime;

        setSession((prev) => {
          const newWins = prev.wins + 1;
          const isLevelComplete = newWins >= level.targetWins;

          if (isLevelComplete) {
            setTimeout(() => {
              AudioManager.play("win"); // 🔊 level menang
              onFinishLevel(prev.score + roundScore, true);
            }, 1500);
          } else {
            setTimeout(nextRound, 1500);
          }

          return {
            ...prev,
            score: prev.score + roundScore,
            wins: newWins,
            modoState: "eating",
            message: "Benar!",
            isOver: isLevelComplete,
          };
        });
      } else {
        AudioManager.play("wrong"); // 🔊 salah
        handleLoseLife("Salah!");
      }
    } else {
      // multi mode → hanya toggle
      setSelectedAnswers((prev) =>
        prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
      );
    }
  };

  // Play background music while this session is mounted
  useEffect(() => {
    AudioManager.playBGM();
    return () => {
      AudioManager.stopBGM();
    };
  }, []);

  const handleExitClick = () => {
    AudioManager.stopBGM();
    onExit();
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center p-4">
      {/* Header Container */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-2 mb-4">
        {/* Tombol Keluar */}
        <button
          onClick={handleExitClick}
          className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 text-red-500 hover:bg-red-50 transition-colors"
          title="Keluar ke Menu"
        >
          <X size={24} />
        </button>

        {/* Tombol Toggle Musik */}
        <button
          onClick={toggleMusic}
          className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 text-gray-700 hover:bg-gray-50 transition-colors"
          title={isMuted ? "Nyalakan Musik" : "Matikan Musik"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume size={20} />}
        </button>

        {/* Info Bar */}
        <div className="flex-1 flex justify-between items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-blue-100">
          <div className="flex gap-1 text-red-500 items-center">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl transition-opacity ${
                  i < session.lives ? "opacity-100" : "opacity-20 grayscale"
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
          <div className="font-bold text-lg text-gray-700 flex items-center">
            Ronde {session.wins + 1}
            <span className="text-gray-400 text-sm ml-1">
              /{level.targetWins}
            </span>
          </div>
          <div className="font-bold text-yellow-600 flex items-center gap-1 bg-yellow-50 px-3 rounded-lg">
            <Star size={20} fill="currentColor" /> {session.score}
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      {level.timer && (
        <div className="w-full max-w-3xl h-3 bg-gray-200 rounded-full overflow-hidden mb-6 border border-gray-300">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              session.timer < 5 ? "bg-red-500" : "bg-orange-500"
            }`}
            style={{ width: `${(session.timer / level.timer) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center space-y-8">
        {/* Karakter Monster */}
        <div className="relative group">
          <ModoCharacter state={session.modoState} />
          <div className="absolute -top-4 -right-24 md:-right-40 bg-white px-4 py-3 rounded-2xl shadow-lg border-2 border-gray-100 animate-bounce-slow max-w-[150px] md:max-w-[200px] z-10">
            <p className="font-bold text-sm text-gray-800 leading-tight text-center">
              {session.message}
            </p>
            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-100 transform rotate-45 -translate-y-1/2"></div>
          </div>
        </div>

        {/* DATA (Kartu Soal) */}
        <div className="bg-white/60 p-6 rounded-2xl w-full border border-white/50 backdrop-blur-sm shadow-sm">
          <p className="text-center text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">
            Data Statistik
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {gameState.cards.map((num, idx) => (
              <div
                key={idx}
                className="w-10 h-12 md:w-12 md:h-14 bg-white border-2 border-indigo-100 rounded-lg flex items-center justify-center font-bold text-xl text-indigo-700 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* CONTROLS (Pilihan Jawaban) */}
        <div className="w-full pb-8">
          <p className="text-center text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">
            {level.modeType === "multi"
              ? "Pilih Angka Modus (Bisa > 1)"
              : "Pilih Satu Angka Modus"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {gameState.options.map((opt) => (
              <NumberCard
                key={opt}
                value={opt}
                isSelected={selectedAnswers.includes(opt)}
                onClick={() => toggleAnswer(opt)}
                disabled={session.isOver}
              />
            ))}
          </div>

          {/* Tombol Submit Khusus Multi Mode */}
          {level.modeType === "multi" && !session.isOver && (
            <div className="mt-8 flex justify-center animate-fade-in">
              <Button
                variant="success"
                onClick={checkAnswer}
                className="w-full max-w-xs text-lg shadow-green-200"
                disabled={selectedAnswers.length === 0}
              >
                BERI MAKAN MODO! 🍖
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSession;
