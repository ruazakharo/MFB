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
    await checkOfflineBankers();

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

    if (status === API.BankerStatus.READY) {
        await updateLastTimeOnline(bankerId);
    }

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

export async function updateLastTimeOnline(bankerId: string) {
    await BankerDAO.updateOne({
        filter: {
            id: bankerId
        },
        update: {
            lastTimeOnlineOn: moment().valueOf()
        }
    });
}

export async function checkOfflineBankers() {
    const WAIT_BEFORE_OFFLINE = 10 * 1000;

    const bankers = await BankerDAO.getMany({});
    await Promise.all(
        bankers
        .filter(b => (moment().valueOf() - b.lastTimeOnlineOn > WAIT_BEFORE_OFFLINE))
        .map(b => updateBankerStatus(b.id, API.BankerStatus.OFFLINE))
    );
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