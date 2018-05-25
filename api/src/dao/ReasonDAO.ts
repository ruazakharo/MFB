import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import { AppointmentReason } from '../models/api';

const logger = Log4js.getLogger('dao.reason');


class ReasonDAO extends BaseDAO<AppointmentReason> {
    constructor() {
        super(logger, 'reasons', true);
    }
}

const instance = new ReasonDAO();
export default instance;