import { LoggerService, LogLevel } from '@nestjs/common';
import { configuration } from './configuration';

export const loggerConfig: false | LoggerService | LogLevel[] = (configuration().logger.split(',') as false | LoggerService | LogLevel[]);
