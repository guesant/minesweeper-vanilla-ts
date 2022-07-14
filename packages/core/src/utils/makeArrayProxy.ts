export const makeArrayProxy = <T extends any>(
  array: T[],
  callback: () => any
) =>
  new Proxy(Array.from(array), {
    set(target: T[], key: string | symbol, value: any): boolean {
      if (typeof key !== "symbol") {
        const idx = parseInt(key)

        if (!Number.isNaN(idx) && idx > 0) {
          target[idx] = value
          callback()
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
