export class ComputedStateCache<Deps, ComputedKeys> {
  cache = new Map<ComputedKeys, any>()

  getters = new Map<ComputedKeys, () => any>()

  dependencies = new Map<Deps, ComputedKeys[]>()

  get<V = any, K extends ComputedKeys = ComputedKeys>(key: K): V {
    if (!this.cache.has(key)) {
      const value = (this.getters.get(key) as any)()
      this.cache.set(key, value)
    }

    return this.cache.get(key)
  }

  revokeDependency(dependency: Deps) {
    for (const computedKey of this.dependencies.get(dependency) ?? []) {
      this.cache.delete(computedKey)
    }
  }

  ensureDependency(dep: Deps) {
    if (!this.dependencies.has(dep)) {
      this.dependencies.set(dep, [])
    }

    return this.dependencies.get(dep)!
  }

  add(key: ComputedKeys, getter: () => any, deps: Deps[]) {
    this.getters.set(key, getter)
    for (const dep of deps) {
      this.ensureDependency(dep).push(key)
    }
  }
}
