import { GameComponent } from "../../utils/GameComponent"
import { Game } from "../Game/Game"
import * as styles from "./GameTable.module.css"
import { GameTableCell } from "./GameTableCell"

export class GameTable extends GameComponent {
  tableCells: GameTableCell[] = []
  safeCellsAlreadyChecked = new Set<number>()

  constructor(game: Game) {
    super(game, { className: styles.gameTable })
    this.game.rootEl.appendChild(this.rootEl)
  }

  render() {
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
