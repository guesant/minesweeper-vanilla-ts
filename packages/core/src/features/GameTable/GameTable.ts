import { GameComponent } from "../interfaces/GameComponent"
import { Game } from "../Game/Game"
import { GameStatus } from "../interfaces/GameStatus"
import * as styles from "./GameTable.module.css"
import { GameTableCell } from "./GameTableCell"

export class GameTable extends GameComponent {
  tableCells: GameTableCell[] = []

  safeCellsAlreadyChecked = new Set<number>()

  get canTouchTable() {
    const { status } = this.game
    return Boolean(
      (status & GameStatus.RUNNING) | (status & GameStatus.STOPPED)
    )
  }

  constructor(game: Game) {
    super(game, { className: styles.gameTable })
    this.game.rootEl.appendChild(this.rootEl)
  }

  render() {
    if (this.canTouchTable) {
      delete this.rootEl.dataset.canNotTouch
    } else {
      this.rootEl.dataset.canNotTouch = ""
    }

    const tableCellsToRender = this.tableCells.filter(
      (tableCell) => tableCell.shouldRender
    )

    for (const tableCell of tableCellsToRender) {
      tableCell.render()
    }
  }

  handleGameStart() {
    this.safeCellsAlreadyChecked.clear()

    for (const tableCell of this.tableCells) {
      tableCell.dispose()
    }

    this.tableCells = this.game.cells.map(
      (_, idx) => new GameTableCell(this, idx)
    )
  }
}
