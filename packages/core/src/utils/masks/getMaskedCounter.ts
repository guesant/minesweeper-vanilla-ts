export const getMaskedCounter = (value: string | number) =>
  String(value).padStart(3, "0")
