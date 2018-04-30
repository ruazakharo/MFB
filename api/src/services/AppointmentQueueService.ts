import * as _ from 'lodash';
import * as API from '../models/api';

const MOCKED_QUEUE: API.AppointmentQueue = {
    clients: [{
        id: 'A0001',
        window: '1'
    }, {
        id: 'T0002',
        window: '2'
    }, {
        id: 'C0001',
        window: '3'
    }, {
        id: 'C0002'
    }, {
        id: 'D0001'
    }, {
        id: 'T0003'
    }]
};

export async function getQueueForUser(userId: string): Promise<API.AppointmentQueue> {
    const queue = _.cloneDeep(MOCKED_QUEUE);
    _.last(queue.clients).isCurrentUser = true;
    return queue;
}

export async function getOfficeQueue(): Promise<API.AppointmentQueue> {
    return MOCKED_QUEUE;
}