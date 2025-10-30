let winston = require('winston')
let path = require('path')
let logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH;MM;SS' }),
    winston.format.json(),
    winston.format.errors({ stack: true })

)
let logger = winston.createLogger({
    format: logFormat,
    level: "info",
    defaultMeta: { service: 'Ecommerce' },
    transport: [
        new winston.transports.File({
            filename: path.join('logs', 'info.log'),
            level: 'info',
            maxsize: 5242880,
            maxfile: 5

        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.logs')

        })
    ]


})
if (process.env.Node_Env = "development") {
    logger.add(new winston.transports.Console(
        {
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }

    ))
}
let fs = require('fs')
let Logdir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(Logdir)) {
    mkdirSync(logdir, { recursive: true })
}
module.exports = logger