import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import { AppointmentOffice } from '../models/api';

const logger = Log4js.getLogger('dao.office');


class OfficeDAO extends BaseDAO<AppointmentOffice> {
    constructor() {
        super(logger, 'offices');
    }
}

const instance = new OfficeDAO();
export default instance;