import * as Express from 'express';

import * as API from '../../../../models/api';
import * as AppointmentService from '../../../../services/AppointmentService';

export function put(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = AppointmentService.updateAppointmentStatus(req.params.appointmentId, req.body as API.AppointmentStatus);

    next();
}