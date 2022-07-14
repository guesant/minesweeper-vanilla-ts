import { Game } from "../Game"

export interface IGameComponentOptions {
  className?: string
}

export abstract class GameComponent {
  rootEl: HTMLElement

  protected constructor(
    public game: Game,
    options: IGameComponentOptions = {}
  ) {
    this.rootEl = document.createElement("div")

    const { className } = options

    if (className) {
      this.rootEl.classList.add(className)
    }
  }

  abstract render(): void

  handleGameStart() {}
}
