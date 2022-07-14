import {
  makeArrayProxy,
  MakeArrayProxyHandlerInfo
} from "../../utils/makeArrayProxy"
import { generateRandomNumbers } from "../../utils/random/generateRandomNumbers"
import { GameHeader } from "../GameHeader/GameHeader"
import { GameCellStatus } from "../GameTable/GameCellStatus"
import { GameTable } from "../GameTable/GameTable"
import { GameTimer } from "../GameTimer/GameTimer"
import * as styles from "./Game.module.css"
import { GameStatus } from "./GameStatus"
import { GameCellsCounter } from "./GameCellsCounter"
import { getDefaultCellsCounter } from "../../utils/getDefaultCellsCounter"
import { splitGameCellStatus } from "../../utils/splitGameCellStatus"

export class Game {
  // game state

  cols = 0

  rows = 0

  bombsCount = 0

  #cells: GameCellStatus[] = []

  //

  timer = new GameTimer()

  table = new GameTable(this)

  header = new GameHeader(this)

  //

  get cells() {
    return this.#cells
  }

  set cells(value) {
    const handleChange = (info?: MakeArrayProxyHandlerInfo<GameCellStatus>) => {
      this.computeCellsCounter(info)
      this.checkGameStatus()
    }

    this.#cells = makeArrayProxy(value, (info) => handleChange(info))

    handleChange()
  }

  // end game state

  // computed state

  get cellsCount() {
    return this.cols * this.rows
  }

  get status() {
    if (this.bombClickIndex) {
      return GameStatus.LOSE
    }

    if (this.cellsClosedCount === this.bombsCount) {
      return GameStatus.WIN
    }

    if (this.timer.isRunning) {
      return GameStatus.RUNNING
    }

    return GameStatus.STOPPED
  }

  get statusCanTouch() {
    const { status } = this
    return (status & GameStatus.RUNNING) | (status & GameStatus.STOPPED)
  }

  cellsCounter: GameCellsCounter = getDefaultCellsCounter()

  get flagsCount() {
    return this.cellsCounter.flags
  }

  get bombClickIndex() {
    return this.cellsCounter.bombClickIndex
  }

  get distributedBombsCount() {
    return this.cellsCounter.distributedBombs
  }

  get cellsOpenedCount() {
    return this.cellsCounter.cellsOpened
  }

  get cellsClosedCount() {
    return this.cellsCount - this.cellsOpenedCount
  }

  computeCellsCounter(info?: MakeArrayProxyHandlerInfo<GameCellStatus>) {
    if (info) {
      const { idx, prevValue, nextValue } = info

      if (prevValue === nextValue) {
        return
      }

      const cellsCounter = this.cellsCounter

      const prevState = splitGameCellStatus(prevValue)

      cellsCounter.flags -= Number(prevState.hasFlag)
      cellsCounter.cellsOpened -= Number(prevState.isOpened)
      cellsCounter.distributedBombs -= Number(prevState.hasBomb)

      if (prevState.hasBombClicked && idx === cellsCounter.bombClickIndex) {
        cellsCounter.bombClickIndex = null
      }

      const nextState = splitGameCellStatus(nextValue)

      cellsCounter.flags += Number(nextState.hasFlag)
      cellsCounter.cellsOpened += Number(nextState.isOpened)
      cellsCounter.distributedBombs += Number(nextState.hasBomb)

      if (nextState.hasBombClicked) {
        cellsCounter.bombClickIndex = idx
      }

      this.cellsCounter = cellsCounter
    } else {
      this.cellsCounter = this.cells.reduce((acc, cellStatus, idx) => {
        const { hasBomb, hasBombClicked, hasFlag, isOpened } =
          splitGameCellStatus(cellStatus)

        acc.flags += Number(hasFlag)
        acc.cellsOpened += Number(isOpened)
        acc.distributedBombs += Number(hasBomb)

        if (hasBombClicked) {
          acc.bombClickIndex = idx
        }

        return acc
      }, getDefaultCellsCounter())
    }
  }

  // end computed state

  constructor(public rootEl: HTMLElement) {
    this.rootEl.classList.add(styles.game)
    this.rootEl.addEventListener("contextmenu", (e) => e.preventDefault())
  }

  checkGameStatus() {
    const { status } = this
    if (status & GameStatus.WIN || status & GameStatus.LOSE) {
      this.timer.stop()
    }
  }

  start(cols: number, rows: number, bombsCount: number) {
    if (bombsCount >= cols * rows) {
      throw new Error("Invalid game setup!")
    }

    this.timer.reset()

    this.cols = cols
    this.rows = rows
    this.bombsCount = bombsCount
    this.cells = Array(this.cellsCount).fill(0)

    this.header.handleGameStart()
    this.table.handleGameStart()

    this.render()

    return this
  }

  restart() {
    this.start(this.cols, this.rows, this.bombsCount)
  }

  render() {
    this.rootEl.style.setProperty("--game-table-cols", String(this.cols))
    this.rootEl.style.setProperty("--game-table-rows", String(this.rows))

    this.header.render()
    this.table.render()

    return this
  }

  distributeRandomBombs(excludeIndex: number) {
    const randomBombsPositions = generateRandomNumbers(
      this.bombsCount,
      this.cellsCount,
      excludeIndex
    )

    for (let i = 0; i < this.cellsCount; i++) {
      if (randomBombsPositions.includes(i)) {
        this.cells[i] |= GameCellStatus.BOMB
      } else {
        this.cells[i] = this.cells[i] & ~GameCellStatus.BOMB
      }
    }

    return this
  }

  initialBombsDistribution(targetFirstIndex: number) {
    this.distributeRandomBombs(targetFirstIndex)
    this.timer.start()
  }
}
