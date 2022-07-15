import { GameStatus } from "../GameStatus"
import { Game } from "../../Game/Game"

export const getGameStatus = (game: Game) => {
  if (game.bombClickIndex) {
    return GameStatus.LOSE
  }

  if (game.cellsClosedCount === game.bombsCount) {
    return GameStatus.WIN
  }

  if (game.timer.isRunning) {
    return GameStatus.RUNNING
  }

  return GameStatus.STOPPED
}
