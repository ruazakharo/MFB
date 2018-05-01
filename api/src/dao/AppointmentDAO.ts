import * as Log4js from 'log4js';

import { BaseDAO } from './BaseDAO';
import Appointment from '../models/Appointment';

const logger = Log4js.getLogger('dao.appointment');

class AppointmentDAO extends BaseDAO<Appointment> {
    constructor() {
        super(logger, 'appointments');
    }
}

const instance = new AppointmentDAO();
export default instance;