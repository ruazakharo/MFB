import * as Express from 'express';
import * as Log4js from 'log4js';
import * as _ from 'lodash';

import * as TokenService from '../services/TokenService';
import * as API from '../models/api';
import { NotAuthorizedError } from '../models/error';

const logger = Log4js.getLogger('middleware.auth-token');

declare module 'express' {
    interface Request {
        tokenPayload: TokenService.TokenPayload;
    }
}

const BEARER_PREFIX = 'Bearer ';

async function verifyAuthorizationHeader(req: Express.Request): Promise<TokenService.TokenPayload> {
    const authHeader = req.get('Authorization');

    if (!_.startsWith(authHeader, BEARER_PREFIX)) {
        throw new NotAuthorizedError('Token should be prefixed with auth type');
    }

    const token = _.replace(authHeader, BEARER_PREFIX, '');
    return TokenService.verifyToken(token)
    .catch((err) => {
        throw new NotAuthorizedError('Failed to verify token');
    });
}

export = function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    verifyAuthorizationHeader(req)
    .then((payload) => {
        req.tokenPayload = payload;
        next();
    })
    .catch(next);
};