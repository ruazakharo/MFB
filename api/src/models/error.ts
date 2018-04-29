import * as HttpStatusCodes from 'http-status-codes';

export const HttpStatus = HttpStatusCodes;

export class ServerError {
    constructor(public message?: string, public statusCode?: number) {
        statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
