import * as _ from 'lodash';
import * as moment from 'moment';
import * as Mongo from 'mongodb';
import * as Log4js from 'log4js';

import * as API from '../models/api';
import BankerRequestDAO from '../dao/BankerRequestDAO';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../models/error';
import BankerRequest from '../models/BankerRequest';

const logger = Log4js.getLogger('services.bankerrequest');

export async function createBankerRequest(req: API.BankerRequest): Promise<API.BankerRequest> {
    const res = await BankerRequestDAO.insertOne({
        value: {
            bankerId: req.bankerId,
            clientId: req.clientId,
            status: API.BankerRequestStatus.PENDING
        }
    });

    return toApi(res);
}

type BankerRequestFilter = {
    clientId?: string;
    bankerId?: string;
    status?: API.BankerRequestStatus;
};

export async function getBankerRequests(filter: BankerRequestFilter): Promise<API.BankerRequest[]> {
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

    return res.map(toApi);
}

export async function updateBankerRequestStatus(requestId: string, status: API.BankerRequestStatus) {
    await BankerRequestDAO.updateOne({
        filterById: requestId,
        update: {
            status
        }
    });
}

function toApi(r: BankerRequest): API.BankerRequest {
    return {
        id: r.id,
        bankerId: r.bankerId,
        clientId: r.clientId,
        status: r.status
    };
}