export function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  const hours = date.getHours().toString().padStart(2, "0"); // Get hours and format with leading zero
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and format with leading zero
  return `${hours}:${minutes}`;
}
