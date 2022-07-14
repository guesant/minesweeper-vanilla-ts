import { GameCellsCounter } from "../features/Game/GameCellsCounter"

export const getDefaultCellsCounter = (): GameCellsCounter => ({
  flags: 0,
  distributedBombs: 0,
  bombClickIndex: null,
  cellsOpened: 0
})
