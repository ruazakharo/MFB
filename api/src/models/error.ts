import * as HttpStatusCodes from 'http-status-codes';

export const HttpStatus = HttpStatusCodes;

export class ServerError {
    constructor(public message?: string, public statusCode?: number) {
        statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    }
}

export class NotAuthorizedError extends ServerError {
    constructor(message?: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class BadRequestError extends ServerError {
    constructor(message?: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundError extends ServerError {
    constructor(message?: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}