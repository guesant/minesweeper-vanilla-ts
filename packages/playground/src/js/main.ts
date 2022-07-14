import { game } from "./game"
import { bootstrapSyncGameScale } from "./utils/syncGameScale"

game.start(9, 9, 10)
bootstrapSyncGameScale()
