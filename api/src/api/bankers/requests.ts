import * as Express from 'express';

import * as BankerRequestService from '../../services/BankerRequestService';
import * as API from '../../models/api';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = BankerRequestService.getBankerRequests({
        bankerId: req.query.bankerId,
        clientId: req.query.clientId,
        status: req.query.status
    });
    next();
}

export function post(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = BankerRequestService.createBankerRequest(req.body as API.BankerRequest);
    next();
}