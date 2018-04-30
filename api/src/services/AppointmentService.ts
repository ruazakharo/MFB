import ReasonDAO from '../dao/ReasonDAO';
import OfficeDAO from '../dao/OfficeDAO';
import * as AppointmentQueueService from './AppointmentQueueService';
import * as API from '../models/api';

export function getOffices() {
    return OfficeDAO.getMany({});
}

export function getReasons() {
    return ReasonDAO.getMany({});
}

export function createAppointment(userId: string, req: API.AppointmentRequest): Promise<API.Appointment> {
    return getMockedAppointment();
}

export function updateCurrentAppointment(userId: string, req: API.AppointmentRequest): Promise<API.Appointment> {
    return getMockedAppointment();
}

export function getCurrentAppointment(userId: string): Promise<API.Appointment> {
    return getMockedAppointment();
}

export async function deleteCurrentAppointment(userId: string) {
}

export function checkinForCurrentAppointment(userId: string) {
    return getMockedAppointment();
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