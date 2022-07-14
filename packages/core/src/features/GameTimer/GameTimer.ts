export class GameTimer {
  #elapsedTime = 0

  #intervalId: null | number = null

  public listeners = new Set<() => any>()

  get elapsedTime() {
    return this.#elapsedTime
  }

  set elapsedTime(value) {
    this.#elapsedTime = value
    requestIdleCallback(() => this.runListeners(), { timeout: 10 })
  }

  get isRunning() {
    return this.#intervalId !== null
  }

  runListeners() {
    for (const callback of this.listeners) {
      callback()
    }
  }

  start() {
    this.stop()

    this.#intervalId = setInterval(() => {
      this.elapsedTime++
    }, 1000)
  }

  stop() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId)
      this.#intervalId = null
    }
  }

  reset() {
    this.stop()
    this.elapsedTime = 0
  }

  restart() {
    this.reset()
    this.start()
  }
}
