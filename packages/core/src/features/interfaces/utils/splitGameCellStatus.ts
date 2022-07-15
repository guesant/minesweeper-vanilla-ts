import { GameCellStatus } from "../GameCellStatus"

export const splitGameCellStatus = (cellStatus: GameCellStatus) => {
  const hasFlag = Boolean(cellStatus & GameCellStatus.FLAG)
  const hasBomb = Boolean(cellStatus & GameCellStatus.BOMB)
  const isOpened = Boolean(cellStatus & GameCellStatus.OPENED)
  const wasBombClicked = Boolean(cellStatus & GameCellStatus.BOMB_CLICK)

  return { hasFlag, hasBomb, isOpened, wasBombClicked }
}
