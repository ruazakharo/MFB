import * as Express from 'express';

import * as UserService from '../../services/UserService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = UserService.getUserInfo(req.tokenPayload.user.id);
    next();
}