import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import Banker from '../models/Banker';

const logger = Log4js.getLogger('dao.banker');

class BankerDAO extends BaseDAO<Banker> {
    constructor() {
        super(logger, 'bankers', true);
    }
}

const instance = new BankerDAO();
export default instance;