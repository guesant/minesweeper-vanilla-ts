import { get1DPosition } from "./get1DPosition"
import { get2DPosition } from "./get2DPosition"

export const getAroundPositions = (
  index: number,
  gameColsCount: number,
  gameRowsCount: number
) => {
  const { col, row } = get2DPosition(index, gameColsCount)

  const allPositions: [number, number, boolean][] = [
    [-1, -1, row > 0 && col > 0],
    [-1, 0, row > 0],
    [-1, 1, row > 0 && col < gameColsCount - 1],

    [0, -1, col > 0],
    [0, 1, col < gameColsCount - 1],

    [1, -1, row < gameRowsCount - 1 && col > 0],
    [1, 0, row < gameRowsCount - 1],
    [1, 1, row < gameRowsCount - 1 && col < gameColsCount - 1]
  ]

  return allPositions
    .filter(([, , isValid]) => isValid)
    .map(([rowDiff, colDiff]) => [row + rowDiff, col + colDiff])
    .map(([targetRow, targetCol]) =>
      get1DPosition({ col: targetCol, row: targetRow }, gameColsCount)
    )
}
