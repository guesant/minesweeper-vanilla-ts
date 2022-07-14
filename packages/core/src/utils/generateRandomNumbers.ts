export const generateRandomNumbers = (
  quantity: number,
  maxValue: number,
  excludeNumbers: number | number[]
) => {
  const excludeNumbers_ = Array.isArray(excludeNumbers)
    ? excludeNumbers
    : [excludeNumbers]

  const generated = new Set<number>()

  while (generated.size !== quantity) {
    const randomNumber = Math.floor(Math.random() * maxValue)

    if (!excludeNumbers_.includes(randomNumber)) {
      generated.add(randomNumber)
    }
  }

  return Array.from(generated)
}
