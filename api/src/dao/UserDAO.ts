import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import User from '../models/User';

const logger = Log4js.getLogger('dao.user');


class UserDAO extends BaseDAO<User> {
    constructor() {
        super(logger, 'users');
    }

    getByPhoneNumber(phoneNumber: string) {
        return this.getOne({
            filter: {
                phoneNumber
            }
        });
    }
}

const instance = new UserDAO();
export default instance;