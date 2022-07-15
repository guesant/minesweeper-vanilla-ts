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

  const { hasBomb, wasBombClicked, hasFlag, isOpened } =
    splitGameCellStatus(cellStatus)

  const sumFactor = revert ? -1 : 1;

  cellsCounter.flags += Number(hasFlag) * sumFactor
  cellsCounter.cellsOpened += Number(isOpened) * sumFactor
  cellsCounter.distributedBombs += Number(hasBomb) * sumFactor

  if(wasBombClicked) {
    if(!revert) {
      cellsCounter.bombClickIndex = idx
    } else if(idx === cellsCounter.bombClickIndex) {
      cellsCounter.bombClickIndex = null
    }
  }

  return cellsCounter
}
