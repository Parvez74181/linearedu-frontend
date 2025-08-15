import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Custom formatter to safely include user data
const userDataFormatter = winston.format((info: any) => {
  if (info.user) {
    return {
      ...info,
      user: {
        name: info.user.name || "anonymous",
        email: info.user.email || "not-provided",
        phone: info.user.phone || "not-provided",
      },
    };
  }
  return info;
});

// Log format (JSON for structured logging)
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  userDataFormatter(),
  winston.format.json() // Outputs logs in JSON format
);

// Define transports (where logs are stored)
const transports = {
  console: new winston.transports.Console({
    level: "debug", // Log everything to console in development
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
  file: new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "DD-MM-YYYY",
    zippedArchive: true, // Compress old logs
    maxSize: "20m", // Rotate after 20MB
    maxFiles: "40d", // Keep logs for 40 days
    level: "info", // Only log info and above to files
  }),
};

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // transports.console,
    transports.file,
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "logs/exceptions.log" })],
});

export default logger;
