import * as Express from 'express';

import * as AppointmentService from '../../services/AppointmentService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = AppointmentService.getOffices();
    next();
}