import * as Express from 'express';

import * as API from '../../models/api';
import * as EventService from '../../services/EventService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = EventService.getGreeterEvents();
    next();
}