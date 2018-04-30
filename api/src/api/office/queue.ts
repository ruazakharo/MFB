import * as Express from 'express';

import * as API from '../../models/api';
import * as AppointmentService from '../../services/AppointmentService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = AppointmentService.getOfficeQueue();

    next();
}