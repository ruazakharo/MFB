import * as Express from 'express';

import * as API from '../../models/api';
import * as AppointmentService from '../../services/AppointmentService';

export function post(req: Express.Request, res: Express.Response, next: Function) {
    const body: API.AppointmentRequest = req.body || {};

    res.promise = AppointmentService.createAppointment(req.tokenPayload.user.id, body);

    next();
}