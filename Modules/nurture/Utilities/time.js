export const availableMinutes = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
export const defaultMinutes = availableMinutes.indexOf(30);

export function formatHour(hour) {
  return hour < 10 ? `0${hour}:00` : `${hour}:00`;
}
