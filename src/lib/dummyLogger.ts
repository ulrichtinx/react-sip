import { Logger } from './types';

const dummyLogger: Logger = {
  debug(message?: any, ...optionalParams: any[]): void {
    return;
  },
  error(message?: any, ...optionalParams: any[]): void {
    return;
  },
  info(message?: any, ...optionalParams: any[]): void {
    return;
  },
  log(message?: any, ...optionalParams: any[]): void {
    return;
  },
  warn(message?: any, ...optionalParams: any[]): void {
    return;
  },
};

export default dummyLogger;
