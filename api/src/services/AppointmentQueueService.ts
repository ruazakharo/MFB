import * as Config from 'config';
import * as Log4js from 'log4js';
import * as _ from 'lodash';
import * as moment from 'moment';

import * as API from '../models/api';
import * as AppointmentService from './AppointmentService';
import QueueDAO from '../dao/QueueDAO';
import { QueueClient } from '../models/Queue';

const logger = Log4js.getLogger('services.queue');

type QueueConfig = {
    windows: string[];
    refreshInterval: number;
    fillQueueSize: number;
    minServiceTime: number;
    maxServiceTime: number;
};

const queueConfig = Config.get<QueueConfig>('queue');

const DEFAULT_QUEUE_NAME = 'default';

let queueRefreshIntervalId: NodeJS.Timer;
let pendingAppointments: {userId: string; appointmentId: string}[] = [];

export async function initialize() {
    const queueExists = await QueueDAO.exists({
        filter: {
            name: DEFAULT_QUEUE_NAME
        }
    });

    if (!queueExists) {
        await QueueDAO.insertOne({
            value: {
                name: DEFAULT_QUEUE_NAME,
                clients: []
            }
        });
    }

    const clients = await getQueueClients();
    if (_.some(clients, c => c.userId)) {
        startQueueSimulation();
    }
}


export async function getQueueForUser(userId: string): Promise<API.AppointmentQueue> {
    const clients = await getQueueClients();

    const userIdx = _.findIndex(clients, c => c.userId === userId);

    return {
        clients: clients.slice(0, userIdx + 1).map(c => ({
            id: c.code,
            window: c.window,
            isCurrentUser: c.userId === userId
        }))
    };
}

export async function getOfficeQueue(): Promise<API.AppointmentQueue> {
    const clients = await getQueueClients();

    return {
        clients: clients.map(c => ({
            id: c.code,
            window: c.window
        }))
    };
}

export async function addUserAppointmentToQueue(userId: string, appointmentId: string) {
    pendingAppointments.push({userId, appointmentId});
    await refreshQueue();
    if (!isQueueSimulationRunning()) {
        startQueueSimulation();
    }
}

function isQueueSimulationRunning() {
    return !!queueRefreshIntervalId;
}

function startQueueSimulation() {
    if (isQueueSimulationRunning()) {
        logger.warn('Failed to start queue simulation, already running');
        return;
    }

    logger.info('Starting queue simulation');
    queueRefreshIntervalId = setInterval(refreshQueue, queueConfig.refreshInterval);
}

function stopQueueSimulation() {
    if (!isQueueSimulationRunning()) {
        logger.warn('Failed to stop queue simulation, already stopped');
        return;
    }

    logger.info('Stopping queue simulation');
    clearInterval(queueRefreshIntervalId);
    queueRefreshIntervalId = undefined;
}

let codeId = 1;
function getNewQueueCode() {
    const prefixes = 'ABCT';
    const prefixIdx = Math.trunc(Math.random() * prefixes.length);

    const codeIdStr = _.padStart(codeId.toString(), 4, '0');
    codeId++;
    return prefixes[prefixIdx] + codeIdStr;
}

function getRandomServiceDuration() {
    return queueConfig.minServiceTime + (queueConfig.maxServiceTime - queueConfig.minServiceTime) * Math.random();
}

async function refreshQueue() {
    let clients = await getQueueClients();
    let queueChanged = false;

    pendingAppointments.forEach(pa => {
        while (clients.length < queueConfig.fillQueueSize) {
            const code = getNewQueueCode();
            logger.info('Adding mock user to the queue: ', code);
            clients.push({
                userId: null,
                appointmentId: null,
                code,
                window: null,
                serviceDuration: getRandomServiceDuration(),
                serviceStartedOn: null
            });
        }

        const code = getNewQueueCode();
        logger.info(`Adding pending user appointment to queue: ${JSON.stringify(pa)}, code: ${code}`);
        clients.push({
            userId: pa.userId,
            appointmentId: pa.appointmentId,
            code,
            window: null,
            serviceDuration: getRandomServiceDuration(),
            serviceStartedOn: null
        });
        queueChanged = true;
    });
    pendingAppointments = [];

    await Promise.all(clients
    .filter(c => c.window)
    .map(async c => {
        const isDone = (c.serviceStartedOn + c.serviceDuration) < moment().valueOf();
        if (!isDone) {
            return;
        }

        logger.info('Service finished for ', c.code);
        _.remove(clients, cc => cc.code === c.code);
        if (c.userId) {
            await AppointmentService.changeAppointmentStatus(c.appointmentId, API.AppointmentStatus.FINISHED);
        }

        queueChanged = true;
    }));


    Promise.all(queueConfig.windows.map(async w => {
        const taken = !!clients.find(c => c.window === w);
        if (taken) {
            return;
        }

        const targetClient = clients.find(c => c.window === null);
        if (targetClient) {
            logger.info(`Assigning window ${w} to client ${targetClient.code}`);
            targetClient.window = w;
            targetClient.serviceStartedOn = moment().valueOf();
            if (targetClient.userId) {
                await AppointmentService.changeAppointmentStatus(targetClient.appointmentId, API.AppointmentStatus.IN_SERVICE);
            }
            queueChanged = true;
        }
    }));

    if (!_.some(clients, c => c.userId)) {
        clients = [];
        queueChanged = true;
        stopQueueSimulation();
    }

    if (queueChanged) {
        await updateQueueClients(clients);
    }
}

async function getQueueClients(): Promise<QueueClient[]> {
    const queue = await QueueDAO.getOne({
        filter: {
            name: DEFAULT_QUEUE_NAME
        }
    });

    return queue.clients;
}

async function updateQueueClients(clients: QueueClient[]): Promise<void> {
    await QueueDAO.updateOne({
        filter: {
            name: DEFAULT_QUEUE_NAME
        },
        updateWithOperators: {
            $set: {
                clients
            }
        }
    });
}