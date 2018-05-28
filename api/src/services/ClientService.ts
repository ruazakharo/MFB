import * as Log4js from 'log4js';
import * as Config from 'config';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Mongo from 'mongodb';

import * as API from '../models/api';
import Appointment from '../models/Appointment';
import User from '../models/User';
import UserDAO from '../dao/UserDAO';
import AppointmentDAO from '../dao/AppointmentDAO';
import * as AppointmentService from './AppointmentService';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../models/error';
import { ACTIVE_APPOINTMENT_STATUSES } from './AppointmentService';

const logger = Log4js.getLogger('services.client');

export async function getActiveClients(): Promise<API.ClientInfo[]> {
    const activeAppointments = await AppointmentDAO.getMany({
        filter: {
            status: {
                $in: ACTIVE_APPOINTMENT_STATUSES
            }
        }
    });

    const userIds = activeAppointments.map(a => a.userId);

    const users = await UserDAO.getMany({
        filter: {
            $or: [
                { 'presence.bank': true},
                { 'presence.signage': true},
                { '_id': {
                    $in: userIds.map(id => new Mongo.ObjectID(id))
                }}
            ]
        }
    });

    return await Promise.all(users.map(async u => {
        const app = activeAppointments.find(a => a.userId === u.id);
        return toApi(u, app);
    }));
}

export async function getClientInfo(clientId: string): Promise<API.ClientInfo> {
    const app = await AppointmentService.getActiveAppointment(clientId);
    const user = await UserDAO.getOne({
        filterById: clientId
    });
    return toApi(user, app);
}

async function toApi(u: User, app?: Appointment): Promise<API.ClientInfo> {
    return {
        id: u.id,
        name: u.name,
        phoneNumber: u.phoneNumber,
        presence: u.presence,
        currentAppointment: app ? await AppointmentService.toApi(app) : undefined
    };
}