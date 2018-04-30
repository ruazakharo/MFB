import * as Express from 'express';

import * as API from '../../models/api';
import * as SignageService from '../../services/SignageService';

export function post(req: Express.Request, res: Express.Response, next: Function) {
    const body: API.SignageIdentificationRequest = req.body || {};

    res.promise = SignageService.getIdentifiedSignage(body);

    next();
}