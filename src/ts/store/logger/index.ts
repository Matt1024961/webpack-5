import { Logger, LoggerManager } from 'typescript-logger';

export class StoreLogger {
  private logger: Logger;
  private static instance: StoreLogger;

  private constructor() {
    this.init();
  }

  public static getInstance(): StoreLogger {
    if (!StoreLogger.instance) {
      StoreLogger.instance = new StoreLogger();
    }
    return StoreLogger.instance;
  }

  private init() {
    this.logger = LoggerManager.create('Inline XBRL Viewer', `#003768`);

    if (process.env.NODE_ENV === 'production') {
      // we are in production mode
      LoggerManager.setProductionMode();
    }
  }

  public info(message: string): void {
    this.logger.info(`${message}`);
  }

  public warn(message: string): void {
    this.logger.warn(`${message}`);
  }

  public log(message: string): void {
    this.logger.log(`${message}`);
  }
}
