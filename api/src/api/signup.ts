import * as Express from 'express';

import * as API from '../models/api';
import * as UserService from '../services/UserService';

export function post(req: Express.Request, res: Express.Response, next: Function) {
    const body: API.SignupRequest = req.body || {};

    res.promise = UserService.signupUser(body);

    next();
}