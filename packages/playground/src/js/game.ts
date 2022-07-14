import { Game } from "@minesweeper-vanilla-ts/core"

export const gameEl = document.querySelector<HTMLElement>("#game")!

export const game = new Game(gameEl)
Object.assign(window, { game })
