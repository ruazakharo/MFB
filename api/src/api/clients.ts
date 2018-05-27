import * as Express from 'express';

import * as API from '../models/api';
import * as ClientService from '../services/ClientService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = ClientService.getActiveClients();

    next();
}