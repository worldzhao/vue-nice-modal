export const extend = Object.assign;

export const inBrowser = typeof window !== 'undefined';

export const noop = (...args: any[]) => {
  //
};
