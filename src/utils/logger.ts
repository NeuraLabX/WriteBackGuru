import winston from 'winston'; 

// Declare the tableau object globally 
declare const tableau: any; 

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
    new winston.transports.File({ filename: 'writeback_guru_log.txt', maxsize: 5242880, maxFiles: 5 }) 
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
