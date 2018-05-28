import * as Express from 'express';

import * as BankerRequestService from '../../../../services/BankerRequestService';
import * as API from '../../../../models/api';

export function put(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = BankerRequestService.updateBankerRequestStatus(req.params.requestId, req.body as API.BankerRequestStatus);
    next();
}