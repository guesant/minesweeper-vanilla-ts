export type MakeArrayProxyHandlerInfo<T> = {
  idx: number
  prevValue: T
  nextValue: T
}

export const makeArrayProxy = <T extends any>(
  array: T[],
  handler: (info: MakeArrayProxyHandlerInfo<T>) => any
) =>
  new Proxy(Array.from(array), {
    set(target: T[], key: string | symbol, nextValue: any): boolean {
      if (typeof key !== "symbol") {
        const idx = parseInt(key)

        if (!Number.isNaN(idx)) {
          const prevValue = target[idx]

          target[idx] = nextValue

          handler({ idx, prevValue, nextValue })

          return true
        }
      }

      if (key in target) {
        target[key as any] = nextValue
        return true
      }

      return false
    }
  })
