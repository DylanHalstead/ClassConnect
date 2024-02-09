import { Char } from './types';

export function assertChar<N extends number>(value: string, length: N): Char<N> {
  if (value.length !== length) {
      throw new Error(`Length of '${value}' is not ${length}`);
  }
  return value as Char<N>;
}
