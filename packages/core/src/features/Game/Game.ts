import { GameCellStatus } from "../../interfaces/GameCellStatus"
import { generateRandomNumbers } from "../../utils/generateRandomNumbers"
import { GameHeader } from "../GameHeader/GameHeader"
import { GameTable } from "../GameTable/GameTable"
import { GameTimer } from "../GameTimer/GameTimer"
import * as styles from "./Game.module.css"
import { ComputedStateCache } from "../../utils/ComputedStateCache"
import { GameStatus } from "../../interfaces/GameStatus"

export class Game {
  timer = new GameTimer()

  table = new GameTable(this)

  header = new GameHeader(this)

  // game state

  cols = 0

  rows = 0

  bombsCount = 0

  #cells: GameCellStatus[] = []

  get cells() {
    return this.#cells
  }

  set cells(value) {
    const game = this

    this.#cells = new Proxy(Array.from(value), {
      set(target: GameCellStatus[], key: string | symbol, value: any): boolean {
        if (typeof key !== "symbol") {
          const idx = parseInt(key)

          if (!Number.isNaN(idx) && idx > 0) {
            target[idx] = value

            game.computedStateCache.revokeDependency("cells")

            return true
          }
        }

        if (key in target) {
          target[key as any] = value
          return true
        }

        return false
      }
    })

    this.computedStateCache.revokeDependency("cells")
  }

  // end game state

  // computed state

  computedStateCache = new ComputedStateCache<"cells", string>()

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

  get flagsCount() {
    return this.computedStateCache.get("cellsStats").flagsCount as number
  }

  get bombClickIndex() {
    return this.computedStateCache.get("cellsStats").bombClickIndex as number
  }

  get distributedBombsCount() {
    return this.computedStateCache.get("cellsStats")
      .distributedBombsCount as number
  }

  get cellsOpenedCount() {
    return this.computedStateCache.get("cellsStats").cellsOpenedCount as number
  }

  get cellsClosedCount() {
    return this.cellsCount - this.cellsOpenedCount
  }

  // end computed state

  constructor(public rootEl: HTMLElement) {
    this.rootEl.classList.add(styles.game)

    this.rootEl.addEventListener("contextmenu", (e) => e.preventDefault())

    this.timer.listeners.add(() => {
      const { status } = this

      if (status & GameStatus.WIN || status & GameStatus.LOSE) {
        this.timer.stop()
      }
    })

    this.computedStateCache.add(
      "cellsStats",
      () => {
        return this.cells.reduce(
          (acc, cellStatus, idx) => {
            if (cellStatus & GameCellStatus.FLAG) {
              acc.flagsCount++
            }

            if (cellStatus & GameCellStatus.BOMB) {
              acc.distributedBombsCount++
            }

            if (cellStatus & GameCellStatus.OPENED) {
              acc.cellsOpenedCount++
            }

            if (cellStatus & GameCellStatus.BOMB_CLICK) {
              acc.bombClickIndex = idx
            }

            return acc
          },
          {
            flagsCount: 0,
            cellsOpenedCount: 0,
            bombClickIndex: null as null | number,
            distributedBombsCount: 0
          }
        )
      },
      ["cells"]
    )
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
