export function degreesToDirection(degrees: number): string {
  const directions: string[] = [
    "North",
    "North East",
    "East",
    "South East",
    "South",
    "South West",
    "West",
    "North West",
  ];
  const index: number = Math.round(degrees / 45) % 8;
  return directions[index];
}
