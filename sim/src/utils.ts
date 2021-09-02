type DeepCopy<T> =
  T extends undefined | null | boolean | string | number ? T :
  T extends Set<unknown> | Map<unknown, unknown> ? unknown :
  T extends ReadonlyArray<infer U> ? Array<DeepCopy<U>> :
  { [K in keyof T]: DeepCopy<T[K]> };

export function deepClone<T>(value: T): DeepCopy<T> {
  if (typeof value !== 'object' || value === null) {
    return value as DeepCopy<T>;
  }

  if (value instanceof Set) {
    return new Set(Array.from(value, deepClone)) as DeepCopy<T>;
  }

  if (value instanceof Map) {
    return new Map(Array.from(value, ([k, v]) => [k, deepClone(v)])) as DeepCopy<T>;
  }

  if (value instanceof Date) {
    return new Date(value) as DeepCopy<T>;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as DeepCopy<T>;
  }

  return Object.keys(value).reduce((acc, key) => {
    return Object.assign(acc, { [key]: deepClone((value as Record<string, unknown>)[key]) });
  }, (Array.isArray(value) ? [] : {}) as DeepCopy<T>);
}