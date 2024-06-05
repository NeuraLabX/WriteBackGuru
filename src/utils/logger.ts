import winston from 'winston';
import TransportStream from 'winston-transport';

// Declare the tableau object globally
declare const tableau: any;

// Create a custom transport for logging to localStorage
class LocalStorageTransport extends TransportStream {
  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const logEntry = `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${Object.keys(info.meta).length ? JSON.stringify(info.meta) : ''}`;

    let logs = localStorage.getItem('logs');
    if (!logs) {
      logs = '';
    }
    logs += logEntry + '\n';
    localStorage.setItem('logs', logs);

    callback();
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new LocalStorageTransport()
  ]
});

const logEntry = (message: string, data: any = {}) => {
  const userInfo = tableau.extensions.environment.context.user;
  const username = userInfo ? userInfo.name : 'Unknown User';

  if (data.error) {
    logger.error(`${username} - ${message}`, { error: data.error, stack: data.error.stack });
  } else {
    logger.info(`${username} - ${message}`, data);
  }
};

export { logEntry };
