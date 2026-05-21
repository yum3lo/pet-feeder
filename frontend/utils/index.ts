export const toCapitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export * from './petPayload';
export { notificationEmitter } from './notificationEmitter';
