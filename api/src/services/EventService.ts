import * as Log4js from 'log4js';
import * as Config from 'config';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Mongo from 'mongodb';

import * as API from '../models/api';
import * as ClientService from './ClientService';
import * as BankerRequestService from './BankerRequestService';
import * as BankerService from './BankerService';

const logger = Log4js.getLogger('services.event');

type Event = {
    type: API.EventType;
    clientId?: string;
    bankerRequestId?: string;
};

let greeterEvents: Event[] = [];
const bankerEvents: {
    [bankerId: string]: Event[]
} = {};

export async function addGreeterEvent(e: Event) {
    logger.debug('Adding greeter event: ', e);
    greeterEvents.push(e);
}

export async function addBankerEvent(bankerId: string, e: Event) {
    logger.debug('Adding banker event, bankerId: ', bankerId, ', event: ', e);
    bankerEvents[bankerId] = bankerEvents[bankerId] || [];
    bankerEvents[bankerId].push(e);
}

export async function getGreeterEvents(): Promise<API.Event[]> {
    await BankerRequestService.updateNonRepliedRequests();

    const events = greeterEvents;
    greeterEvents = [];
    return await toApi(events);
}

export async function getBankerEvents(bankerId: string): Promise<API.Event[]> {
    await BankerService.updateLastTimeOnline(bankerId);

    const events = bankerEvents[bankerId] || [];
    bankerEvents[bankerId] = [];
    return await toApi(events);
}

function toApi(events: Event[]): Promise<API.Event[]> {
    return Promise.all(events.map(async e => {
        const res: API.Event = {
            id: 'id',
            type: e.type
        };

        if (e.clientId) {
            res.clientInfo = await ClientService.getClientInfo(e.clientId);
        }

        if (e.bankerRequestId) {
            res.bankerRequest = await BankerRequestService.getBankerRequestInfo(e.bankerRequestId);
        }

        return res;
    }));
}
