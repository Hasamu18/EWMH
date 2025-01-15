export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
export type UserDefinedKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];
