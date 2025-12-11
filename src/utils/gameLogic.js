export const GameLogic = {
  getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  // Fungsi inti: Menghitung Modus
  calculateMode: (arr) => {
    const frequency = {};
    let maxFreq = 0;
    
    arr.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) maxFreq = frequency[num];
    });

    const modes = Object.keys(frequency)
      .filter(key => frequency[key] === maxFreq)
      .map(str => parseInt(str))
      .sort((a, b) => a - b);

    return { modes, maxFreq, frequency };
  },

  // Membuat soal yang valid sesuai konfigurasi level
  generateProblem: (config) => {
    let cards = [];
    let isValid = false;
    let result;
    let attempts = 0;

    // Loop sampai ketemu soal yang pas (misal: harus multimodus di level 3)
    while (!isValid && attempts < 200) {
      cards = [];
      for (let i = 0; i < config.cardCount; i++) {
        cards.push(GameLogic.getRandomInt(config.numberRange[0], config.numberRange[1]));
      }

      result = GameLogic.calculateMode(cards);
      
      if (config.modeType === 'single') {
        if (result.modes.length === 1) isValid = true;
      } else if (config.forceMulti) {
        if (result.modes.length > 1) isValid = true;
      } else {
        isValid = true;
      }
      attempts++;
    }

    // Generate Opsi Jawaban (Kunci Jawaban + Pengecoh)
    const distinctNumbers = [...new Set(cards)];
    let options = [...result.modes];
    
    while (options.length < Math.min(6, distinctNumbers.length + 1)) {
      const randomOpt = distinctNumbers[GameLogic.getRandomInt(0, distinctNumbers.length - 1)];
      if (!options.includes(randomOpt)) {
        options.push(randomOpt);
      }
      if (options.length >= distinctNumbers.length) break;
    }
    
    return {
      cards,
      modes: result.modes,
      options: options.sort((a, b) => a - b),
      maxFreq: result.maxFreq
    };
  }
};