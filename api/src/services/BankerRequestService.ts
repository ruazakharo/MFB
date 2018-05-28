import * as _ from 'lodash';
import * as moment from 'moment';
import * as Mongo from 'mongodb';
import * as Log4js from 'log4js';

import * as API from '../models/api';
import BankerRequestDAO from '../dao/BankerRequestDAO';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../models/error';
import BankerRequest from '../models/BankerRequest';
import * as EventService from './EventService';
import * as BankerService from './BankerService';
import * as ClientService from './ClientService';

const logger = Log4js.getLogger('services.bankerrequest');

export async function createBankerRequest(req: API.CreateBankerRequest): Promise<API.BankerRequestInfo> {
    const res = await BankerRequestDAO.insertOne({
        value: {
            bankerId: req.bankerId,
            clientId: req.clientId,
            status: API.BankerRequestStatus.PENDING
        }
    });

    await EventService.addBankerEvent(req.bankerId, {
        type: API.EventType.BANKER_REQUEST,
        bankerRequestId: res.id
    });

    return await toApi(res);
}

type BankerRequestFilter = {
    clientId?: string;
    bankerId?: string;
    status?: API.BankerRequestStatus;
};

export async function getBankerRequests(filter: BankerRequestFilter): Promise<API.BankerRequestInfo[]> {
    const res = await BankerRequestDAO.getMany({
        filter: _.omitBy({
            clientId: filter.clientId,
            bankerId: filter.bankerId,
            status: filter.status ? filter.status : {
                $not: {
                    $in: [API.BankerRequestStatus.FINISHED]
                }
            }
        }, _.isUndefined) as any
    });

    return Promise.all(res.map(r => toApi(r)));
}

export async function updateBankerRequestStatus(requestId: string, status: API.BankerRequestStatus) {
    await BankerRequestDAO.updateOne({
        filterById: requestId,
        update: {
            status
        }
    });

    await EventService.addGreeterEvent({
        type: API.EventType.BANKER_REQUEST_RESPONSE,
        bankerRequestId: requestId
    });
}

export async function getBankerRequestInfo(requestId: string): Promise<API.BankerRequestInfo> {
    const res = await BankerRequestDAO.getOne({
        filterById: requestId
    });

    return await toApi(res);
}

async function toApi(r: BankerRequest): Promise<API.BankerRequestInfo> {
    return {
        id: r.id,
        bankerInfo: await BankerService.getBankerInfo(r.bankerId),
        clientInfo: await ClientService.getClientInfo(r.clientId),
        status: r.status
    };
}