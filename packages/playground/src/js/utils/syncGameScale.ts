import throttle from "lodash.throttle"
import { gameEl } from "../game"

export const syncGameScale = () => {
  const targetScale = Math.min(
    ...[
      [document.body.offsetHeight, gameEl.offsetHeight],
      [document.body.offsetWidth, gameEl.offsetWidth]
    ].map(([bodySize, gameSize]) => (bodySize - 40) / gameSize)
  )
  gameEl.style.setProperty("transform", `scale(${targetScale})`)
}

export const syncGameScaleThrottled = throttle(() => syncGameScale(), 10)

export const bootstrapSyncGameScale = () => {
  window.addEventListener("resize", syncGameScaleThrottled)
  syncGameScaleThrottled()
}
