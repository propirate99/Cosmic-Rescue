class SoundEngine {
  constructor() { this.context = null; this.master = null; this.enabled = true; this.ambient = null; this.ambientGain = null; }
  init() {
    if (this.context || typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.context = new AudioContextClass();
    this.master = this.context.createGain();
    this.master.gain.value = this.enabled ? 0.22 : 0;
    this.master.connect(this.context.destination);
  }
  resume() {
    this.init();
    if (this.context?.state === 'suspended') this.context.resume().catch(() => {});
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    if (this.master && this.context) this.master.gain.setTargetAtTime(enabled ? 0.22 : 0, this.context.currentTime, 0.04);
  }
  tone({ frequency = 440, duration = 0.16, type = 'sine', volume = 0.25, slideTo = null } = {}) {
    if (!this.enabled) return;
    this.resume();
    if (!this.context || !this.master) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), this.context.currentTime + duration);
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain); gain.connect(this.master);
    oscillator.start(); oscillator.stop(this.context.currentTime + duration);
  }
  click() { this.tone({ frequency: 650, duration: 0.06, type: 'square', volume: 0.08 }); }
  select() { this.tone({ frequency: 480, duration: 0.12, type: 'triangle', volume: 0.12 }); }
  error() { this.tone({ frequency: 230, slideTo: 100, duration: 0.28, type: 'sawtooth', volume: 0.14 }); }
  success() { this.tone({ frequency: 660, duration: 0.14, type: 'triangle' }); setTimeout(() => this.tone({ frequency: 880, duration: 0.18, type: 'triangle' }), 130); }
  launch() { this.tone({ frequency: 70, slideTo: 280, duration: 1.0, type: 'sawtooth', volume: 0.2 }); }
  alarm() { this.tone({ frequency: 820, slideTo: 430, duration: 0.22, type: 'square', volume: 0.12 }); }
  startAmbient() {
    this.resume();
    if (!this.context || !this.master || this.ambient) return;
    this.ambient = this.context.createOscillator();
    this.ambientGain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    this.ambient.type = 'triangle';
    this.ambient.frequency.value = 48;
    filter.type = 'lowpass';
    filter.frequency.value = 140;
    this.ambientGain.gain.value = 0.055;
    this.ambient.connect(filter); filter.connect(this.ambientGain); this.ambientGain.connect(this.master);
    this.ambient.start();
  }
  stopAmbient() {
    if (this.ambient) { this.ambient.stop(); this.ambient.disconnect(); this.ambient = null; }
    if (this.ambientGain) { this.ambientGain.disconnect(); this.ambientGain = null; }
  }
  rescue() { [523, 659, 784, 1046].forEach((frequency, index) => setTimeout(() => this.tone({ frequency, duration: 0.22, type: 'triangle' }), index * 140)); }
  toggle() { this.setEnabled(!this.enabled); return this.enabled; }
}
export const sound = new SoundEngine();
