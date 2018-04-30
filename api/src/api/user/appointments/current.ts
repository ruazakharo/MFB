import * as Express from 'express';

import * as API from '../../../models/api';
import * as AppointmentService from '../../../services/AppointmentService';

export function get(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = AppointmentService.getCurrentAppointment(req.tokenPayload.user.id);

    next();
}

export function put(req: Express.Request, res: Express.Response, next: Function) {
    const body: API.AppointmentRequest = req.body || {};

    res.promise = AppointmentService.updateCurrentAppointment(req.tokenPayload.user.id, body);

    next();
}

exports.delete = function(req: Express.Request, res: Express.Response, next: Function) {
    res.promise = AppointmentService.deleteCurrentAppointment(req.tokenPayload.user.id);

    next();
};