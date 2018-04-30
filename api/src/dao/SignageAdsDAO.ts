import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import { SignageAdvertisment } from '../models/api';

const logger = Log4js.getLogger('dao.signageads');


class SignageAdsDAO extends BaseDAO<SignageAdvertisment> {
    constructor() {
        super(logger, 'signageads');
    }
}

const instance = new SignageAdsDAO();
export default instance;