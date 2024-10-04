import * as winston from 'winston';

const formatconfig = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.simple(),
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.errors({ stack: true })
);

const createLog = (filename, level) =>
  winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: `logs/${filename}.log`,
        level,
        format: formatconfig,
      }),
    ],
  });

const errorLogger = createLog('error', 'error');
const infoLogger = createLog('info', 'info');
const protectLogger = createLog('protect', 'warn');

const logger = {
  info: (log) => infoLogger.info(log),
  error: (log) => errorLogger.error(log),
  protect: (log) => protectLogger.warn(log),
};

export default logger;
