import * as Express from 'express';

import * as API from '../../models/api';
import * as UserService from '../../services/UserService';

export function put(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = UserService.updateUserPresence(req.tokenPayload.user.id, req.body as API.ClientPresence);
    next();
}