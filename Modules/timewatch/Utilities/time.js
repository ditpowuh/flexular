export function formatTime(elapsed) {
  let milliseconds = Math.floor((elapsed % 1000) / 10);
  let seconds = Math.floor((elapsed / 1000) % 60);
  let minutes = Math.floor((elapsed / (1000 * 60)) % 60);
  let hours = Math.floor((elapsed / (1000 * 60 * 60)) % 100);

  milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  hours = hours < 10 ? "0" + hours : hours;

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
