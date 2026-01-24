/**
 * Winston Logger Configuration
 * Provides structured logging for application events and errors
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/environment');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports = [
  // Console output for all logs
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    ),
  }),
];

// File transports for non-development environments
if (!config.isDevelopment) {
  transports.push(
    new winston.transports.File({
      filename: config.logErrorFile,
      level: 'error',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: config.logFile,
      format: logFormat,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: config.logErrorFile }),
  ],
});

module.exports = logger;
