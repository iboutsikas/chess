const winston = require('winston');

const level = process.env.LOG_LEVEL || 'debug';

function formatParams(info) {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace('T', ' ');

    return `${ts} [${level}]: ${message} ${Object.keys(args).length
        ? JSON.stringify(args, "", "")
        : ""}`;
}

const developmentFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(formatParams)
);

const productionFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(formatParams)
);

let logger;

if (process.env.NODE_ENV !== "production") {
    logger = winston.createLogger({
        level: level,
        // format: developmentFormat,
        transports: [
            new winston.transports.Console({ colorize: true, format: developmentFormat }),
            new winston.transports.File({ filename: "output.log" }),
        ]
    });

} else {
    logger = winston.createLogger({
        level: level,
        // format: productionFormat,
        transports: [
            new winston.transports.Console({ colorize: true }),
            new winston.transports.File({ filename: "error.log", level: "error" }),
            new winston.transports.File({ filename: "output.log" }),
        ]
    });
}

module.exports = logger;