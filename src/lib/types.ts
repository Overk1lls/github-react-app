export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonOptional<T> = T extends undefined ? never : T;

export function as<T>(value: any): value is T {
  return true;
}

export type SerializePropertyValue<T extends Record<any, any> = any, K = keyof T> = (
  value: T[K],
  object: T,
  key: K
) => any | undefined;
