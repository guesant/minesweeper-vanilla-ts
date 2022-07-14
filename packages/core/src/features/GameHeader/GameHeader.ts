import { GameComponent } from "../../interfaces/GameComponent"
import { getMaskedCounter } from "../../utils/getMaskedCounter"
import { Game } from "../Game/Game"
import * as styles from "./GameHeader.module.css"

export class GameHeader extends GameComponent {
  // computed state

  get elapsedTime() {
    return this.game.timer.elapsedTime
  }

  get unknownBombs() {
    return Math.max(this.game.bombsCount - this.game.flagsCount, 0)
  }

  // computed state

  get bombsCounterEl() {
    return this.rootEl.querySelector('[data-counter="bombs"]')!
  }

  get btnStatusEl() {
    return this.rootEl.querySelector('[data-button="status"]')!
  }

  get timerCounterEl() {
    return this.rootEl.querySelector('[data-counter="timer"]')!
  }

  constructor(game: Game) {
    super(game, { className: styles.gameHeader })

    this.rootEl.innerHTML = `
      <div data-panel="left">
        <span data-counter="bombs"></span>
      </div>
      <div data-panel="center">
        <button data-button="status"></button>
      </div>
      <div data-panel="right">
        <span data-counter="timer"></span>
      </div>
    `

    this.game.timer.listeners.add(() => this.render())

    this.btnStatusEl.addEventListener("click", () => this.game.restart())

    this.game.rootEl.appendChild(this.rootEl)
  }

  render() {
    // LEFT PANEL
    this.bombsCounterEl.textContent = getMaskedCounter(this.unknownBombs)

    // CENTER PANEL
    this.btnStatusEl.textContent = "🙂"

    // RIGHT PANEL
    this.timerCounterEl.textContent = getMaskedCounter(this.elapsedTime)
  }
}
