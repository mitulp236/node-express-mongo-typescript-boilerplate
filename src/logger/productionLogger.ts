import * as winston from "winston"

const { combine, timestamp, label, printf, colorize } = winston.format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const productionLogger = () => {

    return winston.createLogger({
        level: 'info',
        format: combine(
            colorize(),
            timestamp( { format: 'DD MMM YYYY HH:mm:ss'}),
            myFormat
        ),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
        ],
      });
}

export default productionLogger;