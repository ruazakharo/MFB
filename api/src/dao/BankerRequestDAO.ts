import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import BankerRequest from '../models/BankerRequest';

const logger = Log4js.getLogger('dao.bankerrequest');

class BankerRequestDAO extends BaseDAO<BankerRequest> {
    constructor() {
        super(logger, 'bankerrequests');
    }
}

const instance = new BankerRequestDAO();
export default instance;