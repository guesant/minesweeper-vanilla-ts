export const getMaskedCounter = (value: string | number) =>
  String(Math.min(+value, 999)).padStart(3, "0")
