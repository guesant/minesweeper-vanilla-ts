import { GameCellStatus } from "../features/GameTable/GameCellStatus"

export const splitGameCellStatus = (cellStatus: GameCellStatus) => {
  const hasFlag = Boolean(cellStatus & GameCellStatus.FLAG)
  const hasBomb = Boolean(cellStatus & GameCellStatus.BOMB)
  const isOpened = Boolean(cellStatus & GameCellStatus.OPENED)
  const hasBombClicked = Boolean(cellStatus & GameCellStatus.BOMB_CLICK)

  return { hasFlag, hasBomb, isOpened, hasBombClicked }
}
