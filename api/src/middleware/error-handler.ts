import * as Express from 'express';
import * as Log4js from 'log4js';

import * as API from '../models/api';
import { ServerError, HttpStatus } from '../models/error';

const logger = Log4js.getLogger('middleware.error-handler');

export function errorHandler(err: any, req: Express.Request, res: Express.Response, next: Function) {
    if (err instanceof ServerError || res.statusCode || err.statusCode) {
        logger.warn('Error:', err);
    } else {
        logger.error('Unexpected error:', err);
    }

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal error';

    if (err instanceof ServerError) {
        statusCode = err.statusCode || statusCode;
    } else {
        statusCode = err.statusCode || res.statusCode || statusCode;
    }

    if (statusCode == HttpStatus.OK) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse: API.Error = {
        message: message
    };

    res.status(statusCode).json(errorResponse);
}