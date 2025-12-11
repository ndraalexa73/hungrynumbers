export const LEVEL_CONFIG = [
  {
    id: 1,
    name: "Level 1: Basic",
    description: "Cari satu angka yang paling sering muncul.",
    cardCount: 5,
    numberRange: [1, 5],
    modeType: 'single', // Pasti 1 modus
    timer: null,
    minScoreToUnlock: 0,
    targetWins: 3,
  },
  {
    id: 2,
    name: "Level 2: Medium",
    description: "Jumlah kartu lebih banyak. Fokus!",
    cardCount: 9,
    numberRange: [1, 8],
    modeType: 'single',
    timer: 20,
    minScoreToUnlock: 250,
    targetWins: 3,
  },
  {
    id: 3,
    name: "Level 3: Challenge",
    description: "Hati-hati! Bisa ada LEBIH DARI SATU modus.",
    cardCount: 12,
    numberRange: [1, 9],
    modeType: 'multi', // Bisa multimodus
    forceMulti: true, // Memaksa soal multimodus
    timer: null,
    minScoreToUnlock: 750,
    targetWins: 3,
  },
  {
    id: 4,
    name: "Level 4: Mixed Speed",
    description: "Cepat! Waktu hanya 15 detik!",
    cardCount: 15,
    numberRange: [1, 15],
    modeType: 'multi',
    timer: 15,
    minScoreToUnlock: 1000,
    targetWins: 4,
  },
  {
    id: 5,
    name: "Level 5: Expert",
    description: "Rentang luas (1-20) dan analisis cepat.",
    cardCount: 20,
    numberRange: [1, 20],
    modeType: 'multi',
    timer: 15,
    minScoreToUnlock: 1500,
    targetWins: 5,
  }
];