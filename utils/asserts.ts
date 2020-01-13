import { ServerError } from './server-error';

export function makeSure(expression: boolean, message: string, statusCode = 400) {
    if (expression) return;
    throw new ServerError(message, statusCode);
}

export function mustExist(value: any, message: string, statusCode = 400) {
    if (value) return;
    throw new ServerError(message, statusCode);
}

export function mustMatchReg(value: string, reg: RegExp, message: string, statusCode = 400) {
    if (value.match(reg)) return;
    throw new ServerError(message, statusCode);
}

