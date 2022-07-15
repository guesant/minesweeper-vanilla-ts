import { GameCellStatus } from "../GameCellStatus"
import { getDefaultCellsCounter } from "./getDefaultCellsCounter"
import { splitGameCellStatus } from "./splitGameCellStatus"

export const updateCellsCounterState = (
  idx: number,
  cellStatus: GameCellStatus,
  currentCellsCounter = getDefaultCellsCounter(),
  revert = false
) => {
  const cellsCounter = structuredClone(currentCellsCounter)

  const { hasBomb, hasBombClicked, hasFlag, isOpened } =
    splitGameCellStatus(cellStatus)

  if (revert) {
    cellsCounter.flags -= Number(hasFlag)
    cellsCounter.cellsOpened -= Number(isOpened)
    cellsCounter.distributedBombs -= Number(hasBomb)

    if (hasBombClicked && idx === cellsCounter.bombClickIndex) {
      cellsCounter.bombClickIndex = null
    }
  } else {
    cellsCounter.flags += Number(hasFlag)
    cellsCounter.cellsOpened += Number(isOpened)
    cellsCounter.distributedBombs += Number(hasBomb)

    if (hasBombClicked) {
      cellsCounter.bombClickIndex = idx
    }
  }

  return cellsCounter
}
