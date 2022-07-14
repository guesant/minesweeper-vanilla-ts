import { GameCellStatus } from "../../interfaces/GameCellStatus"
import { GameComponent } from "../../interfaces/GameComponent"
import { getAroundPositions } from "../../utils/getAroundPositions"
import { GameTable } from "./GameTable"
import * as styles from "./GameTable.module.css"

export class GameTableCell extends GameComponent {
  aroundPositions: number[]

  get col() {
    return this.index % this.game.cols
  }

  get row() {
    return Math.floor(this.index / this.game.cols)
  }

  get tableCells() {
    return this.game.table.tableCells
  }

  get tableCell() {
    return this.tableCells[this.index]
  }

  get cellStatus() {
    return this.game.cells[this.index]
  }

  set cellStatus(value) {
    this.game.cells[this.index] = value
  }

  get aroundCellsWithFlags() {
    return this.aroundPositions.filter(
      (idx) => this.game.cells[idx] & GameCellStatus.FLAG
    )
  }

  get aroundCellsWithBombs() {
    return this.aroundPositions.filter(
      (idx) => this.game.cells[idx] & GameCellStatus.BOMB
    )
  }

  get aroundCellsWithBombsCount() {
    if (this.cellStatus & GameCellStatus.BOMB) {
      return -1
    }

    return this.aroundCellsWithBombs.length
  }

  constructor(gameTable: GameTable, public index: number) {
    super(gameTable.game, { className: styles.gameTableCell })

    this.rootEl.addEventListener("click", this.handleClick)
    this.rootEl.addEventListener("contextmenu", this.handleRightClick)

    gameTable.rootEl.appendChild(this.rootEl)

    this.aroundPositions = getAroundPositions(
      this.index,
      this.game.cols,
      this.game.rows
    )
  }

  dispose() {
    this.game.table.rootEl.removeChild(this.rootEl)

    this.rootEl.removeEventListener("click", this.handleClick)
    this.rootEl.removeEventListener("contextmenu", this.handleRightClick)
  }

  handleClick = () => {
    if (!this.game.statusCanTouch) {
      return
    }

    let hasBombClick = false

    if (this.game.distributedBombsCount === 0) {
      this.game.initialBombsDistribution(this.index)
    }

    if (this.cellStatus & GameCellStatus.FLAG) {
      return
    }

    const cellsToOpen = new Set<number>()

    cellsToOpen.add(this.index)

    const safeCellsToOpen = new Set<number>()

    const { safeCellsAlreadyChecked } = this.game.table
    const { aroundCellsWithBombsCount } = this

    if (aroundCellsWithBombsCount === 0) {
      safeCellsToOpen.add(this.index)
    }

    if (this.cellStatus & GameCellStatus.OPENED) {
      const { aroundCellsWithFlags } = this

      if (
        aroundCellsWithFlags.length > 0 &&
        aroundCellsWithFlags.length === aroundCellsWithBombsCount
      ) {
        const targetPositions = this.aroundPositions.filter(
          (idx) => !aroundCellsWithFlags.includes(idx)
        )

        for (const idx of targetPositions) {
          cellsToOpen.add(idx)

          if (this.tableCells[idx].aroundCellsWithBombsCount === 0) {
            safeCellsToOpen.add(idx)
          }
        }
      }
    }

    while (safeCellsToOpen.size > 0) {
      const targetIdx = safeCellsToOpen.values().next().value

      if (!safeCellsAlreadyChecked.has(targetIdx)) {
        const { aroundPositions } = this.tableCells[targetIdx]

        aroundPositions.forEach((aroundIdx) => cellsToOpen.add(aroundIdx))

        aroundPositions
          .filter((i) => !safeCellsAlreadyChecked.has(i))
          .filter((i) => this.tableCells[i].aroundCellsWithBombsCount === 0)
          .forEach((i) => safeCellsToOpen.add(i))

        safeCellsAlreadyChecked.add(targetIdx)
      }

      safeCellsToOpen.delete(targetIdx)
    }

    for (const idx of cellsToOpen) {
      const tableCell = this.tableCells[idx]

      tableCell.cellStatus |= GameCellStatus.OPENED

      if (
        !hasBombClick &&
        tableCell.cellStatus & GameCellStatus.BOMB &&
        this.game.bombClickIndex === null
      ) {
        tableCell.cellStatus |= GameCellStatus.BOMB_CLICK
        hasBombClick = true
      }
    }

    if (hasBombClick) {
      // TODO
      console.log("bomb click!", this.game.bombClickIndex)
    }

    this.game.render()
  }

  handleRightClick = () => {
    if (!this.game.statusCanTouch) {
      return
    }

    if (this.cellStatus & GameCellStatus.OPENED) {
      return
    }

    this.cellStatus ^= GameCellStatus.FLAG

    this.game.render()
  }

  #prevCellStatus: GameCellStatus | null = null

  get shouldRender() {
    return this.#prevCellStatus !== this.cellStatus
  }

  render() {
    if (!this.shouldRender) {
      return
    }

    let shouldShowFlag = false

    if (
      this.cellStatus & GameCellStatus.BOMB &&
      this.cellStatus & GameCellStatus.OPENED
    ) {
      this.rootEl.dataset.bomb =
        this.game.bombClickIndex === this.index ? "click" : ""
    } else {
      delete this.rootEl.dataset.bomb
    }

    if (this.cellStatus & GameCellStatus.OPENED) {
      this.rootEl.dataset.opened = ""

      this.rootEl.innerText = ""

      const { aroundCellsWithBombsCount } = this

      if (aroundCellsWithBombsCount > 0) {
        this.rootEl.innerText = `${aroundCellsWithBombsCount}`
      }
    } else {
      delete this.rootEl.dataset.opened

      shouldShowFlag = Boolean(this.cellStatus & GameCellStatus.FLAG)

      this.rootEl.innerText = ""
    }

    if (shouldShowFlag) {
      this.rootEl.dataset.flag = ""
    } else {
      delete this.rootEl.dataset.flag
    }

    this.#prevCellStatus = this.cellStatus
  }
}
