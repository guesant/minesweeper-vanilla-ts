import {
  makeArrayProxy,
  MakeArrayProxyHandlerInfo
} from "../../utils/makeArrayProxy"
import { generateRandomNumbers } from "../../utils/random/generateRandomNumbers"
import { GameHeader } from "../GameHeader/GameHeader"
import { GameCellStatus } from "../interfaces/GameCellStatus"
import { GameTable } from "../GameTable/GameTable"
import { GameTimer } from "../GameTimer/GameTimer"
import * as styles from "./Game.module.css"
import { GameStatus } from "../interfaces/GameStatus"
import { GameCellsCounter } from "../interfaces/GameCellsCounter"
import { getDefaultCellsCounter } from "../interfaces/utils/getDefaultCellsCounter"
import { getGameStatus } from "../interfaces/utils/getGameStatus"
import { computeCellsCounterUpdate } from "../interfaces/utils/computeCellsCounterUpdate"

export class Game {
  //

  cols = 0

  rows = 0

  bombsCount = 0

  #cells: GameCellStatus[] = []

  //

  timer = new GameTimer()

  table = new GameTable(this)

  header = new GameHeader(this)

  cellsCounter: GameCellsCounter = getDefaultCellsCounter()

  //

  get cells() {
    return this.#cells
  }

  set cells(value) {
    this.#cells = makeArrayProxy(value, (info) => this.handleCellsChange(info))
    this.handleCellsChange()
  }

  get cellsCount() {
    return this.cols * this.rows
  }

  get status() {
    return getGameStatus(this)
  }

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

  computeCellsCounter(info?: MakeArrayProxyHandlerInfo<GameCellStatus>) {
    this.cellsCounter = computeCellsCounterUpdate(this, info)
  }

  handleCellsChange(info?: MakeArrayProxyHandlerInfo<GameCellStatus>) {
    this.computeCellsCounter(info)
    this.checkGameStatus()
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
