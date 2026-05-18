"use client";

// Simple retro audio synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a retro "whirr" sound when claw moves
export const playWhirrSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

// Play a mechanical "grab" sound
export const playGrabSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

// Play a triumphant chime when winning
export const playChimeSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playTone(523.25, now, 0.2); // C5
  playTone(659.25, now + 0.15, 0.2); // E5
  playTone(783.99, now + 0.3, 0.4); // G5
  playTone(1046.50, now + 0.45, 0.6); // C6
};
