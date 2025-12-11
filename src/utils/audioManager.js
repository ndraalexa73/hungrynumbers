export const AudioManager = {
  sounds: {
    correct: new Audio("/sfx/correct.mp3"),
    wrong: new Audio("/sfx/wrong.mp3"),
    lose: new Audio("/sfx/lose.mp3"),
    win: new Audio("/sfx/win.mp3"),
    select: new Audio("/sfx/selectmodebutton.mp3"), // gunakan ini
    start: new Audio("/sfx/startbutton.mp3"), // khusus tombol Start
  },
  bgm: new Audio("/sfx/bgm.mp3"),
  muted: false,
  sfxVolume: 1.0,
  bgmVolume: 0.5,

  init() {
    if (this.bgm) {
      this.bgm.loop = true;
      this.bgm.volume = this.bgmVolume;
    }
  },

  play(name) {
    if (this.muted) return;
    const sound = this.sounds[name];
    if (!sound) return;
    sound.volume = this.sfxVolume;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  playBGM() {
    if (!this.bgm) return;
    this.bgm.volume = this.bgmVolume;
    if (!this.muted) this.bgm.play().catch(() => {});
  },

  pauseBGM() {
    if (this.bgm) this.bgm.pause();
  },

  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
  },

  toggleBGM() {
    if (!this.bgm) return;
    if (this.bgm.paused) this.playBGM(); else this.pauseBGM();
  },

  setBGMVolume(v) {
    this.bgmVolume = Math.max(0, Math.min(1, v));
    if (this.bgm) this.bgm.volume = this.bgmVolume;
  },

  setSFXVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
  },

  setMuted(val) {
    this.muted = !!val;
    if (this.bgm) this.bgm.muted = this.muted;
    Object.values(this.sounds).forEach((s) => (s.muted = this.muted));
  },
};

AudioManager.init();
