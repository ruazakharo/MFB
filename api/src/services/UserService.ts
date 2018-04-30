import * as API from '../models/api';
import * as TokenService from './TokenService';
import UserDAO from '../dao/UserDAO';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../models/error';

const PHONE_NUMBER_PATTERN = /^(\+\d)?\d{10}$/;

export function normalizePhoneNumber(phonNumber: string) {
    if (!phonNumber.startsWith('+')) {
        return '+1' + phonNumber;
    } else {
        return phonNumber;
    }
}

export async function authenticateUser(req: API.SigninRequest): Promise<API.SigninResponse> {
    if (!PHONE_NUMBER_PATTERN.exec(req.phoneNumber)) {
        throw new BadRequestError('Invalid phone number');
    }

    const user = await UserDAO.getOne({
        filter: {
            phoneNumber: normalizePhoneNumber(req.phoneNumber)
        }
    });

    if (!user) {
        throw new NotAuthorizedError('User not found');
    }

    const res = {
        token: await TokenService.createToken({
            user: user
        })
    };

    return res;
}

export async function getUserInfo(userId: string): Promise<API.UserInfo> {
    const user = await UserDAO.getOne({
        filterById: userId
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return {
        name: user.name,
        phoneNumber: user.phoneNumber,
        currentAppointment: undefined
    };
}