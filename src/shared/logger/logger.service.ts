import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, Logger, transports, format } from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file");


@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
    private context?: string;
    private logger: Logger;

    public setContext(context: string): void {
        this.context = context;
    }

    constructor(private configService: ConfigService) {
        const logDir = this.configService.get<string>('logDir');
        const dailyRotateFileTransport = new DailyRotateFile({
            filename: `${logDir}/%DATE%.log`,
            maxSize: "1g",
            maxFiles: "3d",
            zippedArchive: true,
            datePattern: 'YYYY-MM-DD'
        });
        const logger = createLogger({
            transports: [
                dailyRotateFileTransport
            ],
        });

        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (process.env.NODE_ENV !== 'production') {
            logger.add(new transports.Console({
                format: format.simple(),
            }));
        }
    }

    error(
        message: string,
        meta?: Record<string, any>,
    ): Logger {
        const timestamp = new Date().toISOString();

        return this.logger.error({
            message,
            contextName: this.context,
            timestamp,
            ...meta,
        });
    }

    warn(
        message: string,
        meta?: Record<string, any>,
    ): Logger {
        const timestamp = new Date().toISOString();

        return this.logger.warn({
            message,
            contextName: this.context,
            timestamp,
            ...meta,
        });
    }

    debug(
        message: string,
        meta?: Record<string, any>,
    ): Logger {
        const timestamp = new Date().toISOString();

        return this.logger.debug({
            message,
            contextName: this.context,
            timestamp,
            ...meta,
        });
    }

    verbose(
        message: string,
        meta?: Record<string, any>,
    ): Logger {
        const timestamp = new Date().toISOString();

        return this.logger.verbose({
            message,
            contextName: this.context,
            timestamp,
            ...meta,
        });
    }

    log(
        message: string,
        meta?: Record<string, any>,
    ): Logger {
        const timestamp = new Date().toISOString();

        return this.logger.info({
            message,
            contextName: this.context,
            timestamp,
            ...meta,
        });
    }
}