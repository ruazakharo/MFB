import * as Log4js from 'log4js';
import * as Config from 'config';
import * as JWT from 'jsonwebtoken';
import * as _ from 'lodash';

import User from '../models/User';
import { NotAuthorizedError } from '../models/error';

const logger = Log4js.getLogger('services.token');

const secret = Config.get<string>('token.secret');

export interface TokenPayload {
    user: User;
}

export function createToken(payload: TokenPayload): Promise<string> {
    const jwtPayload = _.extend(payload, {});

    return new Promise<string>((resolve, reject) => {
        JWT.sign(jwtPayload, secret, {}, (err, token) => {
            if (err) {
                logger.warn('Failed to create token, err:', err);
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

export function verifyToken(token: string): Promise<TokenPayload> {
    return new Promise<TokenPayload>((resolve, reject) => {
        JWT.verify(token, secret, (err, payload) => {
            if (err) {
                logger.info('Failed to verify token, err:', err);
                reject(err);
            } else {
                resolve(payload as TokenPayload);
            }
        });
    });
}