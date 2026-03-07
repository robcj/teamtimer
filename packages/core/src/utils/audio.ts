export type TimerToneStyle = 'beep' | 'siren';

export const playTimerTone = (
  audioContext: AudioContext,
  duration = 0.1,
  style: TimerToneStyle = 'beep'
): void => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const startTime = audioContext.currentTime;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (style === 'siren') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(650, startTime);
    oscillator.frequency.linearRampToValueAtTime(1100, startTime + duration / 2);
    oscillator.frequency.linearRampToValueAtTime(650, startTime + duration);
    gainNode.gain.setValueAtTime(0.45, startTime);
  } else {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, startTime);
    gainNode.gain.setValueAtTime(0.3, startTime);
  }

  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};
