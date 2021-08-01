import * as winston from "winston"

const { combine, timestamp, label, printf, colorize } = winston.format;
 
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const developmentLogger = () => {

    return winston.createLogger({
        level: 'info',
        format: combine(
            colorize(),
            timestamp( { format: 'DD MMM YYYY HH:mm:ss'}),
            myFormat
        ),
        transports: [
          new winston.transports.Console()
        ],
      });
}

export default developmentLogger;