import { createLogger, format, transports } from 'winston'
import moment from 'moment'
import fs from 'fs'

import { LOG_DIR , APP } from '../setting'

const { combine, timestamp, label, printf } = format;
const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${tsFormat()} [${label}] ${level.toUpperCase()}: ${message}`;
});

function dailyRotateFileTransport(type: any) {
    const pathFileLog = `${LOG_DIR}/${type}`

    if (!fs.existsSync(pathFileLog)) {
        fs.mkdirSync(pathFileLog);
    }

    return new transports.File({
        filename: `${pathFileLog}/log-${moment().format('YYYY-MM-DD')}.log`,
    });
}

export function logger(type: any) {
    return createLogger({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: combine(
            label({ label: `${APP}` }),
            timestamp(),
            myFormat
        ),
        transports: [
            dailyRotateFileTransport(type),
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.printf(
                        info => `${tsFormat()} ${info.level}: ${info.message}`
                    )
                )
            })
        ]
    })
}