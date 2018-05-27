import * as Express from 'express';

import * as API from '../models/api';
import * as BankerService from '../services/BankerService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = BankerService.getAvailableBankers();

    next();
}