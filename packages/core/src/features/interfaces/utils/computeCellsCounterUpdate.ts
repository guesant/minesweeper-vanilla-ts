import { MakeArrayProxyHandlerInfo } from "../../../utils/makeArrayProxy"
import { GameCellStatus } from "../GameCellStatus"
import { getDefaultCellsCounter } from "./getDefaultCellsCounter"
import { updateCellsCounterState } from "./updateCellsCounterState"
import { Game } from "../../Game/Game"

export const computeCellsCounterUpdate = (
  game: Game,
  info?: MakeArrayProxyHandlerInfo<GameCellStatus>
) => {
  if (!info) {
    return game.cells.reduce(
      (acc, cellStatus, idx) => updateCellsCounterState(idx, cellStatus, acc),
      getDefaultCellsCounter()
    )
  } else {
    const { idx, prevValue, nextValue } = info ?? {}

    if (prevValue !== nextValue) {
      const cellsCounterReverted = updateCellsCounterState(
        idx,
        prevValue,
        game.cellsCounter,
        true
      )

      const cellsCounterUpdatedWithNextValue = updateCellsCounterState(
        idx,
        nextValue,
        cellsCounterReverted
      )

      return cellsCounterUpdatedWithNextValue
    }
  }
  return game.cellsCounter
}
