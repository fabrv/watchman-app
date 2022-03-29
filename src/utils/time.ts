export const toSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export const toHours = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secondsLeft = Math.round(seconds - hours * 3600 - minutes * 60);
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

export const toMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.round(seconds - minutes * 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}