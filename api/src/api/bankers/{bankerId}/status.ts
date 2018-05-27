import * as Express from 'express';

import * as API from '../../../models/api';
import * as BankerService from '../../../services/BankerService';

export function put(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = BankerService.updateBankerStatus(req.params.bankerId, req.body as API.BankerStatus);
    next();
}