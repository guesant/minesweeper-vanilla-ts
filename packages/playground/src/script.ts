import { Game } from "@minesweeper-vanilla-ts/core"

const game = new Game(document.querySelector("#game"))

game.start(9, 9, 10)

Object.assign(window, { game })
