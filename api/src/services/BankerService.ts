import * as Log4js from 'log4js';
import * as Config from 'config';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Mongo from 'mongodb';

import * as API from '../models/api';
import BankerDAO from '../dao/BankerDAO';
import BankerRequestDAO from '../dao/BankerRequestDAO';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../models/error';
import Banker from '../models/Banker';

const logger = Log4js.getLogger('services.banker');

export async function getAvailableBankers(): Promise<API.BankerInfo[]> {
    const bankers = await BankerDAO.getMany({});

    return bankers.map(toApi);
}

export async function updateBankerStatus(bankerId: string, status: API.BankerStatus): Promise<void> {
    await BankerDAO.updateOne({
        filter: {
            id: bankerId
        },
        update: {
            status
        }
    });

    if (status === API.BankerStatus.READY || status === API.BankerStatus.OFFLINE) {
        await BankerRequestDAO.updateMany({
            filter: {
                bankerId: bankerId,
                status: {
                    $not: {
                        $in: [API.BankerRequestStatus.PENDING]
                    }
                } as any
            },
            update: {
                status: API.BankerRequestStatus.FINISHED
            }
        });
    }
}

export async function getBankerInfo(bankerId: string): Promise<API.BankerInfo> {
    const res = await BankerDAO.getOne({
        filter: {
            id: bankerId
        }
    });

    return await toApi(res);
}

function toApi(b: Banker): API.BankerInfo {
    return {
        id: b.id,
        name: b.name,
        specialty: b.specialty,
        status: b.status,
    };
}