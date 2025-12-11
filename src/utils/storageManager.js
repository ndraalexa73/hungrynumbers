import { LEVEL_CONFIG } from "../data/levelConfig";

export const StorageManager = {
  KEY: "hungry_numbers_save_v1",

  load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) {
      return {
        unlockedLevel: 1,
        levelScores: {},
        totalScore: 0,
        bestScore: 0,
      };
    }
    return JSON.parse(raw);
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  getBestScore() {
    const data = this.load();
    return data.bestScore || 0;
  },

  updateScore(levelId, score, isWin = false) {
    const data = this.load();

    const oldScore = data.levelScores[levelId] || 0;

    // Selalu simpan score level (ambil score tertinggi)
    data.levelScores[levelId] = Math.max(oldScore, score);

    // Hitung ulang total score (akumulasi semua level)
    data.totalScore = Object.values(data.levelScores).reduce(
      (a, b) => a + b,
      0
    );

    // Update bestScore global
    data.bestScore = Math.max(...Object.values(data.levelScores));

    // Hanya unlock jika MENANG dan memenuhi minimum score
    if (isWin) {
      const nextLevel = LEVEL_CONFIG.find((l) => l.id === levelId + 1);

      if (nextLevel) {
        const need = nextLevel.minScoreToUnlock;

        if (data.totalScore >= need) {
          data.unlockedLevel = Math.max(data.unlockedLevel, levelId + 1);
        }
      }
    }

    this.save(data);
    return data;
  },
};
