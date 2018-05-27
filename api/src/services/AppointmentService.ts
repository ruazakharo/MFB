import * as moment from 'moment';
import * as Log4js from 'log4js';

import ReasonDAO from '../dao/ReasonDAO';
import OfficeDAO from '../dao/OfficeDAO';
import AppointmentDAO from '../dao/AppointmentDAO';
import * as AppointmentQueueService from './AppointmentQueueService';
import * as API from '../models/api';
import Appointment from '../models/Appointment';
import { BadRequestError } from '../models/error';

const logger = Log4js.getLogger('services.appointment');

export function getOffices() {
    return OfficeDAO.getMany({});
}

function getOfficeById(officeId: string) {
    return OfficeDAO.getOne({
        filterById: officeId
    });
}

export function getReasons() {
    return ReasonDAO.getMany({});
}

function getReasonById(reasonId: string) {
    return ReasonDAO.getOne({
        filterById: reasonId
    });
}

export async function createAppointment(userId: string, req: API.AppointmentRequest): Promise<API.Appointment> {
    const app = await AppointmentDAO.insertOne({
        value: {
            userId,
            createdOn: moment().valueOf(),
            status: API.AppointmentStatus.ASSIGNED,
            reasonId: req.reasonId,
            officeId: req.officeId,
            date: 'Today',
            time: 'Before 7 PM'
        }
    });

    return await toApi(app);
}

export async function updateCurrentAppointment(userId: string, req: API.AppointmentRequest): Promise<API.Appointment> {
    const app = await getActiveAppointment(userId);
    if (!app) {
        throw new BadRequestError('No current appointment');
    }

    const updatedApp = await AppointmentDAO.updateOne({
        filterById: app.id,
        update: {
            officeId: req.officeId,
            reasonId: req.reasonId
        }
    });

    return await toApi(updatedApp);
}

export async function tryGetCurrentAppointment(userId: string): Promise<API.Appointment> {
    const app = await getActiveAppointment(userId);

    if (app) {
        return await toApi(app);
    } else {
        return undefined;
    }
}

export async function getCurrentAppointment(userId: string): Promise<API.Appointment> {
    const app = await getActiveAppointment(userId);
    if (!app) {
        throw new BadRequestError('No current appointment');
    }

    return await toApi(app);
}

export async function deleteCurrentAppointment(userId: string) {
    const app = await getActiveAppointment(userId);
    if (!app) {
        throw new BadRequestError('No current appointment');
    }

    await AppointmentDAO.updateOne({
        filter: {
            id: app.id
        },
        update: {
            status: API.AppointmentStatus.CANCELLED
        }
    });

    return 'ok';
}

export async function checkinForCurrentAppointment(userId: string) {
    const app = await getActiveAppointment(userId);
    if (!app) {
        throw new BadRequestError('No current appointment');
    }

    if (app.status !== API.AppointmentStatus.ASSIGNED) {
        throw new BadRequestError('Current appointment is not in assigned state');
    }

    const updatedApp = await AppointmentDAO.updateOne({
        filterById: app.id,
        update: {
            status: API.AppointmentStatus.CHECKED_IN
        }
    });

    const apiApp = await toApi(updatedApp);
    if (!apiApp.reason.isPersonalService) {
        await AppointmentQueueService.addUserAppointmentToQueue(userId, updatedApp.id);
    }

    return apiApp;
}

export async function changeAppointmentStatus(appointmentId: string, status: API.AppointmentStatus) {
    logger.info(`Changing appointment ${appointmentId} to status ${status}`);
    await AppointmentDAO.updateOne({
        filterById: appointmentId,
        update: {
            status: status
        }
    });
}

export function getCurrentAppointmentQueue(userId: string) {
    return AppointmentQueueService.getQueueForUser(userId);
}

export function getOfficeQueue() {
    return AppointmentQueueService.getOfficeQueue();
}

async function getMockedAppointment(): Promise<API.Appointment> {
    return {
        id: 'a123',
        status: API.AppointmentStatus.ASSIGNED,
        reason: (await getReasons())[0],
        office: (await getOffices())[0],
        date: 'Today, April 30',
        time: 'Before 7 PM'
    };
}

export const ACTIVE_APPOINTMENT_STATUSES = [API.AppointmentStatus.ASSIGNED, API.AppointmentStatus.CHECKED_IN, API.AppointmentStatus.IN_SERVICE];
async function getActiveAppointment(userId: string): Promise<Appointment> {
    const app = await AppointmentDAO.getOne({
        filter: {
            userId: userId,
            status: {
                $in: ACTIVE_APPOINTMENT_STATUSES
            }
        },
        sort: {
            createdOn: -1
        }
    });

    if (!app) {
        return undefined;
    }

    return app;
}

export async function toApi(app: Appointment): Promise<API.Appointment> {
    return {
        id: app.id,
        status: app.status,
        office: await getOfficeById(app.officeId),
        reason: await getReasonById(app.reasonId),
        date: app.date,
        time: app.time
    };
}