import * as Express from 'express';

import * as API from '../models/api';

export function post(req: Express.Request, res: Express.Response, next: Function) {
    const body: API.SignupRequest = req.body || {};

    res.promise = Promise.resolve({x: '123'});
    next();
}