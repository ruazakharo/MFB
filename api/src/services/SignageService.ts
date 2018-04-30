import UserDAO from '../dao/UserDAO';
import SignageAdsDAO from '../dao/SignageAdsDAO';

import * as API from '../models/api';
import * as UserService from './UserService';

export async function getIdentifiedSignage(req: API.SignageIdentificationRequest): Promise<API.SignageIdentification> {
    const phoneNumber = UserService.getNormalizedPhoneNumber(req.phoneNumber);
    const user = await UserDAO.getByPhoneNumber(phoneNumber);

    let client: API.SignageIdentificationClient;
    if (user) {
        client = {
            name: user.name,
            phoneNumber: user.phoneNumber
        };
    }

    const ads = await SignageAdsDAO.getMany({});

    return {
        client,
        ad: client ? ads[1] : ads[0]
    };
}