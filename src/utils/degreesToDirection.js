export function degreesToDirection(degrees) {
  const directions = [
    "North",
    "North East",
    "East",
    "South East",
    "South",
    "South West",
    "West",
    "North West",
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
