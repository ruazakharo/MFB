import * as Express from 'express';

import * as API from '../../models/api';
import * as SignageService from '../../services/SignageService';

export function post(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = SignageService.updateSignagePresence(req.body as API.SignagePresenceUpdate);
    next();
}